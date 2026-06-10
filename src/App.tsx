import type { CSSProperties } from 'react';
import { AvailablePlayers } from './AvailablePlayers';
import GoogleSheetFetcher from './GoogleSheetFetcher';
import SingleTeamCard from './Team';
import { ThemeToggle, useTheme } from './theme/ThemeContext';

function App() {
  const { colors } = useTheme();
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

  const teamsConfig = [
    { name: "Team Arun & Allen", range: "Sheet1!I2:N20" },
    { name: "Team Nishad & Musafir", range: "Sheet1!P2:U20" },
    { name: "Team Rahul & Dibin", range: "Sheet1!W2:AB20" },
    { name: "Team Abishek & Mahith", range: "Sheet1!I22:N41" }
  ];

  const appContainerStyle: CSSProperties = {
    padding: '40px 16px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: colors.bgApp,
    minHeight: '100vh',
    color: colors.textPrimary,
    boxSizing: 'border-box',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  };

  const headerTopRowStyle: CSSProperties = {
    width: '100%',
    maxWidth: '1300px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '8px',
  };

  const badgeLiveStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: colors.badgeLiveBg,
    color: colors.badgeLiveColor,
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    letterSpacing: '0.05em',
    marginBottom: '12px',
    border: `1px solid ${colors.badgeLiveBorder}`,
  };

  const dotStyle = {
    width: '6px',
    height: '6px',
    backgroundColor: colors.dotLive,
    borderRadius: '50%',
    display: 'inline-block',
  };

  const titleStyle = {
    color: colors.title,
    margin: '0 0 6px 0',
    fontSize: '34px',
    fontWeight: '800',
    letterSpacing: '-0.03em',
  };

  const mainLayoutStackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    maxWidth: '1300px',
    margin: '0 auto',
    width: '100%',
  };

  const sectionStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  };

  const sectionTitleStyle = {
    margin: 0,
    color: colors.textPrimary,
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    borderLeft: `4px solid ${colors.accent}`,
    paddingLeft: '12px',
  };

  const dividerStyle = {
    border: '0',
    height: '1px',
    backgroundColor: colors.divider,
    margin: '12px 0',
  };

  const poolHeaderFlexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap' as const,
  };

  const poolNoticeStyle = {
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: colors.poolNoticeBg,
    color: colors.poolNoticeColor,
    padding: '4px 12px',
    borderRadius: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap' as const,
  };

  const poolWrapperStyle: CSSProperties = {
    backgroundColor: colors.poolWrapperBg,
    borderRadius: '16px',
    border: `1px solid ${colors.poolWrapperBorder}`,
    boxShadow: colors.poolWrapperShadow,
    padding: '6px',
    overflow: 'hidden',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  };

  return (
    <div style={appContainerStyle}>
      <header style={headerStyle}>
        <div style={headerTopRowStyle}>
          <ThemeToggle />
        </div>
        <div style={badgeLiveStyle}>
          <span style={dotStyle}></span> LIVE UPDATES
        </div>
        <h1 style={titleStyle}>LIVE AUCTION BOARD</h1>
      </header>

      <div style={mainLayoutStackStyle}>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>👥 Team Squads Status</h2>

          <style>{`
            .teams-grid-container {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
              width: 100%;
              box-sizing: border-box;
            }
            @media (min-width: 768px) {
              .teams-grid-container {
                grid-template-columns: 1fr 1fr;
              }
            }
          `}</style>

          <div className="teams-grid-container">
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

        <hr style={dividerStyle} />

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

export default App;
