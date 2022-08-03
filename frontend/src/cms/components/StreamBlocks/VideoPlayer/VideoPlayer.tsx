import React from 'react'

export type VideoPlayer = {
  src: string
}

export const VideoPlayer = ({ src }: VideoPlayer): React.ReactElement => {
  const embedId = src.split('=')[1]

  return (
    <iframe
      src={`https://www.youtube.com/embed/${embedId}`}
      width={'100%'}
      height={'100%'}
      frameBorder={0}
      allow={
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      }
      allowFullScreen
      title={'Embedded youtube'}
    />
  )
}
