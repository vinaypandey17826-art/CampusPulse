import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-3.5 mb-6">
        <div className="w-8 h-8 rounded-[2px] bg-red-50 border border-red-200 flex items-center justify-center shrink-0 text-[#DC2626]">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E2E2]">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          size="sm"
          onClick={() => {
            onConfirm();
          }}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
