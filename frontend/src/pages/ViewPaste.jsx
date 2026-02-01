import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ViewPaste() {
  const { id } = useParams(); // get paste ID from URL
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        // Call backend API to fetch paste
        const res = await axios.get(`${API_BASE_URL}/api/pastes/${id}`);

        // Backend returns { content, remaining_views, expires_at }
        console.log("viewpasteJSX: ", res.data);

        setPaste(res.data);
      } catch (err) {
        if (err.response && err.response.data) {
          // Handle expired, max views exceeded, or not found
          setError(err.response?.data?.error || "Failed to fetch paste");
        } else {
          setError("Failed to fetch paste");
        }
        console.error(err);
      }
    };

    fetchPaste();
  }, [id]);

  // Show error if any
  if (error) {
    return (
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md text-center">
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
      </div>
    );
  }

  // Show loading while fetching
  if (!paste) {
    return (
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md text-center">
        Loading paste...
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Paste</h2>

      <div className="border border-gray-300 p-4 rounded mb-4 whitespace-pre-wrap">
        {paste.content}
      </div>

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
