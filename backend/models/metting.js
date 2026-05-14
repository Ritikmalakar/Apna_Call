import mongoose from "mongoose";

const meetingSchema =
  new mongoose.Schema(

    {

      // ================= USER =================

      user_id: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,

      },


      // ================= MEETING CODE =================

      meetingCode: {

        type: String,

        required: true,

        trim: true,

      },

    },

    {

      // ================= AUTO TIME =================

      timestamps: true,

    }
  );


// ================= EXPORT =================

const Meeting =
  mongoose.model(
    "Meeting",
    meetingSchema
  );

export default Meeting;