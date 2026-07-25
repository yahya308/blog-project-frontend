export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
}

export interface LoginCredentials {
  email: string;
  password: string;
}
