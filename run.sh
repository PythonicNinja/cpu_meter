#!/usr/bin/env bash

python3 server.py &
python3 -m http.server &
open http://localhost:8000/client.html
