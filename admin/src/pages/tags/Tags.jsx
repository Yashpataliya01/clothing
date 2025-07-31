import React, { useState, useEffect } from "react";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://clothing-kg9h.onrender.com/api/tag/tags"
      ); // Updated to match router's GET /
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      setError("Tag name is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://clothing-kg9h.onrender.com/api/tag/tags/",
        {
          // Updated to match router's POST /create
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTagName.trim() }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create tag");
      }
      setTags([...tags, data.tag]);
      setNewTagName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTag = async (id) => {
    if (!editTagName.trim()) {
      setError("Tag name is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://clothing-kg9h.onrender.com/api/tag/tags/${id}`,
        {
          // Updated to match router's PUT /edit/:id
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editTagName.trim() }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update tag");
      }
      setTags(tags.map((tag) => (tag._id === id ? data.tag : tag)));
      setEditTagId(null);
      setEditTagName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (tag) => {
    setEditTagId(tag._id);
    setEditTagName(tag.name);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Tags</h1>

        {/* Create Tag Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create New Tag
          </h2>
          <form
            onSubmit={handleCreateTag}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tag"}
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Tags List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">All Tags</h2>
          {loading && <p className="text-sm text-gray-600">Loading tags...</p>}
          {error && !loading && <p className="text-sm text-red-600">{error}</p>}
          {!loading && tags.length === 0 && (
            <p className="text-sm text-gray-600">No tags found.</p>
          )}
          <ul className="space-y-2">
            {tags.map((tag) => (
              <li
                key={tag._id}
                className="flex items-center justify-between p-3 border-b border-gray-200"
              >
                {editTagId === tag._id ? (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTag(tag._id)}
                        className="bg-green-600 text-white py-1 px-3 rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-green-400"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditTagId(null);
                          setEditTagName("");
                        }}
                        className="bg-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm font-medium hover:bg-gray-400"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-700 capitalize">{tag.name}</span>
                    <button
                      onClick={() => startEditing(tag)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      disabled={loading}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tags;
