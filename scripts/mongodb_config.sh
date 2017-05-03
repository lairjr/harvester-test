#!/bin/bash
MONGODB1=`ping -c 1 mongodb1 | head -1  | cut -d "(" -f 2 | cut -d ")" -f 1`
#MONGODB2=`ping -c 1 mongodb2 | head -1  | cut -d "(" -f 2 | cut -d ")" -f 1`
#MONGODB3=`ping -c 1 mongodb3 | head -1  | cut -d "(" -f 2 | cut -d ")" -f 1`

#echo "Waiting for mongodb1..."
#until curl http://${MONGODB1}:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
#  printf '.'
#  sleep 1
#done

#echo curl http://${MONGODB1}:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1
echo "mongodb1 is ready..."
#echo $MONGODB1
#echo $MONGODB2
#echo $MONGODB3

echo time now: `date +"%T" `
mongo --host ${MONGODB1}:27017 <<EOF
   var cfg = {
        "_id": "rs",
        "version": 1,
        "members": [
            {
                "_id": 0,
                "host": "${MONGODB1}:27017",
                "priority": 1
            }
        ]
    };
    rs.initiate(cfg, {force: true});
    rs.reconfig(cfg, {force: true});
EOF
