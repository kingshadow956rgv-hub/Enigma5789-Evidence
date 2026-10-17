import React, { useState } from 'react';
import { Globe, GitFork, Users, BarChart3, Bot, Send, ShieldAlert, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GLOBE' | 'TREE' | 'TOWN_HALL' | 'SCORES'>('GLOBE');
  const [jimmyMessages, setJimmyMessages] = useState<Array<{ sender: 'JIMMY' | 'USER'; text: string }>>([
    {
      sender: 'JIMMY',
      text: "System initialized. Enigma 5789 World Observer online. I'm Jimmy, your cognitive guide and neural forecasting engine. What observation or hypothesis shall we evaluate?",
    },
  ]);
  const [userInput, setUserInput] = useState<string>('');

  const handleJimmySend = () => {
    if (!userInput.trim()) return;
    const newMsgs = [...jimmyMessages, { sender: 'USER' as const, text: userInput }];
    setJimmyMessages(newMsgs);
    setUserInput('');

    setTimeout(() => {
      setJimmyMessages([
        ...newMsgs,
        {
          sender: 'JIMMY',
          text: `Logged hypothesis: "${userInput}". Running multi-layer neural correlation check against historical registries and P-R / M-R series. Constructing automated Kill Test parameters...`,
        },
      ]);
    }, 900);
  };

  return (
    <div style={{ background: '#07090e', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#0f172a', padding: '14px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 12px #00e5ff' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', letterSpacing: '1px' }}>ENIGMA 5789 // WORLD OBSERVER</h1>
            <span style={{ fontSize: '10px', color: '#38bdf8' }}>Evidence-Centered Cognitive Mentorship Engine</span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '12px' }}>
          {[
            { id: 'GLOBE', label: '3D Globe', icon: Globe },
            { id: 'TREE', label: 'Scenario Tree', icon: GitFork },
            { id: 'TOWN_HALL', label: 'Town Hall', icon: Users },
            { id: 'SCORES', label: 'Scorecard', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? '#00e5ff' : '#94a3b8',
                  border: `1px solid ${isActive ? '#00e5ff' : '#334155'}`,
                  borderRadius: '6px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '20px', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        
        {/* Active Display Panel */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          
          {activeTab === 'GLOBE' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                  <Globe color="#00e5ff" size={20} />
                  <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '18px' }}>Global Observation Grid & 3D Telemetry</h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>
                  Real-time regional news ingestion, gap analysis, and multi-source corroboration mapping across geopolitical flashpoints.
                </p>
              </div>
              <div style={{ flex: 1, border: '1px dashed #334155', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', margin: '20px 0' }}>
                <Cpu size={48} color="#00e5ff" style={{ opacity: 0.8, marginBottom: '10px' }} />
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Interactive WebGL Globe Rendering Active</span>
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Tracking feeds across W1–W5 observation windows.</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Active Feeds</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#38bdf8', fontWeight: 'bold' }}>14 Locked Registries</p>
                </div>
                <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Coverage Gaps</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#fbbf24', fontWeight: 'bold' }}>2 Regions Flagged</p>
                </div>
                <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Verification Rate</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#34d399', fontWeight: 'bold' }}>84.2% Verified</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TREE' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <GitFork color="#a855f7" size={20} />
                <h3 style={{ margin: '0', color: '#f8fafc', fontSize: '18px' }}>Scenario Branching & Kill-Test Tree</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                Evaluate hypothetical trajectories and test falsifiability across multi-layered branching forks.
              </p>
              <div style={{ background: '#020617', padding: '20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderLeft: '3px solid #00e5ff', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#38bdf8' }}>ROOT HYPOTHESIS</span>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>Global supply chain adaptation under regional energy shocks.</p>
                </div>
                <div style={{ marginLeft: '20px', borderLeft: '3px solid #a855f7', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#c084fc' }}>BRANCH A // DIVERSIFIED CORRIDORS</span>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#94a3b8' }}>Resilience threshold met within 90 days. Probability: 68%</p>
                </div>
                <div style={{ marginLeft: '20px', borderLeft: '3px solid #f43f5e', paddingLeft: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#fb7185' }}>BRANCH B // SYSTEMIC BOTTLENECK (KILL TEST ACTIVE)</span>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#94a3b8' }}>Critical port stagnation. Probability: 32%</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TOWN_HALL' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <Users color="#38bdf8" size={20} />
                <h3 style={{ margin: '0', color: '#f8fafc', fontSize: '18px' }}>Town Hall Assembly Chamber</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                Deliberation matrix and peer consensus evaluation for incoming policy models.
              </p>
              <div style={{ background: '#020617', padding: '30px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
                <ShieldAlert size={40} color="#38bdf8" style={{ marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#fff' }}>Assembly Session Open</h4>
                <p style={{ color: '#94a3b8', fontSize: '13px', maxWidth: '400px', margin: '0 auto 15px auto' }}>
                  No active motions currently contesting registry data. Submit a proposition through Jimmy to initiate assembly review.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'SCORES' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <BarChart3 color="#34d399" size={20} />
                <h3 style={{ margin: '0', color: '#f8fafc', fontSize: '18px' }}>3-Track Correlation Scorecard</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                Independent period roll-ups across locked telemetry series without zeroing unmeasured days.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>P ↔ R (Prediction vs Real World)</span>
                    <span style={{ color: '#34d399', fontWeight: 'bold' }}>84.2% (Strong)</span>
                  </div>
                  <div style={{ width: '100%', background: '#020617', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '84.2%', background: '#34d399', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#c084fc' }}>M ↔ R (Maya Symbolism vs Real World)</span>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>61.5% (Moderate)</span>
                  </div>
                  <div style={{ width: '100%', background: '#020617', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '61.5%', background: '#fbbf24', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#f43f5e' }}>P ↔ M (Prediction vs Maya Lens)</span>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>58.0% (Aligned)</span>
                  </div>
                  <div style={{ width: '100%', background: '#020617', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: '58.0%', background: '#38bdf8', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Jimmy AI Assistant Sidebar */}
        <aside style={{ width: '360px', background: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', background: '#1e1b4b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} color="#818cf8" />
              <span style={{ color: '#c7d2fe', fontWeight: 'bold', fontSize: '13px' }}>JIMMY // COGNITIVE ENGINE</span>
            </div>
            <span style={{ fontSize: '10px', background: '#064e3b', color: '#6ee7b7', padding: '2px 6px', borderRadius: '4px' }}>ONLINE</span>
          </div>

          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jimmyMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'USER' ? '#0284c7' : '#1e293b',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'USER' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  maxWidth: '88%',
                  border: msg.sender === 'JIMMY' ? '1px solid #334155' : 'none',
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid #1e293b', display: 'flex', gap: '8px', background: '#0f172a' }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJimmySend()}
              placeholder="Ask Jimmy or log a hypothesis..."
              style={{ flex: 1, background: '#020617', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '10px', fontSize: '12px', outline: 'none' }}
            />
            <button
              onClick={handleJimmySend}
              style={{ background: '#00e5ff', color: '#000', border: 'none', borderRadius: '6px', padding: '10px 14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Send size={14} />
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
