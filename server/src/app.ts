import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor live");
});

// Rutas
app.use("/api/user", userRoutes);

export default app;
