#!/usr/bin/python2
import SimpleHTTPServer
import SocketServer

PORT = 8000
HOST = "0.0.0.0"

# HOST = ""

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer((HOST, PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
