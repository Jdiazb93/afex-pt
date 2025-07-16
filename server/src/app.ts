import express from "express";
import cors from "cors";
import userRoutes from "./routes/item.routes";

const app = express();

app.use(cors());
app.use(express.json());

// CORS Config
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.get("/", (req, res) => {
  res.send("Servidor live");
});

// Rutas
app.use("/api/item", userRoutes);

export default app;
