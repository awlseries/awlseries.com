// components/Test/TrackerApiTest.jsx
import { useEffect, useState } from 'react';
import { testTrackerApiConnection } from '/utils/trackerApi';

export default function TrackerApiTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const apiResult = await testTrackerApiConnection();
      setResult(apiResult);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Автоматически запустить тест при загрузке
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔧 Тест подключения к tracker.gg API</h2>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        style={{ marginBottom: '20px', padding: '10px 20px' }}
      >
        {loading ? 'Тестируем...' : 'Запустить тест'}
      </button>

      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: result.success ? '#338a47ff' : '#463c3dff',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <h3>{result.success ? '✅ Успешно!' : '❌ Ошибка'}</h3>
          
          <pre style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '3px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}