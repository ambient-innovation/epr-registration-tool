import strawberry


# For storage systems that aren’t accessible from the local filesystem, path will raise NotImplementedError instead.
@strawberry.type
class FileType:
    name: str
    size: int
    url: str


@strawberry.type
class ImageType(FileType):
    width: int
    height: int
