import React, { useState } from 'react';
import { Search, BookOpen, Shield, Zap, Crosshair, Cpu, Users, ChevronRight } from 'lucide-react';

const RULES_DATA = [
  {
    title: "ATRIBUTOS BÁSICOS",
    icon: Cpu,
    content: `Os Atributos são a base do seu personagem. Eles definem suas capacidades naturais e físicas.
    
    • FOR (Força): Poder bruto, dano corpo a corpo e peso.
    • DES (Destreza): Precisão, equilíbrio e manuseio de armas leves.
    • AGI (Agilidade): Velocidade de movimento, esquiva e reflexos.
    • VIG (Vigor): Resistência física, saúde (PS) e armadura natural (CA).
    • INT (Inteligência): Raciocínio, hacking e conhecimentos técnicos.
    • EXP (Espírito): Força de vontade, resistência mental (SAN) e carisma técnico.
    • CAR (Carisma): Influência social, lábia e conexões.`
  },
  {
    title: "SISTEMA DE COMBATE",
    icon: Crosshair,
    content: `O combate em Avernus é rápido e brutal. Cada turno permite uma Ação e um Movimento.
    
    • Ataques: Role 1d20 + Atributo Relacionado + Bônus de Perícia.
    • Defesa (CA): O atacante deve igualar ou superar sua Classe de Armadura.
    • Reação: Você pode gastar Pontos de Esforço (PE) para realizar reações táticas ou esquivas.
    • Dano: Se o ataque atingir, role os dados da arma e subtraia dos Pontos de Saúde (PS) do alvo.`
  },
  {
    title: "RECURSOS VITAIS",
    icon: Shield,
    content: `Seus recursos definem quanto tempo você aguenta na rua.
    
    • PS (Pontos de Saúde): Se chegar a 0, você entra em estado crítico. Calculado como (VIG * 5) + 10.
    • PE (Pontos de Esforço): Usados para habilidades especiais e reações. Calculado como (INT + VIG) * 2.
    • SAN (Sanidade): Sua estabilidade mental. Traumas e horrores reduzem este valor.
    • CA (Classe de Armadura): Sua proteção contra danos. Base 10 + Bônus de Atributo.`
  },
  {
    title: "EVOLUÇÃO E TALENTOS",
    icon: Zap,
    content: `Ao ganhar XP, você sobe de nível e recebe pontos para investir.
    
    • PA (Pontos de Atributo): Aumentam seus atributos base.
    • PP (Pontos de Perícia): Treinam softwares e conhecimentos específicos.
    • PT (Pontos de Talento): Instalam protocolos neurais e truques sujos.
    
    Talentos de bônus progressivo (+5/10/15) podem ser evoluídos até o Nível 3, custando +1 PT por nível adicional.`
  }
];

export function RulesPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const filteredRules = RULES_DATA.filter(rule => 
    rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar with topics */}
      <div className="cyber-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--neon-cyan)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="PESQUISAR_DATABASE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-mono"
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              padding: '0.5rem 0.5rem 0.5rem 2.2rem',
              fontSize: '0.75rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredRules.map((rule, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTopic(rule)}
              className={`cyber-button ${selectedTopic?.title === rule.title ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1rem',
                textAlign: 'left',
                justifyContent: 'flex-start',
                borderColor: selectedTopic?.title === rule.title ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)',
                background: selectedTopic?.title === rule.title ? 'rgba(0, 243, 255, 0.1)' : 'transparent'
              }}
            >
              <rule.icon size={18} color={selectedTopic?.title === rule.title ? 'var(--neon-cyan)' : '#666'} />
              <div style={{ flex: 1 }}>
                <div className="header-futuristic" style={{ fontSize: '0.7rem', color: selectedTopic?.title === rule.title ? 'var(--neon-cyan)' : '#888' }}>
                  {rule.title}
                </div>
              </div>
              <ChevronRight size={14} color={selectedTopic?.title === rule.title ? 'var(--neon-cyan)' : '#333'} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="cyber-panel" style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'rgba(0,0,0,0.2)' }}>
        {selectedTopic ? (
          <div style={{ animation: 'glitch-anim 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <selectedTopic.icon size={32} color="var(--neon-cyan)" />
              <h1 className="header-futuristic" style={{ fontSize: '1.8rem', color: 'var(--neon-cyan)', textShadow: '0 0 10px var(--neon-cyan)' }}>
                {selectedTopic.title}
              </h1>
            </div>
            <div className="text-mono" style={{ 
              fontSize: '1rem', 
              color: '#ddd', 
              lineHeight: '1.8', 
              whiteSpace: 'pre-wrap',
              textAlign: 'justify'
            }}>
              {selectedTopic.content}
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            <BookOpen size={64} color="var(--neon-cyan)" />
            <div className="header-futuristic" style={{ marginTop: '1rem', fontSize: '1rem' }}>SELECIONE_UM_TÓPICO_PARA_LEITURA</div>
          </div>
        )}
      </div>
    </div>
  );
}
