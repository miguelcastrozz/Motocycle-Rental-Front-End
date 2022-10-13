const URL = "http://130.162.39.53/api/";
let isUpdated = false;
let id = null;

$(document).ready(function () {
  getAjax("GET", URL + "Message/all", "")
    .done(function (response) {
      filledTable(response);
    });
});

function getAjax(type, url, data) {
  return $.ajax({
    type: type, // GET, POST, PUT OR DELETE
    url: url,   // https://google.com
    data: data, // {"id" : 1 , "nombre": "Pepito Perez"}
    dataType: "json",
    contentType: "application/json; charset=utf-8",
  });
}

function filledTable(data) {
  let tBodyContent = "";
  for (let i = 0; i < data.length; i++) {
    tBodyContent += "<tr>";
    tBodyContent += `<th scope="row">${i+1}</th>`;
    tBodyContent += `<td>${data[i].messageText}</td>`;
    tBodyContent += "<td>";
    tBodyContent += `<button type='button' class='btn btn-primary btn-update' value='${data[i].idMessage}'>Actualizar</button>`;
    tBodyContent += `<button type='button' class='btn btn-danger btn-delete' value='${data[i].idMessage}'>Eliminar</button>`;
    tBodyContent += "</td>";
    tBodyContent += "</tr>";
  }
  $(".table tBody").html(tBodyContent);
  listeners();
}

$("form").on("submit", function (e) {
  let url = '';
  e.preventDefault();
  let data = {
    idMessage: id,
    messageText: $("#messageText").val(),
  };
  if(isUpdated){
    url+= URL + 'Message/update' //PUT
  }else{
    url+= URL + 'Message/save' //POST
  }
  getAjax(isUpdated ? "PUT" : "POST", url, JSON.stringify(data))
    .done(function (response, textStatus, http) {
      if (http.status == 201) {
        $("#modal-form").modal("hide"); //show, hide, toggle
        getAjax("GET", URL + "Message/all", "").done(function (response) {
          filledTable(response);
        })
      }
    });
});

$(".btn-modal").on("click", function(){
  isUpdated = false;
  id = null;
  $(".modal-title").html("Agregar mensaje")
  $("#modal-form").modal("show"); //show, hide, toggle
})

function listeners() {
  $(".btn-update").on("click", function (e) {
    isUpdated = true;
    $(".modal-title").html("Actualizar mensaje")
    let id = e.target.value;
    getAjax("GET", URL + `Message/${id}`, "").done(function (response) {
      setDataToForm(response);
    });
    $("#modal-form").modal("show"); //show, hide, toggle
  });

  $(".btn-delete").on("click", function(e) {
    let id = e.target.value;
    getAjax("DELETE", URL + `Message/${id}`, "").done(function (response, textStatus, http) {
      if(http.status == 204) {    
        getAjax("GET", URL + "Message/all", "").done(function (response) {
          filledTable(response);
        })
      }
    });
  })
}

function setDataToForm(data) {
  id = data.idMessage;
  $("#messageText").val(data.messageText);
}

function setDataEmpty() {
  id = null;
  $("#messageText").val("");
}

$("#modal-form").on("hidden.bs.modal", function(){
  setDataEmpty();
  $("form").removeClass("was-validated");
})
