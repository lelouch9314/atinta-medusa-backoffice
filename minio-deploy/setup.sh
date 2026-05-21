#!/bin/sh
set -e

# Start MinIO server in background
minio server /data --console-address ":9001" &
MINIO_PID=$!

# Wait for MinIO to be ready
echo "Waiting for MinIO to start..."
sleep 5

# Retry until MinIO is responsive
for i in $(seq 1 30); do
  if wget -q --spider http://localhost:9000/minio/health/live 2>/dev/null; then
    echo "MinIO is ready"
    break
  fi
  echo "Waiting for MinIO... attempt $i"
  sleep 2
done

# Configure MinIO client and create bucket
mc alias set local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" || true

# Create bucket if it doesn't exist
mc mb local/products_images --ignore-existing || true

# Set bucket to public read access
mc anonymous set download local/products_images || true

echo "MinIO setup complete. Bucket 'products_images' is ready."

# Wait for MinIO server process
wait $MINIO_PID
