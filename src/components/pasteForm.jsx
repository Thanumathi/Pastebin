import { useState } from "react";

export default function Pasteform({ onCreate }) {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
 
  const handleSubmit = () => {
    const payload = {
      content,
      ttl_seconds: ttl ? Number(ttl) : undefined,
      max_views: maxViews ? Number(maxViews) : undefined,
    };
    onCreate(payload);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Paste</h2>

      <textarea
        className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="6"
        placeholder="Enter your text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label className="block mb-2">
        TTL (seconds):
        <input
          type="number"
          className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        Max Views:
        <input
          type="number"
          className="w-full border border-gray-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />
      </label>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Create Paste
      </button>
    </div>
  );
}
