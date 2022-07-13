import imageCompression from 'browser-image-compression'
import { useCallback, useState } from 'react'

interface UseCompressedImageReturnType {
  image: File | null | undefined
  imageURL: string
  isCompressing: boolean
  updateImage: (img: null | File) => void
  isError: boolean
  progress: number
}

export const useCompressedImage = (): UseCompressedImageReturnType => {
  const [isCompressing, setCompressing] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [image, setImage] = useState<null | File | undefined>(undefined)
  const [imageURL, setImageURL] = useState<string>('')
  const [isError, setError] = useState<boolean>(false)

  const handleChangeFile = useCallback(
    async (img: null | File) => {
      if (img === null) {
        setImageURL('')
        setImage(null)
        return
      }
      setError(false)
      setCompressing(true)

      try {
        const compressedFile = await imageCompression(img, {
          // Use webworker for faster compression with
          // the help of threads
          useWebWorker: true,
          maxSizeMB: 2,
          maxWidthOrHeight: 1024,
          onProgress: (value: number) => {
            setProgress(value)
          },
        })
        setImage(compressedFile)
        setImageURL(URL.createObjectURL(compressedFile))
      } catch (error) {
        setError(true)
      } finally {
        setTimeout(() => {
          setCompressing(false)
          setProgress(0)
        }, 500)
      }
    },
    [setImage]
  )

  return {
    image: isError && image ? undefined : image,
    imageURL: isError ? '' : imageURL,
    isCompressing,
    progress,
    updateImage: handleChangeFile,
    isError,
  }
}
