"use client";

import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-lg bg-white p-10 shadow-xl dark:bg-card"
      >
 
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-xs leading-6 text-gray-400">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              rounded-full
              bg-gray-50
              px-5 py-3
              text-sm font-semibold
              text-indigo-500
              transition
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              rounded-full
              bg-red-500
              px-6 py-3
              text-sm font-semibold
              text-white
              transition
              hover:bg-red-600
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}