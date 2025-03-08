import { useState } from "react";
import { useRouter } from "next/router";

// const SERVER_IP = "192.168.29.180";
const API_URL = `http://localhost:5000/join`;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    const handleRegister = async () => {
      if (!name.trim()) {
        alert("Please enter a name!");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({username: name }),
        });

        const data = await res.json();
        console.log("🔍 API Response:", data);

        localStorage.setItem("user", JSON.stringify(name));
        localStorage.setItem("uuid", data.uuid);

        alert("✅ Registration successful!");
        router.push("/");
      } catch (error) {
        console.error("❌ Registration failed:", error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 via-blue-500 to-purple-500">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-6">Register</h1>

        <input
          type="text"
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="w-full mt-4 p-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin border-2 border-green-600 border-t-transparent rounded-full w-5 h-5"></span>
          ) : (
            "Register"
          )}
        </button>

        <button
          className="text-white text-sm mt-4 underline hover:text-gray-200 transition"
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
