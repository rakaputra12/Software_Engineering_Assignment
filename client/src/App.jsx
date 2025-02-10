import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import StartPage from "./components/StartPage";
import EventListPage from "./components/EventListPage";
import "./App.css";

const App = () => {


  return (
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/list" element={<EventListPage />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
