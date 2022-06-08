/*jshint esversion: 6 */
//importar modulos
const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const path = require("path");
//Creamos un objeto de Router Express
const router = express.Router();

//Alertas
// 0 = okay
// 1 = Campo vacio
// 2 = menor que cero
// 3 = pesos insuficientes
// 4 = Dolares insuficientes
// 5 = Dinero insuficiente por parte del cliente
// 6 = Éxito
// 7 = Tipo de cambio

var Error = 0;
// Varaible para identificar el cambio del usuario dentro de los alerts
var cambiomalo = 0;

//variables del saldo inicial y el saldo actual
var dolaresInicio = 1000;
var pesosInicio = 20000;
var dolares = dolaresInicio;
var pesos = pesosInicio;

//Valores iniciales de la seccion compra
var compraDolares = 0;
var cambioCompra = 0;

//Valores iniciales de la seccion venta
var ventaDolares = 0;
var pagoDolares = 0;
var cambioVenta = 0;
var regreso = 0;

//Valores iniciales de la seccion corte caja
var cortePesosInicio = 0;
var cortePesosFinal = 0;
var cortePesosGanancia = 0;
var corteDolaresInicio = 0;
var corteDolaresFinal = 0;
var corteDolaresGanancia = 0;

//valores iniciales de la seccion Tipo de cambio
var tipoCambioCompra = 20;
var tipoCambioVenta = 20;

//post de compra
router.post("/", (req, res) => {
  console.log(req.body.compraDolares);
  compraDolares = req.body.compraDolares;
  cambioCompra = 0;
  cambiomalo = 0;

  // Atrapamos los errores
  if (compraDolares == "") {
    Error = 1;
  } else if (compraDolares <= 0) {
    Error = 2;
  } else {
    cambioCompra = parseInt(compraDolares) * parseInt(tipoCambioCompra);
    if (cambioCompra > pesos) {
      Error = 3;
      cambiomalo = cambioCompra;
      cambioCompra = 0;
    } else {
      dolares = parseInt(dolares) + parseInt(compraDolares);
      pesos = parseInt(pesos) - parseInt(cambioCompra);
      Error = 6;
    }
  }
  res.render("pages/Compra", {
    cambiomalo,
    Error,
    compraDolares,
    cambioCompra,
    dolares,
    pesos,
    tipoCambioCompra,
  });
});

//post de ventas
router.post("/venta", (req, res) => {
  ventaDolares = req.body.ventaDolares;
  pagoDolares = req.body.pagoDolares;
  cambioVenta = 0;
  regreso = 0;
  cambiomalo = 0

    // Atrapamos los errores
  if (ventaDolares == "" || pagoDolares == "") {
    Error = 1;
  } else if (ventaDolares <= 0 || pagoDolares <= 0) {
    Error = 2;
  } else if (ventaDolares > dolares) {
    Error = 4;
  } else {
    cambioVenta = parseInt(ventaDolares) * parseInt(tipoCambioVenta);
    if (cambioVenta > pagoDolares) {
      Error = 5;
      cambiomalo = cambioVenta;
      cambioVenta = 0;
    } else {
      dolares = parseInt(dolares) - parseInt(ventaDolares);
      pesos = parseInt(pesos) + parseInt(cambioVenta);
      regreso = parseInt(pagoDolares) - parseInt(cambioVenta);
      Error = 6;
    }
  }
  res.render("pages/venta", {
    cambiomalo,
    Error,
    ventaDolares,
    pagoDolares,
    dolares,
    pesos,
    cambioVenta,
    regreso,
    tipoCambioVenta,
  });
});

//post de tipo de cambio
router.post("/TipoCambio", (req, res) => {
  tipoCambioCompra = req.body.tipoCambioCompra;
  tipoCambioVenta = req.body.tipoCambioVenta;
  if (tipoCambioCompra > tipoCambioVenta) {
    Error = 7
    console.log("compra mayor que venta", tipoCambioCompra, tipoCambioVenta);
  }else{
    Error = 6
    console.log("venta mayor que compra", tipoCambioVenta);
  }

  res.render("pages/TipoCambio", {
    Error,
    tipoCambioCompra,
    tipoCambioVenta,
  });
});

//Exportar nuestro modulo ROUTES
module.exports = router;

//Pestaña de compra
router.get("/", (req, res) => {
  res.render("pages/Compra", {
    cambiomalo,
    Error: 0,
    compraDolares,
    cambioCompra: 0,
    dolares,
    pesos,
    tipoCambioCompra,
  });
})

//Pestaña de venta
router.get("/venta", (req, res) => {
  res.render("pages/venta", {
    cambiomalo,
    Error: 0,
    ventaDolares,
    pagoDolares,
    dolares,
    pesos,
    cambioVenta,
    regreso,
    tipoCambioVenta,
  }); 
});

//Pestaña de corte caja
router.get("/corteCaja", (req, res) => {
  // Diferencia entre valores iniciales y valores finales para pesos
  cortePesosInicio = parseInt(pesosInicio);
  cortePesosFinal = parseInt(pesos);
  cortePesosGanancia = parseInt(cortePesosFinal) - parseInt(cortePesosInicio);
  // Diferencia entre valores iniciales y valores finales para dolares
  corteDolaresInicio = parseInt(dolaresInicio);
  corteDolaresFinal = parseInt(dolares);
  corteDolaresGanancia =
    parseInt(corteDolaresFinal) - parseInt(corteDolaresInicio);
  res.render("pages/corteCaja", {
    cortePesosInicio,
    cortePesosFinal,
    cortePesosGanancia,
    corteDolaresInicio,
    corteDolaresFinal,
    corteDolaresGanancia,
  });
});

//Pestaña de tipo de cambio
router.get("/TipoCambio", (req, res) => {
  res.render("pages/TipoCambio", {
    Error:0,
    tipoCambioCompra,
    tipoCambioVenta,
  });
});

