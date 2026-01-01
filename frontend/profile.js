// profile.js
apiFetch("/api/profile")


async function apiFetch(endpoint) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  return res.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  const profileIcon = document.getElementById("profile-icon");
  const profileName = document.getElementById("profile-username");

  if (!profileIcon || !profileName) return;

  try {
    const data = await apiFetch("/api/profile");
    if (!data || !data.user) return;

    const identifier = data.user.identifier;

    profileIcon.textContent = identifier.charAt(0).toUpperCase();
    profileName.textContent = identifier;

  } catch (err) {
    console.error("Profile load failed:", err);
  }
});
