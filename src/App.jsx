import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [activeTab, setActiveTab] = useState("supply");
  const [supplies, setSupplies] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState("");
  const [posts, setPosts] = useState([{ id: 1, message: "Maintenance Log", comments: [] }]);
  const [newComment, setNewComment] = useState("");

  // Load supplies from Supabase
  const loadSupplies = async () => {
    const { data, error } = await supabase
      .from("supplies")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setSupplies(data);
  };

  // Load comments from Supabase
  const loadComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) {
      // Map comments to posts
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: data.filter((c) => c.post_id === post.id).map((c) => c.text),
        }))
      );
    }
  };

  useEffect(() => {
    loadSupplies();
    loadComments();

    // Optional: Realtime subscriptions
    const suppliesSub = supabase
      .from("supplies")
      .on("*", () => loadSupplies())
      .subscribe();

    const commentsSub = supabase
      .from("comments")
      .on("*", () => loadComments())
      .subscribe();

    return () => {
      supabase.removeSubscription(suppliesSub);
      supabase.removeSubscription(commentsSub);
    };
  }, []);

  // Add supply
  const addSupply = async () => {
    if (!newItem || !newQty) return;
    await supabase.from("supplies").insert([{ name: newItem, quantity: parseInt(newQty, 10) }]);
    setNewItem("");
    setNewQty("");
  };

  // Delete supply
  const deleteSupply = async (id) => {
    await supabase.from("supplies").delete().eq("id", id);
  };

  // Add comment
  const addComment = async (postId) => {
    if (!newComment) return;
    await supabase.from("comments").insert([{ post_id: postId, text: newComment }]);
    setNewComment("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-auto p-4 pb-20">
        {activeTab === "supply" && (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">DC8149 Maintenance Log - Supply</h1>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Supply name"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <input
                type="number"
                placeholder="Qty"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                className="border p-2 rounded w-24"
              />
              <button onClick={addSupply} className="bg-blue-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {supplies.map((s) => (
                <li key={s.id} className="border p-2 rounded flex justify-between items-center bg-white">
                  <div>
                    <span className="font-medium">{s.name}</span> - Qty: {s.quantity}
                  </div>
                  <button onClick={() => deleteSupply(s.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">DC8149 Maintenance Log - Alerts</h1>
            {posts.map((post) => (
              <div key={post.id} className="border p-3 rounded mb-4 bg-yellow-100">
                <p className="font-bold">{post.message}</p>
                <ul className="space-y-1 mb-2">
                  {post.comments.map((c, i) => (
                    <li key={i} className="text-sm pl-2">
                      - {c}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border p-2 rounded flex-1"
                  />
                  <button onClick={() => addComment(post.id)} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="flex bg-white shadow fixed bottom-0 left-0 right-0">
        <button className={`flex-1 p-4 text-center font-semibold ${activeTab === "supply" ? "border-t-4 border-blue-600" : ""}`} onClick={() => setActiveTab("supply")}>
          Supply
        </button>
        <button className={`flex-1 p-4 text-center font-semibold ${activeTab === "alerts" ? "border-t-4 border-blue-600" : ""}`} onClick={() => setActiveTab("alerts")}>
          Alerts
        </button>
      </nav>
    </div>
  );
}

export default App;
