import express from "express";
import bodyParser from "body-parser";
import config from "../../../src/config/config.js";
import connectionDB from "./database/database.js";

const app = express();

connectionDB();

app.use(bodyParser.json());

app.listen(config.port, ()=>{
    console.log(`Server is running at port ${config.port}.....`);
});