import { useState } from "react";
import { useRouter } from "next/router";

const SERVER_IP = "192.168.29.180";
const API_URL = `http://localhost:4000/api/user/login`;

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!name.trim()) {
      alert("Please enter a name!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      console.log("RES DATA: ", res);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format (not JSON)");
      }

      const data = await res.json();
      console.log("🔍 API Response:", data);

      // ❌ Check for login failure & return early
      if (!res.ok || !data.status || !data.token || !data.user) {
        router.push("/login");
        alert("Login Failed, Try Again!");
      } else {
        // ✅ Store token and user info in localStorage
        localStorage.setItem("user", JSON.stringify(name));
        localStorage.setItem("token", data.token);

        alert("Login successful!");
      }

      // 🚀 **Redirect ONLY if the token is valid**
      if (data.token) {
        router.push("/");
      } else {
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-6">
          Login as Anonymous
        </h1>

        <input
          type="text"
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="w-full mt-4 p-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin border-2 border-indigo-600 border-t-transparent rounded-full w-5 h-5"></span>
          ) : (
            "Login"
          )}
        </button>
        <button
          className="text-white text-sm mt-4 underline hover:text-gray-200 transition"
          onClick={() => router.push("/register")}
        >
          Register your self.
        </button>
        <br />

        <button
          className="text-white text-sm mt-4 underline hover:text-gray-200 transition"
          onClick={() => router.push("/")}
        >
          Login Anonymous?
        </button>
      </div>
    </div>
  );
}
