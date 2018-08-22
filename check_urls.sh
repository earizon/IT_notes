#!/bin/bash

if [[ $# != 1 ]] ; then
   echo "Ussage: $0 htmlFileToCheck"
   exit 1
fi

FILE=$1

for delimiter in "'" '"'; do
  # WARN: only first link is captured:
  # REF: http://skybert.net/unix/non-greedy-matching-in-sed/
  SED_EXPR="s/^.*href=[${delimiter}]\([^${delimiter}]*\)[${delimiter}].*$/\1/"
  (cat ${FILE} | grep "href=${delimiter}" | sed ${SED_EXPR}  | while read url ; do
     echo $url | grep -q "^http" || continue
     echo $url | sed "s/#.*$//"
  done ) | \
  sort | uniq | while read url ; do
   # echo $url
     wget --spider -O /dev/null -o /dev/null $url
     if [[ $? != 0 ]] ; then 
        echo $url
     fi
  done

done
