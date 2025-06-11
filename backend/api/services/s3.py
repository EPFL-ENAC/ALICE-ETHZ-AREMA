from enacit4r_files.services.s3 import S3Service
from api.config import config
import os

# Starting with botocore version 1.29.76 (March 2023), AWS added support for checksum trailers when uploading files to S3.
# However, many S3-compatible storage providers (like MinIO, DigitalOcean Spaces, Ceph, etc.) do not support this feature,
# resulting in the BadRequest: trailing checksum is not supported error.
os.environ["AWS_S3_DISABLE_CHECKSUM_TRAILER"] = "true"

s3_client = S3Service(config.S3_ENDPOINT_PROTOCOL + config.S3_ENDPOINT_HOSTNAME,
                      config.S3_ACCESS_KEY_ID,
                      config.S3_SECRET_ACCESS_KEY,
                      config.S3_REGION,
                      config.S3_BUCKET,
                      config.S3_PATH_PREFIX)
