import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ConfessionList from "../pages/components/ConfessionList";
import ConfessionForm from "../pages/components/ConfessionForm";
import SideBar from "./sidebar";
import { io, Socket } from "socket.io-client";

type Message = { message: string; createdAt: string; userId: string };
type User = { userId: string; name: string };

const DUMMY_USERS: User[] = [
  { userId: "1", name: "Alice" },
  { userId: "2", name: "Bob" },
  { userId: "3", name: "Charlie" },
];

const DUMMY_MESSAGES: Message[] = [
  {
    userId: "1",
    message: "Hey! How's it going?",
    createdAt: "2025-03-07T12:00:00Z",
  },
  {
    userId: "2",
    message: "Hello! What's up?",
    createdAt: "2025-03-07T12:10:00Z",
  },
  { userId: "3", message: "Good morning!", createdAt: "2025-03-07T12:20:00Z" },
  {
    userId: "1",
    message: "Long time no see!",
    createdAt: "2025-03-07T12:30:00Z",
  },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uuid, setUuuid] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null); 

  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_URL = `http://localhost:5000`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const uuid = localStorage.getItem("uuid");
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
  
        const newSocket = io(API_URL, { transports: ["websocket"] });
  
        newSocket.on("connect", () => {
          console.log("WebSocket connected");
          newSocket.emit("register", { username: userData.name, uuid: uuid });
        });
  

        newSocket.on("updateOnlineUsers", (onlineUsers) => {
          console.log("Received Online Users:", onlineUsers);
          setUser(onlineUsers.filter((user: User) => user.name));
        });
  
        // Save socket instance
        setSocket(newSocket);
  
  
        return () => {
          newSocket.disconnect();
          console.log("WebSocket disconnected");
        };
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  const fetchMessages = async () => {
    if (!user || !uuid) return;
  
    try {
      const res = await fetch(`${API_URL}/messages/${uuid}`);
  
      if (!res.ok) {
        throw new Error(`Failed to fetch messages: ${res.statusText}`);
      }
  
      const messages: Message[] = await res.json();
      setMessages(messages.slice(-50)); // Store only the latest 50 messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  const addMessage = async (message: string) => {
    
    if (!user || !uuid) return;
  
    const newMessage: Message = {
      message,
      createdAt: new Date().toISOString(),
      userId: uuid,
    };
  
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
  
      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.statusText}`);
      }
  
      const savedMessage: Message = await res.json();
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <SideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <div className="flex-1 flex flex-col">
        {/* ✅ Greeting Section */}
        {!loading && user && (
          <div className="bg-gray-800 p-4 text-center shadow-lg">
            <p className="text-sm text-gray-400">Start chatting with someone</p>
          </div>
        )}

        {selectedUser ? (
          <>
            <div className="bg-gray-800 p-4 flex items-center shadow-lg">
              <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages
                .filter(
                  (m) =>
                    m.userId === selectedUser?.userId ||
                    m.userId === user?.userId
                )
                .map((msg, index) => {
                  const isMyMessage = msg.userId === user?.userId;
                  const sender = isMyMessage
                    ? user
                    : DUMMY_USERS.find((u) => u.userId === msg.userId);

                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        isMyMessage ? "items-end" : "items-start"
                      }`}
                    >
                    
                      <span className="text-xs text-gray-400 mb-1">
                        {sender?.name}
                      </span>


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
