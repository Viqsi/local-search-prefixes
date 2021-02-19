// Search URLs 
// * Format is <keyword>: { 'url': <search url>, 'post': <optional POST
//   parameters if needed for this search>, 'auto': <optional; see below> }
// * %s in the search url is replaced with query parameters.
// * "auto" is for searches that use some kind of generic key: value list with
//   a regex (see: jQuery 'autocomplete' widget). for these sorts of searches,
//   the 'auto' attribute should point to a function that takes the query
//   string to match against and a callback reference that accepts an array of
//   objects with "value" and "url" properties.
// * as a shorthand, for searches that don't need the 'post' or 'auto'
//   parameters can just provide the url rather than that parameterized object,
//   and it'll Just Work.
// * the special keyword '__default__' should point to an existing keyword; it
//   indicates the default search to use.

var searchURLs = {
    '__default__': 's',
    // Startpage search
    'g': 'https://www.startpage.com/sp/search?query=%s&prfe=d3ebddf71b6a20152e5d28647f54b2b39e1a59c32f71e9ab5621b0bd186d7156d13de6acded60f70b79ba6a7a5b9f9c50cdb637fb454d280f81344eb8d49583458b340ec1e5a25ea83c3ce2c33c296f2d1',
    's': 'https://www.startpage.com/sp/search?query=%s&prfe=d3ebddf71b6a20152e5d28647f54b2b39e1a59c32f71e9ab5621b0bd186d7156d13de6acded60f70b79ba6a7a5b9f9c50cdb637fb454d280f81344eb8d49583458b340ec1e5a25ea83c3ce2c33c296f2d1',
    // Startpage Image Search
    'i': 'https://www.startpage.com/sp/search?query=%s&cat=pics&prfe=d3ebddf71b6a20152e5d28647f54b2b39e1a59c32f71e9ab5621b0bd186d7156d13de6acded60f70b79ba6a7a5b9f9c50cdb637fb454d280f81344eb8d49583458b340ec1e5a25ea83c3ce2c33c296f2d1',
    // Google Search
    'go': 'https://www.google.com/search?hl=en&q=%s',
    // Amazon
    'z': 'http://www.amazon.com/exec/obidos/external-search?tag=opera-20&index=blended&keyword=%s',
    // eBay
    'e': 'http://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=%s&_sacat=0',
    // DuckDuckGo
    'd': 'http://duckduckgo.com/?t=ous&q=%s',
    // Wikipedia
    'p': 'http://en.wikipedia.org/wiki/Special:Search?search=%s&go=Go',
    'w': 'http://en.wikipedia.org/wiki/Special:Search?search=%s&go=Go',
    // The Internet Movie Database (IMDb)
    'm': 'http://www.imdb.com/find?s=all&q=%s',
    // The Internet Movie Firearms Database (IMFDb)
    'mf': 'http://www.imfdb.org/index.php?search=%s&go=Go&title=Special%3ASearch',
    // The W3C Markup Validation Service
    'v': 'http://validator.w3.org/check?uri=%s',
    // Google Image Search
    'gi': 'https://www.google.com/search?tbm=isch&q=%s',
    // GameFAQs
    'q': 'http://www.gamefaqs.com/search/index.html?game=%s&searchplatform=All+Platforms',
    // Forecaster.ca Hockey Player Info
    //'hn': {
    //    'url': 'http://forecaster.thehockeynews.com/hockeynews/hockey/playerindex.cgi',
    //    'post': 'x_param=search&x_option=%s',
    //},
    'tsf': {
        'url': 'http://sportsforecaster.com/nhl/',
        'auto': (function (queryString, runQueryCB) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                    var sourcearray = JSON.parse(xmlhttp.responseText.replace(
                            /\r?\n|\r/g, '').replace(
                            /.*playersearchbox"\)\.autocomplete\({ *source: *\[/, '[').replace(
                            /],.*/, ']').replace(
                            /\s+/g, ' ').replace(
                            /value:/g, '"value":').replace(
                            /url: "/g, '"url": "http://sportsforecaster.com'));
                    var queryRegex = new RegExp(".*" + queryString + ".*", 'i');
                    runQueryCB(sourcearray.filter(function(arrItem) {
                        return arrItem.value.match(queryRegex);
                    }));
                }
            };
            //xmlhttp.open("POST", "https://cors-anywhere.herokuapp.com/http://sportsforecaster.com/modules/player_search_update.php?sport=nhl");
            xmlhttp.open("POST", "https://cors.bridged.cc/http://sportsforecaster.com/modules/player_search_update.php?sport=nhl");
            xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlhttp.send();
        })
    },
    // eliteprospects.com
    'ep': 'https://www.eliteprospects.com/search/player?q=%s',
    // Hockey Reference
    'hr': 'http://www.hockey-reference.com/player_search.cgi?search=%s',
    // CapFriendly
    'cf': 'https://capfriendly.com/teams/%s',
    // PuckPedia
    'pp': 'https://puckpedia.com/players/search/%s',
    // Dragon Age Wiki
    'da': 'http://dragonage.wikia.com/wiki/Special:Search?search=%s',
    // HockeyDB
    'h': 'http://www.hockeydb.com/ihdb/stats/findplayer.php?full_name=%s',
    // The Hypertext d20 SRD
    'srd': 'http://www.d20srd.org/search.htm?q=%s',
    // Pathfinder SRD
    'psrd': 'http://www.google.com/cse?cx=006680642033474972217%3A6zo0hx_wle8&q=%s',
    // Google Play Android App Store
    'a': 'https://play.google.com/store/search?q=%s&c=apps',
    // TVTropes
    'tt': 'http://tvtropes.org/pmwiki/search_result.php?q=%s',

    // Port Columbus International Flight Number
    'pcia': 'https://flycolumbus.com/flights/flight-status?adi=A&q=%s',
    // Google Docs Viewer
    'gdv': 'http://docs.google.com/viewer?url=%s',
    // Internet Archive Wayback Machine
    'b': 'http://web.archive.org/web/%s',
    // Google Translate
    'gt': 'https://translate.google.com/translate?sl=auto&tl=en&u=%s',
    };
