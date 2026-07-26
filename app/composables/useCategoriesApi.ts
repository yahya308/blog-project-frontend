import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/blog'
import { useApiClient } from './useApiClient'

interface CategoriesResponse {
  success: boolean
  message: string
  categories: Category[]
}

interface CategoryResponse {
  success: boolean
  message: string
  category: Category
}

export function useCategoriesApi() {
  const { apiFetch } = useApiClient()

  async function getCategories() {
    const response = await apiFetch<CategoriesResponse>('categories')
    return response.categories
  }

  async function getCategoryById(id: string) {
    const response = await apiFetch<CategoryResponse>(`categories/${id}`)
    return response.category
  }

  async function createCategory(payload: CreateCategoryPayload) {
    const response = await apiFetch<CategoryResponse>('categories', {
      method: 'POST',
      body: payload
    })
    return response.category
  }

  async function updateCategory(id: string, payload: UpdateCategoryPayload) {
    const response = await apiFetch<CategoryResponse>(`categories/${id}`, {
      method: 'PATCH',
      body: payload
    })
    return response.category
  }

  async function deleteCategory(id: string) {
    await apiFetch<{ success: boolean, message: string }>(`categories/${id}`, {
      method: 'DELETE'
    })
    return { id }
  }

  return {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
