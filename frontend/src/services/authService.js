import apiRequest from "./api";

async function login(username, password) {
  const data = await apiRequest("/auth/login/", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  return data;
}

async function getCurrentUser() {
  const data = await apiRequest("/auth/me/", {
    method: "GET",
  });

  return data;
}

export { login, getCurrentUser };