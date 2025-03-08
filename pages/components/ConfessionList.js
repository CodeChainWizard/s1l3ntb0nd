export default function ConfessionList({ confessions = [] }) {
  return (
    <ul className="mt-4 space-y-3">
      {confessions.length > 0 ? (
        confessions.map(({ id, message }) => (
          <li key={id} className="p-3 bg-gray-100 rounded-lg shadow">
            {message}
          </li>
        ))
      ) : (
        <li className="p-3 bg-gray-100 rounded-lg shadow text-gray-500">
          No confessions found.
        </li>
      )}
    </ul>
  );
}
