#!/bin/bash

cat << EOF >index.html
<html>
<body>
<h1>IT_notes</h1>

<p>
detailed mental maps on software development and system architecture and administration I write down while working on different projects.<br/>
If this project was useful to you, consider making a donation to my Bitcoin address (1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK):<br/>
<image style='width:100px' src='./btc_address_1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK.png' />
</p>
EOF
REGEX_IGNORE="index"
find -name "*html"  -type f | egrep -v "${REGEX_IGNORE}" | sort | while read f ; do
title=`head $f | grep "<title>" | sed "s/<title>//g" | sed "s/<.title>//g" `
location=`echo $f | cut -f 2 -d "/" `
echo $title  | grep "ignore" || echo "<code>${location}/</code> <a href='${f}'>${title}</a><br/>" >>index.html
done
cat << EOF >>index.html
</body>
</html>
EOF
