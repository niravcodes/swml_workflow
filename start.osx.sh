#!/bin/bash

BACKEND_SD=`head /dev/urandom | LC_ALL=C tr -dc A-Za-z0-9 | head -c12| awk '{print tolower($0)}'` 

# SWMLPROXY_SD=`head /dev/urandom | LC_ALL=C tr -dc A-Za-z0-9 | head -c12 |  awk '{print tolower($0)}'`
SWMLPROXY_SD='uniquesubdomainforyourtest'

# Start the proxy server
cd swml_backend 
nodemon index.js &
lt -h "https://localtunnel.me" -p 3001 -s $BACKEND_SD &
echo "Started proxy server"
cd ..

# Start the server that serves SWML to SignalWire
cd swml_server
node index.js $BACKEND_SD &
lt -h "https://localtunnel.me" -p 3500 -s $SWMLPROXY_SD &
echo "Started SWML server"
cd ..

# Open the AI voice call testing app
cd swml_caller_helper
./start.osx.sh
cd ..