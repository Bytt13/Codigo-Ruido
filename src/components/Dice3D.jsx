import React from 'react';

export function Dice3D({ rolling, value }) {
  return (
    <div className="dice-container">
      <div className={`cube ${rolling ? 'cube-spinning' : ''}`}>
        <div className="face front">{value || '?'}</div>
        <div className="face back">{value || '?'}</div>
        <div className="face right">{value || '?'}</div>
        <div className="face left">{value || '?'}</div>
        <div className="face top">{value || '?'}</div>
        <div className="face bottom">{value || '?'}</div>
      </div>
    </div>
  );
}
