import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket Server:", newSocket.id);
    });

    newSocket.on("message", (msg) => {
      console.log("📩 Received Message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!socket) {
      console.error("No WebSocket connection!");
      return;
    }

    if (!input.trim()) {
      console.warn("Cannot send an empty message!");
      return;
    }

    console.log("Sending Message:", input);
    socket.emit("message", input);
    setInput(""); // Clear input field
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">WebSocket Chat</h1>
      <div className="border p-2 h-40 overflow-y-auto bg-gray-100">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index} className="p-1">
              {msg}
            </p>
          ))
        ) : (
          <p className="text-gray-500">No messages yet...</p>
        )}
      </div>
      <input
        className="border p-1 mt-2"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="ml-2 bg-blue-500 text-white px-2 py-1"
        onClick={sendMessage}
        disabled={!socket}
      >
        Send
      </button>
    </div>
  );
}
