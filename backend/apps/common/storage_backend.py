import os
from urllib.parse import urljoin

from django.conf import settings
from django.core.files.storage import FileSystemStorage

from storages.backends.s3boto3 import S3Boto3Storage


class PrivateMediaStorage(S3Boto3Storage):
    object_parameters = {'ContentDisposition': 'attachment'}
    location = settings.AWS_PRIVATE_MEDIA_LOCATION
    querystring_expire = 3600  # seconds until the generated link expires
    default_acl = 'bucket-owner-full-control'
    file_overwrite = True
    custom_domain = False


absolute_media_url = urljoin(settings.BASE_URL, settings.MEDIA_URL)

if settings.AWS_PRIVATE_MEDIA_LOCATION:
    PRIVATE_FILE_STORAGE = PrivateMediaStorage()
else:
    file_system_storage = FileSystemStorage(location=settings.MEDIA_ROOT, base_url=absolute_media_url)
    PRIVATE_FILE_STORAGE = file_system_storage


class LocalFileStorage(FileSystemStorage):
    def __init__(self, *args, **kwargs):
        """
        This storage class creates absolute URLs, based on the following pattern:
            <BASE_URL>/<MEDIA_URL>/path/to/my/image.jpg
        In production we store media files in an S3 Bucket, so image URLs will
        be absolute by default, since the media domain differs from our backend server.
        This class tries stay close to this behaviour by also returning absolute media URLs.
        """
        super().__init__(*args, **kwargs, base_url=absolute_media_url)

    def get_available_name(self, name, max_length=None):
        """
        By default Django ensures unique file-names, by adding a generated suffix at the end
        of the file-name when a file with an existing name is uploaded to the same directory.
        This altered implementation removes existing files when new files with the same name are uploaded.
        Hence the new file can keep it's original name and thus overwrites the old file.
        We do this in order to stay as close as possible to the behaviour of the Boto3 (AWS bucket) setting
        `PublicS3Storage.file_overwrite=True`, which is used in production .
        Based on: https://stackoverflow.com/a/9523400/11621551
        """
        if self.exists(name):
            os.remove(os.path.join(self.base_location, name))
        return name


class PublicS3Storage(S3Boto3Storage):
    location = 'media/public/'
    file_overwrite = True


def private_file_storage():
    return PRIVATE_FILE_STORAGE


def public_file_storage():
    if settings.AWS_BUCKET_NAME:
        return PublicS3Storage()
    else:
        return FileSystemStorage(location=settings.MEDIA_ROOT, base_url=absolute_media_url)
