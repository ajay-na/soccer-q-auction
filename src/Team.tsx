import type { CSSProperties } from 'react';
import { useTheme } from './theme/ThemeContext';
import type { SheetRow } from './types';

interface SingleTeamCardProps {
  teamName: string;
  rows: SheetRow[];
}

export function SingleTeamCard({ teamName, rows }: SingleTeamCardProps) {
  const { colors } = useTheme();
  const TOTAL_BUDGET = 400;
  const MIN_PLAYERS = 8;
  const MIN_PLAYER_BASE_PRICE = 25;

  const cardStyle: CSSProperties = {
    padding: '24px',
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: '16px',
    background: colors.cardBg,
    boxShadow: colors.cardShadow,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  };

  const titleStyle = {
    margin: 0,
    color: colors.title,
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.025em',
  };

  const squadCountBadgeStyle = (isComplete: boolean): CSSProperties => ({
    fontSize: '13px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: isComplete ? colors.squadCompleteBg : colors.squadIncompleteBg,
    color: isComplete ? colors.squadCompleteColor : colors.squadIncompleteColor,
    border: `1px solid ${isComplete ? colors.squadCompleteBorder : colors.squadIncompleteBorder}`,
  });

  const metricBoxStyle = (textColor: string, bgColor: string): CSSProperties => ({
    padding: '10px 4px',
    borderRadius: '10px',
    backgroundColor: bgColor,
    color: textColor,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${bgColor}`,
    width: '100%',
    boxSizing: 'border-box',
  });

  const tableContainerStyle: CSSProperties = {
    maxHeight: '260px',
    overflowY: 'auto',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
  };

  const thRowStyle: CSSProperties = {
    backgroundColor: colors.tableHeaderBg,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  };

  const thStyle = {
    padding: '10px 14px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    color: colors.thColor,
    borderBottom: `2px solid ${colors.thBorder}`,
    letterSpacing: '0.05em',
  };

  const trStyle = (index: number): CSSProperties => ({
    backgroundColor: index % 2 === 0 ? colors.trEven : colors.trOdd,
    borderBottom: `1px solid ${colors.trBorder}`,
    transition: 'background-color 0.2s ease',
  });

  const tdStyle = {
    padding: '10px 14px',
    fontSize: '14px',
    color: colors.tdColor,
    verticalAlign: 'middle' as const,
  };

  const emptyStateStyle: CSSProperties = {
    padding: '30px',
    textAlign: 'center',
    color: colors.emptyColor,
    fontStyle: 'italic',
    background: colors.emptyBg,
    borderRadius: '8px',
    border: `1px dashed ${colors.emptyBorder}`,
  };

  if (!rows || rows.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={titleStyle}>{teamName}</h3>
        <p style={{ color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
          No player data found for this range.
        </p>
      </div>
    );
  }

  const teamPlayers = rows.slice(1);
  const currentPlayerCount = teamPlayers.length;

  const current_spend = teamPlayers.reduce((acc: number, player: SheetRow) => {
    const price = player[5] ? parseFloat(player[5].toString().replace(/[^0-9.]/g, '')) : 0;
    return acc + price;
  }, 0);

  const remaining_budget = TOTAL_BUDGET - current_spend;

  const slotsRemaining = Math.max(0, MIN_PLAYERS - currentPlayerCount);
  const reservedForOthers = slotsRemaining > 1 ? (slotsRemaining - 1) * MIN_PLAYER_BASE_PRICE : 0;
  const max_bid = slotsRemaining > 0 ? remaining_budget - reservedForOthers : remaining_budget;

  const maxBidLow = max_bid <= MIN_PLAYER_BASE_PRICE;

  return (
    <div style={cardStyle}>
      <div style={headerFlexStyle}>
        <h3 style={titleStyle}>{teamName}</h3>
        <span style={squadCountBadgeStyle(currentPlayerCount >= MIN_PLAYERS)}>
          Squad: {currentPlayerCount} / {MIN_PLAYERS}
        </span>
      </div>

      <div style={dashboardGridStyle}>
        <div style={metricBoxStyle(colors.metricPurseText, colors.metricPurseBg)}>
          <span style={metricLabelStyle}>Purse Left</span>
          <span style={metricValueStyle}>{remaining_budget.toFixed(0)}</span>
        </div>
        <div style={metricBoxStyle(colors.metricSpentText, colors.metricSpentBg)}>
          <span style={metricLabelStyle}>Spent</span>
          <span style={metricValueStyle}>{current_spend.toFixed(0)}</span>
        </div>
        <div style={metricBoxStyle(
          maxBidLow ? colors.metricBadText : colors.metricGoodText,
          maxBidLow ? colors.metricBadBg : colors.metricGoodBg
        )}>
          <span style={metricLabelStyle}>Max Bid</span>
          <span style={metricValueStyle}>{max_bid > 0 ? max_bid.toFixed(0) : 0}</span>
        </div>
      </div>

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
                  <td style={{ ...tdStyle, fontWeight: '600', color: colors.tdNameColor }}>{player[1]}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold', color: colors.tdPriceColor }}>
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

const headerFlexStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
};

const dashboardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '8px',
  marginBottom: '20px',
  width: '100%',
};

const metricLabelStyle: CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  opacity: 0.9,
  marginBottom: '4px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
};

const metricValueStyle = {
  fontSize: '18px',
  fontWeight: '800',
  letterSpacing: '-0.025em',
};

export default SingleTeamCard;
