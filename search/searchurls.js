// Search URLs 
// * Format is <keyword>: { 'url': <search url>, 'post': <optional POST
//   parameters if needed for this search>, 'auto': <optional; see below> }
// * %s in the search url is replaced with query parameters.
// * "auto" is for searches that use some kind of generic key: value list with
//   a regex (see: jQuery 'autocomplete' widget). for these sorts of searches,
//   the 'auto' attribute should point to a Promise that takes the query
//   string to match against, and which may optionally resolve to an array of
//   'value'/'url' objects to display in a VERY ad-hoc manner.
// * as a shorthand, for searches that don't need the 'post' or 'auto'
//   parameters can just provide the url rather than that parameterized object,
//   and it'll Just Work.
// * the special keyword '__default__' should point to an existing keyword; it
//   indicates the default search to use.

function keywordSearchRegex(querywords) {
    // borrowed from https://stackoverflow.com/a/41869757/2872102
    return new RegExp("(?=.*?\\b" + 
            querywords.split("%20").join(")(?=.*?\\b") + ").*", "i");
}
function uniqueByProp(array_of_objects, property) {
    // borrowed from https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
    return [...new Map(array_of_objects.map(
            (item) => [item[property], item])).values()]
}

// I use Startpage a lot and there's multiple searches based on it, so...
const startpageBase = 'https://www.startpage.com/do/search?q=%s&segment=startpage.vivaldi&prfe=d97e49589e3e9ecdd49bb22a154a5b1f9aac477c1c4aa671dea5cc2da8b021b308e3440e8e4cb6c9b2718a2793d075470da6dbc3fd6a48a8e64fc8796991feb89ddbdac659784474e3cf79cddcba';

const searchURLs = {
    '__default__': 's',
    // Startpage search
    //'g': startpageBase,
    's': startpageBase,
    // Startpage Image Search
    'i': `${startpageBase}&cat=pics`,
    // Startpage News Search
    'n': `${startpageBase}&cat=news`,
    // deprecated
    'g': {
        'url': 'index.html',
        'auto': (async querystring => {
            return new Promise((resolve, reject) => {
                resolve([{
                    'value': 'Stop doing that; "g" is deprecated in favor of "s"',
                    'url': '.'
                },{
                    'value': 'You want this instead',
                    'url': `index.html?q=s+${querystring}`
                }]);
            })
        })
    },
    // Google Search
    'go': 'https://www.google.com/search?hl=en&q=%s',
    // Ecosia ('t' for tree)
    't': 'https://www.ecosia.org/search?tt=vivaldi&q=%s',
    // Ecosia Images
    'ti': 'https://www.ecosia.org/images?tt=vivaldi&q=%s',
    // Amazon
    //'z': 'http://www.amazon.com/exec/obidos/external-search?index=blended&keyword=%s',
    'z': 'https://www.amazon.com/s?k=%s&tag=admarketus-20',
    // eBay
    'e': 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=%s&_sacat=0',
    // DuckDuckGo
    'd': 'https://duckduckgo.com/?t=vivaldi&q=%s',
    // Wikipedia
    'p': 'https://en.wikipedia.org/wiki/Special:Search?search=%s&go=Go',
    'w': 'https://en.wikipedia.org/wiki/Special:Search?search=%s&go=Go',
    // The Internet Movie Database (IMDb)
    'm': 'https://www.imdb.com/find?s=all&q=%s',
    // The Internet Movie Firearms Database (IMFDb)
    'mf': 'https://www.imfdb.org/index.php?search=%s&go=Go&title=Special%3ASearch',
    // The W3C Markup Validation Service
    //'v': 'http://validator.w3.org/check?uri=%s',
    // Google Image Search
    'gi': 'https://www.google.com/search?tbm=isch&q=%s',
    // GameFAQs
    //'q': 'http://www.gamefaqs.com/search/index.html?game=%s&searchplatform=All+Platforms',
    // Sports Forecaster Hockey Player Info
    // (They keep changing this one...)
    'tsf': {
        'url': 'https://sportsforecaster.com/nhl/',
        'auto': (async querystring => {
            return new Promise(async (resolve, reject) => {
                const resdata = await fetch(`https://sportsforecaster.com/api/filtered/players/nhl/first_order/${querystring}`);
                const searchresults = await resdata.json();
                resolve(
                    searchresults.players.map(itemObj => { return {
                        'value': `${itemObj.name_position} (${itemObj.city_team_name})`,
                        'url': `https://sportsforecaster.com${itemObj.player_link}`
                    };})
                );
            })
        })
    },
    // eliteprospects.com
    'ep': 'https://www.eliteprospects.com/search/player?q=%s',
    // Hockey Reference
    //'hr': 'http://www.hockey-reference.com/player_search.cgi?search=%s',
    // CapFriendly (deprecated)
    //'cf': 'https://capfriendly.com/teams/%s',
    'cf': {
        'url': 'index.html',
        'auto': (async querystring => {
            return new Promise((resolve, reject) => {
                resolve([{
                    'value': 'Stop doing that; "cf" is deprecated in favor of "pp"',
                    'url': '.'
                },{
                    'value': 'You want this instead',
                    'url': `index.html?q=pp+${querystring}`
                }]);
            })
        })
    },
    // PuckPedia
    //'pp': 'https://puckpedia.com/players/search/%s',
    'pp': {
        'url': 'https://puckpedia.com/',
        'auto': (async querystring => {
            return new Promise(async (resolve, reject) => {
                const resdata = await fetch(`https://puckpedia.com/puckpedia/person_search/autocomplete/search?q=${querystring}`);
                const searchresults = await resdata.json();
                resolve(
                    searchresults.map(itemObj => {return {
                        'value': itemObj.label.replace(/<span.*<\/i>([A-Za-z]*)<\/span>(.*)/, '$2 ($1)'),
                        'url': `https://puckpedia.com/${itemObj.value}`
                    };})
                );
            })
        })
    },
    // CapWages
    // This works (sorta), but it is ABSURDLY slow due to rate limiting from
    // the free CORS proxy I'm using.
    'cw': {
        'url': 'https://capwages.com/',
        'auto': (async querystring => {
            return new Promise(async (resolve, reject) => {
                // Like Forecaster and PuckPedia, these guys just provide a
                // Big-Ass JSON List. Unlike those, these folks don't even HAVE
                // a data access endpoint - they HARDCODE THE LIST AND EMBED IT
                // IN THE APP BUNDLE. Which has a versionhashed filename
                // because of course it does.
                const idxresdata = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.capwages.com')}`);
                //console.log("idxresdata", idxresdata);
                const idx = await idxresdata.json();
                const idxParser = new DOMParser();
                const idxDoc = idxParser.parseFromString(idx.contents, "text/html")
                const bundleURL = `https://www.capwages.com${
                        new URL(idxDoc.querySelectorAll(
                        'script[src*="_app"]')[0].src).pathname}`;
                //console.log("bundleURL", bundleURL);
                const docresdata = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(bundleURL)}`);
                //console.log("docresdata", docresdata);
                const bundledoc = await docresdata.json();
                // Use of eval() is STUPIDLY risky here, but, well, because of
                // the escaping involved I don't have much of a choice. :(
                //console.log("bundledoc contents", bundledoc.contents);
                const JSONdoc = eval(bundledoc.contents.match(/(JSON.parse\('{"data":.*'\)),/)[1]);
                const queryregex = keywordSearchRegex(querystring);
                //console.log("JSONdoc", JSONdoc);
                resolve(
                    JSONdoc.data.filter(i => i.name.match(queryregex))
                    .map(itemObj => {return {
                        'value': itemObj.name,
                        'url': `https://www.capwages.com/${itemObj.type}s/${itemObj.slug}`
                    };})
                );
            })
        })
    },
    // Spotrac
    'st': 'https://www.spotrac.com/search?q=%s',
    // HockeyViz
    'hv': 'https://hockeyviz.com/search?q=%s',
    // Dragon Age Wiki
    //'da': 'http://dragonage.wikia.com/wiki/Special:Search?search=%s',
    // HockeyDB
    'h': 'https://www.hockeydb.com/ihdb/stats/findplayer.php?full_name=%s',
    // The Hypertext d20 SRD
    'srd': 'http://www.d20srd.org/search.htm?q=%s',
    // Pathfinder SRD
    //'psrd': 'http://www.google.com/cse?cx=006680642033474972217%3A6zo0hx_wle8&q=%s',
    // Google Play Android App Store
    'app': 'https://play.google.com/store/search?q=%s&c=apps',
    // TVTropes
    'tt': 'https://tvtropes.org/pmwiki/search_result.php?q=%s',

    // Port Columbus International Flight Number
    'pcia': 'https://flycolumbus.com/flights/flight-status?adi=A&q=%s',
    // Google Docs Viewer
    'gdv': 'https://docs.google.com/viewer?url=%s',
    // Internet Archive Wayback Machine
    'b': 'https://web.archive.org/web/%s',
    // Google Translate
    'gt': 'https://translate.google.com/translate?sl=auto&tl=en&u=%s',
    // Roblox Users
    'rbu': 'https://www.roblox.com/search/users?keyword=%s',
    };
