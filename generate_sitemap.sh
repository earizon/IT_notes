#!/bin/bash

SITEMAP1="github-sitemap.xml"
SITEMAP2="24x7-sitemap.xml"

declare -A sitemap2URL
sitemap2URL[${SITEMAP1}]="https://singlepagebookproject.github.io/IT_notes"
sitemap2URL[${SITEMAP2}]="http://www.oficina24x7.com"

for SITEMAP in ${SITEMAP1} ${SITEMAP2} ; do
  cat << __EOF > ${SITEMAP}
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
__EOF
done

(
cat << EOF
Blockchain/ethereum_map.html         1.0
JAVA/java_map.html                   1.0
General/cryptography_map.html        1.0
WebTechnologies/map.html             1.0
DevOps/devops_map.html               0.5
Architecture/architecture_map.html   0.5
Architecture/financial_arch_map.html 0.3
Cloud/cloud_map.html                 0.5
EOF
) | while read FILE PRIORITY ; do
    for SITEMAP in ${SITEMAP1} ${SITEMAP2} ; do
      LASTMOD=$(stat --format=%y $FILE | sed "s/ .*//")
      echo $LASTMOD
      cat << ______EOF >> ${SITEMAP}
  <url>
    <loc>${sitemap2URL[${SITEMAP}]}/${FILE}?showSearchMenu=true</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${PRIORITY}</priority>
  </url>
______EOF
    done
done

for SITEMAP in ${SITEMAP1} ${SITEMAP2} ; do
  cat << __EOF >> ${SITEMAP}
</urlset> 
__EOF
done

wc -l ${SITEMAP1} ${SITEMAP2}
