import { useState } from "react";
import Pasteform from "../components/pasteForm";
import { createPaste } from "../api"; 

export default function CreatePaste() {
  const [pasteUrl, setPasteUrl] = useState("");

  const handleCreate = async (payload) => {
    const res = await createPaste(payload);
    setPasteUrl(res.url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Pasteform onCreate={handleCreate} />

      {pasteUrl && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p>Paste created!</p>
          <a href={pasteUrl} className="text-blue-600 underline">
            {pasteUrl}
          </a>
        </div>
      )}
    </div>
  );
}
