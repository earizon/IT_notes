#!/usr/bin/python3

from os import chdir,fork

from http.server import HTTPServer, SimpleHTTPRequestHandler

newpid = fork()
if newpid != 0:
   chdir('..')
   port = 8001
else:
   port = 8000
httpd = HTTPServer( ('127.0.0.1',port), SimpleHTTPRequestHandler )
httpd.serve_forever()
