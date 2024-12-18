const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = require("./app/productos");
const cartManager = require("./app/carrito");

app.use("./app/productos", productManager);
app.use("./app/carrito", cartManager);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando puerto ${PORT}`);
});
