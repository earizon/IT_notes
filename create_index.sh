#!/bin/bash

OUTPUT=IT_notes_index.html
cat << EOF >$OUTPUT
<h3>Current list of Single Page Books:</h3>
<ul>
<li>Next follow a list of example single-page-books I've created while working on different topics.<br/>
 The quality varies from "intention to create something" to "useful for daily work" based on the time
 spent and my own experience on each topic.
 <ol>
 <li>alpha or draft state means just the intention to do some work in the future.</li>
 <li>Beta state means that related information is in place, but information is still missing or non-validated.</li>
 <li>Version 1.0 or higher means that content can be used as reference (In my personal experience,
    now I have to visit Google much less frequently while programing with Java/Kotlin or
    doing linux administrative work) 
 </li> 
 </ol>
</li>
</ul>

<ul style="font-family:monospace">
EOF
REGEX_IGNORE="index"
find -name "*html"  -type f | egrep -v "${REGEX_IGNORE}" | sort | while read f ; do
echo $f
title=`head $f | grep "<title>" | sed "s/<title>//g" | sed "s/<.title>//g" `
location=`echo $f | cut -f 2 -d "/" `
if [ ! -z "$title" ] ; then
  echo $title  | egrep "(ignore|alpha)" || echo "<li>${location}/<a target="_new" href='${f}'>${title}</a></li>" >>$OUTPUT
fi
done
cat << EOF >>$OUTPUT
</ul>

<p>
<h3>Pull-request and bug-reporting contributions welcome!</h3>
</p>

</body>
</html>
EOF
