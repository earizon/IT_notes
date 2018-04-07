#!/bin/bash

cat << EOF >index.html
<html>
<body>
<h1>IT_notes</h1>

<p>
Pseudo-ordered notes and quick-sheets on software development and system architecture and administration I write down while working on different projects.<br/>
If this project was useful to you, consider making a donation to my Bitcoin address (1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK):<br/>
<image style='width:100px' src='./btc_address_1JXPKbYJwfbMfFCWbRdiKRgw8H2JaPboUK.png' />
</p>
EOF
REGEX_IGNORE=`cat ignore_list`
find -name "*html"  -type f | egrep -v "${REGEX_IGNORE}" | sort | while read f ; do
title=`head $f | grep "<title>" | sed "s/<title>//g" | sed "s/<.title>//g" `
echo $title
location=`echo $f | cut -f 2 -d "/" `
echo "<code>${location}/</code> <a href='${f}'>${title}</a><br/>" >>index.html
done
cat << EOF >>index.html
</body>
</html>
EOF
