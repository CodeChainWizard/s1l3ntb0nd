export default function ConfessionList({ confessions }) {
  return (
    <ul className="mt-4 space-y-3">
      {confessions.map(({ id, message }) => (
        <li key={id} className="p-3 bg-gray-100 rounded-lg shadow">
          {message}
        </li>
      ))}
    </ul>
  );
}
