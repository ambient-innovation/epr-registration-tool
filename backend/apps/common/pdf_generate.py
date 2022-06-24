import gc
import tempfile

from django.conf import settings
from django.core.files import File
from django.template.loader import render_to_string
from django.utils._os import safe_join

from weasyprint import HTML, default_url_fetcher


class PDFService:
    """
    PDF service
    """

    FILE_URL_PREFIX = 'file:///'

    def _get_filename(self) -> str:
        raise NotImplementedError

    def _get_template(self) -> str:
        raise NotImplementedError

    @classmethod
    def url_fetcher(cls, url) -> dict:
        # https://www.ampad.de/blog/generating-pdfs-django/
        prefix = f'{cls.FILE_URL_PREFIX}{settings.STATIC_URL.strip("/")}/'
        if url.startswith(prefix):
            url = url[len(prefix) :]
            url = cls.FILE_URL_PREFIX + safe_join(settings.STATICFILES_DIRS, url)
        return default_url_fetcher(url)

    def generate_pdf(self):
        """
        Generates PDF file
        """
        html_content = self._create_pdf_content()

        """ Creates temp file """
        pdf_file = tempfile.NamedTemporaryFile(suffix=".pdf")

        """ Renders PDF content to PDF file """
        html_content.write_pdf(pdf_file)

        del html_content

        # garbage collector to free memory
        gc.collect()

        return File(name=f'{self._get_filename()}.pdf', file=pdf_file)

    def _create_pdf_content(self):
        """
        :return: pdf content
        """
        html_content = HTML(
            string=render_to_string(self._get_template(), self._get_context_data()), url_fetcher=self.url_fetcher
        )

        return html_content

    def _get_context_data(self):
        return {
            'pagesize': 'A4',
        }
