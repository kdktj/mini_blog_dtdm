import React from 'react';
import { useToast, TOAST_TYPES } from '../../context/ToastContext';

/**
 * Toast Component
 * Displays a single toast notification
 */
const Toast = ({ toast, onClose }) => {
  let bgColor, textColor, icon;

  switch (toast.type) {
    case TOAST_TYPES.SUCCESS:
      bgColor = '#d4edda';
      textColor = '#155724';
      icon = '✅';
      break;
    case TOAST_TYPES.ERROR:
      bgColor = '#f8d7da';
      textColor = '#721c24';
      icon = '❌';
      break;
    case TOAST_TYPES.WARNING:
      bgColor = '#fff3cd';
      textColor = '#856404';
      icon = '⚠️';
      break;
    case TOAST_TYPES.INFO:
    default:
      bgColor = '#d1ecf1';
      textColor = '#0c5460';
      icon = 'ℹ️';
      break;
  }

  return (
    <div
      style={{
        background: bgColor,
        color: textColor,
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{icon}</span>
        <span>{toast.message}</span>
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: '1.2rem',
          padding: '0 0.5rem',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.target.style.opacity = '1')}
        onMouseOut={(e) => (e.target.style.opacity = '0.7')}
      >
        ✕
      </button>
    </div>
  );
};

/**
 * ToastContainer Component
 * Container for displaying all toasts
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }

        @media (max-width: 768px) {
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
