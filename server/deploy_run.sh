#!/bin/bash
cd /consumer_portal
sudo pm2 delete -f consumer_portal
sudo pm2 start -f index.js --name consumer_portal
sudo pm2 save --name consumer_portal