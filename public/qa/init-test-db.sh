#!/usr/bin/env bash
echo "Removing all documents from all collections"
node cleanup-db.js --all

echo "Initializing all collections with fresh documents"
node setup-db.js
