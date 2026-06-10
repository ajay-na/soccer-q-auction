import type { CSSProperties } from 'react';
import { useTheme } from './theme/ThemeContext';
import type { SheetRow } from './types';

interface AvailablePlayersProps {
  rows: SheetRow[];
}

export function AvailablePlayers({ rows }: AvailablePlayersProps) {
  const { colors } = useTheme();

  const cardStyle: CSSProperties = {
    padding: '24px',
    background: colors.cardBg,
    borderRadius: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'background-color 0.2s ease',
  };

  const titleStyle = {
    margin: 0,
    color: colors.title,
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.025em',
  };

  const poolCountBadgeStyle = {
    fontSize: '13px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: colors.poolBadgeBg,
    color: colors.poolBadgeColor,
    border: `1px solid ${colors.poolBadgeBorder}`,
  };

  const tableContainerStyle = {
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
    padding: '12px 14px',
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
    padding: '12px 14px',
    fontSize: '14px',
    color: colors.tdColor,
    verticalAlign: 'middle' as const,
  };

  const emptyStateStyle: CSSProperties = {
    padding: '40px',
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
        <h2 style={titleStyle}>Available Players Pool (0)</h2>
        <div style={emptyStateStyle}>No players found in registry.</div>
      </div>
    );
  }

  const allPlayers = rows.slice(1);

  const availablePlayers = allPlayers.filter(
    (player: SheetRow) => player[6] && player[6].toString().toLowerCase() !== "sold"
  );

  return (
    <div style={cardStyle}>
      <div style={headerFlexStyle}>
        <h2 style={titleStyle}>Available Players Pool</h2>
        <span style={poolCountBadgeStyle}>
          📋 Remaining: {availablePlayers.length}
        </span>
      </div>

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
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: colors.tdNameColor }}>{player[1]}</td>
                  <td style={{ ...tdStyle, color: colors.tdColor }}>{player[2]}</td>
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
  marginBottom: '20px',
};
