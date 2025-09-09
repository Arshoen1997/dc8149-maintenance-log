import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const API = "http://localhost:3000";

function App() {
  const [comments, setComments] = useState([]);
  const [parts, setParts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [partName, setPartName] = useState("");
  const [activeTab, setActiveTab] = useState("parts");

  useEffect(() => {
    loadComments();
    loadParts();
  }, []);

  const loadComments = async () => {
    const res = await fetch(`${API}/comments`);
    setComments(await res.json());
  };

  const loadParts = async () => {
    const res = await fetch(`${API}/parts`);
    setParts(await res.json());
  };

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
      <header>
        <h1>DC8149 Facilities</h1>
        <div className="tabs">
          <button
            className={activeTab === "parts" ? "active" : ""}
            onClick={() => setActiveTab("parts")}
          >
            Parts Check-Out
          </button>
          <button
            className={activeTab === "maintenance" ? "active" : ""}
            onClick={() => setActiveTab("maintenance")}
          >
            Maintenance Work Log
          </button>
        </div>
        <p className="note">
          Please use this Web Based App to check out parts and log all repairs. Thanks Team! - Arshoen Scott
        </p>
      </header>

      {activeTab === "parts" && (
        <div className="section">
          <h2>Parts Check-Out</h2>
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
                <button className="delete-btn" onClick={() => deletePart(p.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="section">
          <h2>Maintenance Work Log</h2>
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
                <button className="delete-btn" onClick={() => deleteComment(c.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
