import React, { useState } from 'react';
import NestedJSONViewer from './components/NestedJSONViewer';
import rawData from './data/sample.json';

function App() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(rawData.Test, null, 2));
  const [parsedJSON, setParsedJSON] = useState(rawData.Test);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setParsedJSON(parsed);
      setError(null);
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      {/* LEFT SIDE: JSON Viewer (unchanged position) */}
      <div style={{ flex: 1 }}>
        <NestedJSONViewer data={parsedJSON} label="Root" />
      </div>

      {/* RIGHT SIDE: JSON Editor */}
      <div style={{ width: '400px' }}>
        <h2 style={{ marginTop: 0 }}>Enter Your JSON</h2>
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          rows={20}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '14px',
            resize: 'vertical',
          }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;
