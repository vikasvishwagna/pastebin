import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePaste from './pages/CreatePaste.jsx';
import ViewPaste from './pages/ViewPaste.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-red from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Pastebin Lite</h1>
      <Routes>
        <Route path="/" element={<CreatePaste />} />
        <Route path="/paste/:id" element={<ViewPaste />} />
      </Routes>
    </div>
  );
}

export default App;
