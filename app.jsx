import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleSubmit = () => file && evaluateStartup(file);

  async function evaluateStartup(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/evaluate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
        return;
      }

      const data = await response.json();
      setResult(data.evaluation);

    } catch (err) {
      console.error("Error communicating with backend:", err);
      alert("Error communicating with backend. Please try again later.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">AI Startup Analyst</h1>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Evaluate Startup
      </button>
      <div className="mt-4">{result}</div>
    </div>
  );
}

export default App;
