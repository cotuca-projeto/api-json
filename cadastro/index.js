const img = document.getElementsByClassName("view-password");

for (const element of img) {
  element.addEventListener("click", function () {
    const input = document.getElementById("password-field");
    if (input.type == "text") {
      input.type = "password";
      img[0].classList.add("hide");
      img[1].classList.remove("hide");
    } else {
      input.type = "text";
      img[0].classList.remove("hide");
      img[1].classList.add("hide");
    }
  });
}