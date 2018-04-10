if [ -x /usr/bin/python3 ]; then
   python3 -m http.server      1>/tmp/port8000.log 2>&1 &
else 
   python2 -m SimpleHTTPServer 1>/tmp/port8000.log 2>&1 &
fi
