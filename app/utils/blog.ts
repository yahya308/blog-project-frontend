import type { Blog } from '~/types/blog'

export function getBlogAuthorName(blog: Pick<Blog, 'authorName' | 'author'>) {
  return blog.authorName?.trim() || blog.author?.name || ''
}
