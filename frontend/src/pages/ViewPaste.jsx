import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        setLoading(true);
        setError("");

        // Call the API
        const res = await axios.get(`${API_BASE_URL}/api/pastes/${id}`);
        setPaste(res.data);
      } catch (err) {
        console.error("Error fetching paste:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to fetch paste");
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md text-center">
        Loading paste…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md text-center">
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
      </div>
    );
  }

  // Escape content safely
  const contentEscaped = paste.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Paste</h2>

      <pre className="border border-gray-300 p-4 rounded mb-4 whitespace-pre-wrap">
        {contentEscaped}
      </pre>

      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Remaining Views:{" "}
          {paste.remaining_views !== null ? paste.remaining_views : "Unlimited"}
        </span>
        {paste.expires_at && (
          <span>Expires At: {new Date(paste.expires_at).toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}

export default ViewPaste;
