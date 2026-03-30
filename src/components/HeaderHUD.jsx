import React from 'react';
import { Shield, Zap, Activity } from 'lucide-react';

export function HeaderHUD({ name, reputation, level, xp, maxXp, points, ca }) {
  const xpPercentage = (xp / maxXp) * 100;

  return (
    <div className="cyber-panel" style={{ 
      width: '100%', 
      marginBottom: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background XP Bar Decor */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '4px',
        width: '100%',
        background: 'rgba(0, 255, 255, 0.1)',
      }}>
        <div style={{
          height: '100%',
          width: `${xpPercentage}%`,
          background: 'var(--neon-cyan)',
          boxShadow: '0 0 10px var(--neon-cyan)',
          transition: 'width 0.5s ease-out'
        }} />
      </div>

      <div style={{ zIndex: 1 }}>
        <h1 className="header-futuristic" style={{ fontSize: '1.8rem', margin: 0 }}>{name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.2rem' }}>
          <p className="text-mono" style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem', margin: 0 }}>
            REP: {reputation} | LVL: {level}
          </p>
          
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <div className="text-mono" style={{ fontSize: '0.65rem' }}>
              <span style={{ color: 'var(--neon-cyan)', opacity: points.PA > 0 ? 1 : 0.5 }}>PA: {points.PA}</span>
            </div>
            <div className="text-mono" style={{ fontSize: '0.65rem' }}>
              <span style={{ color: 'var(--neon-pink)', opacity: points.PP > 0 ? 1 : 0.5 }}>PP: {points.PP}</span>
            </div>
            <div className="text-mono" style={{ fontSize: '0.65rem' }}>
              <span style={{ color: 'var(--neon-yellow)', opacity: points.PT > 0 ? 1 : 0.5 }}>PT: {points.PT}</span>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(0,0,0,0.3)', 
            padding: '2px 8px', 
            borderRadius: '4px',
            border: '1px solid rgba(0, 255, 255, 0.2)'
          }}>
            <span className="text-mono" style={{ fontSize: '0.6rem', color: 'var(--neon-cyan)' }}>XP</span>
            <div style={{ width: '60px', height: '6px', background: '#111', position: 'relative' }}>
              <div style={{ height: '100%', width: `${xpPercentage}%`, background: 'var(--neon-cyan)' }} />
            </div>
            <span className="text-mono" style={{ fontSize: '0.6rem' }}>{xp}/{maxXp}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={20} color="var(--neon-cyan)" />
          <p className="text-mono" style={{ fontSize: '1.2rem', color: 'var(--neon-cyan)', marginTop: '0.2rem', margin: 0 }}>{ca}</p>
          <p className="text-mono" style={{ fontSize: '0.7rem', margin: 0 }}>ARMADURA</p>
        </div>
      </div>
    </div>
  );
}
