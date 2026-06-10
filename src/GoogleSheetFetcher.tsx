import { useEffect, useState, type ReactNode } from 'react';
import type { SheetRow } from './types';

interface GoogleSheetFetcherProps {
  apiKey: string | undefined;
  spreadsheetId: string | undefined;
  range: string;
  children: (data: SheetRow[]) => ReactNode;
}

function GoogleSheetFetcher({ apiKey, spreadsheetId, range, children }: GoogleSheetFetcherProps) {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey || !spreadsheetId || !range) return;

    const fetchSheetData = async () => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Google API Error! Status: ${response.status}`);
        }
        const result = await response.json();

        setData(result.values || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching live auction data:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();

    const interval = setInterval(fetchSheetData, 30000);

    return () => clearInterval(interval);

  }, [apiKey, spreadsheetId, range]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#4b5563' }}>
        ⏳ Loading Live Auction Data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
        <strong>⚠️ Auction Sync Error:</strong> {error}
        <p style={{ fontSize: '12px', marginTop: '5px', color: '#991b1b' }}>
          Please verify your API key, spreadsheet permissions, and tab range settings.
        </p>
      </div>
    );
  }

  return children(data);
}

export default GoogleSheetFetcher;
