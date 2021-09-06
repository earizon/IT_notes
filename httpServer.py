#!/usr/bin/python3

from os import chdir,fork,environ

from http.server import HTTPServer, SimpleHTTPRequestHandler

if 'HOST' in environ :
    HOST=environ['HOST']
else:
    HOST='127.0.0.1'
print(HOST)

newpid = fork()
if newpid != 0:
   chdir('..')
   port = 8001
else:
   port = 8000
httpd = HTTPServer( (HOST,port), SimpleHTTPRequestHandler )
httpd.serve_forever()
