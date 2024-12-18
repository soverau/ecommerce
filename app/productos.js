const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express.app();

// Ruta leer los productos
app.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const productos = await fs.readJson(
      path.join(__dirname, "../productos.json")
    );

    // En caso de limitar
    const result = limit ? productos.slice(0, limit) : productos;

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Ruta obtener producto por id
app.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productos = await fs.readJson(
      path.join(__dirname, "../productos.json")
    );
    const product = productos.find((p) => p.id === pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Ruta crear nuevo producto
app.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({
        error: "Todos los campos salvo thumbnails son obligatorios",
      });
    }

    const productos = await fs.readJson(
      path.join(__dirname, "../productos.json")
    );
    const newProduct = {
      id: Date.now().toString(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    productos.push(newProduct);
    await fs.writeJson(path.join(__dirname, "../productos.json"), productos);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// Ruta para actualizar un producto
app.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    const productos = await fs.readJson(
      path.join(__dirname, "../productos.json")
    );
    const productIndex = productos.findIndex((p) => p.id === pid);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedProduct = {
      ...productos[productIndex],
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
    productos[productIndex] = updatedProduct;

    await fs.writeJson(path.join(__dirname, "../productos.json"), productos);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Ruta eliminar un producto
app.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    let productos = await fs.readJson(
      path.join(__dirname, "../productos.json")
    );
    productos = productos.filter((p) => p.id !== pid);

    await fs.writeJson(path.join(__dirname, "../productos.json"), productos);

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = app;
