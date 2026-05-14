// =========================================
// backend/controller/socketManager.js
// FULLY FIXED SOCKET MANAGER
// =========================================

import { Server } from "socket.io";

// =========================================
// STORAGE
// =========================================

let connections = {};

let messages = {};

let timeOnline = {};

// =========================================
// CONNECT SOCKET
// =========================================

export const connectToSocket = (
  server
) => {

  const io = new Server(server, {

    cors: {

      origin: "*",

      methods: [
        "GET",
        "POST",
      ],

      allowedHeaders: ["*"],

      credentials: true,
    },

  });

  // =========================================
  // CONNECTION
  // =========================================

  io.on(
    "connection",
    (socket) => {

      console.log(
        "USER CONNECTED :",
        socket.id
      );

      // =====================================
      // JOIN CALL
      // =====================================

      socket.on(
        "join-call",
        (roomId) => {

          // JOIN ROOM

          socket.join(roomId);

          // CREATE ROOM

          if (
            connections[
              roomId
            ] === undefined
          ) {

            connections[
              roomId
            ] = [];
          }

          // ADD USER

          connections[
            roomId
          ].push(socket.id);

          // SAVE TIME

          timeOnline[
            socket.id
          ] = new Date();

          // SEND USERS

          connections[
            roomId
          ].forEach((id) => {

            io.to(id).emit(

              "user-joined",

              socket.id,

              connections[
                roomId
              ]
            );
          });

          // SEND OLD MESSAGES

          if (
            messages[
              roomId
            ] !== undefined
          ) {

            messages[
              roomId
            ].forEach((msg) => {

              io.to(socket.id).emit(
                "chat-message",
                msg
              );
            });
          }

          console.log(
            "ROOMS :",
            connections
          );
        }
      );

      // =====================================
      // SIGNAL
      // =====================================

      socket.on(

        "signal",

        (
          toId,
          message
        ) => {

          io.to(toId).emit(

            "signal",

            socket.id,

            message
          );
        }
      );

      // =====================================
      // CHAT
      // =====================================

      socket.on(

        "chat-message",

        (data) => {

          const roomId =
            data.room;

          // CREATE ROOM CHAT

          if (
            messages[
              roomId
            ] === undefined
          ) {

            messages[
              roomId
            ] = [];
          }

          // SAVE MESSAGE

          messages[
            roomId
          ].push(data);

          // SEND MESSAGE

          io.to(roomId).emit(
            "chat-message",
            data
          );

          console.log(
            "MESSAGE :",
            data
          );
        }
      );

      // =====================================
      // DISCONNECT
      // =====================================

      socket.on(
        "disconnect",
        () => {

          console.log(
            "USER LEFT :",
            socket.id
          );

          // REMOVE USER

          for (
            const roomId
            in connections
          ) {

            connections[
              roomId
            ] = connections[
              roomId
            ].filter(
              (id) =>
                id !== socket.id
            );

            // SEND LEFT EVENT

            connections[
              roomId
            ].forEach((id) => {

              io.to(id).emit(
                "user-left",
                socket.id
              );
            });

            // DELETE EMPTY ROOM

            if (
              connections[
                roomId
              ].length === 0
            ) {

              delete connections[
                roomId
              ];
            }
          }

          // REMOVE TIME

          delete timeOnline[
            socket.id
          ];
        }
      );
    }
  );

  return io;
};