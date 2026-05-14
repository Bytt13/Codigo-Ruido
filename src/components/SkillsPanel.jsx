import React, { useState } from 'react';
import { SKILLS_DATABASE } from '../data/skills';
import { Search, Plus } from 'lucide-react';
import * as Formulas from '../utils/formulas';

export function SkillsPanel({ skills, availablePP, availablePT, talents, onUpgradeSkill, onAddTalent, onRoll }) {
  const [search, setSearch] = useState('');
  const [talentSearch, setTalentSearch] = useState('');

  const filteredSkills = SKILLS_DATABASE.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div className="cyber-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="header-futuristic" style={{ fontSize: '1rem' }}>FIAÇÃO_NEURAL [SKILLS]</h2>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--neon-cyan)" style={{ position: 'absolute', left: '8px' }} />
            <input 
              type="text" 
              placeholder="BUSCAR_SOFTWARE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-mono"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                padding: '0.4rem 0.5rem 0.4rem 2rem',
                fontSize: '0.7rem',
                outline: 'none',
                width: '200px'
              }}
            />
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '0.8rem',
          paddingRight: '0.5rem'
        }}>
          {filteredSkills.map(skill => {
            const currentBonus = skills[skill.name] || 0;
            const cost = Formulas.getPPCost(currentBonus);
            const canUpgrade = availablePP >= cost;

            return (
              <div key={skill.id} className="cyber-panel" style={{ 
                padding: '0.8rem', 
                border: '1px solid rgba(0, 243, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                {canUpgrade && currentBonus < 20 && (
                  <button 
                    onClick={() => onUpgradeSkill(skill.name)}
                    className="cyber-button-mini"
                    title={`Gastar ${cost} PP para aumentar +1`}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'var(--neon-pink)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '2px 6px',
                      fontSize: '0.6rem'
                    }}
                  >
                    <Plus size={10} /> {cost}PP
                  </button>
                )}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="header-futuristic" style={{ fontSize: '0.8rem' }}>{skill.name}</h3>
                    <span className="text-mono" style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', marginRight: canUpgrade ? '45px' : '0' }}>
                      +{currentBonus}
                    </span>
                  </div>
                  <p className="text-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                    {`ATTR: ${skill.attr.join(' / ')}`}
                  </p>
                  <p className="text-mono" style={{ fontSize: '0.65rem' }}>{skill.desc}</p>
                </div>
                
                <button 
                  className="cyber-button glitch-hover"
                  onClick={() => onRoll(skill.name, skill.attr)}
                  style={{ padding: '0.2rem', marginTop: '0.8rem', fontSize: '0.6rem' }}
                >
                  RUN_EXECUTION
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Talent Section */}
      <div className="cyber-panel cyber-panel-pink" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="header-futuristic" style={{ fontSize: '0.9rem', color: 'var(--neon-yellow)' }}>
            ARQUIVOS_MÉTODO [TALENTOS]
          </h2>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color="var(--neon-yellow)" style={{ position: 'absolute', left: '8px' }} />
            <input 
              type="text" 
              placeholder="FILTRAR_TALENTOS..."
              value={talentSearch}
              onChange={(e) => setTalentSearch(e.target.value)}
              className="text-mono"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--neon-yellow)',
                color: 'var(--neon-yellow)',
                padding: '0.3rem 0.5rem 0.3rem 1.8rem',
                fontSize: '0.65rem',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {talents.length === 0 ? (
              <p className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>NENHUM TALENTO REGISTRADO.</p>
          ) : (() => {
            const filteredTalents = talents.filter(t => t.toLowerCase().includes(talentSearch.toLowerCase()));
            
            if (filteredTalents.length === 0) {
              return <p className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>NENHUM RESULTADO ENCONTRADO.</p>;
            }

            const grouped = filteredTalents.reduce((acc, t) => {
              acc[t] = (acc[t] || 0) + 1;
              return acc;
            }, {});

            return Object.entries(grouped).map(([name, count], idx) => (
              <div key={idx} style={{ 
                background: 'rgba(255, 255, 0, 0.1)', 
                border: '1px solid var(--neon-yellow)', 
                padding: '2px 8px', 
                fontSize: '0.7rem',
                color: 'var(--neon-yellow)',
                cursor: 'pointer'
              }} className="text-mono">
                {name}{count > 1 ? `_v${count}` : ''}
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
