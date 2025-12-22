import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotesPanel({ token }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const dietitian = JSON.parse(localStorage.getItem("user"));
  const dietitianId = dietitian?.id;

  const loadClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const clientsOnly = res.data.filter(
        (user) => user.role?.toLowerCase() === "user"
      );
      setClients(clientsOnly);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  };

  const loadNotes = async (clientId) => {
    if (!clientId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notes/${clientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) loadNotes(selectedClient.id);
  }, [selectedClient]);

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        {
          clientId: selectedClient.id,
          dietitianId,
          content: newNote,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote("");
      loadNotes(selectedClient.id);
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const updateNote = async (noteId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${noteId}`,
        { content: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingNoteId(null);
      setEditingText("");
      loadNotes(selectedClient.id);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadNotes(selectedClient.id);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  // Filtered client list
  const filteredClients = clients.filter((c) =>
    (c.name || c.email).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full gap-6">

      {/* LEFT SIDE — CLIENT LIST */}
      <div className="w-1/3 bg-white border rounded-xl shadow p-4 flex flex-col overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Clients</h2>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
        />

        {/* CLIENT LIST */}
        <div className="overflow-y-auto">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
                selectedClient?.id === client.id
                  ? "bg-green-100 border border-green-400"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <p className="font-medium">{client.name || client.email}</p>
            </div>
          ))}

          {filteredClients.length === 0 && (
            <p className="text-gray-400 text-sm mt-4">No clients found.</p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE — NOTES PANEL */}
      <div className="w-2/3 bg-white border rounded-xl shadow p-5 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          {selectedClient ? `Notes for ${selectedClient.name}` : "Select a client"}
        </h2>

        {selectedClient && (
          <div className="mb-4">
            <textarea
              className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="Write a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button
              onClick={addNote}
              className="mt-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Add Note
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3">
          {selectedClient && notes.length === 0 && (
            <p className="text-gray-500">No notes yet.</p>
          )}

          {notes.map((note) => (
            <div key={note.id} className="bg-gray-50 border rounded-lg p-4">
              {editingNoteId === note.id ? (
                <>
                  <textarea
                    className="w-full border rounded-lg p-2 h-24"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => updateNote(note.id)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingNoteId(null);
                        setEditingText("");
                      }}
                      className="px-4 py-1 bg-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800">{note.content}</p>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => {
                        setEditingNoteId(note.id);
                        setEditingText(note.content);
                      }}
                      className="text-blue-500 font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
