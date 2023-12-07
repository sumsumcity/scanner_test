#!/bin/bash

echo "Node.js version: $(node --version)"
echo "Starting server on port ${HOST}:${PORT}"
node /app/seedDB/seeder.js

echo "Executing node app.js"
exec node app.js