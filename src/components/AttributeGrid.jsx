import * as Formulas from '../utils/formulas';

const Attribute = ({ icon: Icon, name, value, per, onRoll, onUpgrade, availablePA }) => {
  const cost = Formulas.getPACost(value);
  const canUpgrade = availablePA >= cost;

  return (
    <div className="cyber-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '0.8rem',
      gap: '0.4rem',
      cursor: 'pointer',
      minWidth: '100px',
      position: 'relative'
    }}
    onClick={() => onRoll(name)}
    >
      {canUpgrade && (
        <button 
          onClick={(e) => { e.stopPropagation(); onUpgrade(name); }}
          className="cyber-button glitch-hover"
          style={{ 
            position: 'absolute', 
            top: '4px', 
            right: '4px', 
            padding: '2px 6px', 
            fontSize: '0.6rem',
            background: 'var(--neon-cyan)',
            color: 'var(--bg-dark)',
            border: 'none',
            zIndex: 10
          }}
        >
          +{cost}PA
        </button>
      )}
      <Icon size={24} color={name === 'VIG' || name === 'FOR' ? 'var(--neon-pink)' : 'var(--neon-cyan)'} />
      <span className="header-futuristic" style={{ fontSize: '0.7rem' }}>{name}</span>
      <span className="text-mono" style={{ fontSize: '1.5rem', color: 'var(--neon-cyan)' }}>{value}</span>
      <span className="text-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>PER: +{per}</span>
      <div className="cyber-button glitch-hover" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', marginTop: '0.4rem', width: '100%', textAlign: 'center' }}>
        ROLL
      </div>
    </div>
  );
};

export function AttributeGrid({ attributes, skills, onRoll, onUpgrade, availablePA }) {
  const attrs = [
    { icon: Dumbbell, name: 'FOR', value: attributes.FOR, per: skills.FOR },
    { icon: Target, name: 'DES', value: attributes.DES, per: skills.DES },
    { icon: Wind, name: 'AGI', value: attributes.AGI, per: skills.AGI },
    { icon: Shield, name: 'VIG', value: attributes.VIG, per: skills.VIG },
    { icon: Brain, name: 'INT', value: attributes.INT, per: skills.INT },
    { icon: Book, name: 'EXP', value: attributes.EXP, per: skills.EXP },
    { icon: Users, name: 'CAR', value: attributes.CAR, per: skills.CAR },
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
      gap: '1rem',
      marginBottom: '1rem'
    }}>
      {attrs.map((attr, idx) => (
        <Attribute 
          key={idx} 
          {...attr} 
          onRoll={onRoll} 
          onUpgrade={onUpgrade}
          availablePA={availablePA}
        />
      ))}
    </div>
  );
}
