import React, { useState } from 'react';

function App() {
  // Form States - Defaulting to Home Workout now!
  const [trainingEnvironment, setTrainingEnvironment] = useState('Home Workout');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('Fat Loss');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [weeklyFrequency, setWeeklyFrequency] = useState(4);
  const [equipmentArsenal, setEquipmentArsenal] = useState([]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState('');
  const [error, setError] = useState('');

  const equipmentOptions = ['Dumbbells', 'Pull-up Bar', 'Resistance Bands', 'Kettlebells', 'Bodyweight Only'];

  const handleEquipmentChange = (item) => {
    if (equipmentArsenal.includes(item)) {
      setEquipmentArsenal(equipmentArsenal.filter((i) => i !== item));
    } else {
      setEquipmentArsenal([...equipmentArsenal, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoutine('');

    // Payload perfectly mapped to match FastAPI's Pydantic schema
    const payload = {
      trainingEnvironment,
      weight: parseFloat(weight) || 0,
      height: parseFloat(height) || 0,
      fitnessGoal,
      experienceLevel,
      weeklyFrequency: parseInt(weeklyFrequency, 10),
      equipmentArsenal
    };

    try {
      const response = await fetch('https://gym-ai-backend-8b05.onrender.com/api/generate-routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP link failure status: ${response.status}`);
      }

      const data = await response.json();
      setRoutine(data.routine);
    } catch (err) {
      setError(`Diagnostic Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-gray-100 flex flex-col items-center justify-start p-4 md:p-8"
      style={{
        backgroundColor: '#0a0a0c',
        // Updated to a cinematic home training/garage setup background image
        backgroundImage: 'linear-gradient(to bottom, rgba(10, 10, 12, 0.85), rgba(10, 10, 12, 0.95)), url("https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1920&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Header Container */}
      <header className="text-center my-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-white uppercase mb-2" style={{ letterSpacing: '0.15em' }}>
          Biometric System Engine
        </h1>
        <p className="text-xs md:text-sm text-cyan-400 font-medium tracking-widest uppercase opacity-80">
          Integrated BMI Tracking, Water Configurations & Diet Calculation
        </p>
      </header>

      {/* Main Grid Layout */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Control Panel Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-black/60 backdrop-blur-md p-6 rounded-xl border border-zinc-800/80 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold tracking-wide text-white uppercase border-l-4 border-red-500 pl-3">
            Biometric Parameters
          </h2>

          {/* Training Environment Toggle */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Training Environment</label>
            <div className="grid grid-cols-2 gap-3">
              {['Full Gym', 'Home Workout'].map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setTrainingEnvironment(env)}
                  className={`py-2.5 rounded font-bold uppercase text-xs tracking-wider transition-all duration-200 ${
                    trainingEnvironment === env 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Weight (KG)</label>
              <input
                type="number"
                placeholder="e.g. 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Height (CM)</label>
              <input
                type="number"
                placeholder="e.g. 172"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Fitness Goal Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Fitness Goal</label>
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Fat Loss">Fat Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Endurance">Endurance & Stamina</option>
              <option value="Calisthenics">Calisthenics Skills</option>
            </select>
          </div>

          {/* Experience Level Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced / Elite</option>
            </select>
          </div>

          {/* Weekly Frequency Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Weekly Frequency</label>
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{weeklyFrequency} Training Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={weeklyFrequency}
              onChange={(e) => setWeeklyFrequency(e.target.value)}
              className="w-full accent-red-600 bg-zinc-800 h-1 rounded-lg cursor-pointer"
            />
          </div>

          {/* Equipment Arsenal Checklist */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Available Home Equipment</label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((item) => {
                const selected = equipmentArsenal.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleEquipmentChange(item)}
                    className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide border transition-all duration-150 ${
                      selected 
                        ? 'bg-zinc-800 border-cyan-500 text-cyan-400' 
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-sm uppercase tracking-widest py-3 rounded shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Compiling Home Routine...' : 'Launch Plan'}
          </button>
        </form>

        {/* Right Output Dashboard Display Panel */}
        <section className="lg:col-span-7 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-zinc-800/80 shadow-2xl min-h-[500px] flex flex-col">
          
          {/* Error Message Render block */}
          {error && (
            <div className="bg-red-950/40 border border-red-900 text-red-400 px-4 py-3 rounded font-semibold text-sm text-center mb-4 tracking-wide animate-pulse">
              {error}
            </div>
          )}

          {/* Standby Default Screen Layer */}
          {!loading && !routine && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="text-zinc-600 text-5xl font-thin tracking-widest uppercase animate-pulse">Core Status: Standby</div>
              <p className="text-xs text-zinc-500 max-w-sm tracking-wide">
                Configure your home biometric parameters and available arsenal options to compile structure matrices inside your display output viewport.
              </p>
            </div>
          )}

          {/* Loading Processing State Spinner Layer */}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-t-red-600 border-zinc-800 rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
                Analyzing Metrics & Synthesizing Home Routine...
              </p>
            </div>
          )}

          {/* Output Presentation Content Area */}
          {routine && !loading && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <h3 className="text-lg font-bold tracking-wide text-cyan-400 uppercase">Generated Home Routine</h3>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Matrix Live</span>
              </div>
              <div className="flex-1 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                {routine}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;