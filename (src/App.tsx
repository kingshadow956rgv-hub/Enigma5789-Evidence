import React, { useState, useEffect, useRef } from 'react';

// --- TYPES ---
export interface Message {
  id: string;
  sender: 'JIMMY' | 'USER';
  text: string;
  timestamp: string;
}

export interface CountryProfile {
  name: string;
  code: string;
  threatLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  reversibility: 'R0' | 'R1' | 'R2' | 'R3' | 'R4';
  exports: string; // What it sells
  imports: string; // What it buys
  keyPartners: string;
  activeEvents: number;
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

// --- COUNTRY TRADE DATABASE ---
const COUNTRY_DATABASE: Record<string, CountryProfile> = {
  USA: {
    name: 'United States',
    code: 'USA',
    threatLevel: 'MODERATE',
    reversibility: 'R1',
    exports: 'Refined Petroleum, Aircraft, Integrated Circuits, Soybeans',
    imports: 'Consumer Electronics, Automobiles, Crude Oil, Pharmaceuticals',
    keyPartners: 'Canada, Mexico, China, Japan, Germany',
    activeEvents: 4,
  },
  DEU: {
    name: 'Germany',
    code: 'DEU',
    threatLevel: 'ELEVATED',
    reversibility: 'R2',
    exports: 'Motor Vehicles, Machinery, Chemical Products, Pharmaceuticals',
    imports: 'Natural Gas, Crude Oil, Electronics, Vehicle Parts',
    keyPartners: 'United States, China, Netherlands, France, Poland',
    activeEvents: 6,
  },
  EGY: {
    name: 'Egypt (Suez Corridor)',
    code: 'EGY',
    threatLevel: 'CRITICAL',
    reversibility: 'R3',
    exports: 'Liquefied Natural Gas, Crude Petroleum, Gold, Fertilizers',
    imports: 'Wheat, Refined Petroleum, Pharmaceuticals, Telecommunications Gear',
    keyPartners: 'United Arab Emirates, Saudi Arabia, Turkey, Italy, India',
    activeEvents: 9,
  },
  SGP: {
    name: 'Singapore',
    code: 'SGP',
    threatLevel: 'ELEVATED',
    reversibility: 'R1',
    exports: 'Integrated Circuits, Refined Petroleum, Precision Instruments',
    imports: 'Crude Oil, Semiconductors, Gold, Telecommunications Equipment',
    keyPartners: 'China, Malaysia, United States, Indonesia, Taiwan',
    activeEvents: 5,
  },
  JPN: {
    name: 'Japan',
    code: 'JPN',
    threatLevel: 'MODERATE',
    reversibility: 'R1',
    exports: 'Automobiles, Semiconductor Equipment, Steel, Chemical Products',
    imports: 'Liquefied Natural Gas, Crude Oil, Coal, Integrated Circuits',
    keyPartners: 'China, United States, South Korea, Australia, Taiwan',
    activeEvents: 3,
  },
};

// --- SCENARIO TREE (PS5 RELAPSE JAILBREAK & NETWORK QUARANTINE) ---
const PS5_JAILBREAK_TREE: TreeNode = {
  id: 'root-relapse',
  title: 'PS5 Relapse Jailbreak & Ecosystem Network Isolation',
  type: 'TRUNK',
  details: 'Root Event: Tethered kernel exploit released Sept 29, 2026 for FW 7.00–13.60 via browser User Guide DNS bypass (45.56.67.85).',
  children: [
    {
      id: 'branch-sony-response',
      title: 'Platform Defense & Network Quarantine',
      type: 'BRANCH',
      details: 'Primary degree consequence: Platform holder escalates firmware baseline to force network divergence.',
      children: [
        {
          id: 'leaf-fw1410',
          title: 'Firmware 14.10 Enforces Minimum PSN Threshold',
          type: 'LEAF',
          confidenceScore: 98,
          evidenceSource: 'Official Network Infrastructure Advisory',
          details: 'Forces user divergence: Users must choose between remaining on <=13.60 for homebrew or updating to 14.10 for online PSN access.',
        },
        {
          id: 'leaf-legal',
          title: 'Legal Enforcement & Enforcement Actions',
          type: 'LEAF',
          confidenceScore: 91,
          evidenceSource: 'Corporate Legal Registry',
          details: 'Cease & desist notices issued to unofficial storefronts like Overdrive; alternative repositories emerge.',
        },
      ],
    },
    {
      id: 'branch-ecosystem',
      title: 'Systemic Secondary Adaptations',
      type: 'BRANCH',
      details: 'Secondary degree consequence: Offline software preservation & kernel panic stabilization.',
      children: [
        {
          id: 'leaf-emulation',
          title: 'Standalone Legacy Emulation (PS2/PS3/Xbox)',
          type: 'LEAF',
          confidenceScore: 88,
          evidenceSource: 'Developer Repository Audit',
          details: 'Community develops custom payload hooks to stabilize webkit browser entry and reduce kernel panics.',
        },
      ],
    },
  ],
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BOARD' | 'OBSERVER' | 'WIRE' | 'PLAYERS' | 'TREE' | 'TOWN_HALL' | 'SCORES'>('BOARD');
  const [selectedDay, setSelectedDay] = useState<string>('09-20');
  const [selectedCountry, setSelectedCountry] = useState<CountryProfile>(COUNTRY_DATABASE['EGY']);
  const [selectedLeaf, setSelectedLeaf] = useState<TreeNode | null>(null);

  // Jimmy Assistant Chat State
  const [jimmyMessages, setJimmyMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'JIMMY',
      text: "Enigma 5789 World Observer online. I'm Jimmy, your cognitive guide. Grounded in OpenAlex research indices and Wikidata entity trees. What observation or hypothesis shall we evaluate?",
      timestamp: '14:00 CT',
    },
  ]);
  const [userInput, setUserInput] = useState<string>('');

  // Town Hall State
  const [townHallSticker, setTownHallSticker] = useState<'🤖' | '👽' | '🦖' | '👾'>('🤖');
  const [townHallMessages, setTownHallMessages] = useState([
    { id: '1', alias: 'Observer_99', sticker: '👽', text: 'PS5 FW 14.10 threshold verified. Network isolation active on <=13.60 nodes.', time: '13:42 CT' },
    { id: '2', alias: 'Analyst_Alpha', sticker: '🦖', text: '5-day mean 20–24 holds at 81.02%. Maya non-causal alignment steady.', time: '13:48 CT' },
  ]);
  const [townHallInput, setTownHallInput] = useState<string>('');

  // Globe Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- STABILIZED CONTINENTAL GLOBE CANVAS RENDERER ---
  useEffect(() => {
    if (activeTab !== 'BOARD' && activeTab !== 'OBSERVER') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;

    // Defined Landmass Continents (Simplified Vector Polygons)
    const continents = [
      // North America
      { name: 'USA', centerLat: 0.35, centerLon: -1.6, points: [[-1.8, 0.5], [-1.2, 0.4], [-1.1, 0.2], [-1.5, 0.1], [-1.9, 0.3]] },
      // South America
      { name: 'SA', centerLat: -0.25, centerLon: -1.1, points: [[-1.2, -0.1], [-0.9, -0.2], [-1.0, -0.6], [-1.2, -0.4]] },
      // Europe
      { name: 'DEU', centerLat: 0.45, centerLon: 0.1, points: [[-0.1, 0.5], [0.3, 0.5], [0.4, 0.3], [0.0, 0.3]] },
      // Africa
      { name: 'EGY', centerLat: 0.0, centerLon: 0.2, points: [[0.0, 0.3], [0.4, 0.2], [0.3, -0.3], [-0.1, -0.2]] },
      // Asia
      { name: 'ASIA', centerLat: 0.4, centerLon: 1.2, points: [[0.5, 0.5], [1.6, 0.4], [1.4, 0.1], [0.6, 0.2]] },
      // Japan / East Asia
      { name: 'JPN', centerLat: 0.35, centerLon: 1.8, points: [[1.7, 0.4], [1.9, 0.3], [1.8, 0.2]] },
      // Australia
      { name: 'AUS', centerLat: -0.4, centerLon: 1.7, points: [[1.5, -0.3], [1.9, -0.3], [1.8, -0.6], [1.4, -0.5]] },
    ];

    const renderStabilizedGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      // Outer Glow & Maya Codex Frame Ring
      const glow = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.2);
      glow.addColorStop(0, 'rgba(212, 175, 55, 0.12)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Outer Sphere Border
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0f110d';
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude Grid Lines
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        const y = centerY + (i * radius) / 3;
        const rx = Math.sqrt(Math.max(0, radius * radius - ((i * radius) / 3) ** 2));
        ctx.ellipse(centerX, y, rx, rx * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Smooth Rotation Advance
      rotationAngle += 0.004;

      // Render Continental Landmass Shapes
      continents.forEach((cont) => {
        ctx.beginPath();
        let first = true;

        cont.points.forEach(([lonOffset, latOffset]) => {
          const angle = rotationAngle + lonOffset;
          const z = radius * Math.cos(angle);

          // Only render points on the visible front hemisphere
          if (z > -radius * 0.2) {
            const x = centerX + radius * Math.sin(angle) * Math.cos(latOffset);
            const y = centerY - radius * Math.sin(latOffset);

            if (first) {
              ctx.moveTo(x, y);
              first = false;
            } else {
              ctx.lineTo(x, y);
            }
          }
        });

        ctx.closePath();
        ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Interactive Country Pin Markers (Gold Triangles)
      Object.values(COUNTRY_DATABASE).forEach((country) => {
        let lonOffset = 0.2;
        let latOffset = 0.0;

        if (country.code === 'USA') { lonOffset = -1.5; latOffset = 0.35; }
        if (country.code === 'DEU') { lonOffset = 0.1; latOffset = 0.45; }
        if (country.code === 'EGY') { lonOffset = 0.2; latOffset = 0.0; }
        if (country.code === 'SGP') { lonOffset = 1.2; latOffset = -0.2; }
        if (country.code === 'JPN') { lonOffset = 1.8; latOffset = 0.35; }

        const angle = rotationAngle + lonOffset;
        const z = radius * Math.cos(angle);

        if (z > 0) {
          const px = centerX + radius * Math.sin(angle) * Math.cos(latOffset);
          const py = centerY - radius * Math.sin(latOffset);
          const isSelected = selectedCountry.code === country.code;

          // Pin Pulse
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 10 : 6, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected ? '#ffffff' : '#d4af37';
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.stroke();

          // Gold Pin Triangle
          ctx.fillStyle = isSelected ? '#ffffff' : '#d4af37';
          ctx.beginPath();
          ctx.moveTo(px, py - 5);
          ctx.lineTo(px + 4, py + 3);
          ctx.lineTo(px - 4, py + 3);
          ctx.closePath();
          ctx.fill();

          // Label
          ctx.font = '10px monospace';
          ctx.fillStyle = isSelected ? '#ffffff' : '#e5c052';
          ctx.fillText(country.code, px + 8, py + 3);
        }
      });

      animationFrameId = requestAnimationFrame(renderStabilizedGlobe);
    };

    renderStabilizedGlobe();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeTab, selectedCountry]);

  // --- JIMMY CHAT HANDLER ---
  const handleJimmySend = () => {
    if (!userInput.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' CT';
    const newMsg: Message = { id: String(Date.now()), sender: 'USER', text: userInput, timestamp: timeStr };
    const updated = [...jimmyMessages, newMsg];
    setJimmyMessages(updated);
    const query = userInput;
    setUserInput('');

    setTimeout(() => {
      setJimmyMessages([
        ...updated,
        {
          id: String(Date.now() + 1),
          sender: 'JIMMY',
          text: `[Jimmy Engine]: Hypothesis logged ("${query}"). Cross-referencing OpenAlex research index & Wikidata knowledge graphs. Generated Kill Test: "Must observe zero network quarantine divergence within 30 days."`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' CT',
        },
      ]);
    }, 800);
  };

  // --- TOWN HALL HANDLER ---
  const handleTownHallSend = () => {
    if (!townHallInput.trim()) return;
    const entry = {
      id: String(Date.now()),
      alias: `Analyst_${Math.floor(Math.random() * 900 + 100)}`,
      sticker: townHallSticker,
      text: townHallInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' CT',
    };
    setTownHallMessages([...townHallMessages, entry]);
    setTownHallInput('');
  };

  // --- TREE RENDER HELPER ---
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isTrunk = node.type === 'TRUNK';
    const isLeaf = node.type === 'LEAF';

    return (
      <div key={node.id} style={{ marginLeft: `${depth * 18}px`, marginTop: '10px' }}>
        <div
          onClick={() => isLeaf && setSelectedLeaf(node)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: isTrunk ? '8px 14px' : '5px 10px',
            background: isTrunk ? '#d4af37' : isLeaf ? '#1f221e' : '#1a1c18',
            border: `1px solid ${isTrunk ? '#e5c052' : isLeaf ? '#525a4c' : '#333730'}`,
            borderRadius: '6px',
            color: isTrunk ? '#121411' : isLeaf ? '#d4af37' : '#e2e8f0',
            fontWeight: isTrunk ? 'bold' : 'normal',
            cursor: isLeaf ? 'pointer' : 'default',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          <span>{isTrunk ? '🪵 TRUNK:' : isLeaf ? '🍃 LEAF:' : '🌿 BRANCH:'}</span>
          <span>{node.title}</span>
          {node.confidenceScore && (
            <span style={{ background: '#2e332a', color: '#d4af37', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>
              {node.confidenceScore}%
            </span>
          )}
        </div>
        {node.children && node.children.map((child) => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ background: '#0d0f0c', color: '#c9cebe', minHeight: '100vh', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column', padding: '16px' }}>
      
      {/* MAYAN CODEX HEADER BAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2e332b', paddingBottom: '12px', marginBottom: '16px', background: '#121511', padding: '12px 16px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* MAYAN SOLAR DISC GLYPH ART */}
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1d18', color: '#d4af37', fontSize: '16px', fontWeight: 'bold' }}>
            ☉
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', color: '#d4af37', fontFamily: 'Georgia, serif', letterSpacing: '0.5px' }}>
              Enigma<span style={{ color: '#e5c052' }}>5789</span>
            </h1>
            <div style={{ fontSize: '10px', color: '#8e9388', fontFamily: 'monospace', letterSpacing: '1.5px', marginTop: '2px' }}>
              MAYAN CODEX & TACTICAL WORLD OBSERVER
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#a3a89e', fontFamily: 'monospace', textAlign: 'right' }}>
          <div>2026-10-17 19:15 CT</div>
          <div style={{ color: '#d4af37', fontSize: '10px' }}>TZOLK'IN DAY: 3 Ak'bal</div>
        </div>
      </header>

      {/* TOP TAB NAVIGATION BAR */}
      <nav style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'BOARD', label: '👁️ Board' },
          { id: 'OBSERVER', label: '((o)) Observer' },
          { id: 'WIRE', label: '⚡ Wire' },
          { id: 'PLAYERS', label: '👥 Players' },
          { id: 'TREE', label: '🌿 Scenario Tree' },
          { id: 'TOWN_HALL', label: '🏛️ Town Hall' },
          { id: 'SCORES', label: '📊 Scorecard' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: isActive ? '#d4af37' : '#1a1c18',
                color: isActive ? '#121411' : '#c9cebe',
                border: `1px solid ${isActive ? '#e5c052' : '#333730'}`,
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'all 0.15s ease-in-out',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* TZOLK'IN MAYAN CALENDAR DATE CARDS WITH BAR-DOT NOTATION */}
      <section style={{ background: '#151814', border: '1px solid #2d3328', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#8e9388', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>SEPTEMBER 20–26 OBSERVATION WINDOWS</span>
          <span style={{ color: '#d4af37' }}>TZOLK'IN BAR-DOT NOTATION: · = 1 | — = 5</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { day: '09-20', sign: "7 Imix'", dots: '·· —', score: '71.2%' },
            { day: '09-21', sign: "8 Ik'", dots: '··· —', score: '72.6%' },
            { day: '09-22', sign: "9 Ak'bal", dots: '···· —', score: '81.0%' },
            { day: '09-23', sign: "10 K'an", dots: '— —', score: '83.3%' },
            { day: '09-24', sign: '11 Chikchan', dots: '· — —', score: '88.4%' },
          ].map((item) => {
            const isSelected = selectedDay === item.day;
            return (
              <button
                key={item.day}
                onClick={() => setSelectedDay(item.day)}
                style={{
                  background: isSelected ? '#252a23' : '#1a1d18',
                  border: `1px solid ${isSelected ? '#d4af37' : '#2e332a'}`,
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: isSelected ? '#d4af37' : '#a3a89e',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '10px', color: '#8e9388' }}>{item.day} ({item.dots})</div>
                <div><strong>{item.sign}</strong></div>
                <div style={{ color: '#e5c052', fontSize: '11px' }}>{item.score}</div>
              </button>
            );
          })}
        </div>
        <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#8e9388', fontFamily: 'monospace' }}>
          Exploratory closes. 26 September stays open. Five-day mean 20–24 is 81.02%, and that is not a week.
        </p>
      </section>

      {/* MAIN CONTENT WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', gap: '16px', overflow: 'hidden', flexWrap: 'wrap' }}>
        
        {/* CENTER GLOBE DISPLAY */}
        <main style={{ flex: 1, minWidth: '300px', background: '#151814', border: '1px solid #2d3328', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
          
          {(activeTab === 'BOARD' || activeTab === 'OBSERVER') && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '11px', color: '#8e9388', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>CONTINENTAL VECTOR GLOBE</span>
                <span style={{ color: '#d4af37' }}>Tap continent pin to inspect trade</span>
              </div>

              {/* STABILIZED GLOBE CANVAS */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0c09', borderRadius: '8px', border: '1px solid #222820', padding: '10px', minHeight: '260px' }}>
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={280}
                  onClick={() => {
                    const keys = Object.keys(COUNTRY_DATABASE);
                    const nextKey = keys[(keys.indexOf(selectedCountry.code) + 1) % keys.length];
                    setSelectedCountry(COUNTRY_DATABASE[nextKey]);
                  }}
                  style={{ maxWidth: '100%', cursor: 'pointer' }}
                />
              </div>

              <div style={{ marginTop: '12px', fontSize: '11px', color: '#8e9388', fontFamily: 'monospace', lineHeight: '1.5' }}>
                Same projection as the command-center globe. Pins show named places stored in records. Gold is the selected observation day.
              </div>
            </div>
          )}

          {activeTab === 'TREE' && (
            <div>
              <div style={{ fontSize: '11px', color: '#8e9388', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '12px' }}>
                SCENARIO BRANCHING // PS5 RELAPSE JAILBREAK FRICTION
              </div>
              {renderTreeNode(PS5_JAILBREAK_TREE)}

              {selectedLeaf && (
                <div style={{ marginTop: '18px', background: '#0a0c09', padding: '12px', borderRadius: '6px', border: '1px solid #d4af37', fontSize: '11px', fontFamily: 'monospace' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#d4af37' }}>Evidence Inspector: {selectedLeaf.title}</h4>
                  <p style={{ margin: '2px 0' }}><strong>Source:</strong> {selectedLeaf.evidenceSource}</p>
                  <p style={{ margin: '2px 0' }}><strong>Confidence Score:</strong> {selectedLeaf.confidenceScore}% (Tier A Direct Observation)</p>
                  <p style={{ margin: '2px 0' }}><strong>Details:</strong> {selectedLeaf.details}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'TOWN_HALL' && (
            <div style={{ fontFamily: 'monospace' }}>
              <div style={{ fontSize: '11px', color: '#8e9388', letterSpacing: '1px', marginBottom: '12px' }}>
                TOWN HALL // VIRTUAL ASSEMBLY CHAMBER
              </div>
              <div style={{ width: '100%', height: '60px', background: '#0a0c09', borderRadius: '30px', border: '1px solid #2e332a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#d4af37' }}>[ ROUND TABLE DISCUSSION ZONE ]</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '12px' }}>
                {townHallMessages.map((m) => (
                  <div key={m.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#0a0c09', padding: '8px', borderRadius: '6px', border: '1px solid #2e332a' }}>
                    <span style={{ fontSize: '18px' }}>{m.sticker}</span>
                    <div>
                      <div style={{ fontSize: '10px', color: '#8e9388' }}>{m.alias} ({m.time})</div>
                      <div style={{ fontSize: '12px', color: '#c9cebe' }}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <select value={townHallSticker} onChange={(e) => setTownHallSticker(e.target.value as any)} style={{ background: '#0a0c09', color: '#fff', border: '1px solid #333730', borderRadius: '4px' }}>
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
                  placeholder="Post message..."
                  style={{ flex: 1, background: '#0a0c09', color: '#fff', border: '1px solid #333730', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                />
                <button onClick={handleTownHallSend} style={{ background: '#d4af37', color: '#121411', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'SCORES' && (
            <div style={{ fontFamily: 'monospace' }}>
              <div style={{ fontSize: '11px', color: '#8e9388', letterSpacing: '1px', marginBottom: '12px' }}>
                3-TRACK CORRELATION SCORECARD
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#0a0c09', padding: '12px', borderRadius: '6px', border: '1px solid #2e332a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#d4af37', fontWeight: 'bold' }}>P ↔ R (Prediction vs Real World)</span>
                    <span style={{ color: '#e5c052', fontWeight: 'bold' }}>84.2% (Strong)</span>
                  </div>
                  <div style={{ width: '100%', background: '#1f221e', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '84.2%', background: '#d4af37', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ background: '#0a0c09', padding: '12px', borderRadius: '6px', border: '1px solid #2e332a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>M ↔ R (Maya Symbolism vs Real World)</span>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>61.5% (Moderate)</span>
                  </div>
                  <div style={{ width: '100%', background: '#1f221e', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '61.5%', background: '#fbbf24', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* SELECTED COUNTRY TRADE PROFILE DRAWER */}
        <aside style={{ width: '250px', background: '#151814', border: '1px solid #2d3328', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace' }}>
          <div style={{ borderBottom: '1px solid #2d3328', paddingBottom: '8px' }}>
            <div style={{ fontSize: '10px', color: '#8e9388' }}>COUNTRY TRADE PROFILE</div>
            <h4 style={{ margin: '2px 0 0 0', color: '#d4af37', fontSize: '14px' }}>{selectedCountry.name} ({selectedCountry.code})</h4>
          </div>

          <div style={{ background: '#0a0c09', padding: '8px', borderRadius: '4px', border: '1px solid #222820' }}>
            <span style={{ fontSize: '9px', color: '#8e9388' }}>THREAT / FRICTION STATUS</span>
            <p style={{ margin: '2px 0 0 0', color: selectedCountry.threatLevel === 'CRITICAL' ? '#f87171' : '#facc15', fontWeight: 'bold', fontSize: '11px' }}>
              {selectedCountry.threatLevel}
            </p>
          </div>

          <div style={{ background: '#0a0c09', padding: '8px', borderRadius: '4px', border: '1px solid #222820' }}>
            <span style={{ fontSize: '9px', color: '#8e9388' }}>REVERSIBILITY INDEX</span>
            <p style={{ margin: '2px 0 0 0', color: '#38bdf8', fontWeight: 'bold', fontSize: '11px' }}>
              {selectedCountry.reversibility} Scale
            </p>
          </div>

          <div style={{ fontSize: '10px', color: '#c9cebe', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <strong style={{ color: '#00ff66' }}>📦 EXPORTS (What it Sells):</strong><br />
              <span style={{ color: '#a3a89e' }}>{selectedCountry.exports}</span>
            </div>

            <div>
              <strong style={{ color: '#3388ff' }}>🛒 IMPORTS (What it Buys):</strong><br />
              <span style={{ color: '#a3a89e' }}>{selectedCountry.imports}</span>
            </div>

            <div>
              <strong style={{ color: '#d4af37' }}>🤝 KEY TRADE PARTNERS:</strong><br />
              <span style={{ color: '#a3a89e' }}>{selectedCountry.keyPartners}</span>
            </div>
          </div>
        </aside>

        {/* RIGHT JIMMY AI SIDEBAR */}
        <aside style={{ width: '260px', background: '#151814', border: '1px solid #2d3328', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'monospace' }}>
          <div style={{ padding: '10px 12px', background: '#181a17', borderBottom: '1px solid #2d3328', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#d4af37' }}>🤖 JIMMY // ASSISTANT</span>
            <span style={{ fontSize: '9px', background: '#2e332a', color: '#d4af37', padding: '2px 6px', borderRadius: '3px' }}>
              ONLINE
            </span>
          </div>

          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {jimmyMessages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'USER' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'USER' ? '#2e332a' : '#0a0c09',
                  color: '#c9cebe',
                  padding: '8px 10px',
                  borderRadius: m.sender === 'USER' ? '8px 8px 0 8px' : '8px 8px 8px 0',
                  fontSize: '11px',
                  lineHeight: '1.4',
                  maxWidth: '92%',
                  border: m.sender === 'JIMMY' ? '1px solid #222820' : 'none',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '8px', borderTop: '1px solid #2e332a', display: 'flex', gap: '6px', background: '#151814' }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJimmySend()}
              placeholder="Ask Jimmy or enter hypothesis..."
              style={{ flex: 1, background: '#0a0c09', color: '#fff', border: '1px solid #333730', borderRadius: '4px', padding: '6px', fontSize: '11px', outline: 'none' }}
            />
            <button onClick={handleJimmySend} style={{ background: '#d4af37', color: '#121411', border: 'none', borderRadius: '4px', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
              Send
            </button>
          </div>
        </aside>

      </div>

      {/* FOOTER SECTION */}
      <footer style={{ marginTop: '16px', borderTop: '1px solid #2e332b', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8e9388', fontFamily: 'monospace' }}>
        <div>MAYAN EXPERIMENT DAY: <strong style={{ color: '#d4af37', fontSize: '13px' }}>3 Ak'bal (··· —)</strong></div>
        <div>Non-Causal Symbolic Alignment Engine Active</div>
      </footer>

    </div>
  );
};
