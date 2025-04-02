 
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

 
 
async function handleSignupSubmit(event) {
  event.preventDefault(); 
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const signUpApiUrl="http://localhost:2024/api/auth/register"
  

 try {
  if(password===confirmPassword){
    const data={
        firstName:firstName,
        lastName:lastName,
        email:email,
        password:password
    }

   const response = await fetch(signUpApiUrl,{
      method : "POST",
      headers : {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })

    const result= await response.json();

    if(result.token){
    localStorage.setItem("authToken", result.token);
    window.location.href = "/";
    // window.location.href = "http://127.0.0.1:5501/user-web-app/home.html";
    console.log("API Response:", result);
    alert("Registered successfully!");
    }
  }else{
    alert("Passwords must be same.");
    console.log("Invalid password")
    
  }
 } catch (error) {
  console.error("Error:", error);
    alert("Register failed. Please try again.");
   
  
 }
 








}

document.getElementById("signupForm").addEventListener("submit", handleSignupSubmit);