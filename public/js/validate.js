const loginForm = document.getElementById("login-form");
const fleshMsg = document.getElementById("flesh-msg");
const registerForm = document.getElementById("register-form");
const addProductForm = document.getElementById("add-product-form");
const backendError = document.getElementById("backend-error");
const backendSuccess = document.getElementById("backend-success");
if (backendError) {
  backendError.style.display = "block";
  setTimeout(() => {
    backendError.style.display = "none";
  }, 1500);
}

if (backendSuccess) {
  backendSuccess.style.display = "block";
  setTimeout(() => {
    backendSuccess.style.display = "none";
  }, 1500);
}

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

if (addProductForm) {
  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const productName = document.getElementById("productName").value.trim();
    const stock = document.getElementById("stock").value.trim();
    const price = document.getElementById("price").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!productName) {
      showFlesh("Product Name is required!", "error");
      return;
    }
    if (!description) {
      showFlesh("description is required!", "error");
      return;
    }
    if (!stock) {
      showFlesh("Stock is required!", "error");
      return;
    }
    if (!price) {
      showFlesh("Price is required!", "error");
      return;
    }
    console.log(productName, description, stock, price);
    addProductForm.submit();
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
