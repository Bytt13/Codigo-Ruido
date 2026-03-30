import React from 'react';
import { motion } from 'framer-motion';

export function CyberDie({ rolling, value, sides = 20 }) {
  // Cores de Avernus
  const primaryColor = sides === 20 ? 'var(--neon-pink)' : 'var(--neon-cyan)';
  
  return (
    <div style={{ 
      width: '80px', 
      height: '80px', 
      margin: '1.5rem auto', 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        animate={rolling ? {
          rotateX: [0, 360, 720],
          rotateY: [0, 360, 720],
          scale: [1, 1.2, 1],
        } : {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        }}
        transition={rolling ? {
          duration: 0.6,
          repeat: Infinity,
          ease: "linear"
        } : {
          duration: 0.5,
          type: "spring"
        }}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative'
        }}
      >
        {sides === 20 ? (
          // SVG de Icosaedro (d20) Wireframe
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 0 5px ${primaryColor})` }}>
            <path
              d="M50 5 L95 30 L95 70 L50 95 L5 70 L5 30 Z"
              fill="rgba(0,0,0,0.6)"
              stroke={primaryColor}
              strokeWidth="2"
            />
            <path d="M50 5 L50 95 M5 30 L95 30 M5 70 L95 70 M5 30 L50 95 L95 30 M5 70 L50 5 L95 70" 
              fill="none" 
              stroke={primaryColor} 
              strokeWidth="1" 
              strokeOpacity="0.5" 
            />
          </svg>
        ) : (
          // Cubo (d6) Wireframe
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 0 5px ${primaryColor})` }}>
             <rect x="20" y="20" width="60" height="60" fill="rgba(0,0,0,0.6)" stroke={primaryColor} strokeWidth="2" />
             <path d="M20 20 L35 10 L75 10 L60 20 M75 10 L75 50 L60 60" fill="none" stroke={primaryColor} strokeWidth="2" />
          </svg>
        )}

        {/* Valor Resultante */}
        {!rolling && value && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-mono"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '1.4rem',
              color: primaryColor,
              textShadow: `0 0 10px ${primaryColor}`,
              zIndex: 10
            }}
          >
            {value}
          </motion.div>
        )}
      </motion.div>

      {/* Efeito de Scanline no dado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(transparent 50%, rgba(255,255,255,0.05) 50%)',
        backgroundSize: '100% 4px',
        pointerEvents: 'none',
        borderRadius: '50%'
      }} />
    </div>
  );
}
