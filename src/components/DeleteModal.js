export const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  cancelText = "Cancel",
  confirmText = "Confirm",
  loadingText = "Processing..."
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3 className="delete-modal-title">{title}</h3>
        <p className="delete-modal-message">
          {message}
        </p>
        <div className="delete-modal-actions">
          <button 
            onClick={onClose} 
            className="delete-modal-button cancel"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="delete-modal-button delete"
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
  