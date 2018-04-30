#!/bin/bash

cat << EOF >index.html
<html>
<body>
<h1>IT_notes</h1>

<p>
detailed notes on software development and system architecture and administration I write down while working on different projects.<br/>
The notes can be seen as mind-maps, extended-quicksheets or "hyperbooks". The idea is to have as much information as possible no more than one click away<br/>
Maps status is divided into:
<ul>
<li>draft: Nothing interesting, just the intention to write something in the future</li>
<li>Alpha: Pieces of information collected, but randomnly ordered</li>
<li>Beta: Information is ordered, but probably info still missing/erroneous</li>
<li>v1.0+: Can be used as a mental/mind map/quick-sheet to save time.</li> 
</ul>
</p>
EOF
REGEX_IGNORE="index"
find -name "*html"  -type f | egrep -v "${REGEX_IGNORE}" | sort | while read f ; do
echo $f
title=`head $f | grep "<title>" | sed "s/<title>//g" | sed "s/<.title>//g" `
location=`echo $f | cut -f 2 -d "/" `
if [ ! -z "$title" ] ; then
  echo $title  | grep "ignore" || echo "<code>${location}/</code> <a href='${f}'>${title}</a><br/>" >>index.html
fi
done
cat << EOF >>index.html
If this project was useful to you, consider making a donation to my Bitcoin address (1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK):<br/>
<image style='width:100px' src='./btc_address_1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK.png' />

</body>
</html>
EOF
