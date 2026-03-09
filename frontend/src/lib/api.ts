import axios from 'axios';

export type RegisterData = {
  username: string;
  email: string;
  password: string;
}

export type LoginData = {
  email: string;
  password: string;
}

export type User = {
  id: number;
  username: string;
  email: string;
}


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
});

export const registerUser = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>("/auth/me");
    return response.data;
  } catch (error) {
    return null;
  }
};