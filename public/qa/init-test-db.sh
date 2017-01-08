echo "Removing all documents from all collections"
node cleanup-db.js

echo "Initializing all collections with fresh documents"
node setup-db.js
