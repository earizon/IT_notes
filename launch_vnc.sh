#!/bin/bash 

# PREREQUESITES {
#    $ sudo apt-get install openbox lxpanel lxde
# }

LISTENING_PORT=5901
CONST_BASE_PORT=5900
DISPLAY_NUMBER=$(( $LISTENING_PORT - $CONST_BASE_PORT ))
export DISPLAY=":${DISPLAY_NUMBER}"
echo "DISPLAY: $DISPLAY"

LOG="/tmp/vncserver.${LISTENING_PORT}.log"
echo "" > $LOG
echo "Logs redirected to $LOG"
# TYPICAL VALUES FOR GEOMETRY: GEOMETRY:=2560x1440 ,  1920x1200, 1920x1080 
GEOMETRY=2560x1440

VNCSERVER_OPTS=""
  VNCSERVER_OPTS="$VNCSERVER_OPTS $DISPLAY"
  VNCSERVER_OPTS="$VNCSERVER_OPTS -name $LISTENING_PORT  "
  VNCSERVER_OPTS="$VNCSERVER_OPTS -depth 24 "
  VNCSERVER_OPTS="$VNCSERVER_OPTS -geometry ${GEOMETRY} "
# VNCSERVER_OPTS="$VNCSERVER_OPTS -nevershared"

vncserver ${VNCSERVER_OPTS} 1>>${LOG} 2>&1 &

echo "Waiting for vncserver "
while true ; do 
    netstat -ntlp 2>/dev/null | grep -q $LISTENING_PORT && break
    sleep 1; echo -n "."
done

### echo "Launching i3 ... "
    /usr/bin/i3  1>>${LOG} 2>&1 &

### echo "Launching openbox ... "
### /usr/bin/openbox  1>>${LOG} 2>&1 &
### sleep 1
### 
### echo "Launching lxpanel ... "
### /usr/bin/lxpanel --profile LXDE 1>>${LOG} 2>&1 &
### 
### echo "Launching pcmanfm ... "
### /usr/bin/pcmanfm --desktop --profile LXDE 1>>${LOG} 2>&1 &

