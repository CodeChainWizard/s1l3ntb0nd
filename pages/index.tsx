import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SideBar from "./sidebar";
import ConfessionForm from "../pages/components/ConfessionForm";
import { io, Socket } from "socket.io-client";

type Message = { message: string; createdAt: string; senderUUID: string; receiverUUID: string };
type User = { userId: string; name: string };

const API_URL = `http://localhost:5000`;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const uuid = localStorage.getItem("uuid") || "";

    if (storedUser && uuid) {
      let userData: User;
      try {
        userData = JSON.parse(storedUser);
      } catch {
        userData = { name: storedUser, userId: uuid };
      }
      setUser(userData);

      const newSocket = io(API_URL, { transports: ["websocket"] });

      newSocket.on("connect", () => {
        console.log("WebSocket connected");
        newSocket.emit("register", { username: userData.name, uuid: uuid });
      });

      newSocket.on("receiveMessage", (msg) => {
        console.log("Received Message:", msg);
        setMessages((prev) => [...prev, msg]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        console.log("WebSocket disconnected");
      };
    }
  }, []);

  const addMessage = (message: string) => {
    if (!socket || !user || !selectedUser) return;

    const newMessage = {
      senderUUID: user.userId,
      receiverUUID: selectedUser.userId,
      message: message,
      createdAt: new Date().toISOString(),
    };

    console.log("Sending Message:", newMessage);
    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]); // Update UI immediately
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <SideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-gray-800 p-4 flex items-center shadow-lg">
              <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages
                .filter(
                  (m) =>
                    (m.senderUUID === selectedUser.userId &&
                      m.receiverUUID === user?.userId) ||
                    (m.senderUUID === user?.userId &&
                      m.receiverUUID === selectedUser.userId)
                )
                .map((msg, index) => {
                  const isMyMessage = msg.senderUUID === user?.userId;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        isMyMessage ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-xs ${
                          isMyMessage
                            ? "bg-indigo-500 text-white text-right ml-auto"
                            : "bg-gray-700 text-left"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="p-4 bg-gray-800">
              <ConfessionForm onSubmit={addMessage} />
            </div>
          </>
        ) : (
          <h2 className="text-2xl font-semibold text-center mt-20">
            Select a user to start chatting
          </h2>
        )}
      </div>
    </div>
  );
}