import base64
import os
import typing

from wagtail.images.models import Image


def get_image_mime_type(file_name) -> typing.Optional[str]:
    _, image_ext = os.path.splitext(file_name)
    return {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
    }.get(image_ext, None)


def get_image_placeholder(image: Image, max_size=32) -> typing.Optional[str]:
    """
    Creates a base64 encoded image placeholder for a given image

    Basically copied from:
    https://github.com/wagtail/wagtail/issues/3221#issuecomment-267478534
    """

    if not image:
        return None

    tiny_rendition = image.get_rendition(f'max-{max_size}x{max_size}')
    image_mime = get_image_mime_type(tiny_rendition.file.name)

    try:
        tiny_rendition.file.open('rb')
    except FileNotFoundError:
        placeholder = None
    else:
        placeholder = 'data:{mime};base64,{b64}'.format(
            mime=image_mime, b64=base64.b64encode(tiny_rendition.file.read()).decode('ascii')
        )
    finally:
        tiny_rendition.file.close()
    return placeholder
