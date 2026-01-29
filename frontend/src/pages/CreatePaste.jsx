import React, { useState } from 'react';
import axios from 'axios';

function CreatePaste() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [views, setViews] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setPasteUrl('');

//     if (!content) {
//       setError('Content is required');
//       return;
//     }

//     try {
//   const res = await axios.post('http://localhost:3000/api/paste', {
//     content,
//     ttl_seconds: ttl ? parseInt(ttl) : undefined,
//     max_views: views ? parseInt(views) : undefined,
//   });

//   // Backend now returns { id, url }
//   if (res.data.id) {
//    setPasteUrl(`http://localhost:5173/paste/${res.data.id}`);
//   }
// } catch (err) {
//   console.error("Axios error:", err.response?.data || err.message);
//   setError(err.response?.data?.message || 'Failed to create paste');
// }

//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setPasteUrl('');

  if (!content) {
    setError('Content is required');
    return;
  }

  try {
    const res = await axios.post('http://localhost:3000/api/pastes', {
      content,
      ttl_seconds: ttl ? parseInt(ttl) : undefined,
      max_views: views ? parseInt(views) : undefined,
    });

    // Backend returns { id, url }
    if (res.data.id) {
      // Use React route instead of backend HTML route
      setPasteUrl(`/paste/${res.data.id}`);
    }
  } catch (err) {
    console.error("Axios error:", err.response?.data || err.message);
    setError(err.response?.data?.message || 'Failed to create paste');
  }
};




  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="border border-gray-300 p-2 rounded resize-none h-32"
          placeholder="Enter your paste here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-4">
          <input
            type="number"
            min="1"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="TTL (seconds, optional)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
          <input
            type="number"
            min="1"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Max Views (optional)"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition"
        >
          Create Paste
        </button>
      </form>

      {pasteUrl && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded break-all">
          Your paste URL: <a href={pasteUrl} className="underline">{pasteUrl}</a>
        </div>
      )}
    </div>
  );
}

export default CreatePaste;
