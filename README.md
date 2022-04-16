Local Search Prefixes
=====================

This is a longstanding hack I've been carrying around for over a decade for handling search prefix keywords in web browsers. It's been through quite a lot, and most of the history is not able to be recorded in this repo (owing to it having been saved via NextCloud versioning rather than an actual source control system), but I grabbed what I could where I could.


Usage
-----

1. Fork this repo, then clone your fork.
2. Create a search prefix in your web browser for this system.
    - If your web browser lets you use file:// URIs for searches, then you can just use that. (`file://full/path/to/where/you/cloned/this/repo/search/?%s`)
    - If it doesn't, things get a little more complicated:
        1. Create a local webserver in the directory where you cloned your fork of this repo. Port 1123 is recommended as that's what the OpenSearch profile uses. (Nowadays I'm partial to using Python - `python -m http.server 1123`
        2. Either add `http://localhost:1123/search/?%s` directly as a search prefix, OR if your browser doesn't even let you do that (Firefox, I'm looking at YOU), go to `http://localhost:1123/search/` and right-click on the search input box that shows up; this should allow you to add this as a search prefix.
3. Make this search system the default.
4. Edit `searchurls.js` to use your own custom search URLs as desired. The most basic form of operation works based on pattern substitution (`%s` is swapped out with any keywords). For anything more complicated than a GET, there's documentation in the comments and some commented-out examples.

I have specifically gotten this working on Android using [Termux](https://termux.com). Regrettably, [Vivaldi on Android does not yet support custom searches](https://forum.vivaldi.net/topic/40148/customizable-search-engines), but I'm making do for now until they finally get that done (hopefully soon; upvote that feature request!).

I've also included a few bits I've used to start up that "local webserver" under `.helperscripts/`. These include:
- `httpd.ps1`, a Powershell script I use on my Win10 laptop; uses Python and is launched in the target directory. There may be some execution policy dance necessary to run it; I'm not certain (my powershell-fu is weak).
- `localprefix.tar.gz`, a tarballed Automator Workflow app bundle for MacOS that launches `darkhttpd` (installed via Homebrew, so expected in `/usr/local/bin`) and assumes this repo has been cloned to `$HOME/Library/Bookmarks`. This hasn't been touched in a while due to catastrophically dwindling ex-loyalty to MacOS (blame Apple's no-more-32bit/no-OpenGL-only-Metal/screw-you-nvidia series of fiascoes).
- I don't have an equivalent for Android in this repo, but it's a oneliner in a shell script in `$HOME/.termux/boot/`.


It's Amazing How Long Some Spiteful Hacks Last, or This Thing's Origin Story
----------------------------------------------------------------------------

Long ago in January 2010, a hacker going by "evad" (I believe nowadays he's on Github as [adlorenz](https://github.com/adlorenz)) put together a PHP hack intended to add search keywords to the [MicroB browser](https://en.wikipedia.org/wiki/MicroB) on his [Nokia N900 internet tablet/smartphone](https://en.wikipedia.org/wiki/Nokia_N900), and [just happened to mention how he got it working on talk.maemo.org](http://web.archive.org/web/20210329091502/https://talk.maemo.org/showthread.php?t=39214) - the now-seemingly-defunct discussion forums for Nokia's Maemo operating system and the Internet Tablets that it ran on.

I was deeply in love with my N900 at the time (seriously, it was awesome, nothing else could compare), and so the next month after I kind of begged for the source of his hack (see that linked thread). He generously posted it on the forum, I customized it to add my own hockey-related search engines, uploaded it on the family webserver, and got to using it.

About two weeks later, our ISP started acting really flaky. And I was grumpy about that. So out of bitter spite, I opted to never let this thing be a 'remotely hosted' setup again - I rewrote the hack in Javascript so as to make it entirely client-side in operation. [That earliest ever version is archived via the Wayback Machine.](http://web.archive.org/web/20210329091502/https://talk.maemo.org/attachment.php?attachmentid=7533&d=1267167539).

Two and a half years after that, in a bid to get it working with The Sports Forecaster's NHL player info search (note: this is a VERY frequently recurring theme throughout the history of this hack), I added POST support and made that available to the remaining N900 holdouts in that thread. And, in the interest of minimizing the number of times I had to keep updating search engines in multiple places, I had long since started syncing it between systems (first using Dropbox, then eventually OwnCloud and then NextCloud) and pointing my desktop web browsers at this same hack.

Since then, this has gone through several evolutions. For the longest time, it was just a local file I'd point browsers to. Then I separated out the search URLs into their own file. Then, when I finally bit the bullet and went Android, I paired this together with a tiny local http server and some DNS trickery to "hijack" bing.com so as to sneak it in on browsers there. When that ceased to be necessary, I discovered that many mobile browser simply wouldn't *do* file:// URIs anymore and so kept that Tiny Local Webserver concept, and added an OpenSearch definition. And all throughout all that, I kept having to chase down Sports Forecaster's constantly changing search schemes even as they got rid of server-side search entirely - that, in particular, has been one of the few things that keeps sustaining the useful life of this hack for me.


Preemptively Answered Questions
-------------------------------

Q: Where did you get the URLs you use?  
A: For the most part, reverse engineering websites of interest (not much effort to that, admittedly, unless you count Sports Forecaster). In some cases, though, I poached them or variants from [Vivaldi](https://vivaldi.com)'s preloaded search prefixes, mostly to borrow search partner affiliate parameters because I like that project and want to support it. (I used to do the same with Opera before they turned evil.)

Q: Why a `search/` subdirectory?  
A: Partly because of that whole "hijacking Bing" thing (see history, above), but mostly because I also started keeping my bookmarks (stored in [Lynx](https://en.wikipedia.org/wiki/Lynx_(web_browser))-like HTML files) in the same hierarchy so that they could be accessible via that Tiny Local Webserver.

Q: What's with all the hockey-related searches?  
A: I'm an obsessive Blue Jackets fan who likes to talk about this stuff with others and so find it convenient.

Q: Why port 1123?  
A: Blame [Square One](https://en.wikipedia.org/wiki/Square_One_Television) on PBS; it managed to inexplicably embed the Fibonacci sequence indelibly in my childhood brain, with strange and unexpected results that emerge from time to time.
