 
const forms = document.querySelector(".forms")
const pwShowHide = document.querySelectorAll(".eye-icon")
  // links = document.querySelectorAll("");
// Add click event listener to each eye icon for toggling password visibility
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach(password => {
      if (password.type === "password") { // If password is hidden
        password.type = "text"; // Show password
        eyeIcon.classList.replace("bx-hide", "bx-show"); // Change icon to show state
        return;
      }
      password.type = "password"; // Hide password
      eyeIcon.classList.replace("bx-show", "bx-hide"); // Change icon to hide state
    });
  });
});


async function handleLoginSubmit(event) {
  event.preventDefault(); 

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const apiUrl = "http://localhost:2024/api/auth/login";

  const data = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.token) {
      localStorage.setItem("authToken", result.token);
      window.location.href = "/";
      console.log("API Response:", result);
      alert("Login successful!");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Login failed. Please try again.");
  }
}

// Ensure the form with ID 'loginForm' exists in your HTML
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", handleLoginSubmit);
}

 