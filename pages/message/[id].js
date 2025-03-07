import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SecretMessage() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/messages?id=${id}`)
        .then((res) => res.json())
        .then((data) => setMessage(data.message || "Message expired"));
    }
  }, [id]);

  return (
    <div className="max-w-lg mx-auto mt-20 p-4 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold">Secret Message</h1>
      <p className="mt-3 text-gray-800">{message}</p>
    </div>
  );
}
