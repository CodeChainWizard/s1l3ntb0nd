import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_URL = `http://${process.env.NEXT_PUBLIC_DOMAIN}:${process.env.NEXT_PUBLIC_PORT}/api/user/register`;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [C_password, setC_Password] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !password.trim()) {
      toast.error(
        `Please enter a ${!name.trim() ? "name " : ""}${
          !name.trim() && !password.trim() ? "and " : ""
        }${!password.trim() ? "password" : ""}!`,
        { position: "top-right", autoClose: 3000 }
      );
      return;
    }
    if (C_password.trim() != password.trim()) {
      toast.error(`Please add both password same`, {
        position: "top-left",
        autoClose: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, password: password }),
      });

      const data = await res.json();
      console.log("🔍 API Response:", data);

      localStorage.setItem("user", name);
      localStorage.setItem("password", password);
      localStorage.setItem("token", data.token);
      
      toast.success("✅ Registration successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error("❌ Registration failed:", error);
      toast.error("❌ Registration failed. Please try again.", {
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
        <h1 className="text-3xl font-bold text-white mb-6">Register</h1>

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

        <input
          type="password"
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 mt-3 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Conform Password"
          value={C_password}
          onChange={(e) => setC_Password(e.target.value)}
        />

        <button
          className="w-full mt-7 p-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center"
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
