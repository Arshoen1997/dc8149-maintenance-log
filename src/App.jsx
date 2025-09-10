import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";

function App() {
  const [comments, setComments] = useState([]);
  const [parts, setParts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [partName, setPartName] = useState("");
  const [activeTab, setActiveTab] = useState("parts");
  const [commentError, setCommentError] = useState("");
  const [partError, setPartError] = useState("");

  useEffect(() => {
    loadComments();
    loadParts();
  }, []);

  const loadComments = async () => {
    const { data, error } = await supabase.from("comments").select("*");
    if (error) console.error("Load comments error:", error);
    else setComments(data);
    console.log("Comments loaded:", data);
  };

  const loadParts = async () => {
    const { data, error } = await supabase.from("parts").select("*");
    if (error) console.error("Load parts error:", error);
    else setParts(data);
    console.log("Parts loaded:", data);
  };

  const addComment = async () => {
    setCommentError("");
    if (!commentText) {
      setCommentError("Comment cannot be empty.");
      return;
    }
    const { data, error } = await supabase.from("comments").insert([{ text: commentText }]).select();
    if (error) {
      setCommentError("Failed to add comment: " + error.message);
      console.error("Add comment error:", error);
    } else {
      setCommentText("");
      loadComments();
    }
  };

  const deleteComment = async (id) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) console.error("Delete comment error:", error);
    else {
      console.log("Comment deleted:", id);
      loadComments();
    }
  };

  const addPart = async () => {
    setPartError("");
    if (!partName) {
      setPartError("Part name cannot be empty.");
      return;
    }
    const { data, error } = await supabase.from("parts").insert([{ name: partName }]).select();
    if (error) {
      setPartError("Failed to add part: " + error.message);
      console.error("Add part error:", error);
    } else {
      setPartName("");
      loadParts();
    }
  };

  const deletePart = async (id) => {
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) {
      console.error("Delete part error:", error);
    } else {
      console.log("Part deleted:", id);
      loadParts();
    }
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
          {partError && <div style={{ color: 'red', marginTop: 8 }}>{partError}</div>}
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
          {commentError && <div style={{ color: 'red', marginTop: 8 }}>{commentError}</div>}
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

export default App;
