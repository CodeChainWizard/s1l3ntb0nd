import React, { useEffect, useState } from "react";

type User = { userId: string; name: string };

const DUMMY_USERS: User[] = [
  { userId: "1", name: "Alice" },
  { userId: "2", name: "Bob" },
  { userId: "3", name: "Charlie" },
];

type SideBarProps = {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
};

export default function SideBar({
  selectedUser,
  setSelectedUser,
}: SideBarProps) {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [userGet, setUserGet] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUserGet(storedUser || "");
  }, []);

  return (
    <div className="w-1/4 bg-gray-900 p-5 border-r border-gray-700 min-h-screen">
      {/* Sidebar Header */}
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">Chat Users</h2>

      {/* User Greeting */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-sm text-gray-400">Welcome,</p>
        <h3 className="text-lg font-semibold text-white">
          {userGet || "Guest"}
        </h3>
      </div>

      {/* User List */}
      <ul>
        {users.map((u) => (
          <li
            key={u.userId}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out 
              ${
                selectedUser?.userId === u.userId
                  ? "bg-indigo-500 shadow-md scale-105"
                  : "hover:bg-gray-700 hover:shadow-md"
              }`}
            onClick={() => setSelectedUser(u)}
          >
            {/* User Avatar */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full font-bold mr-3 text-lg shadow-md transition-all duration-300 
                ${
                  selectedUser?.userId === u.userId
                    ? "bg-indigo-700 text-white"
                    : "bg-indigo-400 text-gray-900"
                }`}
            >
              {u.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-white text-lg">{u.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
