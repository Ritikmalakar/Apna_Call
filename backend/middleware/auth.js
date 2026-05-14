import jwt from "jsonwebtoken";

const auth = (
  req,
  res,
  next
) => {

  try {

    const token =
      req.headers.authorization;

    if (!token) {

      return res.status(401)
        .send({

          message:
            "Token Missing",

        });
    }

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET
      );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(401)
      .send({

        message:
          "Invalid Token",

      });
  }
};

export default auth;