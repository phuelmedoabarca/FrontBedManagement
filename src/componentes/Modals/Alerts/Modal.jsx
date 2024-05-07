import React from 'react';
import './Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Modal({ isOpen, onClose, onConfirm, confirmText, children, isError }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        <div className="modal-body">
          {isError ? (
            <FontAwesomeIcon className="fa-exclamation-triangle" icon={faExclamationTriangle} />
          ) : (
            <FontAwesomeIcon className="fa-check-circle" icon={faCheckCircle} />
          )}
          {children}
          <br />
          <div className="button-container">
            <button className="close-button" onClick={onClose}>Cerrar</button>
            {onConfirm && (
              <button className="close-button" onClick={onConfirm}>{confirmText}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;