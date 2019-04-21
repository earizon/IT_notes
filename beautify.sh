#!/bin/bash
sed "s/[/]-/┌─/g" | \
sed "s/-[\]/─┐/g" | \
sed "s/_[/]/─┘/g" | \
sed "s/[\]_/└─/g" | \
sed "s/}-/├─/g" | \
sed "s/-{/─┤/g" | \
sed "s/-v-/─┬─/g" | \
sed "s/-^-/─┴─/g" | \
sed "s/-x-/─┼─/g" | \
sed "s/-|-/─┼─/g" | \
sed "s/->/─→/g" | \
sed "s/<-/←─/g" | \
sed "s/-/─/g" | \
sed "s/|/│/g" | \
sed "s/+/┼/g"
