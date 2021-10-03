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
    //'g': 'https://www.startpage.com/sp/search?query=%s&prfe=d97e49589e3e9ecdd49bb22a154a5b1f9aac477c1c4aa671dea5cc2da8b021b308e3440e8e4cb6c9b2718a2793d075470da6dbc3fd6a48a8e64fc8796991feb89ddbdac659784474e3cf79cddcba',
    's': 'https://www.startpage.com/do/search?q=%s&segment=startpage.vivaldi&prfe=d97e49589e3e9ecdd49bb22a154a5b1f9aac477c1c4aa671dea5cc2da8b021b308e3440e8e4cb6c9b2718a2793d075470da6dbc3fd6a48a8e64fc8796991feb89ddbdac659784474e3cf79cddcba',
    // Startpage Image Search
    'i': 'https://www.startpage.com/do/search?q=%s&segment=startpage.vivaldi&cat=pics&prfe=d97e49589e3e9ecdd49bb22a154a5b1f9aac477c1c4aa671dea5cc2da8b021b308e3440e8e4cb6c9b2718a2793d075470da6dbc3fd6a48a8e64fc8796991feb89ddbdac659784474e3cf79cddcba',
    // Startpage News Search
    'n': 'https://www.startpage.com/do/search?q=%s&segment=startpage.vivaldi&cat=news&prfe=d97e49589e3e9ecdd49bb22a154a5b1f9aac477c1c4aa671dea5cc2da8b021b308e3440e8e4cb6c9b2718a2793d075470da6dbc3fd6a48a8e64fc8796991feb89ddbdac659784474e3cf79cddcba',
    // deprecated
    'g': {
        'url': 'index.html',
        'auto': (function (querystring, runQueryCB) {
            querystring = querystring.replace(/^g/, 's');
            runQueryCB([{
                'value': 'Stop doing that; "g" is deprecated in favor of "s"',
                'url': '.'
                },{
                'value': 'You want this instead',
                'url': 'index.html?q=s ' + querystring
                }]);
        })
    },
    // Google Search
    'go': 'https://www.google.com/search?hl=en&q=%s',
    // Amazon
    'z': 'http://www.amazon.com/exec/obidos/external-search?index=blended&keyword=%s',
    // eBay
    'e': 'http://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=%s&_sacat=0',
    // DuckDuckGo
    'd': 'http://duckduckgo.com/?t=vivaldi&q=%s',
    // Wikipedia
    'p': 'http://en.wikipedia.org/wiki/Special:Search?search=%s&go=Go',
    'w': 'http://en.wikipedia.org/wiki/Special:Search?search=%s&go=Go',
    // The Internet Movie Database (IMDb)
    'm': 'http://www.imdb.com/find?s=all&q=%s',
    // The Internet Movie Firearms Database (IMFDb)
    'mf': 'http://www.imfdb.org/index.php?search=%s&go=Go&title=Special%3ASearch',
    // The W3C Markup Validation Service
    //'v': 'http://validator.w3.org/check?uri=%s',
    // Google Image Search
    'gi': 'https://www.google.com/search?tbm=isch&q=%s',
    // GameFAQs
    'q': 'http://www.gamefaqs.com/search/index.html?game=%s&searchplatform=All+Platforms',
    // Forecaster.ca Hockey Player Info
    //'hn': {
    //    'url': 'http://forecaster.thehockeynews.com/hockeynews/hockey/playerindex.cgi',
    //    'post': 'x_param=search&x_option=%s',
    //},
    //'tsf': {
    //    'url': 'http://sportsforecaster.com/nhl/',
    //    'auto': (function (queryString, runQueryCB) {
    //        var xmlhttp = new XMLHttpRequest();
    //        xmlhttp.onreadystatechange = function() {
    //            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    //                var sourcearray = JSON.parse(xmlhttp.responseText.replace(
    //                        /\r?\n|\r/g, '').replace(
    //                        /.*playersearchbox"\)\.autocomplete\({ *source: *\[/, '[').replace(
    //                        /],.*/, ']').replace(
    //                        /\s+/g, ' ').replace(
    //                        /value:/g, '"value":').replace(
    //                        /url: "/g, '"url": "http://sportsforecaster.com'));
    //                var queryRegex = new RegExp(".*" + queryString + ".*", 'i');
    //                runQueryCB(sourcearray.filter(function(arrItem) {
    //                    return arrItem.value.match(queryRegex);
    //                }));
    //            }
    //        };
    //        //xmlhttp.open("POST", "https://cors-anywhere.herokuapp.com/http://sportsforecaster.com/modules/player_search_update.php?sport=nhl");
    //        xmlhttp.open("POST", "https://cors.bridged.cc/http://sportsforecaster.com/modules/player_search_update.php?sport=nhl");
    //        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //        xmlhttp.send();
    //    })
    //},
    'tsf': {
        'url': 'https://sportsforecaster.com/api/team/players/filter/nhl/all/%s',
        'auto': (function (queryString, runQueryCB) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                    var testtext = xmlhttp.responseText.replace(
                            /\r?\n|\r/g, '').replace(
                            /^{"players":{"1":/, '').replace(
                            /\],"2":\[/, ',').replace(
                            /^\[,/, '[').replace(
                            /,\]/, ']').replace(
                            /}}$/, '');
                    //console.log(xmlhttp.responseText);
                    //console.log(testtext);
                    var sourcearray = JSON.parse(testtext);
                    var endarray = [];
                    sourcearray.forEach(playerObj => {
                        endarray.push({
                            'value': playerObj['name_position'] + ' (' +  playerObj['city_career_stats'] + ')',
                            'url': 'https://sportsforecaster.com/nhl/p/' + playerObj['tsf_global_id'] + '/' + playerObj['full_name']
                        });
                    });
                    runQueryCB(endarray);
                }
            };
            xmlhttp.open("GET", 'https://sportsforecaster.com/api/team/players/filter/nhl/all/%s'.replace("%s", encodeURIComponent(queryString)));
            xmlhttp.send();
        })
    },
    // eliteprospects.com
    'ep': 'https://www.eliteprospects.com/search/player?q=%s',
    // Hockey Reference
    //'hr': 'http://www.hockey-reference.com/player_search.cgi?search=%s',
    // CapFriendly
    'cf': 'https://capfriendly.com/teams/%s',
    // PuckPedia
    //'pp': 'https://puckpedia.com/players/search/%s',
    // Dragon Age Wiki
    //'da': 'http://dragonage.wikia.com/wiki/Special:Search?search=%s',
    // HockeyDB
    'h': 'http://www.hockeydb.com/ihdb/stats/findplayer.php?full_name=%s',
    // The Hypertext d20 SRD
    'srd': 'http://www.d20srd.org/search.htm?q=%s',
    // Pathfinder SRD
    //'psrd': 'http://www.google.com/cse?cx=006680642033474972217%3A6zo0hx_wle8&q=%s',
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
