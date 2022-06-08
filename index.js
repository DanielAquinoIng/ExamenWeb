//Require modules
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 8080;

//Motor de Vistas EJS
app.set('view engine', 'ejs');
app.use(ejsLayouts);

//uso del bodyparser
app.use(express.urlencoded({ extended:true}));

//Cargar Modulo de ROUTES
const  router = require('./routes/routes');
app.use('/', router);

//Recursos publicos
app.use(express.static('public'))

app.listen(port, () =>{
     console.log("Servidor activo en puerto 8080");
});