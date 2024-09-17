import { Image, ImageStyle } from 'expo-image'
import React from 'react'

type SvgImageProps = {
    url: string | number,
    style: ImageStyle,
    resizeMode?: 'cover' | 'contain',
}

const SvgImage = ({ url, style, resizeMode = 'contain' }: SvgImageProps) => {
    return (
        <Image source={url} style={{ ...style }} contentFit={resizeMode} />
    )
}

export default SvgImage