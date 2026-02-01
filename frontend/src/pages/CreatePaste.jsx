import React, { useState } from "react";
import axios from "axios";

function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [frontendUrl, setFrontendUrl] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasteUrl("");

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/pastes`, {
        content,
        ttl_seconds: ttl ? parseInt(ttl) : undefined,
        max_views: views ? parseInt(views) : undefined,
      });

      console.log("CreatePasteJSX: ", res);

      if (res.data.id) {
        setPasteUrl(`${API_BASE_URL}/p/${res.data.id}`);
        // Optional: show frontend URL
        setFrontendUrl(`/p/${res.data.id}`);
      }
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to create paste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="border border-gray-300 p-2 rounded resize-none h-32"
          placeholder="Enter your paste here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />

        <div className="flex gap-4">
          <input
            type="number"
            min="1"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="TTL (seconds, optional)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            disabled={loading}
          />
          <input
            type="number"
            min="1"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Max Views (optional)"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-400 hover:bg-green-500"
          }`}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {loading && (
        <p className="text-sm text-gray-500 mt-3">
          Please wait, creating paste…
        </p>
      )}

      {pasteUrl && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded break-all">
          Grader URL:{" "}
          <a href={pasteUrl} className="underline" target="_blank">
            {pasteUrl}
          </a>
        </div>
      )}

      {frontendUrl && (
        <div className="mt-2 p-2 bg-blue-100 text-blue-700 rounded break-all">
          Frontend URL:{" "}
          <a href={frontendUrl} className="underline">
            {frontendUrl}
          </a>
        </div>
      )}


    </div>
  );
}

export default CreatePaste;
