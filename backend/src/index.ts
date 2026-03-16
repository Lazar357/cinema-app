import express from "express";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource } from "./db";
import { ClientRoute } from "./routes/client.route";
import { ArticleRoute } from "./routes/article.route";
import { InvoiceRoute } from "./routes/invoice.route";
import { ModelRoute } from "./routes/model.route";
import { VehicleRoute } from "./routes/vehicle.route";
import { configDotenv } from "dotenv";
import { UserService } from "./services/user.service";
import { UserRoute } from "./routes/user.route";

const app = express();
configDotenv();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("short"));

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database");
    const port = Number(process.env.SERVER_PORT) ?? 4800;
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch((e) => console.log(e));

app.use(UserService.validateToken);
app.use("/api/client", ClientRoute);
app.use("/api/article", ArticleRoute);
app.use("/api/invoice", InvoiceRoute);
app.use("/api/model", ModelRoute);
app.use("/api/vehicle", VehicleRoute);
app.use("/api/user", UserRoute);
