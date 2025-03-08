import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

type User = { userId: string; name: string };

type SideBarProps = {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
};

const API_URL = "http://localhost:5000"; // Backend API

export default function SideBar({ selectedUser, setSelectedUser }: SideBarProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("Guest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || ""; // Get plain text
    const uuid = localStorage.getItem("uuid");
  
    if (storedUser.trim() !== "") {
      setUsername(storedUser); // Store as plain text
  
      const newSocket = io(API_URL, { transports: ["websocket"] });
  
      newSocket.on("connect", () => {
        console.log("✅ WebSocket connected");
        newSocket.emit("register", { username: storedUser, uuid: uuid });
      });
  
      newSocket.on("updateOnlineUsers", (onlineUsers) => {
        console.log("Received Online Users:", onlineUsers);
        
        // Ensure we map the data correctly
        const formattedUsers = onlineUsers.map((user: { username: string; uuid: string }) => ({
          userId: user.uuid,
          name: user.username,
        }));
      
        setUsers(formattedUsers);
      });
      
  
      setSocket(newSocket);
  
      return () => {
        newSocket.disconnect();
        console.log("WebSocket disconnected");
      };
    } else {
      console.error("User data is empty or invalid");
    }
  }, []);
  
  


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/online-users?search=${search}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="w-1/4 h-screen bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white">Welcome, {username}!</h2>

      <div className="flex items-center bg-gray-700 rounded-lg p-2 mb-4">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 w-full bg-transparent text-white focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-gray-400 hover:text-white">
            ✖
          </button>
        )}
      </div>

      <ul className="flex-1 overflow-y-auto">
  {loading ? (
    <p className="text-gray-400 text-center">Loading users...</p>
  ) : users.length > 0 ? (
    users.map((u) => (
      <li
        key={u.userId}
        className={`flex items-center p-3 rounded cursor-pointer mb-2 ${
          selectedUser?.userId === u.userId ? "bg-indigo-500" : "hover:bg-gray-700"
        }`}
        onClick={() => setSelectedUser(u)}
      >
        {/* Ensure user has a valid name */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-400 text-white font-bold mr-3">
          {u.name ? u.name.charAt(0).toUpperCase() : "?"}
        </div>
        <span className="text-white">{u.name || "Unknown"}</span> {/* ✅ Fix */}
      </li>
    ))
  ) : (
    <p className="text-gray-400 text-center">No users found</p>
  )}
</ul>



      <button
        className="w-full p-3 bg-red-600 text-white font-bold rounded-lg mt-4 hover:bg-red-700 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
