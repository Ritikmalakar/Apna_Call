// =========================================
// src/pages/VideoMeet.jsx
// FULLY FIXED FINAL VERSION
// =========================================

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import io from "socket.io-client";

import {
  Badge,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import VideocamIcon
from "@mui/icons-material/Videocam";

import VideocamOffIcon
from "@mui/icons-material/VideocamOff";

import CallEndIcon
from "@mui/icons-material/CallEnd";

import MicIcon
from "@mui/icons-material/Mic";

import MicOffIcon
from "@mui/icons-material/MicOff";

import ScreenShareIcon
from "@mui/icons-material/ScreenShare";

import StopScreenShareIcon
from "@mui/icons-material/StopScreenShare";

import ChatIcon
from "@mui/icons-material/Chat";

import "../style/VideoMeet.css";
import servrs from "../environment";

// =========================================
// SERVER
// =========================================

const server_url =
servrs;

// =========================================
// RTC CONFIG
// =========================================

const peerConfigConnections = {

  iceServers: [

    {
      urls:
        "stun:stun.l.google.com:19302",
    },

  ],

};

// =========================================
// CONNECTIONS
// =========================================

let connections = {};

// =========================================
// COMPONENT
// =========================================

export default function VideoMeet() {

  const socketRef =
    useRef();

  const socketIdRef =
    useRef();

  const localVideoref =
    useRef();

  // =========================================
  // STATES
  // =========================================

  const [video,
    setVideo] =
    useState(true);

  const [audio,
    setAudio] =
    useState(true);

  const [screen,
    setScreen] =
    useState(false);

  const [screenAvailable,
    setScreenAvailable] =
    useState(false);

  const [messages,
    setMessages] =
    useState([]);

  const [message,
    setMessage] =
    useState("");

  const [newMessages,
    setNewMessages] =
    useState(0);

  const [showModal,
    setModal] =
    useState(false);

  const [askForUsername,
    setAskForUsername] =
    useState(true);

  const [username,
    setUsername] =
    useState("");

  const [videos,
    setVideos] =
    useState([]);

  // =========================================
  // START
  // =========================================

  useEffect(() => {

    getPermissions();

  }, []);

  // =========================================
  // GET MEDIA
  // =========================================

  const getPermissions =
    async () => {

      try {

        const stream =
          await navigator
            .mediaDevices
            .getUserMedia({

              video: true,
              audio: true,

            });

        window.localStream =
          stream;

        if (
          localVideoref.current
        ) {

          localVideoref.current
            .srcObject =
            stream;
        }

        if (
          navigator.mediaDevices
            .getDisplayMedia
        ) {

          setScreenAvailable(
            true
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  // =========================================
  // SOCKET
  // =========================================

  const connectToSocketServer =
    () => {

      socketRef.current =
        io(server_url, {

          transports: [
            "websocket",
          ],

        });

      socketRef.current.on(
        "signal",
        gotMessageFromServer
      );

      socketRef.current.on(
        "chat-message",
        addMessage
      );

      socketRef.current.on(
        "connect",
        () => {

          socketIdRef.current =
            socketRef.current.id;

          socketRef.current.emit(
            "join-call",
            window.location.pathname
          );
        }
      );

      socketRef.current.on(
        "user-left",
        (id) => {

          setVideos(
            (videos) =>
              videos.filter(
                (
                  video
                ) =>
                  video.socketId !==
                  id
              )
          );

          delete connections[id];
        }
      );

      socketRef.current.on(
        "user-joined",

        (
          id,
          clients
        ) => {

          clients.forEach(
            (
              socketListId
            ) => {

              // SKIP SELF

              if (
                socketListId ===
                socketIdRef.current
              ) {
                return;
              }

              // SKIP DUPLICATE

              if (
                connections[
                  socketListId
                ]
              ) {
                return;
              }

              // CREATE CONNECTION

              const connection =
                new RTCPeerConnection(
                  peerConfigConnections
                );

              connections[
                socketListId
              ] = connection;

              // =====================================
              // ICE
              // =====================================

              connection.onicecandidate =
                (
                  event
                ) => {

                  if (
                    event.candidate
                  ) {

                    socketRef.current.emit(
                      "signal",

                      socketListId,

                      JSON.stringify(
                        {
                          ice:
                            event.candidate,
                        }
                      )
                    );
                  }
                };

              // =====================================
              // REMOTE TRACK
              // =====================================

              connection.ontrack =
                (
                  event
                ) => {

                  const remoteStream =
                    event.streams[0];

                  setVideos(
                    (
                      prev
                    ) => {

                      const found =
                        prev.find(
                          (
                            v
                          ) =>
                            v.socketId ===
                            socketListId
                        );

                      if (found) {
                        return prev;
                      }

                      return [

                        ...prev,

                        {
                          socketId:
                            socketListId,

                          stream:
                            remoteStream,
                        },

                      ];
                    }
                  );
                };

              // =====================================
              // ADD LOCAL TRACKS
              // =====================================

              if (
                window.localStream
              ) {

                window.localStream
                  .getTracks()
                  .forEach(
                    (
                      track
                    ) => {

                      connection.addTrack(
                        track,
                        window.localStream
                      );
                    }
                  );
              }

              // =====================================
              // CREATE OFFER
              // =====================================

              if (
                id ===
                socketIdRef.current
              ) {

                connection
                  .createOffer()

                  .then(
                    (
                      description
                    ) => {

                      connection
                        .setLocalDescription(
                          description
                        )

                        .then(
                          () => {

                            socketRef.current.emit(
                              "signal",

                              socketListId,

                              JSON.stringify(
                                {
                                  sdp:
                                    connection.localDescription,
                                }
                              )
                            );
                          }
                        );
                    }
                  );
              }
            }
          );
        }
      );
    };

  // =========================================
  // SIGNAL
  // =========================================

 const gotMessageFromServer =
  async (
    fromId,
    message
  ) => {

    let signal;

    try {

      signal =
        typeof message ===
        "string"
          ? JSON.parse(message)
          : message;

    } catch (err) {

      console.log(
        "Invalid Signal:",
        message
      );

      return;
    }

    if (
      fromId !==
      socketIdRef.current
    ) {

      const connection =
        connections[fromId];

      if (!connection) {
        return;
      }

      // SDP

      if (signal.sdp) {

        await connection
          .setRemoteDescription(
            new RTCSessionDescription(
              signal.sdp
            )
          );

        if (
          signal.sdp.type ===
          "offer"
        ) {

          const description =
            await connection
              .createAnswer();

          await connection
            .setLocalDescription(
              description
            );

          socketRef.current.emit(
            "signal",

            fromId,

            JSON.stringify({
              sdp:
                connection.localDescription,
            })
          );
        }
      }

      // ICE

      if (signal.ice) {

        try {

          await connection
            .addIceCandidate(
              new RTCIceCandidate(
                signal.ice
              )
            );

        } catch (e) {

          console.log(e);
        }
      }
    }
  };
  // =========================================
  // CHAT
  // =========================================

  const addMessage =
    (data) => {

      setMessages(
        (prev) => [

          ...prev,

          {
            sender:
              data.sender,

            data:
              data.message,
          },

        ]
      );

      if (
        data.socketId !==
        socketIdRef.current
      ) {

        setNewMessages(
          (prev) =>
            prev + 1
        );
      }
    };

  const sendMessage =
    () => {

      if (
        !message.trim()
      ) {
        return;
      }

      const data = {

        message,

        sender:
          username,

        socketId:
          socketIdRef.current,

        room:
          window.location.pathname,

      };

      socketRef.current.emit(
        "chat-message",
        data
      );

      setMessage("");
    };

  // =========================================
  // VIDEO
  // =========================================

  const handleVideo =
    () => {

      const enabled =
        !video;

      setVideo(enabled);

      window.localStream
        .getVideoTracks()
        .forEach(
          (track) => {

            track.enabled =
              enabled;
          }
        );
    };

  // =========================================
  // AUDIO
  // =========================================

  const handleAudio =
    () => {

      const enabled =
        !audio;

      setAudio(enabled);

      window.localStream
        .getAudioTracks()
        .forEach(
          (track) => {

            track.enabled =
              enabled;
          }
        );
    };

  // =========================================
  // SCREEN SHARE
  // =========================================

  const handleScreen =
    async () => {

      if (!screen) {

        const stream =
          await navigator
            .mediaDevices
            .getDisplayMedia({

              video: true,

            });

        const screenTrack =
          stream
            .getVideoTracks()[0];

        for (
          let id in connections
        ) {

          const sender =
            connections[id]
              .getSenders()
              .find(
                (s) =>
                  s.track.kind ===
                  "video"
              );

          if (sender) {

            sender.replaceTrack(
              screenTrack
            );
          }
        }

        screenTrack.onended =
          () => {

            handleScreen();
          };

        setScreen(true);

      } else {

        const videoTrack =
          window.localStream
            .getVideoTracks()[0];

        for (
          let id in connections
        ) {

          const sender =
            connections[id]
              .getSenders()
              .find(
                (s) =>
                  s.track.kind ===
                  "video"
              );

          if (sender) {

            sender.replaceTrack(
              videoTrack
            );
          }
        }

        setScreen(false);
      }
    };

  // =========================================
  // END CALL
  // =========================================

  const handleEndCall =
    () => {

      try {

        localVideoref.current
          .srcObject
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

      } catch (e) {}

      window.location.href =
        "/";
    };

  // =========================================
  // CONNECT
  // =========================================

  const connect =
    () => {

      if (!username.trim()) {
        return;
      }

      setAskForUsername(
        false
      );

      connectToSocketServer();
    };

  // =========================================
  // UI
  // =========================================

  return (

    <div>

      {askForUsername ? (

        <div className="lobby-container">

          <h2>
            Join Meeting
          </h2>

          <TextField
            label="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <Button
            variant="contained"
            onClick={connect}
          >
            Connect
          </Button>

          <video
            ref={localVideoref}
            autoPlay
            muted
            playsInline
            className="preview-video"
          />

        </div>

      ) : (

        <div className="meet-container">

          {/* CHAT */}

          {showModal && (

            <div className="chat-container">

              <div className="chat-box">

                <h2>Chat</h2>

                {messages.length ? (

                  messages.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className="chat-message"
                      >

                        <b>
                          {
                            item.sender
                          }
                        </b>

                        <p>
                          {
                            item.data
                          }
                        </p>

                      </div>
                    )
                  )

                ) : (

                  <p>
                    No Messages
                  </p>
                )}

              </div>

              <div className="chat-input">

                <TextField
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  label="Message"
                />

                <Button
                  variant="contained"
                  onClick={sendMessage}
                >
                  Send
                </Button>

              </div>

            </div>

          )}

          {/* CONTROLS */}

          <div className="button-group">

            <IconButton
              onClick={
                handleVideo
              }
              style={{
                color:
                  "white",
              }}
            >

              {video ? (
                <VideocamIcon />
              ) : (
                <VideocamOffIcon />
              )}

            </IconButton>

            <IconButton
              onClick={
                handleAudio
              }
              style={{
                color:
                  "white",
              }}
            >

              {audio ? (
                <MicIcon />
              ) : (
                <MicOffIcon />
              )}

            </IconButton>

            {screenAvailable && (

              <IconButton
                onClick={
                  handleScreen
                }
                style={{
                  color:
                    "white",
                }}
              >

                {screen ? (
                  <StopScreenShareIcon />
                ) : (
                  <ScreenShareIcon />
                )}

              </IconButton>

            )}

            <Badge
              badgeContent={
                newMessages
              }
              color="error"
            >

              <IconButton
                onClick={() => {

                  setModal(
                    !showModal
                  );

                  setNewMessages(
                    0
                  );
                }}
                style={{
                  color:
                    "white",
                }}
              >

                <ChatIcon />

              </IconButton>

            </Badge>

            <IconButton
              onClick={
                handleEndCall
              }
              style={{
                color:
                  "red",
              }}
            >

              <CallEndIcon />

            </IconButton>

          </div>

          {/* LOCAL VIDEO */}

          <video
            className="local-video"
            ref={localVideoref}
            autoPlay
            muted
            playsInline
          />

          {/* REMOTE VIDEOS */}

          <div className="video-grid">

            {videos.map((video) => {

              return (

                <video
                  key={
                    video.socketId
                  }

                  className="video-player"

                  autoPlay
                  playsInline

                  ref={(ref) => {

                    if (
                      ref &&
                      video.stream
                    ) {

                      ref.srcObject =
                        video.stream;

                      ref.onloadedmetadata =
                        async () => {

                          try {

                            await ref.play();

                          } catch (err) {

                            console.log(err);
                          }
                        };
                    }
                  }}
                />
              );
            })}

          </div>

        </div>

      )}

    </div>
  );
}