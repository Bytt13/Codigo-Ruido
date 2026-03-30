import React from 'react';

export function StatusBars({ health, maxHealth, sanity, maxSanity, mentalRes, stamina, maxStamina }) {
  const hpPercent = (health / maxHealth) * 100;
  const sanPercent = (sanity / maxSanity) * 100;
  const staminaPercent = (stamina / maxStamina) * 100;

  return (
    <div className="cyber-panel" style={{ width: '100%', marginBottom: '1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
          <span className="header-futuristic" style={{ fontSize: '0.9rem' }}>VITALIDADE</span>
          <span className="text-mono" style={{ color: 'var(--neon-cyan)' }}>{health}/{maxHealth}</span>
        </div>
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${hpPercent}%`, background: 'var(--neon-cyan)', boxShadow: '0 0 15px var(--neon-cyan)' }}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
          <span className="header-futuristic" style={{ fontSize: '0.9rem', color: 'var(--neon-pink)' }}>SANIDADE</span>
          <span className="text-mono" style={{ color: 'var(--neon-pink)' }}>{sanity}/{maxSanity}</span>
        </div>
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${sanPercent}%`, background: 'var(--neon-pink)', boxShadow: '0 0 15px var(--neon-pink)' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span className="header-futuristic" style={{ fontSize: '0.7rem', color: 'var(--neon-purple)' }}>RESILIÊNCIA MENTAL</span>
            <span className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--neon-purple)' }}>{mentalRes}</span>
          </div>
          <div className="progress-container" style={{ height: '4px' }}>
            <div className="progress-bar" style={{ width: '100%', background: 'var(--neon-purple)', boxShadow: '0 0 10px var(--neon-purple)' }} />
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span className="header-futuristic" style={{ fontSize: '0.7rem', color: 'var(--neon-yellow)' }}>ESTAMINA</span>
            <span className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--neon-yellow)' }}>{stamina}/{maxStamina}</span>
          </div>
          <div className="progress-container" style={{ height: '4px' }}>
            <div className="progress-bar" style={{ width: `${staminaPercent}%`, background: 'var(--neon-yellow)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
