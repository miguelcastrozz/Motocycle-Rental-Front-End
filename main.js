(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

export function validate(data) {
  const email = /^[0-9a-zA-ZÀ-ÿ._\u00f1\u00d1]+@\w+?[.](edu|com|co|gov)?[.]?(edu|com|co|gov)?$/;
  let response = true;
  $.each(JSON.parse(data), function (key, value) {
    if (response !== false) {
      if(key == "brand" || key == "name" || key == "password"){
        response = (value.length >= 5 && value.length <= 45);
      }else if(key == "description" || key == "messageText"){
        response = (value.length >= 5 && value.length <= 250 );
      }else if(key == "email"){
        if(value.slice(-1) != "."){
          response = (value.length >= 10 && value.length <= 45) ? email.test(value) : false;
        }else{
          response = false;
        }
      }
    }
  });
  return response;
}
