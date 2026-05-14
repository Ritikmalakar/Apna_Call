// src/pages/LandingPage.jsx

import React from "react";
import { Link } from "react-router-dom";

import "../style/Lading.css";

export default function LandingPage() {

  // check user login
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="landingPageContainer">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">

        <div className="logo">
          <h2>Nexivo</h2>
        </div>

        <div className="navItems">

          {/* Login hone ke baad hi show hoga */}
          {isLoggedIn && (
            <Link to="/home" className="navLink">
              Join as Guest
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/auth" className="navLink">
                Register
              </Link>

              <Link to="/auth">
                <button className="loginBtn">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <button
              className="loginBtn"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          )}

        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <div className="heroSection">

        {/* LEFT SIDE */}
        <div className="leftSection">

          <h1>
            <span>Connect</span>
            <br />
            with your Loved Ones
          </h1>

          <p>
            Cover a distance by video call
          </p>

          {/* Login hone ke baad hi button dikhega */}
          {isLoggedIn ? (
            <Link to="/home" className="startBtn">
              Start Meeting
            </Link>
          ) : (
            <Link to="/auth" className="startBtn">
              Get Started
            </Link>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="rightSection">

          <img
            className="img1"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
            alt="video-call-user-1"
          />

          <img
            className="img2"
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
            alt="video-call-user-2"
          />

        </div>

      </div>
    </div>
  );
}