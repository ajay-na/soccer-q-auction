
export function SingleTeamCard({ teamName, rows }) {
  const TOTAL_BUDGET = 400;
  const MIN_PLAYERS = 8;
  const MIN_PLAYER_BASE_PRICE = 25; // Base price reserved per remaining squad slot

  if (!rows || rows.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={titleStyle}>{teamName}</h3>
        <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
          No player data found for this range.
        </p>
      </div>
    );
  }

  const teamPlayers = rows.slice(1);
  const currentPlayerCount = teamPlayers.length;

  // 💰 SAFE MATH LOGIC
  const current_spend = teamPlayers.reduce((acc, player) => {
    const price = player[5] ? parseFloat(player[5].toString().replace(/[^0-9.]/g, '')) : 0;
    return acc + price;
  }, 0);

  const remaining_budget = TOTAL_BUDGET - current_spend;

  // 🧮 MAX BID CALCULATION
  const slotsRemaining = Math.max(0, MIN_PLAYERS - currentPlayerCount);
  const reservedForOthers = slotsRemaining > 1 ? (slotsRemaining - 1) * MIN_PLAYER_BASE_PRICE : 0;
  const max_bid = slotsRemaining > 0 ? remaining_budget - reservedForOthers : remaining_budget;

  return (
    <div style={cardStyle}>
      {/* 🏷️ Card Header */}
      <div style={headerFlexStyle}>
        <h3 style={titleStyle}>{teamName}</h3>
        <span style={squadCountBadgeStyle(currentPlayerCount >= MIN_PLAYERS)}>
          Squad: {currentPlayerCount} / {MIN_PLAYERS}
        </span>
      </div>

      {/* 📊 Unified Financial Grid Dashboard */}
      <div style={dashboardGridStyle}>
        <div style={metricBoxStyle('#1e3a8a', '#dbeafe')}>
          <span style={metricLabelStyle}>Purse Left</span>
          <span style={metricValueStyle}>{remaining_budget.toFixed(0)}</span>
        </div>
        <div style={metricBoxStyle('#4b5563', '#f3f4f6')}>
          <span style={metricLabelStyle}>Spent</span>
          <span style={metricValueStyle}>{current_spend.toFixed(0)}</span>
        </div>
        <div style={metricBoxStyle(max_bid <= MIN_PLAYER_BASE_PRICE ? '#b91c1c' : '#047857', max_bid <= MIN_PLAYER_BASE_PRICE ? '#fee2e2' : '#d1fae5')}>
          <span style={metricLabelStyle}>Max Bid</span>
          <span style={metricValueStyle}>{max_bid > 0 ? max_bid.toFixed(0) : 0}</span>
        </div>
      </div>

      {/* 📋 Roster Table */}
      {teamPlayers.length === 0 ? (
        <div style={emptyStateStyle}>No players purchased yet</div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={thRowStyle}>
                <th style={{ ...thStyle, width: '15%' }}>Sl.No</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Player Name</th>
                <th style={{ ...thStyle, textAlign: 'right', width: '25%' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {teamPlayers.map((player, idx) => (
                <tr key={idx} style={trStyle(idx)}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#111827' }}>{player[1]}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold', color: '#2563eb' }}>
                    {player[5]} L
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 🎨 COMPONENT UI STYLES

const cardStyle = {
  padding: '24px',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const headerFlexStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const titleStyle = {
  margin: 0,
  color: '#1e3a8a',
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.025em'
};

const squadCountBadgeStyle = (isComplete) => ({
  fontSize: '13px',
  fontWeight: '600',
  padding: '6px 12px',
  borderRadius: '20px',
  backgroundColor: isComplete ? '#d1fae5' : '#f3f4f6',
  color: isComplete ? '#065f46' : '#374151',
  border: isComplete ? '1px solid #a7f3d0' : '1px solid #e5e7eb'
});

// ⚡ FIXED UNIFORM WIDTH GRID
const dashboardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', // Forces exactly 3 equal-width boxes, no matter what
  gap: '8px', // Slightly tightened for better spacing on mobile devices
  marginBottom: '20px',
  width: '100%'
};

const metricBoxStyle = (textColor, bgColor) => ({
  padding: '10px 4px', // Optimized vertical padding, safe horizontal inset
  borderRadius: '10px',
  backgroundColor: bgColor,
  color: textColor,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${bgColor}`,
  width: '100%', // Fills grid track exactly
  boxSizing: 'border-box'
});

const metricLabelStyle = {
  fontSize: '10px', // Uniform subtle typography scale for responsive displays
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  opacity: 0.9,
  marginBottom: '4px',
  textAlign: 'center',
  whiteSpace: 'nowrap', // Prevents messy line breaking on narrow mobile screens
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%'
};

const metricValueStyle = {
  fontSize: '18px',
  fontWeight: '800',
  letterSpacing: '-0.025em'
};

const tableContainerStyle = {
  maxHeight: '260px',
  overflowY: 'auto',
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
  padding: '10px 14px',
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
  padding: '10px 14px',
  fontSize: '14px',
  color: '#4b5563',
  verticalAlign: 'middle'
};

const emptyStateStyle = {
  padding: '30px',
  textAlign: 'center',
  color: '#9ca3af',
  fontStyle: 'italic',
  background: '#f9fafb',
  borderRadius: '8px',
  border: '1px dashed #e5e7eb'
};

export default SingleTeamCard;