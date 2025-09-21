import React, { useState } from "react";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please choose a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/evaluate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
      setResult("Error communicating with backend.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">AI Startup Analyst</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" onChange={handleFileChange} />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Evaluate Startup
        </button>
      </form>
      {result && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm">{result}</pre>
      )}
    </div>
  );
}

export default UploadForm;
