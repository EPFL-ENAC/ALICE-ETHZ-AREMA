from enacit4r_files.services.s3 import S3Service
from api.config import config

s3_client = S3Service(config.S3_ENDPOINT_PROTOCOL + config.S3_ENDPOINT_HOSTNAME,
                      config.S3_ACCESS_KEY_ID,
                      config.S3_SECRET_ACCESS_KEY,
                      config.S3_REGION,
                      config.S3_BUCKET,
                      config.S3_PATH_PREFIX)
