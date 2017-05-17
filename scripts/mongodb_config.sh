#!/bin/bash
echo "Waiting for mongodb..."
until curl http://mongodb:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done

echo curl http://mongodb:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1
echo "mongodb is ready..."

echo time now: `date +"%T" `
mongo --host mongodb:27017 <<EOF
   var cfg = {
        "_id": "rs",
        "version": 1,
        "members": [
            {
                "_id": 0,
                "host": "mongodb:27017",
                "priority": 1
            }
        ]
    };
    rs.initiate(cfg, {force: true});
    rs.reconfig(cfg, {force: true});
EOF
