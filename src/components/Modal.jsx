import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, width = '600px', height = '80vh' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '2rem'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="cyber-panel"
            style={{
              width: '100%',
              maxWidth: width,
              maxHeight: height,
              overflowY: 'auto',
              background: 'var(--bg-panel)',
              border: '2px solid var(--neon-cyan)',
              boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)',
              padding: '2rem',
              zIndex: 10001,
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(0, 243, 255, 0.3)',
              paddingBottom: '0.5rem'
            }}>
              <h2 className="header-futuristic" style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h2>
              <button 
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--neon-pink)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s'
                }}
                className="glitch-hover"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-mono" style={{ color: 'var(--text-main)' }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
