import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePaste from './pages/CreatePaste.jsx';
import ViewPaste from './pages/ViewPaste.jsx';

function App() {
  return (

 <div className="min-h-screen flex flex-col bg-gray-50">

  {/* Header */}
  <header className="w-full bg-gray-800 text-white flex justify-between items-center px-6 py-3 shadow">
  <div className="text-2xl font-bold flex items-center gap-1">
    <span className="text-white">Paste</span>
    <span className="text-green-400">Bin</span>
  </div>

   

  <div className="flex gap-3">
    {/* Subtle Sign In / Sign Up buttons */}
    <button className="px-3 py-1 border border-gray-400 text-gray-200 rounded hover:bg-gray-700 transition">
      Login
    </button>
    <button className="px-3 py-1 border border-gray-400 text-gray-200 rounded hover:bg-gray-700 transition">
      Sign Up
    </button>
  </div>
</header>

  {/* Main Content */}
  <main className="flex-1 flex flex-col items-center justify-start p-6">
  <div className="max-w-2xl text-center mb-6">
    <h2 className="text-xl font-semibold mb-2 text-gray-800">
      Dump it here
    </h2>
  </div>

  {/* Routes */}
  <Routes>
    <Route path="/" element={<CreatePaste />} />
    <Route path="/p/:id" element={<ViewPaste />} />
 
  </Routes>
</main>


  {/* Footer */}
  <footer className="w-full bg-gray-800 text-gray-200 p-8 mt-6">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* About */}
      <div>
        <h3 className="font-bold mb-2 text-white">PasteBin</h3>
        <p className="text-sm">PasteBin is a lightweight platform to securely share text temporarily. Simple, fast, and safe.</p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="font-semibold mb-2 text-white">Quick Links</h4>
        <ul className="space-y-1 text-sm">
          <li>Home</li>
          <li>Create Paste</li>
          <li>Settings</li>
          <li>Cookie Policy</li>
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h4 className="font-semibold mb-2 text-white">Contact</h4>
        <ul className="space-y-1 text-sm">
          <li>Email: support@pasteBin.com</li>
          <li>Phone: +91 12345 67890</li>
          <li>Address: 123 Library Street, City</li>
        </ul>
      </div>

    </div>
  </footer>
</div>



  );
}

export default App;




{/* <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-red from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Pastebin Lite</h1>
      <Routes>
        <Route path="/" element={<CreatePaste />} />
        <Route path="/paste/:id" element={<ViewPaste />} />
      </Routes>
    </div> */}