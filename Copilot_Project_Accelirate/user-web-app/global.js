let pathPrefix = window.location.pathname.includes("services") ? "../../" : "src/";

fetch(pathPrefix + "components/navbar.html").then(response => response.text()).then(data => {
    document.getElementById("navbar-container").innerHTML = data;
    updateAuthState(); // Call this after navbar is loaded
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("iamhere")
    const token = localStorage.getItem("authToken");

    if (!token) {
        // Redirect to login if no token is found
        window.location.replace("./src/services/Auth/login.html");

    }
});

function updateAuthState() {
    const authLink = document.getElementById("auth-link");
    if (!authLink) return;

    const token = localStorage.getItem("authToken");
    if (token) {
        authLink.innerText = "Logout";
        authLink.removeAttribute("href");
        authLink.style.cursor = "pointer";
        authLink.onclick = logout;
    } else {
        authLink.innerText = "Login";
        authLink.href = "src/services/Auth/login.html";
        authLink.style.cursor = "pointer";
        authLink.onclick = null;
    }
}

function logout() {
    localStorage.removeItem("authToken");
    updateAuthState();
}