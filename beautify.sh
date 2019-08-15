#!/bin/bash

# Convert this text:
#
# /----v----\
# |    |    |
# }----+----{
# |    |    |
# \_---^---_/
#
# Into this one 
# ┌────┬────┐
# │    │    │
# ├────┼────┤
# │    │    │
# └────┴────┘
#
# Just pipe it through beautify!
#
# It will also convert conflictive html characters
# (< > and &) into  similar UTF-8 non-conflictive
# ones. (Don't worry, the SPB javascript file will
# convert them back before rendering in the browser)
# 
sed "s/[/]-/┌─/g" | \
\
sed "s/-[\]/─┐/g" | \
\
sed "s/_[/]/─┘/g" | \
\
sed "s/[\]_/└─/g" | \
\
sed "s/}-/├─/g" | \
\
sed "s/-{/─┤/g" | \
\
sed "s/-v-/─┬─/g" | \
\
sed "s/-^-/─┴─/g" | \
\
sed "s/-x-/─┼─/g" | \
\
sed "s/-+-/─┼─/g" | \
\
sed "s/->/─→/g" | \
\
sed "s/<-/←─/g" | \
\
sed "s/-/─/g" | \
\
sed "s/|/│/g" | \
\
sed "s/-+-/─┼─/g" | \
\
sed "s/</˂/g" | \
\
sed "s/>/˃/g" | \
\
sed "s/&/⅋/g"

