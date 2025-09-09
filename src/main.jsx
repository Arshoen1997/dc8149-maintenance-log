import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import { supabase } from "./supabaseClient"; // <-- import Supabase client

function App() {
  const [comments, setComments] = useState([]);
  const [parts, setParts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [partName, setPartName] = useState("");
  const [activeTab, setActiveTab] = useState("parts");

  useEffect(() => {
    fetchComments();
    fetchParts();
  }, []);

  // --- Parts ---
  const fetchParts = async () => {
    const { data, error } = await supabase.from("parts").select("*").order("id");
    if (error) console.error(error);
    else setParts(data);
  };

  const addPart = async () => {
    if (!partName) return;
    const { error } = await supabase.from("parts").insert([{ name: partName }]);
    if (error) console.error(error);
    else {
      setPartName("");
      fetchParts();
    }
  };

  const deletePart = async (id) => {
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) console.error(error);
    else fetchParts();
  };

  // --- Comments ---
  const fetchComments = async () => {
    const { data, error } = await supabase.from("comments").select("*").order("id");
    if (error) console.error(error);
    else setComments(data);
  };

  const addComment = async () => {
    if (!commentText) return;
    const { error } = await supabase.from("comments").insert([{ text: commentText }]);
    if (error) console.error(error);
    else {
      setCommentText("");
      fetchComments();
    }
  };

  const deleteComment = async (id) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) console.error(error);
    else fetchComments();
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

