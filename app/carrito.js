const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express.app();

// Ruta crear carrito
app.post("/", async (req, res) => {
  try {
    const carrito = { id: Date.now().toString(), productos: [] };
    const carritos = await fs.readJson(path.join(__dirname, "../carrito.json"));
    carritos.push(carrito);

    await fs.writeJson(path.join(__dirname, "../carrito.json"), carritos);
    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Ruta obtener productos de carrito
app.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const carritos = await fs.readJson(path.join(__dirname, "../carrito.json"));
    const carrito = carritos.find((c) => c.id === cid);

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json(carrito.productos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los productos del carrito" });
  }
});

// Ruta agregar producto a carrito
app.post("/:cid/producto/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const carritos = await fs.readJson(path.join(__dirname, "../carrito.json"));
    const carrito = carritos.find((c) => c.id === cid);

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const existingProduct = carrito.productos.find((p) => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      carrito.productos.push({ product: pid, quantity });
    }

    await fs.writeJson(path.join(__dirname, "../carrito.json"), carritos);
    res.status(200).json(carrito.productos);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

module.exports = app;
