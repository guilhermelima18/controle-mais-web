import axios from "axios";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: "http://localhost:3333/v1",
});

api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("@controle-mais:token")?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
