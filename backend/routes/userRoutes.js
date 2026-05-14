import express from "express";

import {

  addToHistory,

  getUserHistory,

  login,

  registerUser,

} from "../controller/userController.js";

import auth from "../middleware/auth.js";

const router =
  express.Router();


// ============================
// AUTH ROUTES
// ============================

// REGISTER

router.post(
  "/register",
  registerUser
);


// LOGIN

router.post(
  "/login",
  login
);


// ============================
// HISTORY ROUTES
// ============================

// ADD HISTORY

router.post(

  "/add_to_activity",

  auth,

  addToHistory
);


// GET HISTORY

router.get(

  "/get_all_activity",

  auth,

  getUserHistory
);


// ============================
// EXPORT
// ============================

export default router;