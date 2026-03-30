import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderHUD } from './components/HeaderHUD';
import { StatusBars } from './components/StatusBars';
import { AttributeGrid } from './components/AttributeGrid';
import { InventoryGrid } from './components/InventoryGrid';
import { SkillsPanel } from './components/SkillsPanel';
import { CyberDie } from './components/CyberDie';
import * as Formulas from './utils/formulas';
import { Terminal, Database, Box, Cpu, Zap } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [maxXp, setMaxXp] = useState(1000);
  const [points, setPoints] = useState({ PA: 0, PP: 0, PT: 0 });
  const [talents, setTalents] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(null);
  
  // Atributos Biológicos (Gênese: 1 em seis, 0 em um)
  const [attributes, setAttributes] = useState({
    FOR: 1, DES: 1, AGI: 1, VIG: 1, INT: 1, EXP: 0, CAR: 1
  });

  // Perícias (Bônus numérico +0 a +20)
  const [skillBonuses, setSkillBonuses] = useState({
    'Atletismo': 0, 'Acrobacia': 0, 'Prestidigitação': 0, 'Furtividade': 0,
    'Dirigir': 0, 'Reflexos': 2, 'Iniciativa': 3, 'Fortitude': 0,
    'Tecnologia': 5, 'Ciências': 0, 'História': 0, 'Geografia': 0,
    'Tática': 0, 'Medicina': 0, 'Investigação': 0, 'Percepção': 0,
    'Intuição': 0, 'Malandragem': 0, 'Manipulação': 0, 'Intimidação': 0
  });

  const [logs, setLogs] = useState([
    { id: 1, text: "PROTOCOLO CÓDIGO RUÍDO ATIVO...", type: "system" },
    { id: 2, text: "BEM-VINDO A AVERNUS, SOBREVIVENTE.", type: "system" }
  ]);

  // Cálculos Derivados
  // Cálculos Derivados com Fallbacks
  const maxPS = Formulas.calculatePS(attributes?.VIG || 0, level || 1) || 12;
  const maxSAN = Formulas.calculateSAN(attributes?.EXP || 0, level || 1) || 12;
  const mentalRes = Formulas.calculateRM(attributes?.INT || 0, attributes?.EXP || 0) || 10;
  const maxPE = Formulas.calculatePE(attributes?.EXP || 0) || 5;
  const armorClass = Formulas.calculateCA(attributes?.VIG || 0, attributes?.AGI || 0, 0) || 10;

  const addLog = (text, type = "roll") => {
    // Usar um ID mais robusto para evitar avisos de chaves duplicadas
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setLogs(prev => [{ id, text, type }, ...prev].slice(0, 50));
  };

  const handleGainXp = (amount) => {
    setXp(prevXp => {
      let newXp = prevXp + amount;
      let newLevel = level;
      let newPoints = { ...points };
      
      if (newXp >= maxXp) {
        newXp -= maxXp;
        newLevel += 1;
        
        // Regras de Progressão (Simplificadas da tabela do PDF)
        const rewards = {
          2: { PA: 1, PT: 2, PP: 3 },
          3: { PA: 1, PT: 3, PP: 3 },
          4: { PA: 0, PT: 2, PP: 2 },
          5: { PA: 0, PT: 2, PP: 2 },
          6: { PA: 1, PT: 3, PP: 3 },
        };
        
        const currentReward = rewards[newLevel] || { PA: 1, PT: 2, PP: 2 };
        newPoints.PA += currentReward.PA;
        newPoints.PP += currentReward.PP;
        newPoints.PT += currentReward.PT;
        
        setLevel(newLevel);
        addLog(`SISTEMA ATUALIZADO: NÍVEL ${newLevel} ALCANÇADO!`, "system");
        addLog(`RECOMPENSAS: +${currentReward.PA} PA, +${currentReward.PP} PP, +${currentReward.PT} PT`, "system");
      }
      
      return newXp;
    });
  };

  const handleUpgradeAttribute = (name) => {
    const cost = Formulas.getPACost(attributes[name]);
    if (points.PA >= cost) {
      setAttributes(prev => ({ ...prev, [name]: prev[name] + 1 }));
      setPoints(prev => ({ ...prev, PA: prev.PA - cost }));
      addLog(`REDE NEURAL OTIMIZADA: ${name} +1`, "system");
    } else {
      addLog(`ERRO: PONTOS DE ATRIBUTO (PA) INSUFICIENTES para ${name}.`, "error");
    }
  };

  const handleUpgradeSkill = (name) => {
    const cost = Formulas.getPPCost(skillBonuses[name]);
    if (points.PP >= cost) {
      setSkillBonuses(prev => ({ ...prev, [name]: prev[name] + 1 }));
      setPoints(prev => ({ ...prev, PP: prev.PP - cost }));
      addLog(`SOFTWARE ATUALIZADO: ${name} +1`, "system");
    } else {
      addLog(`ERRO: PONTOS DE PERÍCIA (PP) INSUFICIENTES para ${name}.`, "error");
    }
  };

  const handleAddTalent = (talentName) => {
    if (points.PT >= 1) {
      setTalents(prev => [...prev, talentName]);
      setPoints(prev => ({ ...prev, PT: prev.PT - 1 }));
      addLog(`NOVO TALENTO ATIVADO: ${talentName.toUpperCase()}`, "system");
      return true;
    }
    addLog(`ERRO: PONTOS DE TALENTO (PT) INSUFICIENTES.`, "error");
    return false;
  };

  const rollDice = (sides = 20, label = "D20", linkedAttrs = []) => {
    if (isRolling) return;
    
    // Calcular nível do atributo (X)
    let attrLevel = 1;
    if (linkedAttrs.length > 0) {
      // Se for híbrida, pega o maior valor entre os atributos vinculados
      const values = linkedAttrs.map(a => attributes[a] || 0);
      attrLevel = Math.max(...values);
    } else if (attributes[label] !== undefined) {
      attrLevel = attributes[label];
    }
    
    const bonus = skillBonuses[label] || 0;
    
    setIsRolling(true);
    setCurrentRoll(null);
    addLog(`EXECUTANDO SOFTWARE [${label}]: ${attrLevel > 0 ? `${attrLevel}d20` : '2d20 (DESV.)'}...`, "system");
    
    setTimeout(() => {
      let results = [];
      let finalValue = 0;

      if (attrLevel > 0) {
        for (let i = 0; i < attrLevel; i++) {
          results.push(Math.floor(Math.random() * 20) + 1);
        }
        finalValue = Math.max(...results);
      } else {
        const d1 = Math.floor(Math.random() * 20) + 1;
        const d2 = Math.floor(Math.random() * 20) + 1;
        results = [d1, d2];
        finalValue = Math.min(d1, d2);
      }

      const total = finalValue + bonus;
      setCurrentRoll(total);
      addLog(`[${label}] DADOS: [${results.join(', ')}] | BÔNUS: +${bonus}`, "system");
      addLog(`RESULTADO FINAL: [${total}]`, "roll");
      
      setTimeout(() => {
        setIsRolling(false);
      }, 1500);
    }, 1200);
  };

  const tabs = [
    { id: 'DASHBOARD', icon: Cpu },
    { id: 'SKILLS', icon: Zap },
    { id: 'INVENTORY', icon: Box },
    { id: 'DATABASE', icon: Database },
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      minHeight: '100vh'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderHUD 
          name="K41-Z3N" 
          reputation="SURVIVOR" 
          level={level}
          xp={xp}
          maxXp={maxXp}
          points={points}
          ca={armorClass}
        />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Main Content Area */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cyber-button ${activeTab === tab.id ? 'active' : ''}`}
                style={{ 
                  flex: 1, 
                  fontSize: '0.7rem',
                  background: activeTab === tab.id ? 'var(--neon-cyan)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--bg-dark)' : 'var(--neon-cyan)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <tab.icon size={14} />
                  {tab.id}
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'DASHBOARD' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatusBars 
                  health={maxPS - 5} maxHealth={maxPS} 
                  sanity={maxSAN - 2} maxSanity={maxSAN}
                  mentalRes={mentalRes}
                  stamina={maxPE} maxStamina={maxPE}
                />
                <AttributeGrid 
                  attributes={attributes} 
                  skills={skillBonuses}
                  availablePA={points.PA}
                  onUpgrade={handleUpgradeAttribute}
                  onRoll={(label) => rollDice(20, label)} 
                />
              </motion.div>
            )}
            
            {activeTab === 'SKILLS' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ height: 'calc(100vh - 350px)' }}
              >
                <SkillsPanel 
                  skills={skillBonuses}
                  availablePP={points.PP}
                  availablePT={points.PT}
                  talents={talents}
                  onUpgradeSkill={handleUpgradeSkill}
                  onAddTalent={handleAddTalent}
                  onRoll={(label, attrs) => rollDice(20, label, attrs)}
                />
              </motion.div>
            )}
            
            {activeTab === 'INVENTORY' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <InventoryGrid />
              </motion.div>
            )}

            {activeTab === 'DATABASE' && (
              <motion.div
                key="database"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '3rem' }}
                className="cyber-panel"
              >
                <h2 className="header-futuristic" style={{ fontSize: '1rem' }}>MÓDULO [DATABASE] EM MANUTENÇÃO</h2>
                <p className="text-mono" style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>ACESSO RESTRITO / NIVEL 4 / Anth_OS</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sidebar Log / Dice Roller */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="cyber-panel cyber-panel-pink"
           style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}
        >
          <h3 className="header-futuristic" style={{ fontSize: '0.8rem', color: 'var(--neon-pink)', marginBottom: '1rem' }}>CONSOLE_LOG</h3>
          
          <AnimatePresence>
            {(isRolling || currentRoll) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ marginBottom: '1rem' }}
              >
                <CyberDie 
                  rolling={isRolling && !currentRoll} 
                  value={currentRoll} 
                  sides={20} // Dashboard sempre usa d20
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-mono" style={{ 
            fontSize: '0.7rem', 
            flex: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '400px'
          }}>
            {logs.map(log => (
              <div key={log.id} style={{ color: log.type === 'system' ? 'var(--neon-pink)' : 'var(--neon-cyan)' }}>
                {`> ${log.text}`}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button 
              className="cyber-button" 
              onClick={() => rollDice(20)}
              disabled={isRolling}
              style={{ 
                width: '100%', 
                borderColor: 'var(--neon-pink)', 
                color: 'var(--neon-pink)',
                opacity: isRolling ? 0.5 : 1,
                cursor: isRolling ? 'not-allowed' : 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              {isRolling ? 'ROLLING...' : 'RUN_D20_ROLL'}
            </button>
            <button 
              className="cyber-button" 
              onClick={() => handleGainXp(100)}
              style={{ 
                width: '100%', 
                borderColor: 'var(--neon-cyan)', 
                color: 'var(--neon-cyan)',
                fontSize: '0.6rem'
              }}
            >
              TEST_GAIN_100_XP
            </button>
          </div>
        </motion.div>
      </div>

      <footer style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.5 }}>
        <p className="text-mono" style={{ fontSize: '0.6rem' }}>
          CYBER_SHEET v1.0.4 // Anth_OS
        </p>
      </footer>
    </div>
  );
}

export default App;
