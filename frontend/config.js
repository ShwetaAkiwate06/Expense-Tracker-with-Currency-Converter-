// config.js
window.BASE_URL = "http://localhost:3000";

window.apiFetch = async function (endpoint, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  });
};
