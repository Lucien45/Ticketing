import Axios from "../api/axios";
import type { LoginResponse, User } from "../types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

async function registerUser(payload:RegisterPayload): Promise<User> {

    const { data } = await Axios.post<User>('/users', payload);
    return data;
}

async function loginUser(payload: LoginPayload): Promise<LoginResponse> {

    const { data } = await Axios.post<LoginResponse>('/users/login', payload);
    return data;
}

async function fetchUsers(): Promise<User[]> {
    const { data } = await Axios.get<User[]>('/users');
    return data;
}

export const UserService = {
    loginUser, registerUser, fetchUsers
}