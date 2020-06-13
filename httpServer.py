#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler

httpd = HTTPServer( ('',8000), BaseHTTPRequestHandler )

httpd.serve_forever()
