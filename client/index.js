import { loadDataTable, validate } from "../main.js"

const URL = "http://130.162.39.53/api/Client";
let isUpdated = false;
let id = null;

$(document).ready(function () {
    getAjax("GET", URL + "/all", "")
      .done(function (response) {
        filledTable(response);
      }).always(function(){
        loadDataTable();
      });
      fillSelectAge();
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
      tBodyContent += `<td>${data[i].name}</td>`;
      tBodyContent += `<td>${data[i].email}</td>`;
      tBodyContent += `<td>${data[i].age}</td>`;
      tBodyContent += "<td>";
      tBodyContent += `<button type='button' class='btn btn-primary btn-update' value='${data[i].idClient}'>Actualizar</button>`;
      tBodyContent += `<button type='button' class='btn btn-danger btn-delete' value='${data[i].idClient}'>Eliminar</button>`;
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
      idClient: id,
      name: $("#name").val(),
      email: $("#email").val(),
      password: $("#password").val(),
      age: $("#age").val()
    };
    if(isUpdated){
      url+= URL + '/update' //PUT
    }else{
      url+= URL + '/save' //POST
    }
    if(validate(JSON.stringify(data))){
      getAjax(isUpdated ? "PUT" : "POST", url, JSON.stringify(data))
      .done(function (response, textStatus, http) {
        if (http.status === 201) {
          $("#modal-form").modal("hide"); //show, hide, toggle
          location.reload();
        }
      });
    }
});

$(".btn-modal").on("click", function(){
    isUpdated = false;
    id = null;
    $(".modal-title").html("Agregar cliente")
    $("#modal-form").modal("show"); //show, hide, toggle
})

function listeners() {
    $(".btn-update").on("click", function (e) {
      isUpdated = true;
      $(".modal-title").html("Actualizar cliente")
      let id = e.target.value;
      getAjax("GET", URL + `/${id}`, "").done(function (response) {
        setDataToForm(response);
      });
      $("#modal-form").modal("show"); //show, hide, toggle
    });
  
    $(".btn-delete").on("click", function(e) {
      let id = e.target.value;
      getAjax("DELETE", URL + `/${id}`, "").done(function (response, textStatus, http) {
        if(http.status == 204) {    
          location.reload();
        }
      });
    })
}

function fillSelectAge() {
  for (let i = 18; i <= 70; i++) {
    $("#age").append($('<option>', {
      value: i,
      text : i
    }))
  }
}

function setDataToForm(data){
    id = data.idClient;
    $("#name").val(data.name);
    $("#email").val(data.email);
    $("#password").val(data.password);
    $("#age").val(data.age);
}

function setDataEmpty(){
  id = null;
  $("#name").val("");
  $("#email").val("");
  $("#password").val("");
  $("#age").val("");
}

$("#modal-form").on("hidden.bs.modal", function(){
  setDataEmpty();
  $("form").removeClass("was-validated");
})