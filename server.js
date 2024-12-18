const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productosRoutes = require("./router/productos");
const carritoRoutes = require("./router/carrito");

app.use("./router/productos", productosRoutes);
app.use("./router/carrito", carritoRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando puerto ${PORT}`);
});
