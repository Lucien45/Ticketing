import { jwtDecode } from "jwt-decode";
import { Token } from "../utils/Token";
import { useState } from "react";

interface JwtPayload {
    exp: number;
}

interface User {
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export const isAuthenticated = (): boolean => {
  const token = Token.GetToken('access_token');
  const profile = Token.GetToken('user');
  
  if (!token || !profile) {
    return false;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      Token.RemoveToken('access_token');
      Token.RemoveToken('user');
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token invalide :", error);
    return false;
  }
};

export function useCurrentUser() {
  const [user] = useState<User | null>(() => {
      const raw = Token.GetToken("user");
      if (!raw) return null;

      try {
          return JSON.parse(raw);
      } catch (error) {
          console.error("Erreur lors du parsing du token user :", error);
          return null;
      }
  });

  const isAdmin = user?.role === 'admin';

  return { user, isAdmin };
}

export const logout = () => {
  Token.RemoveToken('access_token');
  Token.RemoveToken('user');
  console.warn('suppression du token auth........');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};
