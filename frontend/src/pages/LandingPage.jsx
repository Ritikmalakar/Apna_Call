// src/pages/LandingPage.jsx

import React from "react";

import {
  Link,
} from "react-router-dom";

import "../style/Lading.css";

export default function LandingPage() {

  return (

    <div className="landingPageContainer">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <h2>Nexivo</h2>
        </div>

        <div className="navItems">

          <Link
            to="/home"
            className="navLink"
          >
            Join as Guest
          </Link>

          <Link
            to="/auth"
            className="navLink"
          >
            Register
          </Link>

          <Link to="/auth">

            <button className="loginBtn">
              Login
            </button>

          </Link>

        </div>

      </nav>

      {/* HERO */}

      <div className="heroSection">

        <div className="leftSection">

          <h1>

            <span>Connect</span>

            <br />

            with your Loved Ones

          </h1>

          <p>
            Cover a distance by video call
          </p>

          <Link
            to="/auth"
            className="startBtn"
          >
            Get Started
          </Link>

        </div>

        <div className="rightSection">

          <img
            className="img1"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
            alt=""
          />

          <img
            className="img2"
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
            alt=""
          />

        </div>

      </div>

    </div>
  );
}