
export function AvailablePlayers({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div style={cardStyle}>
        <h2 style={titleStyle}>Available Players Pool (0)</h2>
        <div style={emptyStateStyle}>No players found in registry.</div>
      </div>
    );
  }

  const allPlayers = rows.slice(1);
  
  // 🏏 FILTER LOGIC: Match case-insensitive "sold" status 
  const availablePlayers = allPlayers.filter(
    player => player[6] && player[6].toString().toLowerCase() !== "sold"
  );

  return (
    <div style={cardStyle}>
      {/* 🏷️ Header Section */}
      <div style={headerFlexStyle}>
        <h2 style={titleStyle}>Available Players Pool</h2>
        <span style={poolCountBadgeStyle}>
          📋 Remaining: {availablePlayers.length}
        </span>
      </div>

      {/* 📋 Roster Table */}
      {availablePlayers.length === 0 ? (
        <div style={emptyStateStyle}>All players have been successfully drafted!</div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={thRowStyle}>
                <th style={{ ...thStyle, width: '15%' }}>Sl.No</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Player Name</th>
                <th style={{ ...thStyle, textAlign: 'left', width: '35%' }}>Position</th>
              </tr>
            </thead>
            <tbody>
              {availablePlayers.map((player, idx) => (
                <tr key={idx} style={trStyle(idx)}>
                  {/* Using array maps index (+1) to avoid state mutation bugs */}
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#111827' }}>{player[1]}</td>
                  <td style={{ ...tdStyle, color: '#4b5563' }}>{player[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 🎨 COMPONENT UI STYLES (Perfect fit with Team Cards)

const cardStyle = {
  padding: '24px',
  background: '#ffffff',
  borderRadius: '16px',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const headerFlexStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const titleStyle = {
  margin: 0,
  color: '#1e3a8a', // Unifies with your team header sapphire colors
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.025em'
};

const poolCountBadgeStyle = {
  fontSize: '13px',
  fontWeight: '600',
  padding: '6px 12px',
  borderRadius: '20px',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: '1px solid #e2e8f0'
};

const tableContainerStyle = {
  // maxHeight: '400px', // Slightly taller than team views to display more auction slots
  // overflowY: 'auto',
  border: '1px solid #e5e7eb',
  borderRadius: '8px'
};

const thRowStyle = {
  backgroundColor: '#f9fafb',
  position: 'sticky',
  top: 0,
  zIndex: 1
};

const thStyle = {
  padding: '12px 14px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  color: '#4b5563',
  borderBottom: '2px solid #e5e7eb',
  letterSpacing: '0.05em'
};

const trStyle = (index) => ({
  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
  borderBottom: '1px solid #f3f4f6',
  transition: 'background-color 0.2s ease'
});

const tdStyle = {
  padding: '12px 14px',
  fontSize: '14px',
  color: '#4b5563',
  verticalAlign: 'middle',
};

const emptyStateStyle = {
  padding: '40px',
  textAlign: 'center',
  color: '#9ca3af',
  fontStyle: 'italic',
  background: '#f9fafb',
  borderRadius: '8px',
  border: '1px dashed #e5e7eb'
};