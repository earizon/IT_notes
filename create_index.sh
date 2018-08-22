#!/bin/bash

cat << EOF >index.html
<html>
<head>
<style>
body { font-family: sans-serif; }
</style>
</head>
<body>
<h1>Welcome to the Single-Page-Book Project</h1>
<br/>
  <ul>
  <li><a href="https://en.wikipedia.org/wiki/Mind_map">Mind maps</a> are great at displaying 
  related topics toghether, but they fail to provide concrete information about the topics themself</li>

  <li><a href="https://en.wikipedia.org/wiki/Cheat_sheet">Cheat-sheats</a> are great at providing 
    daily-usage for a given tool or procedure, but fail to provide the global mind-map picture in a bigger context</li>

  <li>Books are great for learning purposes but they are "bloated" with educational content
    that is not very useful for the experts and not very conformatble to work with for daily use,
    specially when we just want to query some "how-to" time-to-time.</li>
  </ul>
  
  The Single-Page-Book format (SPB) try to fix those shortcommings providing the 
  best of all worlds.<br/>
  A (properly written) single-page-book will offer all the advantages of mind-maps,
  cheat-sheats and books.<br/>
  Single-Page-book pretend to be to documentation what
  <a href="https://en.wikipedia.org/wiki/Single-page_application">single-page-apps</a> became for web apps.<br/>
  While the content is saved, transported and stored in a single document like an e-book or pdf, it's browsed
  "dynamically" allowing to zoom in/out of the  content.
  <br/>
  To make it possible SPB profits from all the excelent work invested in modern
  Web Browsers to provide static and dynamic content<br/>
  In practice a SPB book is just a single web page profiting from a thoroughly 
  dessigned <a target=_new href="https://en.wikipedia.org/wiki/Cascading_Style_Sheets">CSS</a> and some helper Javascript.<br/>
   The CSS has been designed to be extreme-responsive to any screen size, mouse or
  touch-screen.  Nevertheless a desktop with a modern tiling window manager like 
  <a target=_new href="https://i3wm.org/">i3</a> and a 28" monitor will make a more pleasent experience<br/>

  On Firefox  the <a target=_new href="https://support.mozilla.org/en-US/kb/firefox-reader-view-clutter-free-web-pages">reader view switch</a>
  can also be used to have an start-to-end "book-alike" read<br/>


  The SPB format can also be used for many free purposes like "zipping" in a 
  single page hundreds of
  <a target=_new href="https://en.wikipedia.org/wiki/Snippet_(programming)">code-snippets</a>,
  <a target=_new href="https://en.wikipedia.org/wiki/Sequence_diagram">Sequence diagrams</a>, 
  contacts, resources, links, ...<br/>
  
  The final purpose is to provide a mechanism to have <b>as much information as possible on a set of topics no
  more than one click away</b> avoiding "slow Google searchs" for daily tasks.<br/>

  Indirectly SPB promote "best-pattern" approach to documentation by:
  <ul>
  <li>Putting related info close to each other. Actually a single html text file will be used.</li>
  <li>Don't repeat same info twice. This is easier once the previously spread information is located in a single file</li>
  <li>Don't keep notes spread(hidden) amongst hundred of emails</li>
  <li>Don't hide important info down a million of menus and child pages. People will not search for important 
     information until they are aware that such important information exists, so better place important information
     in the main page</li>
  </ul>

<p>

<h3>Pull-request and bug-reporting contributions welcome!</h3>
</p>
Current list of Mind-maps:<br/>
<ul style="font-family:monospace">
<li>Beta state means that related information is in place, but things are still missing/non-validated</li>
<li>Version 1.0 or higher means that content on the  be used as a reference book, mind map or quick-sheet in daily work</li> 
</ul>

<ul style="font-family:monospace">
EOF
REGEX_IGNORE="index"
find -name "*html"  -type f | egrep -v "${REGEX_IGNORE}" | sort | while read f ; do
echo $f
title=`head $f | grep "<title>" | sed "s/<title>//g" | sed "s/<.title>//g" `
location=`echo $f | cut -f 2 -d "/" `
if [ ! -z "$title" ] ; then
  echo $title  | egrep "(ignore|alpha)" || echo "<li>${location}/<a href='${f}'>${title}</a></li>" >>index.html
fi
done
cat << EOF >>index.html
</ul>
</body>
</html>
EOF
