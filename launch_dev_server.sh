if [ -x /usr/bin/python3 ]; then
   python3 -m http.server      127.0.0.1 8000 1>/tmp/port8000.log 2>&1 &
else 
   python2 launch_dev_server.py 1>/tmp/port8000.log 2>&1 &

fi
