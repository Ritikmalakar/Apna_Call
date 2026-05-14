import dotenv from "dotenv";

dotenv.config();

import express from "express";

import cors from "cors";

import { createServer }
from "node:http";

import { connectDb }
from "./config/db.js";

import {
  connectToSocket
} from "./controller/socketManager.js";

import userRoutes
from "./routes/userRoutes.js";

const app = express();

const server =
  createServer(app);


// SOCKET

connectToSocket(server);


// MIDDLEWARE

app.use(cors());

app.use(
  express.json({
    limit:"40kb"
  })
);

app.use(
  express.urlencoded({
    extended:true,
    limit:"40kb"
  })
);


// PORT

const PORT =
  process.env.PORT || 1111;


// ROUTES

app.use(
  "/api",
  userRoutes
);


// TEST ROUTE

app.get("/", (req, res) => {

  res.send(
    "Server Running"
  );

});


// START SERVER

async function serverStart(){

  try{

    await connectDb();

    server.listen(PORT,()=>{

      console.log(
        `Server Running On ${PORT}`
      );

    });

  }catch(err){

    console.log(err);

  }
}

serverStart();