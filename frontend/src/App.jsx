import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import VideoMeet from "./pages/VideoMeet";
import History from "./pages/History";

import {
  AuthProvider,
} from "./context/AuthContext";

function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/auth"
            element={<Authentication />}
          />

          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/meeting/:meetingCode"
            element={<VideoMeet />}
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;