import type { Blog } from '~/types/blog'

export function getBlogAuthorName(blog: Pick<Blog, 'authorName' | 'author'>) {
  return blog.authorName?.trim() || blog.author?.name || ''
}

export function getReadingMinutes(content?: string | null) {
  const plainText = content?.replace(/<[^>]*>/g, ' ') ?? ''
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(wordCount / 200))
}
