import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

const API_URL = `http://${process.env.NEXT_PUBLIC_DOMAIN}:${process.env.NEXT_PUBLIC_PORT}/api/user/register`;

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      toast.error(
        `Please enter a ${!name.trim() ? "name " : ""}${
          !name.trim() && !password.trim() ? "and " : ""
        }${!password.trim() ? "password" : ""}!`,
        { position: "top-right", autoClose: 3000 }
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "name": name, "password" : password }),
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
        toast.error("❌ Login failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // ✅ Store token and user info in localStorage
        localStorage.setItem("user", name);
        localStorage.setItem("password", password);
        localStorage.setItem("token", data.token);

        toast.success("✅ Login successful!", {
          position: "top-right",
          autoClose: 2000,
        });
      }

      // 🚀 **Redirect ONLY if the token is valid**
      if (data.token) {
        router.push("/");
      } else {
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      toast.error("❌ Login failed. Please try again. " + error, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <ToastContainer />
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

        <input
          type="password"
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 mt-3 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full mt-4 p-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center"
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
