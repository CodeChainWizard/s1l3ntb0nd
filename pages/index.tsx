import { useState, useEffect } from "react";
import ConfessionList from "../pages/components/ConfessionList";
import ConfessionForm from "../pages/components/ConfessionForm";

export default function Home() {
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    fetch("/api/confessions")
      .then((res) => res.json())
      .then((data) => setConfessions(data));
  }, []);

  const addConfession = async (message) => {
    const res = await fetch("/api/confessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const newConfession = await res.json();
    setConfessions([newConfession, ...confessions]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ConfessionForm onSubmit={addConfession} />
      <ConfessionList confessions={confessions} />
    </div>
  );
}
