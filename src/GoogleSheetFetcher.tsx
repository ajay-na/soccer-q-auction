import { useEffect, useState } from 'react';

function GoogleSheetFetcher({ apiKey, spreadsheetId, range, children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Guard clause: Don't run if vital keys are missing
    if (!apiKey || !spreadsheetId || !range) return;

    const fetchSheetData = async () => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Google API Error! Status: ${response.status}`);
        }
        const result = await response.json();
        
        // Google Sheets API returns raw rows inside a "values" array
        setData(result.values || []);
        setError(null); // Clear any previous errors if it recovers
      } catch (err) {
        console.error("Error fetching live auction data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 2. Fetch data immediately on component load
    fetchSheetData(); 
    
    // 3. ⚡ Live Auction Sync: Pull fresh data from Google Sheets every 3 seconds
    const interval = setInterval(fetchSheetData, 30000); 

    // 4. Cleanup: Clear the timer when the user closes/leaves the page
    return () => clearInterval(interval); 

  }, [apiKey, spreadsheetId, range]);

  // 5. Render States
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

  // 6. Return the raw data arrays back up to your UI components using render props
  return children(data);
}

export default GoogleSheetFetcher;