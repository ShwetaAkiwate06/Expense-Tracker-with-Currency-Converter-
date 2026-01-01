// login.js
apiFetch("/api/auth/request-otp")
apiFetch("/api/auth/verify-otp")


let loginType = "email";

const emailField = document.getElementById("email-field");
const phoneField = document.getElementById("phone-field");
const otpField = document.getElementById("otp-field");

// Toggle Email Login
document.getElementById("emailLoginBtn").onclick = () => {
  loginType = "email";
  emailField.style.display = "block";
  phoneField.style.display = "none";
  otpField.style.display = "none";
};

// Toggle Phone Login
document.getElementById("phoneLoginBtn").onclick = () => {
  loginType = "sms";
  emailField.style.display = "none";
  phoneField.style.display = "block";
  otpField.style.display = "none";
};

// Send OTP
document.getElementById("sendOtpBtn").addEventListener("click", async () => {
  const payload =
    loginType === "email"
      ? { type: "email", email: document.getElementById("email").value }
      : { type: "sms", phone: document.getElementById("phone").value };

  const res = await fetch(`${BASE_URL}/api/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    otpField.style.display = "block";
  }
});

// Verify OTP
document.getElementById("verifyOtpBtn").addEventListener("click", async () => {
  const otp = document.getElementById("otp").value;

  const payload =
    loginType === "email"
      ? {
          type: "email",
          email: document.getElementById("email").value,
          otp,
        }
      : {
          type: "sms",
          phone: document.getElementById("phone").value,
          otp,
        };

  const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "home.html";
  } else {
    alert(data.message || "Invalid OTP");
  }
});
