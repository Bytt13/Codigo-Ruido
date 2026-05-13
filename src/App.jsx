import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderHUD } from './components/HeaderHUD';
import { StatusBars } from './components/StatusBars';
import { AttributeGrid } from './components/AttributeGrid';
import { InventoryGrid } from './components/InventoryGrid';
import { SkillsPanel } from './components/SkillsPanel';
import { CyberDie } from './components/CyberDie';
import { RulesPanel } from './components/RulesPanel';
import * as Formulas from './utils/formulas';
import { Terminal, Database, Box, Cpu, Zap, History, Users, Target, Shield, Eye, Plus, Star, Package, Share2, User, BookOpen } from 'lucide-react';
import { Modal } from './components/Modal';
import { TalentTree } from './components/TalentTree';


const LEVEL_REWARDS = {
  1:  { PA: 2, PP: 10, PT: 0 },
  2:  { PA: 1, PP: 3,  PT: 2 },
  3:  { PA: 1, PP: 3,  PT: 3 },
  4:  { PA: 0, PP: 2,  PT: 2 },
  5:  { PA: 0, PP: 2,  PT: 2 },
  6:  { PA: 1, PP: 3,  PT: 3 },
  7:  { PA: 0, PP: 2,  PT: 2 },
  8:  { PA: 0, PP: 2,  PT: 2 },
  9:  { PA: 1, PP: 3,  PT: 3 },
  10: { PA: 1, PP: 3,  PT: 3 },
  11: { PA: 0, PP: 2,  PT: 2 },
  12: { PA: 1, PP: 3,  PT: 3 },
  13: { PA: 0, PP: 2,  PT: 2 },
  14: { PA: 0, PP: 2,  PT: 2 },
  15: { PA: 1, PP: 3,  PT: 3 },
  16: { PA: 0, PP: 2,  PT: 2 },
  17: { PA: 0, PP: 2,  PT: 2 },
  18: { PA: 1, PP: 3,  PT: 3 },
  19: { PA: 0, PP: 2,  PT: 2 },
  20: { PA: 1, PP: 3,  PT: 3 },
};

function App() {
  const [hasCharacter, setHasCharacter] = useState(false);
  const [activeTab, setActiveTab] = useState('DATABASE');
  const [commandInput, setCommandInput] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGenesisPointsModalOpen, setIsGenesisPointsModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ name: '', password: '', startingLevel: 1 });

  const [currentUser, setCurrentUser] = useState(null);

  const [editingContactId, setEditingContactId] = useState(null);



  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [maxXp, setMaxXp] = useState(1000);
  const [points, setPoints] = useState({ PA: 0, PP: 0, PT: 0 });
  const [talents, setTalents] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [numDice, setNumDice] = useState(1);
  const [rollResult, setRollResult] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // Bio Data
  const [bio, setBio] = useState({
    history: '',
    objective: '',
    affiliation: '',
    appearance: '',
    relations: []
  });

  
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
    { id: 2, text: "BEM-VINDO A AVERNUS, SOBREVIVENTE.", type: "system" }
  ]);

  // --- Persistence Logic ---
  
  // Auto-save whenever relevant state changes
  React.useEffect(() => {
    if (hasCharacter && currentUser) {
      const charData = {
        level, xp, points, attributes, skillBonuses, talents, bio
      };
      const key = `avernus_char_${currentUser.name}_${currentUser.password}`;
      localStorage.setItem(key, JSON.stringify(charData));
      localStorage.setItem('avernus_active_session', JSON.stringify(currentUser));
    }
  }, [hasCharacter, currentUser, level, xp, points, attributes, skillBonuses, talents, bio]);

  // Auto-load on mount
  React.useEffect(() => {
    const session = localStorage.getItem('avernus_active_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      const key = `avernus_char_${parsedSession.name}_${parsedSession.password}`;
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const data = JSON.parse(savedData);
        setCurrentUser(parsedSession);
        setLevel(data.level);
        setXp(data.xp);
        setPoints(data.points);
        setAttributes(data.attributes);
        setSkillBonuses(data.skillBonuses);
        setTalents(data.talents);
        setBio(data.bio);
        setHasCharacter(true);
        setActiveTab('DASHBOARD');
        addLog(`SESSÃO RESTAURADA: BEM-VINDO DE VOLTA, ${parsedSession.name.toUpperCase()}.`, "system");
      }
    }
  }, []);

  const handleLogin = () => {
    if (!loginData.name.trim() || !loginData.password.trim()) {
      addLog("ERRO: NOME E PALAVRA-CHAVE SÃO OBRIGATÓRIOS.", "error");
      return;
    }

    const key = `avernus_char_${loginData.name}_${loginData.password}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
      const data = JSON.parse(savedData);
      setLevel(data.level);
      setXp(data.xp);
      setPoints(data.points);
      setAttributes(data.attributes);
      setSkillBonuses(data.skillBonuses);
      setTalents(data.talents);
      setBio(data.bio);
      addLog(`ACESSO CONCEDIDO: DADOS CARREGADOS PARA ${loginData.name.toUpperCase()}.`, "system");
    } else {
      // Calculate cumulative starting points for new character
      let startPA = 0, startPP = 0, startPT = 0;
      for (let i = 1; i <= loginData.startingLevel; i++) {
        const r = LEVEL_REWARDS[i];
        startPA += r.PA;
        startPP += r.PP;
        startPT += r.PT;
      }
      
      setLevel(loginData.startingLevel);
      setXp(0);
      setPoints({ PA: startPA, PP: startPP, PT: startPT });
      addLog(`GÊNESE INICIADA: NOVO REGISTRO NÍVEL ${loginData.startingLevel} PARA ${loginData.name.toUpperCase()}.`, "system");
      addLog(`PONTOS INICIAIS: ${startPA} PA, ${startPP} PP, ${startPT} PT`, "system");
      setIsGenesisPointsModalOpen(true);
    }



    setCurrentUser({ ...loginData });
    setHasCharacter(true);
    setIsLoginModalOpen(false);
    setActiveTab('DASHBOARD');
  };

  const handleLogout = () => {
    localStorage.removeItem('avernus_active_session');
    setHasCharacter(false);
    setCurrentUser(null);
    setActiveTab('DATABASE');
    addLog("SESSÃO ENCERRADA. CONEXÃO SEGURA.", "system");
  };


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
    const newXpTotal = xp + amount;
    
    if (newXpTotal >= maxXp) {
      const remainingXp = newXpTotal - maxXp;
      const nextLevel = level + 1;
      const reward = LEVEL_REWARDS[nextLevel] || { PA: 0, PP: 2, PT: 2 };
      
      setLevel(nextLevel);
      setXp(remainingXp);
      setPoints(prev => ({
        PA: prev.PA + reward.PA,
        PP: prev.PP + reward.PP,
        PT: prev.PT + reward.PT
      }));
      
      addLog(`SISTEMA ATUALIZADO: NÍVEL ${nextLevel} ALCANÇADO!`, "system");
      addLog(`RECOMPENSAS: +${reward.PA} PA, +${reward.PP} PP, +${reward.PT} PT`, "system");
    } else {
      setXp(newXpTotal);
    }
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
    
    let attrLevel = 1;
    if (linkedAttrs.length > 0) {
      const values = linkedAttrs.map(a => attributes[a] || 0);
      attrLevel = Math.max(...values);
    } else if (attributes[label] !== undefined) {
      attrLevel = attributes[label];
    }
    
    const bonus = skillBonuses[label] || 0;
    const currentNumDice = attrLevel > 0 ? attrLevel : 2; // 2 para desvantagem (attr 0)
    
    setIsRolling(true);
    setNumDice(currentNumDice);
    setRollResult(null);
    addLog(`EXECUTANDO SOFTWARE [${label}]: ${attrLevel > 0 ? `${attrLevel}d20` : '2d20 (DESV.)'}...`, "system");
    
    setTimeout(() => {
      let results = [];
      let finalValue = 0;
      let discardIndices = [];

      if (attrLevel > 0) {
        for (let i = 0; i < attrLevel; i++) {
          results.push(Math.floor(Math.random() * 20) + 1);
        }
        finalValue = Math.max(...results);
        const maxIdx = results.indexOf(finalValue);
        discardIndices = results.map((_, i) => i).filter(i => i !== maxIdx);
      } else {
        const d1 = Math.floor(Math.random() * 20) + 1;
        const d2 = Math.floor(Math.random() * 20) + 1;
        results = [d1, d2];
        finalValue = Math.min(d1, d2);
        const maxIdx = results.indexOf(Math.max(d1, d2));
        discardIndices = [maxIdx];
      }

      const total = finalValue + bonus;
      setRollResult({ results, finalValue, bonus, total, discardIndices });
      addLog(`[${label}] DADOS: [${results.join(', ')}] | BÔNUS: +${bonus}`, "system");
      addLog(`RESULTADO FINAL: [${total}]`, "roll");
      
      setTimeout(() => {
        setIsRolling(false);
      }, 600); // Reduzido de 1500ms
    }, 600); // Reduzido de 1200ms
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      if (commandInput.trim().toLowerCase() === '/reset') {
        setHasCharacter(false);
        setActiveTab('DATABASE');
        setLevel(1);
        setXp(0);
        setPoints({ PA: 0, PP: 0, PT: 0 });
        setAttributes({ FOR: 1, DES: 1, AGI: 1, VIG: 1, INT: 1, EXP: 0, CAR: 1 });
        setTalents([]);
        setSkillBonuses({
          'Atletismo': 0, 'Acrobacia': 0, 'Prestidigitação': 0, 'Furtividade': 0,
          'Dirigir': 0, 'Reflexos': 2, 'Iniciativa': 3, 'Fortitude': 0,
          'Tecnologia': 5, 'Ciências': 0, 'História': 0, 'Geografia': 0,
          'Tática': 0, 'Medicina': 0, 'Investigação': 0, 'Percepção': 0,
          'Intuição': 0, 'Malandragem': 0, 'Manipulação': 0, 'Intimidação': 0
        });
        handleLogout();
        addLog("SISTEMA REINICIADO. TODOS OS REGISTROS FORAM APAGADOS.", "system");
      }

      setCommandInput('');
    }
  };

  const updateBio = (field, value) => {
    setBio(prev => ({ ...prev, [field]: value }));
  };

  const addRelation = () => {
    const newRelation = {
      id: Date.now(),
      name: 'NOVO_CONTATO',
      description: '',
      photo: null,
      type: 'CONHECIDO'
    };
    setBio(prev => ({ ...prev, relations: [...prev.relations, newRelation] }));
  };

  const updateRelation = (id, field, value) => {
    setBio(prev => ({
      ...prev,
      relations: prev.relations.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const removeRelation = (id) => {
    setBio(prev => ({
      ...prev,
      relations: prev.relations.filter(r => r.id !== id)
    }));
    setEditingContactId(null);
  };
  const handleBuyTalent = (talent) => {
    // Conta quantas vezes já possui este talento (nível atual)
    const currentLevel = talents.filter(id => id === talent.id).length;
    
    // Talentos de bônus progressivo (+5/10/15) podem ser comprados até 3 vezes
    const isProgressive = talent.description.includes('+5/10/15');
    const maxLevel = isProgressive ? 3 : 1;

    if (currentLevel < maxLevel) {
      // Custo aumenta em 1 para cada nível extra
      const dynamicCost = talent.cost + currentLevel;
      
      if (points.PT >= dynamicCost) {
        setPoints(prev => ({ ...prev, PT: prev.PT - dynamicCost }));
        setTalents(prev => [...prev, talent.id]);
        addLog(`PROTOCOLO ATUALIZADO: ${talent.name.toUpperCase()} (NÍVEL ${currentLevel + 1}).`, "system");
      } else {
        addLog(`ERRO: PONTOS DE TALENTO (PT) INSUFICIENTES. NECESSÁRIO: ${dynamicCost} PT.`, "error");
      }
    }
  };



  const tabs = [
    { id: 'DASHBOARD', icon: Cpu },
    { id: 'SKILLS', icon: Zap },
    { id: 'TALENTS', icon: Star },
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
          name={currentUser?.name || "K41-Z3N"} 
          reputation="SURVIVOR" 
          level={level}
          xp={xp}
          maxXp={maxXp}
          points={points}
          ca={armorClass}
        />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
        {/* Main Content Area */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {tabs.map(tab => {
              const isLocked = !hasCharacter && tab.id !== 'DATABASE';
              return (
                <button
                  key={tab.id}
                  onClick={() => !isLocked && setActiveTab(tab.id)}
                  className={`cyber-button ${activeTab === tab.id ? 'active' : ''}`}
                  style={{ 
                    flex: 1, 
                    fontSize: '0.7rem',
                    color: activeTab === tab.id ? 'var(--neon-cyan)' : (isLocked ? 'var(--text-dim)' : 'var(--neon-cyan)'),
                    opacity: isLocked ? 0.5 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    borderColor: isLocked ? 'var(--text-dim)' : 'var(--neon-cyan)',
                  }}

                  disabled={isLocked}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <tab.icon size={14} />
                    {tab.id}
                  </div>
                </button>
              );
            })}
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

            {activeTab === 'TALENTS' && (
                  <TalentTree 
                    acquiredTalents={talents}
                    onBuyTalent={handleBuyTalent}
                    ptPoints={points.PT}
                    attributes={attributes}
                  />
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
                {!hasCharacter ? (
                  <>
                    <h2 className="header-futuristic" style={{ fontSize: '1.2rem', color: 'var(--neon-pink)' }}>ACESSO NEGADO: NENHUM REGISTRO ENCONTRADO</h2>
                    <p className="text-mono" style={{ color: 'var(--text-dim)', margin: '1.5rem 0' }}>
                      INICIALIZE O PROTOCOLO DE GÊNESE PARA ACESSAR OS SISTEMAS DE AVERNUS.
                    </p>
                    <button 
                      className="cyber-button glitch-hover"
                      onClick={() => setIsLoginModalOpen(true)}
                      style={{ 
                        fontSize: '1rem', 
                        padding: '1rem 2rem', 
                        borderColor: 'var(--neon-pink)', 
                        color: 'var(--neon-pink)' 
                      }}
                    >
                      CRIAR OU CARREGAR PERSONAGEM [GÊNESE]
                    </button>
                  </>

                ) : (
                  <>
                    <h2 className="header-futuristic" style={{ fontSize: '1rem' }}>MÓDULO [DATABASE] ATIVO</h2>
                    <p className="text-mono" style={{ color: 'var(--text-dim)', margin: '1rem 0 2rem 0' }}>SISTEMA DE ARQUIVOS BIOMÉTRICOS E HISTÓRICOS</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                      {[
                        { id: 'history', label: 'HISTÓRIA', icon: History },
                        { id: 'relations', label: 'RELAÇÕES', icon: Users },
                        { id: 'objective', label: 'OBJETIVO', icon: Target },
                        { id: 'affiliation', label: 'AFILIAÇÃO', icon: Shield },
                        { id: 'appearance', label: 'APARÊNCIA', icon: Eye },
                        { id: 'regras', label: 'REGRAS', icon: BookOpen },
                      ].map(item => (
                        <button 
                          key={item.id}
                          className="cyber-button"
                          onClick={() => setActiveModal(item.id)}
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            padding: '1.5rem',
                            gap: '0.8rem'
                          }}
                        >
                          <item.icon size={24} />
                          <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div style={{ padding: '1.5rem', border: '1px solid var(--neon-cyan)', display: 'inline-block', background: 'rgba(0, 243, 255, 0.05)', width: '100%' }}>
                      <p className="text-mono" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>REGISTRO_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      <p className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>STATUS: ONLINE</p>
                    </div>
                  </>
                )}
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
            {(isRolling || rollResult) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}
              >
                {isRolling ? (
                  // Enquanto rola, mostra a quantidade correta de slots processando
                  Array.from({ length: numDice }).map((_, i) => (
                    <CyberDie key={i} rolling={true} value={null} />
                  ))
                ) : (
                  // Mostra todos os resultados, marcando os descartados
                  rollResult?.results.map((val, idx) => (
                    <CyberDie 
                      key={idx} 
                      rolling={false} 
                      value={val} 
                      discarded={rollResult.discardIndices.includes(idx)}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-mono" style={{ 
            fontSize: '0.8rem', 
            flex: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            maxHeight: '220px'
          }}>
            {logs.map(log => (
              <div 
                key={log.id} 
                style={{ 
                  color: log.type === 'system' ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                  fontSize: log.type === 'roll' ? '1.1rem' : '0.8rem',
                  fontWeight: log.type === 'roll' ? '900' : 'normal',
                  padding: log.type === 'roll' ? '6px 8px' : '2px',
                  margin: log.type === 'roll' ? '4px 0' : '0',
                  background: log.type === 'roll' ? 'rgba(0, 243, 255, 0.05)' : 'transparent',
                  borderLeft: log.type === 'roll' ? '3px solid var(--neon-cyan)' : 'none',
                  textShadow: 'none',
                  letterSpacing: log.type === 'roll' ? '1px' : 'normal'
                }}
              >
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

          <div style={{ marginTop: '1rem', position: 'relative' }}>
            <Terminal size={12} color="var(--neon-cyan)" style={{ position: 'absolute', left: '8px', top: '10px' }} />
            <input 
              type="text" 
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleCommand}
              placeholder="DIGITE UM COMANDO..."
              className="text-mono"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                padding: '0.5rem 0.5rem 0.5rem 1.8rem',
                fontSize: '0.7rem',
                outline: 'none'
              }}
            />
          </div>

        </motion.div>
      </div>

      {/* Modals for Bio Section */}
      <Modal 
        isOpen={activeModal === 'history'} 
        onClose={() => setActiveModal(null)} 
        title="ARQUIVOS_DE_MEMÓRIA [HISTÓRIA]"
      >
        <textarea 
          value={bio.history}
          onChange={(e) => updateBio('history', e.target.value)}
          placeholder="REGISTRE AQUI OS EVENTOS QUE MOLDARAM SUA EXISTÊNCIA EM AVERNUS..."
          className="text-mono"
          style={{
            width: '100%',
            height: '300px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            padding: '1rem',
            outline: 'none',
            resize: 'none'
          }}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'objective'} 
        onClose={() => setActiveModal(null)} 
        title="DIRETRIZES_PRIORITÁRIAS [OBJETIVO]"
      >
        <textarea 
          value={bio.objective}
          onChange={(e) => updateBio('objective', e.target.value)}
          placeholder="QUAL É O SEU PROPÓSITO FINAL NESTA CIDADE MORIBUNDA?"
          className="text-mono"
          style={{
            width: '100%',
            height: '200px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            padding: '1rem',
            outline: 'none',
            resize: 'none'
          }}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'affiliation'} 
        onClose={() => setActiveModal(null)} 
        title="CONEXÕES_CORPORATIVAS [AFILIAÇÃO]"
      >
        <textarea 
          value={bio.affiliation}
          onChange={(e) => updateBio('affiliation', e.target.value)}
          placeholder="A QUEM VOCÊ RESPONDE? CORPORAÇÕES? GANGUES? OU APENAS A SI MESMO?"
          className="text-mono"
          style={{
            width: '100%',
            height: '200px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--neon-cyan)',
            color: 'var(--neon-cyan)',
            padding: '1rem',
            outline: 'none',
            resize: 'none'
          }}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'appearance'} 
        onClose={() => setActiveModal(null)} 
        title="SCANNER_BIOMÉTRICO [APARÊNCIA]"
      >
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: '200px', border: '1px dashed var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={48} color="rgba(0, 243, 255, 0.2)" />
          </div>
          <textarea 
            value={bio.appearance}
            onChange={(e) => updateBio('appearance', e.target.value)}
            placeholder="DESCREVA SUAS CARACTERÍSTICAS FÍSICAS E MODIFICAÇÕES CIBERNÉTICAS VISÍVEIS..."
            className="text-mono"
            style={{
              width: '100%',
              height: '150px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              padding: '1rem',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>
      </Modal>

        <Modal 
          isOpen={activeModal === 'relations'} 
          onClose={() => setActiveModal(null)} 
          title="REDE_DE_CONTATOS [RELAÇÕES]"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button 
              className="cyber-button" 
              onClick={() => {
                const id = Date.now();
                const newRelation = {
                  id: id,
                  name: 'NOVO_CONTATO',
                  description: '',
                  photo: null,
                  type: 'CONHECIDO'
                };
                setBio(prev => ({ ...prev, relations: [...prev.relations, newRelation] }));
                setEditingContactId(id);
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} /> REGISTRAR NOVO CONTATO
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {bio.relations.map(rel => (
                <div 
                  key={rel.id} 
                  className="cyber-panel" 
                  onClick={() => setEditingContactId(rel.id)}
                  style={{ 
                    padding: '1rem', 
                    cursor: 'pointer', 
                    borderStyle: 'dashed',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    background: 'rgba(0, 243, 255, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '100%', height: '80px', border: '1px solid var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                    {rel.photo ? <img src={rel.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={24} opacity={0.3} />}
                  </div>
                  <div className="header-futuristic" style={{ fontSize: '0.7rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rel.name}</div>
                  <div className="text-mono" style={{ fontSize: '0.5rem', textAlign: 'center', color: 'var(--neon-pink)' }}>{rel.type}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        <Modal 
          isOpen={activeModal === 'regras'} 
          onClose={() => setActiveModal(null)} 
          title="DATABASE_LOCAL [MANUAL_DE_REGRAS]"
          width="95vw"
          height="92vh"
        >
          <div style={{ height: '82vh' }}>
            <RulesPanel />
          </div>
        </Modal>

        {/* Modal de Detalhes do Contato */}
        <Modal
          isOpen={editingContactId !== null}
          onClose={() => setEditingContactId(null)}
          title={`REGISTRO_BIOMÉTRICO: ${bio.relations.find(r => r.id === editingContactId)?.name || 'CONTATO'}`}
        >
          {editingContactId && (() => {
            const rel = bio.relations.find(r => r.id === editingContactId);
            if (!rel) return null;
            return (
              <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
                  {/* Foto e Tipo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: '150px', height: '150px', border: '2px solid var(--neon-cyan)', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.6)' }}>
                      {rel.photo ? (
                        <img src={rel.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={48} opacity={0.2} />
                        </div>
                      )}
                      <input 
                        type="text" 
                        placeholder="URL_DA_FOTO"
                        value={rel.photo || ''}
                        onChange={(e) => updateRelation(rel.id, 'photo', e.target.value)}
                        className="text-mono"
                        style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.8)', border: 'none', color: 'var(--neon-cyan)', fontSize: '0.5rem', padding: '4px', outline: 'none' }}
                      />
                    </div>
                    
                    <select 
                      value={rel.type}
                      onChange={(e) => updateRelation(rel.id, 'type', e.target.value)}
                      style={{ background: 'var(--bg-dark)', color: 'var(--neon-pink)', border: '1px solid var(--neon-pink)', padding: '5px', fontSize: '0.8rem', outline: 'none' }}
                      className="text-mono"
                    >
                      <option value="CONHECIDO">CONHECIDO</option>
                      <option value="ALIADO">ALIADO</option>
                      <option value="RIVAL">RIVAL</option>
                      <option value="INIMIGO">INIMIGO</option>
                    </select>

                    <button 
                      className="cyber-button" 
                      onClick={() => removeRelation(rel.id)}
                      style={{ borderColor: '#ff0055', color: '#ff0055', fontSize: '0.6rem', marginTop: 'auto' }}
                    >
                      DELETAR_REGISTRO
                    </button>
                  </div>

                  {/* Informações Textuais */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="header-futuristic" style={{ fontSize: '0.7rem' }}>NOME_OU_ALIAS</label>
                      <input 
                        type="text"
                        value={rel.name}
                        onChange={(e) => updateRelation(rel.id, 'name', e.target.value.toUpperCase())}
                        className="text-mono"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', padding: '0.5rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                      <label className="header-futuristic" style={{ fontSize: '0.7rem' }}>DOSSIÊ_DE_RELAÇÃO</label>
                      <textarea 
                        value={rel.description}
                        onChange={(e) => updateRelation(rel.id, 'description', e.target.value)}
                        placeholder="NOTAS DETALHADAS SOBRE HISTÓRICO, ENCONTROS E DÍVIDAS..."
                        className="text-mono"
                        style={{ 
                          width: '100%', 
                          height: '250px', 
                          background: 'rgba(0,0,0,0.4)', 
                          border: '1px solid var(--neon-cyan)', 
                          color: 'var(--text-main)', 
                          padding: '1rem', 
                          outline: 'none', 
                          resize: 'none',
                          fontSize: '0.8rem',
                          lineHeight: '1.4'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>

      {/* Login / Genesis Modal */}
      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        title="PROTOCOLO_GÊNESE [LOGIN]"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            INSIRA SUAS CREDENCIAIS PARA RECUPERAR UM REGISTRO EXISTENTE OU CRIAR UM NOVO.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="header-futuristic" style={{ fontSize: '0.7rem' }}>NOME_DO_PERSONAGEM</label>
            <input 
              type="text"
              value={loginData.name}
              onChange={(e) => setLoginData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
              placeholder="EX: K41-Z3N"
              className="text-mono"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                padding: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="header-futuristic" style={{ fontSize: '0.7rem' }}>PALAVRA_DE_GÊNESE (SENHA)</label>
            <input 
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="UMA PALAVRA QUE O RESUMA..."
              className="text-mono"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                padding: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="header-futuristic" style={{ fontSize: '0.7rem' }}>NÍVEL_INICIAL (PARA NOVOS REGISTROS)</label>
            <input 
              type="number"
              min="1"
              max="20"
              value={loginData.startingLevel}
              onChange={(e) => setLoginData(prev => ({ ...prev, startingLevel: parseInt(e.target.value) || 1 }))}
              className="text-mono"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                padding: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          <button 
            className="cyber-button glitch-hover"

            onClick={handleLogin}
            style={{ 
              marginTop: '1rem',
              padding: '1rem',
              borderColor: 'var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              fontSize: '1rem'
            }}
          >
            AUTENTICAR_SISTEMA
          </button>
        </div>
      </Modal>
      {/* Genesis Point Spending Modal */}
      <Modal 
        isOpen={isGenesisPointsModalOpen} 
        onClose={() => setIsGenesisPointsModalOpen(false)} 
        title="DISTRIBUIÇÃO_DE_RECURSOS_INICIAIS"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '80vh', overflowY: 'auto', paddingRight: '1rem' }}>
          <p className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>
            VOCÊ POSSUI PONTOS ACUMULADOS ATÉ O NÍVEL {level}. DISTRIBUA-OS ABAIXO ANTES DE ACESSAR O DASHBOARD.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Attributes Section */}
            <div className="cyber-panel" style={{ padding: '1rem' }}>
              <h3 className="header-futuristic" style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--neon-pink)', textShadow: 'none' }}>ATRIBUTOS [PA: {points.PA}]</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.keys(attributes).map(attr => (
                  <div key={attr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', border: '1px solid rgba(0,243,255,0.1)' }}>
                    <span className="text-mono" style={{ fontSize: '0.8rem' }}>{attr}: {attributes[attr]}</span>
                    <button 
                      className="cyber-button" 
                      onClick={() => handleUpgradeAttribute(attr)}
                      disabled={points.PA < Formulas.getPACost(attributes[attr])}
                      style={{ padding: '2px 8px', fontSize: '0.6rem', minWidth: '60px' }}
                    >
                      +{Formulas.getPACost(attributes[attr])} PA
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="cyber-panel" style={{ padding: '1rem' }}>
              <h3 className="header-futuristic" style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--neon-cyan)', textShadow: 'none' }}>PERÍCIAS [PP: {points.PP}]</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                {Object.keys(skillBonuses).map(skill => (
                  <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', border: '1px solid rgba(0,243,255,0.1)' }}>
                    <span className="text-mono" style={{ fontSize: '0.7rem' }}>{skill}: +{skillBonuses[skill]}</span>
                    <button 
                      className="cyber-button" 
                      onClick={() => handleUpgradeSkill(skill)}
                      disabled={points.PP < Formulas.getPPCost(skillBonuses[skill])}
                      style={{ padding: '2px 8px', fontSize: '0.6rem', minWidth: '60px' }}
                    >
                      +{Formulas.getPPCost(skillBonuses[skill])} PP
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            className="cyber-button glitch-hover"
            onClick={() => setIsGenesisPointsModalOpen(false)}
            style={{ 
              marginTop: '1rem',
              padding: '1.2rem',
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)',
              fontSize: '1rem',
              background: 'rgba(255,0,85,0.1)',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}
          >
            FINALIZAR_CARREGAMENTO_DE_DADOS
          </button>
        </div>
      </Modal>

      <footer style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.5 }}>

        <p className="text-mono" style={{ fontSize: '0.6rem' }}>
          CYBER_SHEET v1.0.4 // Anth_OS
        </p>
      </footer>
    </div>
  );
}

export default App;
