import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Send, Pencil, Trash2, Users, StickyNote } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import EmptyState from "../../components/UI/EmptyState";
import { PageSpinner } from "../../components/UI/Spinner";
import PaginationBar from "../../components/UI/PaginationBar";
import usePagination from "../../hooks/usePagination";
import { API_URL } from "../../config";

export default function NotesPanel({ token: tokenProp }) {
  const toast = useToast();
  const token = tokenProp || localStorage.getItem("accessToken");
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const dietitian = JSON.parse(localStorage.getItem("user"));
  const dietitianId = dietitian?.id;

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data.filter((user) => user.role?.toLowerCase() === "user"));
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadNotes = async (clientId) => {
    if (!clientId) return;
    try {
      const res = await axios.get(`${API_URL}/api/notes/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClient) loadNotes(selectedClient.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/notes`,
        { clientId: selectedClient.id, dietitianId, content: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote("");
      loadNotes(selectedClient.id);
    } catch (err) {
      toast.error("Failed to add note.");
    }
  };

  const updateNote = async (noteId) => {
    try {
      await axios.put(
        `${API_URL}/api/notes/${noteId}`,
        { content: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingNoteId(null);
      setEditingText("");
      loadNotes(selectedClient.id);
      toast.success("Note updated");
    } catch (err) {
      toast.error("Failed to update note.");
    }
  };

  const deleteNote = async () => {
    try {
      await axios.delete(`${API_URL}/api/notes/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadNotes(selectedClient.id);
      toast.success("Note deleted");
    } catch (err) {
      toast.error("Failed to delete note.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredClients = clients.filter((c) =>
    (c.name || c.email).toLowerCase().includes(search.toLowerCase())
  );

  const {
    page: clientPage,
    setPage: setClientPage,
    totalPages: clientTotalPages,
    pageItems: pagedClients,
    itemsPerPage: clientItemsPerPage,
    setItemsPerPage: setClientItemsPerPage,
    totalItems: clientTotalItems,
  } = usePagination(filteredClients, 10);

  const filteredNotes = notes.filter((n) =>
    n.content.toLowerCase().includes(noteSearch.toLowerCase())
  );

  const {
    page: notePage,
    setPage: setNotePage,
    totalPages: noteTotalPages,
    pageItems: pagedNotes,
    itemsPerPage: noteItemsPerPage,
    setItemsPerPage: setNoteItemsPerPage,
    totalItems: noteTotalItems,
  } = usePagination(filteredNotes, 10);

  if (loadingClients) return <PageSpinner label="Loading clients..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">Clients &amp; Notes</h1>
        <p className="text-stone-500 mt-1.5">Keep track of your clients' progress and nutrition notes.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <Card padding="p-4" className="lg:col-span-1">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field-input pl-10"
            />
          </div>

          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto scroll-thin">
            {pagedClients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full text-left p-3 rounded-xl transition ${
                  selectedClient?.id === client.id
                    ? "bg-emerald-50 border border-emerald-200"
                    : "hover:bg-stone-50 border border-transparent"
                }`}
              >
                <p className="font-medium text-stone-800 text-sm truncate">{client.name || client.email}</p>
              </button>
            ))}

            {filteredClients.length === 0 && (
              <EmptyState icon={Users} title="No clients found" description="Try a different search term." />
            )}
          </div>

          <PaginationBar
            page={clientPage}
            totalPages={clientTotalPages}
            setPage={setClientPage}
            itemsPerPage={clientItemsPerPage}
            setItemsPerPage={setClientItemsPerPage}
            totalItems={clientTotalItems}
            size="sm"
            layout="stack"
            className="mt-4"
          />
        </Card>

        <Card className="lg:col-span-2 flex flex-col min-h-[60vh]">
          {!selectedClient ? (
            <EmptyState
              icon={StickyNote}
              title="Select a client"
              description="Choose a client from the list to view and add nutrition notes."
              className="flex-1"
            />
          ) : (
            <>
              <h2 className="text-lg font-display font-bold text-stone-900 mb-4">
                Notes for {selectedClient.name || selectedClient.email}
              </h2>

              <div className="flex gap-2 mb-4">
                <textarea
                  className="field-input flex-1 resize-none"
                  placeholder="Write a note..."
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={addNote} icon={Send} className="self-end">
                  Add
                </Button>
              </div>

              {notes.length > 5 && (
                <div className="relative mb-4">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    placeholder="Search notes..."
                    className="field-input pl-10"
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto scroll-thin space-y-3">
                {notes.length === 0 ? (
                  <EmptyState icon={StickyNote} title="No notes yet" description="Add your first note for this client above." />
                ) : filteredNotes.length === 0 ? (
                  <EmptyState icon={Search} title="No matching notes" description="Try a different search term." />
                ) : null}

                {pagedNotes.map((note) => (
                  <div key={note.id} className="bg-stone-50 border border-stone-100 rounded-xl p-4">
                    {editingNoteId === note.id ? (
                      <>
                        <textarea
                          className="field-input resize-none"
                          rows={3}
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => updateNote(note.id)}>Save</Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setEditingNoteId(null); setEditingText(""); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-stone-700 text-sm leading-relaxed">{note.content}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-stone-400">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditingNoteId(note.id); setEditingText(note.content); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-200/60 hover:text-emerald-700 transition"
                              aria-label="Edit note"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(note)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-rose-100 hover:text-rose-600 transition"
                              aria-label="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <PaginationBar
                page={notePage}
                totalPages={noteTotalPages}
                setPage={setNotePage}
                itemsPerPage={noteItemsPerPage}
                setItemsPerPage={setNoteItemsPerPage}
                totalItems={noteTotalItems}
                size="sm"
                layout="stack"
                className="mt-4"
              />
            </>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteNote}
        title="Delete this note?"
        description="This note will be permanently removed."
        confirmLabel="Delete"
      />
    </div>
  );
}
