#!/bin/bash
cd /"$1"/consumer_portal
sudo pm2 stop -f consumer_portal_"$1"
sudo pm2 delete -f consumer_portal_"$1"
sudo NODE_ENV="$1" pm2 start -f index.js --name consumer_portal_"$1"
sudo pm2 save --name consumer_portal_"$1"