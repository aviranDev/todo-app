import jwtDecode from "jwt-decode";
import httpService from "./httpService"
const apiUrl = "http://localhost:3900/api";

const TOKEN_KEY = 'my_token'
httpService.setDefaultCommonHeader('x-auth-token', getJWT());

/**
 * SIGNUP 
 */
export function signupUser(user) {
  return httpService.post(`${apiUrl}/users/create-user`, user)
}

export async function logIn(email, password) {
  httpService.setDefaultCommonHeader('x-auth-token', getJWT());
  const { data: { token } } = await httpService.post(`${apiUrl}/auth/login`, { email, password })
  localStorage.setItem(TOKEN_KEY, token);
}


export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(TOKEN_KEY);
    return jwtDecode(jwt);
  } catch {
    return null
  }
}

export function getJWT() {
  return localStorage.getItem(TOKEN_KEY);
}


export function logOut() {
  localStorage.removeItem(TOKEN_KEY);
}

const userService = {
  signupUser,
  logIn,
  getCurrentUser,
  getJWT,
  logOut,
}

export default userService