#!/bin/bash 

# PREREQUESITES {
#    $ sudo apt-get install openbox lxpanel lxde
# }

LISTENING_PORT=5901
CONST_BASE_PORT=5900
DISPLAY_NUMBER=$(( $LISTENING_PORT - $CONST_BASE_PORT ))
export DISPLAY=":${DISPLAY_NUMBER}"
echo "DISPLAY: $DISPLAY"
export LC_MESSAGES=en_US.UTF-8

LOG="/tmp/vncserver.${LISTENING_PORT}.log"
echo "" > $LOG
echo "Logs redirected to $LOG"
# TYPICAL VALUES FOR GEOMETRY: GEOMETRY:=2560x1440 ,  1920x1200, 1920x1080 
GEOMETRY=2560x1440

  TIGERVNC_SERVER_OPTS=""
# TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -audit 3" # audit level
  TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -ac"      # disable access control restrictions
  TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -name $LISTENING_PORT  "
  TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -depth 24 "
  TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -geometry ${GEOMETRY} "
  TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -passwd /home/earizon/.vnc/passwd"
  TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -nevershared"
# TIGERVNC_SERVER_OPTS="$TIGERVNC_SERVER_OPTS -verbose 3"
 

rm .vnc/li305-230*.log -f
vncserver ${TIGERVNC_SERVER_OPTS} 1>>${LOG} 2>&1 &

cat << EOF > ${HOME}/.vnc/xstartup
#/bin/sh
/usr/bin/i3  1>>${LOG} 2>&1
EOF

chmod a+x ${HOME}/.vnc/xstartup

### echo "Launching openbox ... "
### /usr/bin/openbox  1>>${LOG} 2>&1 &
### sleep 1
### 
### echo "Launching lxpanel ... "
### /usr/bin/lxpanel --profile LXDE 1>>${LOG} 2>&1 &
### 
### echo "Launching pcmanfm ... "
### /usr/bin/pcmanfm --desktop --profile LXDE 1>>${LOG} 2>&1 &

