import express from "express";
import * as Controllers from "./controllers/index.js";

const app = express();
app.set("view engine", "hbs");
app.use("/static", express.static("static/"));
app.use("/", express.json());

app.get("/dossier/:dossierId", Controllers.dossierPageController);
app.get("/observer", Controllers.observerPageController);

app.listen(8080);