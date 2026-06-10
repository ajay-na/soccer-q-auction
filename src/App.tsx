import type { CSSProperties } from 'react';
import { AvailablePlayers } from './AvailablePlayers';
import GoogleSheetFetcher from './GoogleSheetFetcher';
import SingleTeamCard from './Team';

function App() {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

  const teamsConfig = [
    { name: "Team Arun & Allen", range: "Sheet1!I2:N20" },
    { name: "Team Nishad & Musafir", range: "Sheet1!P2:U20" },
    { name: "Team Rahul & Dibin", range: "Sheet1!W2:AB20" },
    { name: "Team Abishek & Mahith", range: "Sheet1!I22:N41" }
  ];

  return (
    <div style={appContainerStyle}>
      {/* 🚀 Header Section */}
      <header style={headerStyle}>
        <div style={badgeLiveStyle}>
          <span style={dotStyle}></span> LIVE UPDATES
        </div>
        <h1 style={titleStyle}>LIVE AUCTION BOARD</h1>
      </header>

      {/* 🎛️ Stacking Dashboard Layout */}
      <div style={mainLayoutStackStyle}>
        
        {/* 👥 TOP SECTION: Team Squads Grid (2 Columns on Desktop -> Vertical Stack on Mobile) */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>👥 Team Squads Status</h2>
          <div style={teamsGridStyle}>
            {teamsConfig.map((team, index) => (
              <GoogleSheetFetcher 
                key={index}
                apiKey={API_KEY} 
                spreadsheetId={SHEET_ID} 
                range={team.range} 
              >
                {(teamData) => (
                  <SingleTeamCard 
                    teamName={team.name} 
                    rows={teamData} 
                  />
                )}
              </GoogleSheetFetcher>
            ))}
          </div>
        </div>
        
        {/* 📋 SEPARATOR RULE */}
        <hr style={dividerStyle} />

        {/* 🏏 BOTTOM SECTION: Available Master Pool (Full Width) */}
        <div style={sectionStyle}>
          <div style={poolHeaderFlexStyle}>
            <h2 style={sectionTitleStyle}>📋 Available Player Pool</h2>
            <span style={poolNoticeStyle}>Awaiting Bids</span>
          </div>
          <div style={poolWrapperStyle}>
            <GoogleSheetFetcher apiKey={API_KEY} spreadsheetId={SHEET_ID} range="Sheet1!A1:G35">
              {(rawData) => <AvailablePlayers rows={rawData} />}
            </GoogleSheetFetcher>
          </div>
        </div>

      </div>
    </div>
  );
}

// 🎨 CORE THEME DESIGN STYLES

const appContainerStyle: CSSProperties = {
  // ⚡ Mobile-first safe padding adjustment to prevent edge-bleeding
  padding: '40px 16px', 
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  backgroundColor: '#f8fafc', 
  minHeight: '100vh',
  color: '#0f172a',
  boxSizing: 'border-box' // Forces paddings inside the layout track
};

const headerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '36px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const badgeLiveStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#fee2e2',
  color: '#ef4444',
  fontSize: '11px',
  fontWeight: '700',
  padding: '4px 10px',
  borderRadius: '20px',
  letterSpacing: '0.05em',
  marginBottom: '12px',
  border: '1px solid #fca5a5'
};

const dotStyle = {
  width: '6px',
  height: '6px',
  backgroundColor: '#ef4444',
  borderRadius: '50%',
  display: 'inline-block'
};

const titleStyle = {
  color: '#1e3a8a', 
  margin: '0 0 6px 0',
  fontSize: '34px',
  fontWeight: '800',
  letterSpacing: '-0.03em'
};

// Vertical Layout Stack Wrapper
const mainLayoutStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  maxWidth: '1300px',
  margin: '0 auto',
  width: '100%'
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%'
};

const sectionTitleStyle = {
  margin: 0,
  color: '#0f172a',
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.02em',
  borderLeft: '4px solid #3b82f6',
  paddingLeft: '12px'
};

// ⚡ RESPONSIVE ENGINE: Strict 2 Columns on Desktop, cleanly drops to a single line vertical stack on Mobile
const teamsGridStyle: CSSProperties = {
  display: 'grid',
  // auto-fit + minmax(340px) forces 2 columns if space permits, but wraps layout elements into a clean 1-column list on mobile viewports
  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
  gap: '24px',
  width: '100%',
  boxSizing: 'border-box'
};

const dividerStyle = {
  border: '0',
  height: '1px',
  backgroundColor: '#e2e8f0',
  margin: '12px 0'
};

const poolHeaderFlexStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px'
};

const poolNoticeStyle = {
  fontSize: '12px',
  fontWeight: '600',
  backgroundColor: '#e0f2fe',
  color: '#0369a1',
  padding: '4px 12px',
  borderRadius: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap'
};

// Wrapper ensuring the bottom table stretches beautifully 
const poolWrapperStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
  padding: '6px',
  overflow: 'hidden',
  width: '100%',
  boxSizing: 'border-box'
};

export default App;