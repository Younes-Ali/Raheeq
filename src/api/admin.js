import { apiRequest } from "./api";

const TOKEN_KEY = "raheeq_admin_token";
const EXPIRY_KEY = "raheeq_admin_expiry";

export async function adminLogin(username, password) {
  const result = await apiRequest({
    action: "admin_login",
    username,
    password,
  });

  localStorage.setItem(TOKEN_KEY, result.token);

  localStorage.setItem(
    EXPIRY_KEY,
    String(Date.now() + result.expiresIn * 1000),
  );

  return result;
}

export function getAdminToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = Number(localStorage.getItem(EXPIRY_KEY));

  if (!token || !expiry || Date.now() >= expiry) {
    adminLogout();
    return null;
  }

  return token;
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function adminLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export async function adminRequest(payload) {
  const token = getAdminToken();

  if (!token) {
    throw new Error("session_expired");
  }

  try {
    return await apiRequest({
      ...payload,
      token,
    });
  } catch (error) {
    if (error.message === "unauthorized") {
      adminLogout();
    }

    throw error;
  }
}
