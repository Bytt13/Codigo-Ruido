import React from 'react';
import { Package, Shield, Swords, Battery } from 'lucide-react';

const Item = ({ name, type, weight, category }) => {
  const Icon = type === 'weapon' ? Swords : type === 'armor' ? Shield : type === 'gear' ? Package : Battery;
  
  return (
    <div className="cyber-panel" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '0.8rem',
      marginBottom: '0.5rem',
      borderColor: category === 2 ? 'var(--neon-yellow)' : 'var(--neon-cyan)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size={18} color="var(--neon-cyan)" />
        <div>
          <p className="header-futuristic" style={{ fontSize: '0.7rem' }}>{name}</p>
          <p className="text-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>TYPE: {type.toUpperCase()}</p>
        </div>
      </div>
      <div className="text-mono" style={{ fontSize: '0.8rem' }}>
        {weight}kg
      </div>
    </div>
  );
};

export function InventoryGrid() {
  const items = [
    { name: 'MONOFACAS "RAZOR"', type: 'weapon', weight: 0.5, category: 1 },
    { name: 'JAQUETA DE KEVLAR', type: 'armor', weight: 3.0, category: 1 },
    { name: 'DECK MILITAR Z-9', type: 'gear', weight: 1.2, category: 2 },
  ];

  const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 className="header-futuristic" style={{ fontSize: '0.9rem' }}>EQUIPAMENTO_CARREGADO</h3>
        <span className="text-mono" style={{ color: 'var(--neon-yellow)' }}>CARGA: {totalWeight}/15.0kg</span>
      </div>
      {items.map((item, idx) => (
        <Item key={idx} {...item} />
      ))}
      <button className="cyber-button" style={{ width: '100%', marginTop: '1rem' }}>+ ADICIONAR ITEM</button>
    </div>
  );
}
