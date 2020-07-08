jQuery.get(
  "https://raw.githubusercontent.com/bocayuvaadvogados/IPC/master/noticias",
  function (data) {
    data2 = data.split("\n").filter((o) => o !== "");
    data2.forEach(function (item, i) {
      if (i === 0) return;
      $(".carrossel")[0].innerHTML += carouselItem(item.split(";"));
    });
    $(document).ready(function () {
      $(".carrossel").slick({
        nextArrow:
          '<button class = "col-1" type="button"><img src="images/icons/controle-right.svg"/></button>',
        prevArrow:
          '<button class = "col-1" type="button"><img src="images/icons/controle-left.svg"/></button>',
        fade: true,
      });
    });
  }
);

function showEmpresa(data) {
  if (
    data.find(
      (empresa) => empresa.toLowerCase() === $("#empresas").val().toLowerCase()
    )
  ) {
    $("#nome-empresa p").text($("#empresas").val());
    $("#nome-empresa img").show();
  } else {
    $("#nome-empresa p").text(
      $("#empresas").val().length > 0 ? "Empresa não encontrada." : ""
    );
    $("#nome-empresa img").hide();
  }
}

jQuery.get(
  "https://raw.githubusercontent.com/bocayuvaadvogados/IPC/master/empresas",
  function (data) {
    var wto;
    data2 = data.split(";").filter((o) => o !== "");
    autocomplete(document.getElementById("empresas"), data2);
    $(".autocomplete img").click(function () {
      $(".autocomplete img").attr("src", "images/icons/search.svg");
      $("#empresas").val("");
      showEmpresa(data2);
    });
    $("#empresas").keydown(function () {
      clearTimeout(wto);
      wto = setTimeout(() => {
        if ($(this).val().length > 0) {
          $(".autocomplete img").attr("src", "images/icons/close.svg");
        } else {
          $(".autocomplete img").attr("src", "images/icons/search.svg");
        }
        showEmpresa(data2);
      }, 1000);
    });
    $("#empresas").change(function () {
      clearTimeout(wto);
      wto = setTimeout(() => {
        if ($(this).val().length > 0) {
          $(".autocomplete img").attr("src", "images/icons/close.svg");
        } else {
          $(".autocomplete img").attr("src", "images/icons/search.svg");
        }
        showEmpresa(data2);
      }, 1000);
    });
  }
);

const carouselItem = (data) => {
  return `
  <div class = "col-12 row noticia-wrapper">
    <div class = "d-none d-sm-block col-sm-7">
      <img src="${data[3] !== "" ? data[3] : "images/logo-dark.svg"}" />
    </div>
    <div class = "col-10 offset-1 offset-sm-0 col-sm-6 noticia">
      <div class = "noticia-background">
        <div>
          <h3>${data[0]}</h3>
          <div class = "vertical-divider-news"></div>
          <p>${data[1]}</p>
        </div>
        <div>
          <a class = "btn btn-default" href = "${data[2]}">Acesse</a>
        </div>
      </div>
    </div>
  </div>
  `;
};

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          showEmpresa(arr);
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

$(document).ready(function () {
  var alreadyAnimated = false;
  var myElement = document.getElementById("progress1");

  var elementWatcher = scrollMonitor.create(myElement);

  /** Adding put to jquery */
  jQuery.each(["put", "delete"], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }

      return jQuery.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback,
      });
    };
  });

  function animateCircle(el, postfix) {
    var count = $(`#count${el}`);
    $({ Counter: 0 }).animate(
      { Counter: count.text() },
      {
        duration: 1000,
        easing: "linear",
        step: function (e) {
          count.text(Math.ceil(e) + postfix);
        },
      }
    );

    var s = Snap(`#animated${el}`);
    var progress = s.select(`#progress${el}`);

    progress.attr({ strokeDasharray: "0, 251.2" });
    Snap.animate(
      0,
      251.2,
      function (value) {
        progress.attr({ "stroke-dasharray": value + ",251.2" });
      },
      1000
    );
  }

  elementWatcher.enterViewport(function () {
    if (!alreadyAnimated) {
      animateCircle(1, "mi");
      animateCircle(2, "mi");
      animateCircle(3, "%");
      animateCircle(4, "bi");
    }
    alreadyAnimated = true;
  });

  $(".circle").css("height", $(".circle").css("width"));
  $(".circle svg").css("height", $(".circle").css("width"));
  $("#calculadora-btn").click(function () {
    $("#modal-calculadora").modal({ backdrop: "static", keyboard: false });
  });
  $("#empresa-btn").click(function () {
    $("#modal-empresas").modal({ backdrop: "static", keyboard: false });
  });
  $(".navigation a").click(function (e) {
    e.preventDefault();
    document.querySelector($(e.target).attr("href")).scrollIntoView({
      behavior: "smooth",
    });
  });

  function verifyFields(name, number, cpf, phone, mail) {
    name === ""
      ? $("#formName").addClass("error")
      : $("#formName").removeClass("error");
    phone === ""
      ? $("#formPhone").addClass("error")
      : $("#formPhone").removeClass("error");
    mail === ""
      ? $("#formMail").addClass("error")
      : $("#formMail").removeClass("error");
    return $("input.error").length === 0;
  }

  $("#formSubmit").on("click", function (e) {
    e.preventDefault();
    const name = $("#formName").val();
    const number = $("#formNumber").val();
    const cpf = $("#formCPF").val();
    const phone = $("#formPhone").val();
    const mail = $("#formMail").val();
    if (verifyFields(name, number, cpf, phone, mail)) {
      var mailData = {
        dest: "enggabrielalbino@gmail.com",
        nome: name,
        codigo: number,
        requerido: "",
        assunto: "LOG DE CONSULTA - SITE IPREV",
        telefone: phone,
        email: mail,
        cpf,
      };
      var storageData = {
        nome: name,
        cpf,
        email: mail,
        telefone: phone,
      };
      var requestUrl =
        "https://iprev-281923.rj.r.appspot.com/buscanome?nome=" +
        encodeURI(name);
      if (number !== "") {
        requestUrl =
          "https://iprev-281923.rj.r.appspot.com/buscacodigo?codigo=" + number;
      }
      $.get(requestUrl, function (data) {
        data.exists ? setFormSuccess() : setFormFail();
      });
      console.log(mailData, storageData);
      $.ajax({
        url: "https://iprev-281923.rj.r.appspot.com/email/sendmail",
        type: "POST",
        data: JSON.stringify(mailData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {},
      });
      $.ajax({
        url: "https://iprev-281923.rj.r.appspot.com/clientes/insert",
        type: "PUT",
        data: JSON.stringify(storageData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {},
      });
    }
  });
});

function setFormSuccess() {
  $(".success").css("z-index", 2);
  $(".form").addClass("success");
}
function setFormFail() {
  $(".fail").css("z-index", 2);
  $(".form").addClass("fail");
}
