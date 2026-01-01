import { useState } from "react";
import Pasteform from "../components/pasteForm";
import { CreatePaste } from "../api.js";

export default function CreatePaste() {
  const [pasteUrl, setPasteUrl] = useState("");

  const handleCreate = async (payload) => {
    try {
      const res = await CreatePaste(payload);
      setPasteUrl(res.url);
    } catch (err) {
      alert(err.message || "Failed to create paste");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Pasteform onCreate={handleCreate} />

      {pasteUrl && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p>Paste created!</p>
          <a
            href={pasteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {pasteUrl}
          </a>
        </div>
      )}
    </div>
  );
}
