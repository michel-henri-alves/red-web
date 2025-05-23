import React from 'react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.</p>
        
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn btn-danger">
            Yes, Delete
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

