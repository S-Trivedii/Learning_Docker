import express from "express";

const app = express();

const PORT = 8001;

app.get("/products", (req, res) => {
  return res.json([
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
