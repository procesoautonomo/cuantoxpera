let juntada;

class Amigo {
  constructor() {
    this.Id = 0;
    this.Nombre = "";
    this.Monto = 0;
  }
}

class Cobrador {
  constructor() {
    this.Amigo = new Amigo();
    this.SaldoCobrador = 0;
  }
}

class Deudor {
  constructor() {
    this.Amigo = new Amigo();
    this.SaldoDeudor = 0;
  }
}

class Pago {
  constructor() {
    this.AmigoCobrador = new Cobrador();
    this.AmigoDeudor = new Deudor();
    this.MontoPagar = 0;
    this.MontoRedondeado = 0;
  }
}

class Juntada {
  constructor() {
    this.Id = 0;
    this.Amigos = [];
    this.Deudores = [];
    this.Cobradores = [];
    this.Pagos = [];
    this.TotalJuntada = 0;
    this.TotalxPera = 0;
  }
}

$(document).ready(function () {
  inicializar_sw();
  inicializar();
  consultar_amigos();

  $("#btnCompartirResultados").hide();
  if (navigator.share) {
    $("#btnCompartirResultados").show();
  }
});

$(document).keypress(function (e) {
    if (e.which == 13) {
      validar_persona();
    }
  });

function inicializar() {
  juntada = JSON.parse(localStorage.getItem("Juntada"));
  if (!juntada) {
    juntada = new Juntada();
    juntada.Id = 1;
  }
}

function consultar_amigos() {
  for (let i = 0; i < juntada.Amigos.length; i++) {
    let amigo = juntada.Amigos[i];
    mostrar_persona(amigo);
  }
}

function mostrar_persona(pAmigo) {
  var li_persona =
    '<li class="flex items-center justify-between bg-orange-primary text-sm text-white sm:text-base placeholder-gray-500 pl-1 pr-4 rounded-xl border-2 border-white w-full py-2 focus:outline-none mb-3">\
                          <div>' +
    pAmigo.Id +
    ") " +
    pAmigo.Nombre +
    ": $" +
    pAmigo.Monto +
    '</div>\
                          <div>\
                              <a class=""\
                                  data-idAmigo="' +
    pAmigo.Id +
    '"\
                                  data-nombre="' +
    pAmigo.Nombre +
    '"\
                                  data-monto="' +
    pAmigo.Monto +
    '"\
                                  onclick="editar(this);">\
                                      <span class="">Modificar</span>\
                              </a>\
                              || <a id="btn-eliminar-amigo" class=""\
                                  data-idAmigo="' +
    pAmigo.Id +
    '"\
                                  data-nombre="' +
    pAmigo.Nombre +
    '"\
                                  data-monto="' +
    pAmigo.Monto +
    '"\
                                  @click="showModal2 = true" onclick="confirmar_eliminar(this);">\
                                      <span class="">Quitar</span>\
                              </a>\
                           </div>\
                          </li>';
  $("#ul_personas").append(li_persona);
  $("#panel_personas").show();

  $("#btnCalcular").hide();
  if ($("#ul_personas li").length > 1) {
    $("#btnCalcular").show();
  }
}

function validar_persona() {
  let nombre = $("#txtNombre").val();
  let monto = $("#txtMonto").val();

  if (nombre == "") {
    $.toast({
      heading: "Atención",
      text: "Ingresa el Nombre",
      icon: "warning",
      loader: true,
      position: "top-right",
    });
    $("#txtNombre").focus();
    return;
  }

  if (monto == "") {
    $.toast({
      heading: "Atención",
      text: "Ingresa el monto",
      icon: "warning",
      loader: true,
      position: "top-right",
    });
    $("#txtMonto").focus();
    return;
  }

  let amigo = new Amigo();
  let totalJuntada = 0;
  let totalXpera = 0;
  let id = 0;

  if (juntada.Amigos.length != 0) {
    id = juntada.Amigos[juntada.Amigos.length - 1].Id;
  }

  amigo.Id = id + 1;
  amigo.Nombre = nombre;
  amigo.Monto = Number.parseInt(monto);

  juntada.Amigos.push(amigo);
  mostrar_persona(amigo);

  for (let i = 0; i < juntada.Amigos.length; i++) {
    totalJuntada = totalJuntada + juntada.Amigos[i].Monto;
  }
  totalXpera = totalJuntada / juntada.Amigos.length;

  juntada.TotalJuntada = Number.parseInt(totalJuntada);
  juntada.TotalxPera = Number.parseInt(totalXpera);

  localStorage.setItem("Juntada", JSON.stringify(juntada));

  $.toast({
    heading: "Info",
    text: amigo.Nombre + " gastó " + amigo.Monto,
    icon: "info",
    loader: true,
    position: "top-right",
  });

  $("#txtNombre").val("").focus();
  $("#txtMonto").val("");

  $("#btnCalcular").hide();
  if ($("#ul_personas li").length > 1) {
    $("#btnCalcular").show();
  }
}

function limpiar() {
  juntada = new Juntada();
  juntada.Id = 1;
  localStorage.setItem("Juntada", JSON.stringify(juntada));

  $.toast({
    heading: "Información",
    text: "Todos los amigos fueron borrados.",
    icon: "success",
    loader: true,
    position: "top-right",
  });
  $("#ul_personas").empty();
  $("#panel_personas").hide();
}

function eliminar_amigo(mostrar_toast) {
  let idAmigo = $("#lblAmigo").attr("data-idAmigo");
  let amigo;
  let totalJuntada = 0;
  let totalXpera = 0;
  let i;

  juntada.Amigos.find(function (value, index) {
    if (value.Id === Number.parseInt(idAmigo)) {
      amigo = value;
      i = index;
    }
  });

  juntada.Amigos.splice(i, 1);

  for (let i = 0; i < juntada.Amigos.length; i++) {
    totalJuntada = totalJuntada + juntada.Amigos[i].Monto;
  }
  totalXpera = totalJuntada / juntada.Amigos.length;

  juntada.TotalJuntada = Number.parseInt(totalJuntada);
  juntada.TotalxPera = Number.parseInt(totalXpera);

  localStorage.setItem("Juntada", JSON.stringify(juntada));

  $('#btn-eliminar-amigo[data-idAmigo="' + amigo.Id + '"]')
    .parent()
    .parent()
    .remove();

  if (mostrar_toast) {
    $.toast({
      heading: "Eliminado",
      text: "Se eliminaron los gastos de " + amigo.Nombre,
      icon: "success",
      loader: true,
      position: "top-right",
    });
  }

  $("#btnCalcular").hide();
  if ($("#ul_personas li").length > 1) {
    $("#btnCalcular").show();
  }

  if ($("#ul_personas li").length < 1) {
    $("#panel_personas").hide();
  }
}

function editar(control) {
  var idAmigo = $(control).attr("data-idAmigo");
  var nombre = $(control).attr("data-nombre");
  var monto = $(control).attr("data-monto");

  $("#lblAmigo").attr("data-idAmigo", idAmigo);
  $("#lblAmigo").text(nombre);

  $("#txtNombre").val(nombre);
  $("#txtMonto").val(monto).focus();

  eliminar_amigo(false);
}

function confirmar_eliminar(control) {
  var idAmigo = $(control).attr("data-idAmigo");
  var nombre = $(control).attr("data-nombre");
  $("#lblAmigo").attr("data-idAmigo", idAmigo);
  $("#lblAmigo").text(nombre);
}

function inicializar_sw() {
  var ruta_sw = "./sw.js";
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(ruta_sw)
      .then(function () {
        return navigator.serviceWorker.ready;
      })
      .then(function (reg) {
        // console.log('sw registrado ' + reg);
      })
      .catch(function (error) {
        // console.log('Service Worker error :^(', error);
      });
  }
}

function compartir_resultados() {
  var text_a_pagar = $("#text_pagos_personas").text().trim();
  if (navigator.share) {
    navigator
      .share({
        title: "Cuanto x Pera",
        text: text_a_pagar + "\n\n",
        url: "https://cuantoxpera.com.ar",
      })
      .then
      // () => console.log('Successful share')
      ()
      .catch
      // (error) => console.log('Error sharing', error)
      ();
  }
}

function calcular_joda() {
  juntada.Deudores = [];
  juntada.Cobradores = [];
  juntada.Pagos = [];

  for (let i = 0; i < juntada.Amigos.length; i++) {
    let amigo = juntada.Amigos[i];
    let montoxpera = juntada.TotalxPera;

    if (amigo.Monto < montoxpera) {
      let deudor = new Deudor();
      deudor.Amigo = amigo;
      deudor.SaldoDeudor = montoxpera - amigo.Monto;
      juntada.Deudores.push(deudor);
    } else {
      let cobrador = new Cobrador();
      cobrador.Amigo = amigo;
      cobrador.SaldoCobrador = amigo.Monto - montoxpera;
      juntada.Cobradores.push(cobrador);
    }
  }

  $("#ul_totales_juntada").empty();

  var li_total =
    '<li class="flex items-center justify-between bg-white rounded-xl text-orange-secondary py-3 px-5">\
                                  <div class=""><b>Gastos</b> totales:</div>\
                                  <b><span class="badge">$' +
    juntada.TotalJuntada +
    "</span ></b>\
                              </li>";
  $("#ul_totales_juntada").append(li_total);

  $("#ul_totales_pagos").empty();

  var li_persona =
    '<li class="flex items-center justify-between bg-white rounded-xl text-orange-secondary py-3 px-5">\
                                      <div class=""><b>¿Cuánto x Pera?</b></div>\
                                      <b><span class="badge">$' +
    juntada.TotalxPera +
    "</span ></b>\
                                  </li>";
  $("#ul_totales_pagos").append(li_persona);

  guardarJoda();
}

function guardarJoda() {
  let _deudor;
  let _cobrador;
  let _pago;
  let montoPagar = 0;
  let i = 0;
  let j = 0;

  for (i = 0; i < juntada.Deudores.length; i++) {
    _deudor = juntada.Deudores[i];

    while (_deudor.SaldoDeudor != 0) {
      for (j = 0; j < juntada.Cobradores.length; j++) {
        _cobrador = juntada.Cobradores[j];
        if (_cobrador.SaldoCobrador != 0) {
          break;
        }
      }

      if (_deudor.SaldoDeudor >= _cobrador.SaldoCobrador) {
        montoPagar = _cobrador.SaldoCobrador;
      } else {
        montoPagar = _deudor.SaldoDeudor;
      }

      _deudor.SaldoDeudor = _deudor.SaldoDeudor - montoPagar;
      _cobrador.SaldoCobrador = _cobrador.SaldoCobrador - montoPagar;

      juntada.Deudores[i] = _deudor;
      juntada.Cobradores[j] = _cobrador;

      _pago = new Pago();

      _pago.AmigoCobrador = _cobrador;
      _pago.AmigoDeudor = _deudor;
      _pago.MontoPagar = montoPagar;
      _pago.MontoRedondeado = montoPagar;

      juntada.Pagos.push(_pago);
    }
  }

  localStorage.setItem("Juntada", JSON.stringify(juntada));

  $("#ul_personas_pagos").empty();
  $("#text_pagos_personas").empty();

  for (let p = 0; p < juntada.Pagos.length; p++) {
    let pago = juntada.Pagos[p];
    cargar_pagos_persona(pago.AmigoDeudor.Amigo.Nombre, pago.AmigoCobrador.Amigo.Nombre, pago.MontoRedondeado);
  }
}

function cargar_pagos_persona(NombreDeudor, NombreAmigoCobrador, MontoRedondeado) {
  var li_persona = '<li class="flex items-center justify-between text-white py-3 px-8 border-b">\
    <p>' + NombreDeudor + " le tiene que pagar a " + NombreAmigoCobrador + '</p>\
    <b><span class="badge">$' + MontoRedondeado + "</span ></b>\
    </li>";

  $("#ul_personas_pagos").append(li_persona);

  let titulo = "";
  if ($("#text_pagos_personas").text().trim() == "") {
    titulo = "¡Repartamos los pagos con Cuanto x Pera!\n\n";
  }

  $("#text_pagos_personas").append(titulo + NombreDeudor + " le tiene que pagar a " + NombreAmigoCobrador + " $" + MontoRedondeado + ".\n\n");
}
