import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings

from model_bakery import baker

from apps.common.tests.test_base import BaseApiTestCase


class ChangeCompanyLogoMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    MUTATION = """
        mutation changeCompanyLogo(
            $file: Upload
        ) {
            changeCompanyLogo(
                file: $file
            )
        }
    """

    @staticmethod
    def create_image():
        from PIL import Image

        # we need to create a real image so the image file validation does not fail
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            image = Image.new('RGB', (200, 200), 'white')
            image.save(f, 'JPEG')

        return open(f.name, mode='rb')

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = baker.make_recipe('company.tests.company', users_queryset=[cls.user])

    def test_upload_jpg_logo(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={},
            files={'file': self.create_image()},
        )
        self.company.refresh_from_db()
        self.assertEqual('UPDATED', content['changeCompanyLogo'])
        self.assertTrue(self.company.logo)

    def test_upload_not_allowed_file(self):
        pdf_file = SimpleUploadedFile(name='test_image.pdf', content=b'test', content_type='application/pdf')
        self.query_and_assert_error(self.MUTATION, variables={}, files={'file': pdf_file}, message='invalidExtension')

    @override_settings(MAX_LOGO_FILE_SIZE=2)
    def test_upload_to_large_logo_file(self):
        self.query_and_assert_error(
            self.MUTATION, variables={}, files={'file': self.create_image()}, message='maximumFileSizeExceeded'
        )

    def test_delete_logo(self):
        self.company.logo = SimpleUploadedFile(name='test_old_image.jpg', content=b'test', content_type='image/jpeg')
        self.company.save()

        self.query_and_load_data(self.MUTATION, variables={})
        self.company.refresh_from_db()
        self.assertFalse(bool(self.company.logo))

    def test_change_logo(self):
        self.company.logo = SimpleUploadedFile(name='test_old_image.jpg', content=b'test', content_type='image/jpeg')
        self.company.save()

        new_jpg_file = self.create_image()

        self.query_and_load_data(self.MUTATION, variables={}, files={'file': new_jpg_file})
        self.company.refresh_from_db()
        self.assertTrue(bool(self.company.logo))
        self.assertNotEqual('logos/test_old_image.jpg', self.company.logo.name)
