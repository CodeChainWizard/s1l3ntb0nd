import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type User = { userId: string; name: string };

const DUMMY_USERS: User[] = [
  { userId: "1", name: "Alice" },
  { userId: "2", name: "Bob" },
  { userId: "3", name: "Charlie" },
  { userId: "4", name: "David" },
  { userId: "5", name: "Eve" },
];

type SideBarProps = {
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
};

export default function SideBar({
  selectedUser,
  setSelectedUser,
}: SideBarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("Guest");
  const [search, setSearch] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
        setUsername(userData.name);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  // ✅ Show all users initially, filter dynamically when searching
  const filteredUsers = DUMMY_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  


  return (
    <div className="w-1/4 h-screen bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white">Welcome, {user ? user.name : "Guest"}!</h2>
      <div style={{ display: "none" }}>{username}</div>
      <div className="flex items-center bg-gray-700 rounded-lg p-2 mb-4">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={handleSearch}
          className="p-2 w-full bg-transparent text-white focus:outline-none"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="text-gray-400 hover:text-white"
          >
            ✖
          </button>
        )}
      </div>

      <ul className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <li
              key={u.userId}
              className={`flex items-center p-3 rounded cursor-pointer mb-2 ${
                selectedUser?.userId === u.userId
                  ? "bg-indigo-500"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedUser(u)}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-400 text-white font-bold mr-3">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white">{u.name}</span>
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
