// src/pages/Home.jsx

import React, {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Button,
  IconButton,
  TextField,
} from "@mui/material";

import RestoreIcon from "@mui/icons-material/Restore";

import "../style/Home.css";

import { AuthContext }
  from "../context/AuthContext";

function Home() {

  const navigate =
    useNavigate();

  const [meetingCode,
    setMeetingCode] =
    useState("");

  const {
    addToHistory,
  } = useContext(AuthContext);

  const handleJoin =
    async () => {

      if (!meetingCode)
        return;

      await addToHistory(
        meetingCode
      );

      navigate(
        `/meeting/${meetingCode}`
      );
    };

  return (

    <div className="homeContainer">

      {/* NAVBAR */}

      <div className="navBar">

        <h2>Nexivo</h2>

        <div className="navRight">

          <IconButton
            onClick={() =>
              navigate("/history")
            }
          >
            <RestoreIcon />
          </IconButton>

          <Button
            variant="contained"
            color="error"
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              navigate("/auth");
            }}
          >
            Logout
          </Button>

        </div>

      </div>

      {/* MAIN */}

      <div className="meetContainer">

        <div className="leftPanel">

          <h1>
            High Quality Video Calls
          </h1>

          <p>
            Secure Meetings With
            Crystal Clear Audio &
            Video
          </p>

          <div className="joinBox">

            <TextField
              label="Meeting Code"
              variant="outlined"
              value={meetingCode}
              onChange={(e) =>
                setMeetingCode(
                  e.target.value
                )
              }
            />

            <Button
              variant="contained"
              onClick={handleJoin}
            >
              Join
            </Button>

          </div>

        </div>

        <div className="rightPanel">

          <img
            src="/ritik.jpg"
            alt=""
          />

        </div>

      </div>

    </div>
  );
}

export default Home;