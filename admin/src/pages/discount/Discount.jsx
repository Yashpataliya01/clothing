import React, { useEffect, useState } from "react";

const API_URL = "https://clothing-kg9h.onrender.com/api/discounts";

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({ price: "", discountPercent: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all discounts
  const fetchDiscounts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setDiscounts(data.data);
    } catch (err) {
      console.error("Error fetching discounts:", err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setForm({ price: "", discountPercent: "" });
      setEditingId(null);
      fetchDiscounts();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  // Edit discount
  const handleEdit = (discount) => {
    setForm({
      price: discount.price,
      discountPercent: discount.discountPercent,
    });
    setEditingId(discount._id);
  };

  // Delete discount
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?"))
      return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchDiscounts();
    } catch (err) {
      console.error("Error deleting discount:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Admin Discount Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-4 space-y-4 mb-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            name="discountPercent"
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Discount" : "Add Discount"}
        </button>
      </form>

      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Discount %</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No discounts available
                </td>
              </tr>
            ) : (
              discounts.map((discount) => (
                <tr key={discount._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{discount.price}</td>
                  <td className="p-3">{discount.discountPercent}%</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(discount._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDiscounts;
