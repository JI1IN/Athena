import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GitHubTool from './components/GitHubTool';
import About from './components/About';
import Sidebar from './components/UI/Sidebar';

function App() {
  return (
      <Router>
        <div className="flex min-h-screen bg-base-200">
          <Sidebar />
          <main className="flex-1 p-6 pt-16 overflow-auto">
            <Routes>
              <Route path="/" element={<GitHubTool />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <footer className="text-center mt-10 p-4 text-xs text-gray-400">
              Jason Chen. All rights reserved.
            </footer>
          </main>
        </div>
      </Router>
  );
}

export default App;
