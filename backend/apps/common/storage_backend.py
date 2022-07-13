from urllib.parse import urljoin

from django.conf import settings
from django.core.files.storage import FileSystemStorage

from storages.backends.s3boto3 import S3Boto3Storage


class PrivateMediaStorage(S3Boto3Storage):
    object_parameters = {'ContentDisposition': 'attachment'}
    location = settings.AWS_PRIVATE_MEDIA_LOCATION
    querystring_expire = 3600  # seconds until the generated link expires
    default_acl = 'private'
    file_overwrite = True
    custom_domain = False


absolute_media_url = urljoin(settings.BASE_URL, settings.MEDIA_URL)

if settings.AWS_PRIVATE_MEDIA_LOCATION:
    PRIVATE_FILE_STORAGE = PrivateMediaStorage()
else:
    file_system_storage = FileSystemStorage(location=settings.MEDIA_ROOT, base_url=absolute_media_url)
    PRIVATE_FILE_STORAGE = file_system_storage


def private_file_storage():
    return PRIVATE_FILE_STORAGE
