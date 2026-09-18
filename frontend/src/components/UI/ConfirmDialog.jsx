import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            danger ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        {description && <p className="text-sm text-stone-500">{description}</p>}
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          fullWidth
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
