import express, { json } from "express";
const app = express();
import apiRoutes from "./routes/api";

app.use(json());
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
