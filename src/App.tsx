import React, { useState, useEffect, useRef } from 'react';

// --- TYPES & INTERFACES ---
export type AIProvider = 'LOCAL_OFFLINE' | 'CLAUDE' | 'OPENAI' | 'GROK' | 'OLLAMA';

export interface Message {
  id: string;
  sender: 'JIMMY' | 'USER';
  text: string;
  timestamp: string;
}

export interface TreeNode {
  id: string;
  title: string;
  type: 'TRUNK' | 'BRANCH' | 'LEAF';
  confidenceScore?: number;
  evidenceSource?: string;
  details?: string;
  children?: TreeNode[];
}

// --- SAMPLE BRANCHING TREE DATA ---
const MASTER_TREE_DATA: TreeNode = {
  id: 'root-5789',
  title: 'Maritime Transit Restrictions & Regional Energy Shock',
  type: 'TRUNK',
  details: 'Root Event: Unilateral exclusion zone rhetoric & transit friction in strategic strait.',
  children: [
    {
      id: 'branch-econ',
      title: 'Economic Adaptation & Freight Rate Shifts',
      type: 'BRANCH',
      details: 'Primary degree consequence: Insurance premiums and rerouting costs adjust.',
      children: [
        {
          id: 'leaf-econ-1',
          title: 'Container Premiums Surged +18.4% (Window 3)',
          type: 'LEAF',
          confidenceScore: 92,
          evidenceSource: 'Global Maritime Index & Feed Ingestion',
          details: 'Direct observation across Window 3. High multi-source corroboration.',
        },
        {
          id: 'leaf-econ-2',
          title: 'Alternative Rail & Air Freight Diversion',
          type: 'LEAF',
          confidenceScore: 68,
          evidenceSource: 'Trade Logistics Registry',
          details: 'Secondary adaptation: Importers shifting cargo to trans-continental rail.',
        },
      ],
    },
    {
      id: 'branch-mfg',
      title: 'Military Posture & Force Readiness',
      type: 'BRANCH',
      details: 'Primary degree consequence: Escalation ladder positioning across naval sectors.',
      children: [
        {
          id: 'leaf-mfg-1',
          title: 'Naval Exclusion Zone Rhetoric Issued (R1 Reversibility)',
          type: 'LEAF',
          confidenceScore: 84,
          evidenceSource: 'Regional Ministry Press Wire',
          details: 'Costly to reverse rhetoric, classified under Reversibility Level R1.',
        },
      ],
    },
  ],
};

// --- MAIN APPLICATION COMPONENT ---
export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GLOBE' | 'TREE' | 'TOWN_HALL' | 'SCORES'>('GLOBE');
  const [aiProvider, setAiProvider] = useState<AIProvider>('LOCAL_OFFLINE');
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Jimmy Assistant Chat State
  const [jimmyMessages, setJimmyMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'JIMMY',
      text: "System initialized. Enigma 5789 World Observer online. I'm Jimmy, your cognitive guide and neural forecasting engine. Grounded in OpenAlex scholarly indices and Wikidata entity graphs. What observation or hypothesis shall we evaluate?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [selectedLeaf, setSelectedLeaf] = useState<TreeNode | null>(null);

  // Town Hall State
  const [townHallSticker, setTownHallSticker] = useState<'🤖' | '👽' | '🦖' | '👾'>('🤖');
  const [townHallMessages, setTownHallMessages] = useState([
    { id: '1', alias: 'Observer_99', sticker: '👽', text: 'Window 3 maritime freight rates increased by 18.4%.', time: '14:20 CDT' },
    { id: '2', alias: 'Analyst_Alpha', sticker: '🦖', text: 'Reversibility remains R1. Strategic buffer intact.', time: '14:28 CDT' },
  ]);
  const [townHallInput, setTownHallInput] = useState<string>('');

  // 3D Globe Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- ANIMATED 3D GLOBE CANVAS RENDERER ---
  useEffect(() => {
    if (activeTab !== 'GLOBE') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;

    const renderGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 30;

      // Outer Space Background Glow
      const bgGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.3);
      bgGlow.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Base Sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude Grid Lines
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        const y = centerY + (i * radius) / 3;
        const rx = Math.sqrt(Math.max(0, radius * radius - ((i * radius) / 3) ** 2));
        ctx.ellipse(centerX, y, rx, rx * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Longitude Grid Lines (Rotating)
      rotationAngle += 0.008;
      for (let i = 0; i < 6; i++) {
        const angle = rotationAngle + (i * Math.PI) / 3;
        const rx = radius * Math.cos(angle);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.abs(rx), radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Simulated Kinetic & Event Pulse Markers (6-Color Palette)
      const points = [
        { lat: 0.2, lon: 0.5, color: '#ff3344', label: 'Kinetic Event' },
        { lat: -0.3, lon: 1.2, color: '#ffaa00', label: 'Political Event' },
        { lat: 0.5, lon: -0.8, color: '#00e5ff', label: 'Narrative Event' },
        { lat: -0.1, lon: -0.2, color: '#00ff66', label: 'Export (Buy)' },
        { lat: 0.4, lon: 1.8, color: '#3388ff', label: 'Import (Sell)' },
        { lat: -0.5, lon: -1.5, color: '#aa00ff', label: 'Strategic Trade' },
      ];

      points.forEach((pt) => {
        const px = centerX + radius * 0.7 * Math.cos(rotationAngle + pt.lon);
        const py = centerY + radius * 0.7 * Math.sin(pt.lat);

        // Pulse Ring
        ctx.beginPath();
        ctx.arc(px, py, 8 + Math.sin(rotationAngle * 4) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core Point
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.fill();
      });

      // Orbital Information Ring
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.15, radius * 0.35, -0.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(renderGlobe);
    };

    renderGlobe();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeTab]);

  // --- JIMMY AI INTERACTION ENGINE ---
  const handleJimmySend = () => {
    if (!userInput.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { id: String(Date.now()), sender: 'USER', text: userInput, timestamp: timeStr };
    const updated = [...jimmyMessages, newMsg];
    setJimmyMessages(updated);
    const query = userInput;
    setUserInput('');

    // Simulated local response or API routing
    setTimeout(() => {
      let replyText = '';
      if (aiProvider === 'LOCAL_OFFLINE') {
        replyText = `[Jimmy Offline Mode]: Hypothesis logged ("${query}"). Cross-referencing local ledger. Generated Kill Test: "Must observe zero port stagnation metrics within 30 days."`;
      } else {
        replyText = `[Jimmy via ${aiProvider}]: Analyzing hypothesis "${query}" against OpenAlex scholarly corpus and 3-track correlation metrics. Kill test established.`;
      }

      setJimmyMessages([
        ...updated,
        {
          id: String(Date.now() + 1),
          sender: 'JIMMY',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 850);
  };

  // --- TOWN HALL MESSAGE HANDLER ---
  const handleTownHallSend = () => {
    if (!townHallInput.trim()) return;
    const newEntry = {
      id: String(Date.now()),
      alias: `Analyst_${Math.floor(Math.random() * 900 + 100)}`,
      sticker: townHallSticker,
      text: townHallInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' CDT',
    };
    setTownHallMessages([...townHallMessages, newEntry]);
    setTownHallInput('');
  };

  // --- TREE RENDER HELPER ---
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isTrunk = node.type === 'TRUNK';
    const isLeaf = node.type === 'LEAF';

    return (
      <div key={node.id} style={{ marginLeft: `${depth * 20}px`, marginTop: '10px' }}>
        <div
          onClick={() => isLeaf && setSelectedLeaf(node)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: isTrunk ? '10px 16px' : '6px 12px',
            background: isTrunk ? '#1e1b4b' : isLeaf ? '#022c22' : '#0f172a',
            border: `1px solid ${isTrunk ? '#818cf8' : isLeaf ? '#34d399' : '#334155'}`,
            borderRadius: '6px',
            color: isTrunk ? '#c7d2fe' : isLeaf ? '#a7f3d0' : '#e2e8f0',
            cursor: isLeaf ? 'pointer' : 'default',
            boxShadow: isTrunk ? '0 0 12px rgba(129,140,248,0.3)' : 'none',
            fontSize: '12px',
          }}
        >
          <span>{isTrunk ? '🪵 TRUNK:' : isLeaf ? '🍃 LEAF:' : '🌿 BRANCH:'}</span>
          <strong>{node.title}</strong>
          {node.confidenceScore && (
            <span style={{ background: '#064e3b', color: '#6ee7b7', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
              {node.confidenceScore}% Score
            </span>
          )}
        </div>
        {node.children && node.children.map((child) => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ background: '#07090e', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER BAR */}
      <header style={{ background: '#0f172a', padding: '12px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 10px #00e5ff' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', letterSpacing: '1px' }}>ENIGMA 5789 // WORLD OBSERVER</h1>
            <span style={{ fontSize: '10px', color: '#38bdf8' }}>Cognitive Mentorship & Scenario Engine</span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'GLOBE', label: '🌐 3D Globe' },
            { id: 'TREE', label: '🌿 Scenario Tree' },
            { id: 'TOWN_HALL', label: '🏛️ Town Hall' },
            { id: 'SCORES', label: '📊 Scorecard' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? '#1e293b' : 'transparent',
                color: activeTab === tab.id ? '#00e5ff' : '#94a3b8',
                border: `1px solid ${activeTab === tab.id ? '#00e5ff' : '#334155'}`,
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{ background: '#1e293b', color: '#a855f7', border: '1px solid #a855f7', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '11px' }}
          >
            ⚙️ AI Config
          </button>
        </nav>
      </header>

      {/* AI SETTINGS MODAL */}
      {showSettings && (
        <div style={{ background: '#1e1b4b', padding: '15px 20px', borderBottom: '1px solid #818cf8', display: 'flex', gap: '15px', alignItems: 'center', fontSize: '12px' }}>
          <strong style={{ color: '#c7d2fe' }}>Jimmy BYO-AI Settings:</strong>
          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value as any)}
            style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px' }}
          >
            <option value="LOCAL_OFFLINE">Offline Local Engine</option>
            <option value="CLAUDE">Anthropic Claude 3.5</option>
            <option value="OPENAI">OpenAI ChatGPT (GPT-4o)</option>
            <option value="GROK">xAI Grok-Beta</option>
            <option value="OLLAMA">Local Ollama LLM</option>
          </select>
          {aiProvider !== 'LOCAL_OFFLINE' && (
            <input
              type="password"
              placeholder="Enter API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px', width: '200px' }}
            />
          )}
          <button onClick={() => setShowSettings(false)} style={{ background: '#34d399', color: '#000', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Save
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', padding: '15px', gap: '15px', overflow: 'hidden' }}>
        
        {/* TAB DISPLAY PANEL */}
        <main style={{ flex: 1, background: '#0f172a', borderRadius: '10px', border: '1px solid #1e293b', padding: '15px', overflowY: 'auto' }}>
          
          {/* 3D GLOBE VIEW */}
          {activeTab === 'GLOBE' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#00e5ff', fontSize: '14px' }}>WORLD OBSERVER // 3D TELEMETRY GLOBE</h3>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Windows W1–W5 Active (Central Time)</span>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#020617', borderRadius: '8px', border: '1px solid #1e293b', position: 'relative' }}>
                <canvas ref={canvasRef} width={420} height={320} style={{ maxWidth: '100%' }} />
              </div>

              {/* 6-COLOR LEGEND */}
              <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', background: '#020617', padding: '10px', borderRadius: '6px', fontSize: '10px' }}>
                <div><span style={{ color: '#ff3344' }}>●</span> Kinetic Event</div>
                <div><span style={{ color: '#ffaa00' }}>●</span> Political Event</div>
                <div><span style={{ color: '#00e5ff' }}>●</span> Narrative Event</div>
                <div><span style={{ color: '#00ff66' }}>●</span> Export (Buy)</div>
                <div><span style={{ color: '#3388ff' }}>●</span> Import (Sell)</div>
                <div><span style={{ color: '#aa00ff' }}>●</span> Strategic Trade</div>
              </div>
            </div>
          )}

          {/* SCENARIO TREE VIEW */}
          {activeTab === 'TREE' && (
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#a855f7', fontSize: '14px' }}>BRANCHING SCENARIO TREE // ADAPTATION PATHWAYS</h3>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '15px' }}>
                Click on leaf nodes to inspect raw evidence scores and falsification conditions.
              </p>
              {renderTreeNode(MASTER_TREE_DATA)}

              {selectedLeaf && (
                <div style={{ marginTop: '20px', background: '#020617', padding: '12px', borderRadius: '6px', border: '1px solid #34d399', fontSize: '11px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#34d399' }}>Evidence Inspector: {selectedLeaf.title}</h4>
                  <p style={{ margin: '2px 0' }}><strong>Source:</strong> {selectedLeaf.evidenceSource}</p>
                  <p style={{ margin: '2px 0' }}><strong>Confidence Score:</strong> {selectedLeaf.confidenceScore}% (Tier A Observation)</p>
                  <p style={{ margin: '2px 0' }}><strong>Details:</strong> {selectedLeaf.details}</p>
                </div>
              )}
            </div>
          )}

          {/* TOWN HALL VIEW */}
          {activeTab === 'TOWN_HALL' && (
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#38bdf8', fontSize: '14px' }}>TOWN HALL // VIRTUAL ASSEMBLY CHAMBER</h3>
              <div style={{ width: '100%', height: '70px', background: 'radial-gradient(ellipse, #1e1b4b 0%, #090d16 70%)', borderRadius: '35px', border: '1px solid #4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '11px', color: '#818cf8' }}>[ ROUND TABLE DEBATE CHAMBER ]</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '15px' }}>
                {townHallMessages.map((m) => (
                  <div key={m.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#020617', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '18px' }}>{m.sticker}</span>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{m.alias} ({m.time})</div>
                      <div style={{ fontSize: '12px', color: '#f8fafc' }}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <select value={townHallSticker} onChange={(e) => setTownHallSticker(e.target.value as any)} style={{ background: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '4px' }}>
                  <option value="🤖">🤖</option>
                  <option value="👽">👽</option>
                  <option value="🦖">🦖</option>
                  <option value="👾">👾</option>
                </select>
                <input
                  type="text"
                  value={townHallInput}
                  onChange={(e) => setTownHallInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTownHallSend()}
                  placeholder="Post to Town Hall..."
                  style={{ flex: 1, background: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                />
                <button onClick={handleTownHallSend} style={{ background: '#38bdf8', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Send
                </button>
              </div>
            </div>
          )}

          {/* SCORECARD VIEW */}
          {activeTab === 'SCORES' && (
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#34d399', fontSize: '14px' }}>3-TRACK CORRELATION SCORECARD</h3>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '15px' }}>
                Strictly separated metrics preventing non-causal symbolic lens scores from altering predictive statistics.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#020617', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>P ↔ R (Prediction vs Real World)</span>
                    <span style={{ color: '#34d399', fontWeight: 'bold' }}>84.2% (Strong)</span>
                  </div>
                  <div style={{ width: '100%', background: '#0f172a', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '84.2%', background: '#34d399', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ background: '#020617', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>M ↔ R (Maya Symbolism vs Real World)</span>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>61.5% (Moderate)</span>
                  </div>
                  <div style={{ width: '100%', background: '#0f172a', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '61.5%', background: '#fbbf24', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ background: '#020617', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>P ↔ M (Prediction vs Maya Lens)</span>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>58.0% (Aligned)</span>
                  </div>
                  <div style={{ width: '100%', background: '#0f172a', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '58.0%', background: '#38bdf8', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* JIMMY AI ASSISTANT SIDEBAR */}
        <aside style={{ width: '300px', background: '#0f172a', borderRadius: '10px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', background: '#1e1b4b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#c7d2fe' }}>🤖 JIMMY // AI ENGINE</span>
            <span style={{ fontSize: '9px', background: '#064e3b', color: '#6ee7b7', padding: '2px 6px', borderRadius: '3px' }}>
              {aiProvider === 'LOCAL_OFFLINE' ? 'OFFLINE' : 'ONLINE'}
            </span>
          </div>

          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {jimmyMessages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'USER' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'USER' ? '#0284c7' : '#020617',
                  color: '#fff',
                  padding: '8px 10px',
                  borderRadius: m.sender === 'USER' ? '10px 10px 0 10px' : '10px 10px 10px 0',
                  fontSize: '11px',
                  lineHeight: '1.4',
                  maxWidth: '90%',
                  border: m.sender === 'JIMMY' ? '1px solid #1e293b' : 'none',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '8px', borderTop: '1px solid #1e293b', display: 'flex', gap: '6px', background: '#0f172a' }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJimmySend()}
              placeholder="Ask Jimmy or enter hypothesis..."
              style={{ flex: 1, background: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '4px', padding: '6px', fontSize: '11px', outline: 'none' }}
            />
            <button onClick={handleJimmySend} style={{ background: '#00e5ff', color: '#000', border: 'none', borderRadius: '4px', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
              Send
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
