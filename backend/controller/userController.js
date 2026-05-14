// ============================
// controller/userController.js
// ============================

import User from "../models/userModels.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import Meeting from "../models/metting.js";


// ============================
// GENERATE TOKEN
// ============================

const generateToken = (
  user
) => {

  return jwt.sign(

    {

      _id: user._id,

      email: user.email,

    },

    process.env.JWT_SECRET,

    {

      expiresIn: "7d",

    }
  );
};


// ============================
// REGISTER USER
// ============================

export async function registerUser(
  req,
  res
) {

  try {

    const {

      name,

      email,

      password,

    } = req.body;


    // ================= VALIDATION =================

    if (

      !name ||

      !email ||

      !password

    ) {

      return res.status(400)
        .send({

          success: false,

          message:
            "All fields are required",

        });
    }


    // ================= CHECK USER =================

    const existUser =
      await User.findOne({

        email,

      });

    if (existUser) {

      return res.status(409)
        .send({

          success: false,

          message:
            "User already exists",

        });
    }


    // ================= HASH PASSWORD =================

    const hashedPassword =
      await bcrypt.hash(

        password,

        12
      );


    // ================= CREATE USER =================

    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

      });


    // ================= RESPONSE =================

    res.status(201).send({

      success: true,

      message:
        "Successfully Registered",

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).send({

      success: false,

      message:
        "Server Error",

    });
  }
}


// ============================
// LOGIN USER
// ============================

export async function login(
  req,
  res
) {

  try {

    const {

      email,

      password,

    } = req.body;


    // ================= VALIDATION =================

    if (

      !email ||

      !password

    ) {

      return res.status(400)
        .send({

          success: false,

          message:
            "Email or Password Missing",

        });
    }


    // ================= FIND USER =================

    const user =
      await User.findOne({

        email,

      });

    if (!user) {

      return res.status(404)
        .send({

          success: false,

          message:
            "User Not Found",

        });
    }


    // ================= PASSWORD CHECK =================

    const isMatch =
      await bcrypt.compare(

        password,

        user.password
      );

    if (!isMatch) {

      return res.status(401)
        .send({

          success: false,

          message:
            "Invalid Credentials",

        });
    }


    // ================= TOKEN =================

    const token =
      generateToken(user);


    // ================= SAVE TOKEN =================

    user.token = token;

    await user.save();


    // ================= RESPONSE =================

    res.status(200).send({

      success: true,

      message:
        "Login Successfully",

      token,

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).send({

      success: false,

      message:
        "Server Error",

    });
  }
}


// ============================
// GET USER HISTORY
// ============================

export async function getUserHistory(
  req,
  res
) {

  try {

    // ================= USER ID =================

    const userId =
      req.user._id;


    // ================= GET MEETINGS =================

    const meetings =
      await Meeting.find({

        user_id: userId,

      })

        .sort({

          createdAt: -1,

        });


    // ================= RESPONSE =================

    res.status(200).send({

      success: true,

      message:
        "History Fetched Successfully",

      meetings,

    });

  } catch (err) {

    console.log(err);

    res.status(500).send({

      success: false,

      message:
        "Unable To Fetch History",

    });
  }
}


// ============================
// ADD TO HISTORY
// ============================

export async function addToHistory(
  req,
  res
) {

  try {

    const {

      meeting_code,

    } = req.body;


    // ================= VALIDATION =================

    if (!meeting_code) {

      return res.status(400)
        .send({

          success: false,

          message:
            "Meeting Code Missing",

        });
    }


    // ================= USER ID =================

    const userId =
      req.user._id;


    // ================= SAVE MEETING =================

    const meeting =
      await Meeting.create({

        user_id: userId,

        meetingCode:
          meeting_code,

      });


    // ================= RESPONSE =================

    res.status(201).send({

      success: true,

      message:
        "Meeting Added To History",

      meeting,

    });

  } catch (err) {

    console.log(err);

    res.status(500).send({

      success: false,

      message:
        "Unable To Save Meeting",

    });
  }
}