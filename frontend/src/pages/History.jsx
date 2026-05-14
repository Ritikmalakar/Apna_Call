import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";

import { AuthContext }
  from "../context/AuthContext";

import "../style/History.css";

export default function History() {

  const navigate = useNavigate();

  const {
    getUserHistory,
  } = useContext(AuthContext);

  const [meetings, setMeetings] =
    useState([]);

  useEffect(() => {

    const fetchHistory = async () => {

      const data =
        await getUserHistory();

      setMeetings(data || []);
    };

    fetchHistory();

  }, []);

  const formatDate = (dateString) => {

    const date =
      new Date(dateString);

    return date.toLocaleDateString();
  };

  return (

    <div className="historyPage">

      <div className="historyTop">

        <IconButton
          onClick={() =>
            navigate("/home")
          }
        >
          <HomeIcon />
        </IconButton>

        <h2>Meeting History</h2>

      </div>

      <div className="historyContainer">

        {
          meetings.length > 0 ?

            meetings.map((item, i) => (

              <Card
                key={i}
                className="historyCard"
              >

                <CardContent>

                  <Typography variant="h6">

                    Meeting Code:
                    {item.meetingCode}

                  </Typography>

                  <Typography>

                    Date:
                    {formatDate(item.date)}

                  </Typography>

                </CardContent>

              </Card>

            ))

            :

            <h3>No Meeting History</h3>
        }

      </div>

    </div>
  );
}