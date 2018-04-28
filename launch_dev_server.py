import SimpleHTTPServer
import SocketServer

PORT = 8000
HOST = "localhost"
# HOST = ""

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer((HOST, PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
