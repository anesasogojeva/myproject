import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const token = localStorage.getItem("accessToken");

  const fetchContacts = () => {
    axios
      .get("http://localhost:5000/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setContacts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    axios
      .delete(`http://localhost:5000/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchContacts())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-2">Contact Messages</h2>
      <p className="text-gray-600 mb-6">View and manage customer contact form submissions.</p>

      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Message</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3 truncate max-w-xs">{c.message}</td>
                <td className="p-3">{new Date(c.createdAt).toLocaleString()}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setSelectedContact(c)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MESSAGE MODAL */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h3 className="text-xl font-bold mb-4">Message Details</h3>

            <p><strong>Name:</strong> {selectedContact.name}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p className="mt-4 whitespace-pre-wrap">
              <strong>Message:</strong><br />
              {selectedContact.message}
            </p>

            <button
              onClick={() => setSelectedContact(null)}
              className="mt-6 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
