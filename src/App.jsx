import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("supply");
  const [supplies, setSupplies] = useState([]); // Start empty
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState("");

  // Alerts posts
  const [posts, setPosts] = useState([
    { id: 1, message: "Maintenance Log", comments: [] },
  ]);
  const [newComment, setNewComment] = useState("");

  // Add a new supply
  const addSupply = () => {
    if (!newItem || !newQty) return;
    const newSupply = {
      id: Date.now(),
      name: newItem,
      quantity: parseInt(newQty, 10),
    };
    setSupplies([...supplies, newSupply]);
    setNewItem("");
    setNewQty("");
  };

  // Delete a supply
  const deleteSupply = (id) => {
    setSupplies(supplies.filter((supply) => supply.id !== id));
  };

  // Add comment to an alert post
  const addComment = (postId) => {
    if (!newComment) return;
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
    setNewComment("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 pb-20">
        {activeTab === "supply" && (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">DC8149 Maintenance Log - Supply</h1>

            {/* Add Supply Form */}
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
              <button
                onClick={addSupply}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>

            {/* Inventory List */}
            {supplies.length === 0 ? (
              <p className="text-gray-500">No supplies yet.</p>
            ) : (
              <ul className="space-y-2">
                {supplies.map((supply) => (
                  <li
                    key={supply.id}
                    className="border p-2 rounded flex justify-between items-center bg-white"
                  >
                    <div>
                      <span className="font-medium">{supply.name}</span> - Qty:{" "}
                      {supply.quantity}
                    </div>
                    <button
                      onClick={() => deleteSupply(supply.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">DC8149 Maintenance Log - Alerts</h1>

            {/* Posts */}
            {posts.map((post) => (
              <div
                key={post.id}
                className="border p-3 rounded mb-4 bg-yellow-100"
              >
                <p className="font-bold">{post.message}</p>
                <div className="mt-2">
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
                    <button
                      onClick={() => addComment(post.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="flex bg-white shadow fixed bottom-0 left-0 right-0">
        <button
          className={`flex-1 p-4 text-center font-semibold ${
            activeTab === "supply" ? "border-t-4 border-blue-600" : ""
          }`}
          onClick={() => setActiveTab("supply")}
        >
          Supply
        </button>
        <button
          className={`flex-1 p-4 text-center font-semibold ${
            activeTab === "alerts" ? "border-t-4 border-blue-600" : ""
          }`}
          onClick={() => setActiveTab("alerts")}
        >
          Alerts
        </button>
      </nav>
    </div>
  );
}

export default App;