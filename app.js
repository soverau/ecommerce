const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productosRoutes = require("./app/productos");
const carritoRoutes = require("./app/carrito");

app.use("./app/productos", productosRoutes);
app.use("./app/carrito", carritoRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando puerto ${PORT}`);
});
