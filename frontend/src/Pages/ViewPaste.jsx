import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewPaste() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    
    if (id === "abc123") {
      setContent("This is a mock paste content.");
    } else {
      setError("Paste not found");
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <pre className="whitespace-pre-wrap">{content}</pre>
        )}
      </div>
    </div>
  );
}
