import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor live");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Rutas
app.use("/api/user", userRoutes);
