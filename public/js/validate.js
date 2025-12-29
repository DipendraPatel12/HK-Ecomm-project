const loginForm = document.getElementById("login-form");
const fleshMsg = document.getElementById("flesh-msg");
const registerForm = document.getElementById("register-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email) {
      showFlesh("Email is required !", "error");
      return;
    }
    if (!password) {
      showFlesh("Password is required !", "error");
      return;
    }

    loginForm.submit();
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name) {
      showFlesh("Name is required!", "error");
    }
    if (!email) {
      showFlesh("Email is required!", "error");
      return;
    }
    if (!password) {
      showFlesh("Password is required!", "error");
      return;
    }
    if (password.length < 8) {
      showFlesh("Password must be at least 8 characters", "error");
      return;
    }

    registerForm.submit();
  });
}

function showFlesh(message, status) {
  fleshMsg.textContent = message;
  fleshMsg.className = `flesh ${status}`;
  fleshMsg.style.display = "block";

  setTimeout(() => {
    fleshMsg.style.display = "none";
  }, 1500);
}
