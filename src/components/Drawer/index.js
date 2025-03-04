import React, { useState, useEffect, useRef } from 'react';

const Drawer = ({
  isOpen,
  onClose,
  position = 'left',
  width = '300px',
  height = '100%',
  children,
  title = '',
  footerContent,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const drawerRef = useRef(null);

  // Calculate initial transform based on position
  const getTransform = (pos) => {
    switch (pos) {
      case 'left':
        return 'translateX(-100%)';
      case 'right':
        return 'translateX(100%)';
      case 'top':
        return 'translateY(-100%)';
      case 'bottom':
        return 'translateY(100%)';
      default:
        return 'translateX(-100%)';
    }
  };

  // Set dimensions based on position
  const getDimensions = (pos) => {
    if (pos === 'left' || pos === 'right') {
      return {
        width,
        height: '100%',
      };
    } else {
      return {
        width: '100%',
        height,
      };
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        isOpen
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // If drawer shouldn't be rendered at all
  if (!isOpen && !isAnimating) {
    return null;
  }

  const dimensions = getDimensions(position);

  return (
    <div
      className='drawer-container'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        visibility: isOpen ? 'visible' : 'hidden',
      }}
    >
      {/* Backdrop with fade animation */}
      <div
        className='drawer-backdrop'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className='drawer'
        style={{
          position: 'absolute',
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...dimensions,
          ...(position === 'left' && { left: 0, top: 0 }),
          ...(position === 'right' && { right: 0, top: 0 }),
          ...(position === 'top' && { top: 0, left: 0 }),
          ...(position === 'bottom' && { bottom: 0, left: 0 }),
          transform: isOpen ? 'translate(0, 0)' : getTransform(position),
        }}
      >
        {/* Header */}
        <div
          className='drawer-header'
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '64px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>
            {title}
          </h2>
          <button
            className='drawer-close'
            onClick={onClose}
            aria-label='Close drawer'
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              color: '#666',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          className='drawer-content'
          style={{
            padding: '20px',
            flexGrow: 1,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {(footerContent || onClose) && (
          <div
            className='drawer-footer'
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            {footerContent}
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#d0d0d0';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.borderColor = '#e0e0e0';
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
