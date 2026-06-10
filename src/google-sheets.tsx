import { useEffect, useState } from 'react';
import type { SheetRow } from './types';

function GoogleSheetReader({API_KEY, SPREADSHEET_ID, RANGE}: {API_KEY: string | undefined, SPREADSHEET_ID: string | undefined, RANGE: string | undefined}) {
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchSheetData = async () => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setRows(data.values || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sheets data:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchSheetData();
  }, [SPREADSHEET_ID, API_KEY, RANGE]);

  if (loading) return <div>Loading data from Google Sheets...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Google Sheet Data</h2>
      <table border={1} cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                rowIndex === 0 
                  ? <th key={cellIndex}>{cell}</th> 
                  : <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GoogleSheetReader;
