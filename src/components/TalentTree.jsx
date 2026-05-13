import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, Shield, Crosshair, Cpu, Users, X, Search } from 'lucide-react';
import { TALENT_TREE } from '../data/talents';

const calculatePositions = (talents) => {
  const levels = {};
  const positions = {};
  const nodeGapX = 200; 
  const nodeGapY = 220; 
  const CANVAS_WIDTH = 5000;
  const CANVAS_HEIGHT = 4000;

  const getLevel = (talentId) => {
    const talent = talents.find(t => t.id === talentId);
    if (!talent || !talent.prereq) return 0;
    return 1 + getLevel(talent.prereq);
  };

  talents.forEach(t => {
    const lvl = getLevel(t.id);
    if (!levels[lvl]) levels[lvl] = [];
    levels[lvl].push(t);
  });

  Object.keys(levels).forEach(lvl => {
    levels[lvl].forEach((t, idx) => {
      const totalInLvl = levels[lvl].length;
      const xOffset = (idx - (totalInLvl - 1) / 2) * nodeGapX;
      positions[t.id] = {
        x: xOffset + CANVAS_WIDTH / 2, 
        y: lvl * nodeGapY + 150
      };
    });
  });

  return { positions, width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
};

function Connection({ start, end, active, color }) {
  if (!start || !end) return null;
  return (
    <g>
      <line
        x1={start.x} y1={start.y}
        x2={end.x} y2={end.y}
        stroke={active ? color : '#111'}
        strokeWidth={active ? '5' : '2'}
        style={{ transition: 'all 0.4s ease' }}
      />
    </g>
  );
}

export function TalentTree({ acquiredTalents, onBuyTalent, ptPoints }) {
  const [activeTrack, setActiveTrack] = useState('COMBATE');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef(null);
  
  const [isPanning, setIsPanning] = useState(false);
  const [panState, setPanState] = useState({ x: 0, y: 0, scrollX: 0, scrollY: 0 });

  const [selectedTalent, setSelectedTalent] = useState(null);

  const tracks = [
    { id: 'COMBATE', icon: Crosshair, color: 'var(--neon-pink)' },
    { id: 'RESISTÊNCIA', icon: Shield, color: '#ff9d00' },
    { id: 'MENTE', icon: Cpu, color: 'var(--neon-cyan)' },
    { id: 'SOCIAL', icon: Users, color: '#f0f' }
  ];

  const currentTalents = TALENT_TREE[activeTrack] || [];
  const { positions, width: canvasWidth, height: canvasHeight } = useMemo(() => calculatePositions(currentTalents), [currentTalents]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = (canvasWidth - container.clientWidth) / 2;
      container.scrollTop = 0;
    }
  }, [activeTrack, canvasWidth]);

  const onMouseDown = (e) => {
    setIsPanning(true);
    setPanState({
      x: e.clientX,
      y: e.clientY,
      scrollX: scrollContainerRef.current.scrollLeft,
      scrollY: scrollContainerRef.current.scrollTop
    });
  };

  const onMouseMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - panState.x;
    const dy = e.clientY - panState.y;
    scrollContainerRef.current.scrollLeft = panState.scrollX - dx;
    scrollContainerRef.current.scrollTop = panState.scrollY - dy;
  };

  const isPrereqMet = (talent) => {
    if (!talent.prereq) return true;
    return acquiredTalents.includes(talent.prereq);
  };

  const getTalentLevel = (id) => acquiredTalents.filter(tId => tId === id).length;

  const primaryColor = tracks.find(t => t.id === activeTrack)?.color || 'var(--neon-cyan)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '650px', width: '100%', position: 'relative' }}>
      {/* Top Header with Selectors */}
      <div style={{ display: 'flex', gap: '1rem', zIndex: 100, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          {tracks.map(track => (
            <button
              key={track.id}
              onClick={() => setActiveTrack(track.id)}
              className={`cyber-button ${activeTrack === track.id ? 'active' : ''}`}
              style={{ 
                flex: 1, 
                padding: '0.6rem',
                borderColor: activeTrack === track.id ? track.color : 'rgba(255,255,255,0.1)',
                color: activeTrack === track.id ? track.color : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <track.icon size={14} />
              <span className="header-futuristic" style={{ fontSize: '0.6rem' }}>{track.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Field Container */}
      <div 
        ref={scrollContainerRef}
        className="cyber-panel"
        style={{ 
          flex: 1, 
          overflow: 'hidden',
          background: '#000',
          position: 'relative',
          border: `1px solid ${primaryColor}`,
        }}
      >
        {/* Pan Layer */}
        <div 
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={() => setIsPanning(false)}
          onMouseLeave={() => setIsPanning(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: canvasWidth,
            height: canvasHeight,
            cursor: isPanning ? 'grabbing' : 'grab',
            zIndex: 5
          }}
        />

        {/* Talent Nodes Layer */}
        <div style={{ width: canvasWidth, height: canvasHeight, position: 'relative', pointerEvents: 'none' }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {currentTalents.map(t => t.prereq && (
              <Connection key={t.id} start={positions[t.prereq]} end={positions[t.id]} active={acquiredTalents.includes(t.id)} color={primaryColor} />
            ))}
          </svg>

          {currentTalents.map(talent => {
            const currentLevel = getTalentLevel(talent.id);
            const isProgressive = talent.description.includes('+5/10/15');
            const maxLevel = isProgressive ? 3 : 1;
            const acquired = currentLevel >= maxLevel;
            const isPartiallyAcquired = currentLevel > 0;
            const locked = !isPrereqMet(talent);
            const pos = positions[talent.id];

            // Search filtering
            const matchesSearch = searchTerm === '' || 
              talent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              talent.description.toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div
                key={talent.id}
                className="talent-node"
                style={{
                  position: 'absolute',
                  left: pos.x - 40,
                  top: pos.y - 40,
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 20,
                  cursor: (locked || (acquired && !isProgressive)) ? 'not-allowed' : 'pointer',
                  pointerEvents: 'auto',
                  opacity: matchesSearch ? 1 : 0.1,
                  filter: matchesSearch ? 'none' : 'grayscale(1)',
                  transition: '0.3s all'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTalent(talent);
                }}
              >
                {/* Hexagon */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: acquired ? primaryColor : (isPartiallyAcquired ? `${primaryColor}66` : (locked ? '#050505' : 'rgba(20,20,20,0.8)')),
                  border: `2px solid ${acquired ? '#fff' : (locked ? '#111' : primaryColor)}`,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.2s all',
                  boxShadow: isPartiallyAcquired ? `0 0 15px ${primaryColor}` : 'none'
                }}>
                  {acquired ? <Zap size={20} color="#fff" /> : (locked ? <Lock size={18} color="#222" /> : <span style={{ color: isPartiallyAcquired ? '#fff' : primaryColor, fontWeight: 'bold' }}>{talent.cost + currentLevel}</span>)}
                </div>

                {/* Level Dots */}
                {isProgressive && (
                  <div style={{ position: 'absolute', top: '10px', display: 'flex', gap: '2px' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: currentLevel >= i ? '#fff' : '#222' }} />
                    ))}
                  </div>
                )}

                {/* Label */}
                <div className="header-futuristic" style={{
                  position: 'absolute', top: '70px', width: '200px', textAlign: 'center',
                  fontSize: '0.55rem', color: isPartiallyAcquired ? '#fff' : (locked ? '#333' : '#aaa')
                }}>
                  {talent.name.toUpperCase()} {isProgressive && currentLevel > 0 && `(V${currentLevel})`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Modal for Selection */}
      <AnimatePresence>
        {selectedTalent && (() => {
          const currentLevel = getTalentLevel(selectedTalent.id);
          const isProgressive = selectedTalent.description.includes('+5/10/15');
          const maxLevel = isProgressive ? 3 : 1;
          const dynamicCost = selectedTalent.cost + currentLevel;
          const isMaxed = currentLevel >= maxLevel;

          return (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTalent(null)}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 9999 }} />
              
              <motion.div initial={{ opacity: 0, scale: 0.9, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }}
                style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', background: '#050505', border: `1px solid ${primaryColor}`, boxShadow: `0 0 40px ${primaryColor}33`, padding: '2rem', zIndex: 10000 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div className="header-futuristic" style={{ color: primaryColor, fontSize: '1.2rem', textShadow: 'none' }}>
                      {selectedTalent.name} {isProgressive && currentLevel > 0 && `[NÍVEL ${currentLevel}]`}
                    </div>
                    <div className="text-mono" style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.2rem' }}>ESTÁGIO_EVOLUTIVO: {currentLevel}/{maxLevel}</div>
                  </div>
                  <button onClick={() => setSelectedTalent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}><X size={24} /></button>
                </div>

                <div className="text-mono" style={{ fontSize: '0.9rem', color: '#ddd', lineHeight: '1.6', marginBottom: '2rem', borderLeft: `2px solid ${primaryColor}`, paddingLeft: '1rem' }}>
                  {selectedTalent.description}
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)', minHeight: '80px' }}>
                  <div style={{ flex: 1 }}>
                    <div className="text-mono" style={{ fontSize: '0.65rem', color: '#666' }}>{isMaxed ? 'SISTEMA_OTIMIZADO' : 'CUSTO PRÓXIMA MELHORIA'}</div>
                    <div className="header-futuristic" style={{ fontSize: isMaxed ? '1.2rem' : '1.5rem', color: isMaxed ? '#fff' : (ptPoints >= dynamicCost ? 'var(--neon-cyan)' : 'var(--neon-pink)'), textShadow: 'none', marginTop: '2px' }}>
                      {isMaxed ? 'LEVEL_MÁXIMO' : `${dynamicCost} PT`}
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {isMaxed ? (
                      <div className="header-futuristic" style={{ color: '#fff', fontSize: '0.75rem', background: primaryColor, padding: '0.8rem 1.2rem', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center', whiteSpace: 'nowrap' }}>PROTOCOLO_FINALIZADO</div>
                    ) : !isPrereqMet(selectedTalent) ? (
                      <div className="header-futuristic" style={{ color: '#444', fontSize: '0.8rem', border: '1px solid #222', padding: '0.8rem 1.5rem' }}>REQUISITOS_BLOQUEADOS</div>
                    ) : (
                      <button className="cyber-button" disabled={ptPoints < dynamicCost} onClick={() => { onBuyTalent(selectedTalent); if (!isProgressive || currentLevel + 1 >= maxLevel) setSelectedTalent(null); }}
                        style={{ padding: '0.8rem 1.5rem', borderColor: ptPoints >= dynamicCost ? primaryColor : '#333', color: ptPoints >= dynamicCost ? '#fff' : '#444', textShadow: ptPoints >= dynamicCost ? `0 0 10px ${primaryColor}` : 'none', fontSize: '0.85rem', fontWeight: 'bold', background: ptPoints >= dynamicCost ? `${primaryColor}33` : 'rgba(255,255,255,0.02)', cursor: ptPoints >= dynamicCost ? 'pointer' : 'not-allowed', boxShadow: ptPoints >= dynamicCost ? `inset 0 0 10px ${primaryColor}44` : 'none', whiteSpace: 'nowrap' }}
                      >
                        {currentLevel > 0 ? 'UPGRADE_PROTOCOLO' : 'INSTALAR_PROTOCOLO'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

      <div className="header-futuristic" style={{ fontSize: '0.7rem', textAlign: 'right', color: 'var(--neon-cyan)' }}>
        PONTOS_DISPONÍVEIS: {ptPoints} PT
      </div>
    </div>
  );
}
