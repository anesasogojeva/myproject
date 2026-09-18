import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2, Mail, Search } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/UI/Card";
import Modal from "../../components/UI/Modal";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import { TableRowSkeleton } from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import PaginationBar from "../../components/UI/PaginationBar";
import usePagination from "../../hooks/usePagination";

export default function Contacts() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((c) =>
    `${c.name || ""} ${c.email || ""} ${c.message || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const {
    page,
    setPage,
    totalPages,
    pageItems: pagedContacts,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filteredContacts, 10);

  const token = localStorage.getItem("accessToken");

  const fetchContacts = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setContacts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/contact/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Message deleted");
      fetchContacts();
    } catch (err) {
      toast.error("Failed to delete message.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">Contact Messages</h1>
        <p className="text-stone-500 mt-1.5">View and manage customer contact form submissions.</p>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="field-input pl-10"
        />
      </div>

      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr className="text-left text-stone-500">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Message</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Mail} title="No messages yet" description="Customer contact form submissions will appear here." />
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Search} title="No matching messages" description="Try a different search term." />
                  </td>
                </tr>
              ) : (
                pagedContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/60 transition">
                    <td className="p-4 font-medium text-stone-800">{c.name}</td>
                    <td className="p-4 text-stone-500">{c.email}</td>
                    <td className="p-4 text-stone-500 max-w-[220px] truncate">{c.message}</td>
                    <td className="p-4 text-stone-400 text-xs whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedContact(c)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-emerald-700 transition"
                          aria-label="View message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          aria-label="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {!loading && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={totalItems}
        />
      )}

      <Modal open={!!selectedContact} onClose={() => setSelectedContact(null)} title="Message Details">
        {selectedContact && (
          <div className="space-y-3 text-sm">
            <p><span className="text-stone-400">Name:</span> <span className="font-medium text-stone-800">{selectedContact.name}</span></p>
            <p><span className="text-stone-400">Email:</span> <span className="font-medium text-stone-800">{selectedContact.email}</span></p>
            <div className="bg-stone-50 rounded-xl p-4 text-stone-600 whitespace-pre-wrap leading-relaxed">
              {selectedContact.message}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this message?"
        description="This contact submission will be permanently removed."
        confirmLabel="Delete"
      />
    </div>
  );
}
