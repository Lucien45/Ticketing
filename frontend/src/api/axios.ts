import axios from "axios";
import { apiUrl } from "./api";
import { Token } from "../utils/Token";

const Axios = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

Axios.interceptors.request.use((config) => {
    const token = Token.GetToken('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

export default Axios;

// Extrait un message d'erreur lisible depuis une réponse d'API NestJS
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) {
      return data.message.join(', ');
    }
    if (typeof data?.message === 'string') {
      return data.message;
    }
    return error.message;
  }
  return 'Une erreur inattendue est survenue.';
}
