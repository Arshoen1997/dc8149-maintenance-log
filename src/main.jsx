import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { supabase } from "./supabaseClient";
import "./style.css";

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

  // Load comments from Supabase
  const loadComments = async () => {
    let { data, error } = await supabase.from("comments").select("*");
    if (!error) setComments(data);
  };

  // Load parts from Supabase
  const loadParts = async () => {
    let { data, error } = await supabase.from("parts").select("*");
    if (!error) setParts(data);
  };

  // Add comment
  const addComment = async () => {
    if (!commentText) return;
    await supabase.from("comments").insert([{ text: commentText }]);
    setCommentText("");
    loadComments();
  };

  // Delete comment
  const deleteComment = async (id) => {
    await supabase.from("comments").delete().eq("id", id);
    loadComments();
  };

  // Add part
  const addPart = async () => {
    if (!partName) return;
    await supabase.from("parts").insert([{ name: partName }]);
    setPartName("");
    loadParts();
  };

  // Delete part
  const deletePart = async (id) => {
    await supabase.from("parts").delete().eq("id", id);
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
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

