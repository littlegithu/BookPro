#!/usr/bin/env python
import sys
import os

# Change to the backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from wsgiref.simple_server import make_server
from app import app

if __name__ == "__main__":
    print('Starting server on http://0.0.0.0:5000', file=sys.stderr)
    sys.stderr.flush()
    httpd = make_server('127.0.0.1', 5000, app)
    httpd.serve_forever()