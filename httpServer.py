#!/usr/bin/python3

from http.server import HTTPServer, SimpleHTTPRequestHandler

httpd = HTTPServer( ('127.0.0.1',8000), SimpleHTTPRequestHandler )

httpd.serve_forever()
