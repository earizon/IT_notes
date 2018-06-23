#!/bin/bash

cat << EOF >index.html
<html>
<head>
<style>
body { font-family: sans-serif; }
</style>
</head>
<body>
<h1>IT_notes</h1>
detailed-notes/mind-maps/extended-quicksheets I write down while working on different IT projects.<br/>
<br/>
The idea is to have <b>as much information as possible no more than one click away</b> avoiding "slow" searchs in Google for simple (but not so easy to remember) tasks and procedures<br/>
UI has been designed to be extreme-responsive to any screen size. Nevertheless a modern tiling window manager like <a href="https://i3wm.org/">i3</a>) and a 28" 4K screen will boost your productivity ;).
<br/>
<p style="font-size:0.6em;">
Maps version/status is clasified like:
<ul style="font-family:monospace">
<li>draft: Nothing interesting, just the intention to write something in the future</li>
<li>Alpha: Pieces of information collected, but randomnly ordered</li>
<li>Beta: Information is ordered, but probably info still missing/erroneous</li>
<li>v1.0+: Can be used as a mental/mind map/quick-sheet to save time.</li> 
</ul>
</p>
<hr/>
EOF
REGEX_IGNORE="index"
find -name "*html"  -type f | egrep -v "${REGEX_IGNORE}" | sort | while read f ; do
echo $f
title=`head $f | grep "<title>" | sed "s/<title>//g" | sed "s/<.title>//g" `
location=`echo $f | cut -f 2 -d "/" `
if [ ! -z "$title" ] ; then
  echo $title  | egrep "(ignore|alpha)" || echo "<code>${location}/</code> <a href='${f}'>${title}</a><br/>" >>index.html
fi
done
cat << EOF >>index.html
<hr/>
<h2>
Pull-request and bug-reporting contributions welcome!
</h2>

<table style="width: 100%; text-align:center" >
<tr>
<td style="text-align:center"><code>BTC Address:<br/> 1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK</code></td>
<td style="text-align:center"><code>XRP Address:<br/> rsT4VLnzsG7qc9i3v7nN3nwE8D34heiYph</code></td>
<td style="text-align:center"><code>ETH Address:<br/> 0x008b13F53DD1408175f619086cba7Ac2460a1BE9</code></td>
</tr>
<tr>
<td style="text-align:center"><image style='width:100px' src='./btc_address_1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK.png' /></td>
<td style="text-align:center"><image style='width:100px' src='./xrp_address_rsT4VLnzsG7qc9i3v7nN3nwE8D34heiYph.png' /></td>
<td style="text-align:center"><image style='width:100px' src='./eth_address_0x008b13F53DD1408175f619086cba7Ac2460a1BE9.png' /></td>

</tr>
</p>
</table>

</body>
</html>
EOF
