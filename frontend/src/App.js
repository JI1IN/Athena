import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import GitHubTool from './components/GitHubTool';
import About from './components/About';
import Sidebar from './components/UI/Sidebar';
import PageWrapper from "./components/utils/PageWrapper";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageWrapper><GitHubTool /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-base-200">
        <Sidebar />
        <main className="flex-1 p-6 pt-16 overflow-auto">
          <AnimatedRoutes />
          <footer className="text-center mt-10 p-4 text-xs text-gray-400">
            Jason Chen. All rights reserved.
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;
