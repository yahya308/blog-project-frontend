export type BlogStatus = "DRAFT" | "PUBLISHED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface CategoryFormState {
  name: string;
  slug: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
}

export interface UpdateCategoryPayload {
  name: string;
  slug: string;
}

export interface BlogFormState {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  authorName: string;
  status: BlogStatus;
  publishedAt: string;
  categoryIds: string[];
}

export interface CreateBlogPayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  authorName?: string | null;
  categoryIds?: string[];
}

export interface UpdateBlogPayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  authorName?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  categoryIds?: string[];
}

export interface BlogAuthor {
  id: string;
  name: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  authorId: string;
  authorName?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: BlogAuthor;
  categories?: Category[];
}

export interface GeneratedBlogDraft {
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImageQuery: string;
  coverImageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  categoryIds: string[];
}

export interface GenerateBlogDraftResponse {
  success: boolean;
  message: string;
  draft: GeneratedBlogDraft;
}
