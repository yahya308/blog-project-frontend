import { defineStore } from "pinia";
import type { AuthUser } from "~/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => user.value !== null);

  return {
    user,
    loading,
    isAuthenticated,
  };
});
