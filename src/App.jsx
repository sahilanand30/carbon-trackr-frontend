import { useState } from 'react';
import useStore from './store/store';
import './App.css';
import axios from 'axios';

function App() {
  const [inputs, setInputs] = useState({ distance: '', vehicleType: 'car' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); 
  const { addEntry } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get calculation
      const calcRes = await axios.post('https://carbon-trackr-backend-yxr9.onrender.com/api/calculate', inputs);
      const footprint = calcRes.data.footprint;

      // Get recommendations
      const aiRes = await axios.post('https://carbon-trackr-backend-yxr9.onrender.com/api/recommendations', {
        ...inputs,
        footprint
      });

      const entry = {
        ...inputs,
        footprint,
        recommendations: aiRes.data.recommendations,
        date: new Date().toISOString()
      };

      setResult(entry);
      addEntry(entry);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="card">
      <h1>CarbonTrackr</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Distance (km)"
          value={inputs.distance}
          onChange={(e) => setInputs({ ...inputs, distance: e.target.value })}
          required
        />
        <select
          value={inputs.vehicleType}
          onChange={(e) => setInputs({ ...inputs, vehicleType: e.target.value })}
        >
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {loading && <div className="spinner"></div>}

      {result && !loading && (
        <div className="result-container">
          <h3>Footprint: <span className="footprint-value">{result.footprint} kgCO2</span></h3>
          <h4>Recommendations:</h4>
          <p>{result.recommendations}</p>
        </div>
      )}
    </div>
  );
}

export default App;
