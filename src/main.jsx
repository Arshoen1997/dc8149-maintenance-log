import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const API = "http://localhost:3000";

function App() {
  const [comments, setComments] = useState([]);
  const [parts, setParts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [partName, setPartName] = useState("");

  // --- Load data ---
  useEffect(() => {
    loadComments();
    loadParts();
  }, []);

  const loadComments = async () => {
    const res = await fetch(`${API}/comments`);
    const data = await res.json();
    setComments(data);
  };

  const loadParts = async () => {
    const res = await fetch(`${API}/parts`);
    const data = await res.json();
    setParts(data);
  };

  // --- Handlers ---
  const addComment = async () => {
    if (!commentText) return;
    await fetch(`${API}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: commentText }),
    });
    setCommentText("");
    loadComments();
  };

  const deleteComment = async (id) => {
    await fetch(`${API}/comments/${id}`, { method: "DELETE" });
    loadComments();
  };

  const addPart = async () => {
    if (!partName) return;
    await fetch(`${API}/parts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: partName }),
    });
    setPartName("");
    loadParts();
  };

  const deletePart = async (id) => {
    await fetch(`${API}/parts/${id}`, { method: "DELETE" });
    loadParts();
  };

  return (
    <div className="app">
      <h1>Parts & Comments App</h1>

      <div className="section">
        <h2>Comments</h2>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="New comment"
        />
        <button onClick={addComment}>Add Comment</button>
        <ul>
          {comments.map((c) => (
            <li key={c.id}>
              {c.text}{" "}
              <button onClick={() => deleteComment(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h2>Parts</h2>
        <input
          type="text"
          value={partName}
          onChange={(e) => setPartName(e.target.value)}
          placeholder="New part"
        />
        <button onClick={addPart}>Add Part</button>
        <ul>
          {parts.map((p) => (
            <li key={p.id}>
              {p.name}{" "}
              <button onClick={() => deletePart(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
