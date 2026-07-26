interface ImageOptions {
  width: number
  quality?: number
  fit?: 'crop' | 'max'
}

export function getOptimizedImageUrl(value: string, options: ImageOptions) {
  try {
    const url = new URL(value)

    if (url.hostname !== 'images.unsplash.com') {
      return value
    }

    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', options.fit ?? 'crop')
    url.searchParams.set('w', String(options.width))
    url.searchParams.set('q', String(options.quality ?? 78))

    return url.toString()
  } catch {
    return value
  }
}

export function getImageSrcSet(
  value: string,
  widths: number[],
  options: Omit<ImageOptions, 'width'> = {}
) {
  return widths
    .map(width => `${getOptimizedImageUrl(value, { ...options, width })} ${width}w`)
    .join(', ')
}
