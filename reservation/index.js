const URL = "http://130.162.39.53/api/";
let isUpdated = false;
let id = null;

$(document).ready(function () {
    getAjax("GET", URL + "Reservation/all", "")
        .done(function (response) {
            filledTable(response);
        });
    getAjax("GET", URL + "Motorbike/all", "")
        .done(function (response) {
            filledSelect(response, '#motorbike');
        });
    getAjax("GET", URL + "Client/all", "")
        .done(function (response) {
            filledSelect(response, '#client');
        });
});

function getAjax(type, url, data) {
    return $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
    });
}

function filledTable(data) {
    let tBodyContent = "";
    for (let i = 0; i < data.length; i++) {
        tBodyContent += "<tr>";
        tBodyContent += `<th scope="row">${i + 1}</th>`;
        tBodyContent += `<td>${data[i].startDate}</td>`;
        tBodyContent += `<td>${data[i].devolutionDate}</td>`;
        tBodyContent += `<td>${data[i].client.name}</td>`;
        tBodyContent += `<td>${data[i].motorbike.name}</td>`;
        tBodyContent += `<td>${data[i].score}</td>`;
        tBodyContent += "<td>";
        tBodyContent += `<button type='button' class='btn btn-primary btn-update' value='${data[i].id}'>Actualizar</button>`;
        tBodyContent += `<button type='button' class='btn btn-danger btn-delete' value='${data[i].id}'>Eliminar</button>`;
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
        id: id,
        startDate: $("#startDate").val(),
        devolutionDate: $("#devolutionDate").val(),
        client: {
            id: $("#client").val(),
        },
        motorbike: {
            id: $("#motorbike").val(),
        },
        score: $("#score").val(),
    };
    if (isUpdated) {
        url += URL + 'Reservation/update'
    } else {
        url += URL + 'Reservation/save'
    }
    getAjax(isUpdated ? "PUT" : "POST", url, JSON.stringify(data))
        .done(function (response, textStatus, http) {
            if (http.status === 201) {
                $("#modal-form").modal("hide");
                getAjax("GET", URL + "Reservation/all", "").done(function (response) {
                    filledTable(response);
                });
            }
        });
})

$(".btn-modal").on("click", function () {
    isUpdated = false;
    id = null;
    $(".modal-title").html("Agregar reserva")
    $("#modal-form").modal("show");
})

function listeners() {
    $(".btn-update").on("click", function (e) {
        isUpdated = true;
        $(".modal-title").html("Actualizar reserva")
        let id = e.target.value;
        getAjax("GET", URL + `Reservation/${id}`, "").done(function (response) {
            setDataForm(response);
        });
        $("#modal-form").modal("show");
    });
    $(".btn-delete").on("click", function (e) {
        id = e.target.value;
        getAjax("DELETE", URL + `Reservation/${id}`, "").done(function (response, textStatus, http) {
            if (http.status === 204) {
                getAjax("GET", URL + "Reservation/all", "").done(function (response) {
                    filledTable(response);
                });
            }
        });
    });
}

function setDataForm(data) {
    id = data.id;
    $("#startDate").val(data.startDate);
    $("#devolutionDate").val(data.devolutionDate);
    $("#client").val(data.client.id);
    $("#motorbike").val(data.motorbike.id);
    $("#score").val(data.score);
}

function filledSelect(data, select){
    for(let i = 0; i < data.length; i++){
      $(`${select}`).append($('<option>', { 
        value: data[i].id,
        text : data[i].name 
      }));
    }
  }