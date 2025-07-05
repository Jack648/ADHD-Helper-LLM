import { useState } from "react";

function App() {
  const [mood, setMood] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const getSuggestion = async () => {
    setLoading(true);
    setSuggestion("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/suggest?mood=${encodeURIComponent(mood)}`);
      const data = await res.json();
      setSuggestion(data.suggestion || data.error);
    } catch (err) {
      setSuggestion("Error connecting to API");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">ADHD Helper</h1>
      <input
        type="text"
        placeholder="How are you feeling?"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={getSuggestion}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Get Suggestion"}
      </button>

      {suggestion && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">
          <strong>Suggestion:</strong>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default App;
