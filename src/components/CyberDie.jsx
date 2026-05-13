import React from 'react';
import { motion } from 'framer-motion';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const DIGIT_HEIGHT = 50; // Reduzido de 70

function SlotDigit({ value, rolling }) {
  return (
    <div style={{
      width: '40px', // Reduzido de 50
      height: `${DIGIT_HEIGHT}px`,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <motion.div
        animate={rolling ? {
          y: [0, -DIGIT_HEIGHT * 9],
        } : {
          y: -value * DIGIT_HEIGHT
        }}
        transition={rolling ? {
          duration: 0.15,
          repeat: Infinity,
          ease: "linear"
        } : {
          type: "spring",
          stiffness: 120,
          damping: 20
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {DIGITS.map((d) => (
          <div
            key={d}
            style={{
              height: `${DIGIT_HEIGHT}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem', // Reduzido de 3rem
              fontWeight: '900',
              color: 'white',
              fontFamily: 'var(--font-mono)',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }}
          >
            {d}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CyberDie({ rolling, value, sides = 20, discarded = false }) {
  const displayValue = value !== null ? value.toString().padStart(2, '0') : '00';
  const digits = displayValue.split('').map(Number);
  const primaryColor = discarded ? 'rgba(255, 0, 85, 0.5)' : (sides === 20 ? 'var(--neon-pink)' : 'var(--neon-cyan)');

  return (
    <div style={{
      margin: '1rem auto',
      position: 'relative',
      width: 'fit-content',
      opacity: discarded ? 0.4 : 1,
      transform: discarded ? 'scale(0.85)' : 'scale(1)',
      transition: 'all 0.4s ease'
    }}>
      {/* Outer Industrial Frame */}
      <div style={{
        padding: '6px',
        background: 'rgba(5, 5, 5, 0.9)',
        border: `2px solid ${primaryColor}`,
        borderRadius: '4px',
        boxShadow: discarded ? 'none' : `0 0 20px ${primaryColor}44, inset 0 0 10px ${primaryColor}22`,
        position: 'relative',
        clipPath: 'polygon(5% 0, 95% 0, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0 90%, 0 10%)'
      }}>
        
        {/* Inner Tech-Slot Display */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 1)',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          gap: '2px'
        }}>
          <SlotDigit value={digits[0]} rolling={rolling} />
          
          <div style={{ 
            width: '1px', 
            height: '100%', 
            background: 'linear-gradient(transparent, rgba(255,255,255,0.2), transparent)',
            position: 'absolute',
            left: '50%',
            zIndex: 5
          }} />
          
          <SlotDigit value={digits[1]} rolling={rolling} />

          {/* ELIMINATED OVERLAY */}
          {discarded && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 0, 85, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20
            }}>
              <div style={{
                position: 'absolute',
                width: '120%',
                height: '2px',
                background: 'var(--neon-pink)',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 10px var(--neon-pink)'
              }} />
              <div style={{
                position: 'absolute',
                width: '120%',
                height: '2px',
                background: 'var(--neon-pink)',
                transform: 'rotate(-45deg)',
                boxShadow: '0 0 10px var(--neon-pink)'
              }} />
            </div>
          )}

          {/* Glass Reflection & Scanlines Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(rgba(255,255,255,0.05) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%),
              repeating-linear-gradient(transparent 0px, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)
            `,
            pointerEvents: 'none',
            zIndex: 10
          }} />
        </div>
      </div>

      {/* Small Label */}
      <div className="text-mono" style={{ 
        marginTop: '0.4rem',
        fontSize: '0.5rem', 
        color: primaryColor, 
        textAlign: 'center',
        textDecoration: discarded ? 'line-through' : 'none'
      }}>
        {discarded ? 'DISCARDED' : (rolling ? 'ROLLING' : `D${sides}`)}
      </div>
    </div>
  );
}
