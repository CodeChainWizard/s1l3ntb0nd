import { useState } from "react";

export default function ConfessionForm({ onSubmit }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="w-full p-3 border rounded-lg"
        placeholder="Write your confession..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Submit Confession
      </button>
    </form>
  );
}
