// =========================================
// src/context/AuthContext.jsx
// =========================================

import {
  createContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import servrs from "../environment";

import {
  useNavigate,
} from "react-router-dom";

export const AuthContext =
  createContext();

const client = axios.create({

  // IMPORTANT FIX
  baseURL: `${servrs}/api`,
});

export const AuthProvider = ({
  children,
}) => {

  const navigate =
    useNavigate();

  // =========================================
  // STATES
  // =========================================

  const [userData,
    setUserData] =
    useState(null);

  const [message,
    setMessage] =
    useState("");

  const [error,
    setError] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  // =========================================
  // CHECK LOGIN
  // =========================================

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    const user =
      localStorage.getItem(
        "user"
      );

    if (
      token &&
      user &&
      user !== "undefined"
    ) {

      try {

        setUserData(
          JSON.parse(user)
        );

      } catch (err) {

        console.log(
          "User Parse Error:",
          err
        );

        localStorage.removeItem(
          "user"
        );
      }
    }

  }, []);

  // =========================================
  // REGISTER
  // =========================================

  const handleRegister =
    async (
      name,
      email,
      password
    ) => {

      try {

        setLoading(true);

        setError("");
        setMessage("");

        const response =
          await client.post(
            "/register",
            {
              name,
              email,
              password,
            }
          );

        setMessage(
          response.data.message
        );

        navigate("/auth");

      } catch (err) {

        console.log(err);

        setError(

          err.response?.data
            ?.message ||

          "Register Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin =
    async (
      email,
      password
    ) => {

      try {

        setLoading(true);

        setError("");
        setMessage("");

        const response =
          await client.post(
            "/login",
            {
              email,
              password,
            }
          );

        // SAVE TOKEN

        localStorage.setItem(
          "token",
          response.data.token
        );

        // SAVE USER

        localStorage.setItem(
          "user",

          JSON.stringify(
            response.data.user
          )
        );

        setUserData(
          response.data.user
        );

        navigate("/home");

      } catch (err) {

        console.log(err);

        setError(

          err.response?.data
            ?.message ||

          "Login Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      setUserData(null);

      navigate("/auth");
    };

  // =========================================
  // GET HISTORY
  // =========================================

  const getUserHistory =
    async () => {

      try {

        const response =
          await client.get(

            "/get_all_activity",

            {
              headers: {

                Authorization:
                  localStorage.getItem(
                    "token"
                  ),
              },
            }
          );

        return response.data;

      } catch (err) {

        console.log(err);
      }
    };

  // =========================================
  // ADD HISTORY
  // =========================================

  const addToHistory =
    async (
      meetingCode
    ) => {

      try {

        const response =
          await client.post(

            "/add_to_activity",

            {
              meeting_code:
                meetingCode,
            },

            {
              headers: {

                Authorization:
                  localStorage.getItem(
                    "token"
                  ),
              },
            }
          );

        return response.data;

      } catch (err) {

        console.log(err);
      }
    };

  // =========================================
  // CONTEXT VALUE
  // =========================================

  const value = {

    userData,

    message,
    error,
    loading,

    handleRegister,
    handleLogin,
    handleLogout,

    getUserHistory,
    addToHistory,
  };

  // =========================================
  // PROVIDER
  // =========================================

  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>
  );
};