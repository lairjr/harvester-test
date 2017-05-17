#!/bin/bash
echo "Waiting for mongodb1..."
until curl http://mongodb1:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done

echo curl http://mongodb1:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1
echo "mongodb1 is ready..."

echo time now: `date +"%T" `
mongo --host mongodb1:27017 <<EOF
   var cfg = {
        "_id": "rs1",
        "version": 1,
        "members": [
            {
                "_id": 0,
                "host": "mongodb1:27017",
                "priority": 2
            },
            {
                "_id": 1,
                "host": "mongodb2:27017",
                "priority": 1
            }
        ]
    };
    rs.initiate(cfg, {force: true});
    rs.reconfig(cfg, {force: true});
EOF
