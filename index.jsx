import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  // This is your evaluateStartup function
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
      console.log("Evaluation result:", data);
      setResult(data.evaluation);

    } catch (err) {
      console.error("Error communicating with backend:", err);
      alert("Error communicating with backend. Please try again later.");
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (file) {
      evaluateStartup(file);
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div className="App">
      <h1>AI Startup Analyst</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Evaluate Startup</button>
      <div id="result">{result}</div>
    </div>
  );
}

export default App;
