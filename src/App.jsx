import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    goal: '', 
    experience_level: 'Intermediate',
    days_per_week: 4, // Keeps track of the selected number cleanly
    equipment: [],
    workout_place: '', 
    weight_kg: '',
    height_cm: ''
  });

  const [routineData, setRoutineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reminder, setReminder] = useState(''); 

  const equipmentOptions = ['Barbell', 'Dumbbells', 'Cables', 'Kettlebells', 'Bodyweight'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'days_per_week' ? parseInt(value, 10) : value 
    }));
  };

  const handleCheckboxChange = (item) => {
    setFormData((prev) => {
      const updated = prev.equipment.includes(item)
        ? prev.equipment.filter((eq) => eq !== item)
        : [...prev.equipment, item];
      return { ...prev, equipment: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setReminder('');

    if (!formData.workout_place) {
      setReminder('Please choose a Training Environment setting before launching.');
      return;
    }
    if (!formData.goal) {
      setReminder('Please select a specific Fitness Goal objective.');
      return;
    }
    if (!formData.weight_kg || !formData.height_cm) {
      setReminder('Please enter complete weight and height data fields.');
      return;
    }

    setLoading(true);
    setRoutineData(null);

    const targetTab = window.open('', '_blank');
    targetTab.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Compiling Biometric Metrics...</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body { background-color: #0b0f19; color: #f8fafc; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: 'Roboto', sans-serif; }
          .spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.05); border-top: 4px solid #b91c1c; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <h2 style="font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">MATRIX ENGINE: CONSTRUCTING MATRIX DATA TABLES...</h2>
      </body>
      </html>
    `);

    try {
      const response = await fetch('http://127.0.0.1:8080/api/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`HTTP link failure status: ${response.status}`);
      
      const data = await response.json();
      setRoutineData(data);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${data.split_title || 'AI Workout Profile'}</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Roboto', sans-serif; background-color: #0b0f19; color: #e2e8f0; padding: 40px; margin: 0; }
            .header { text-align: center; border-bottom: 2px solid #b91c1c; padding-bottom: 20px; margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .stat-card { background-color: #111625; border: 1px solid #1e293b; padding: 20px; border-radius: 12px; border-left: 4px solid #b91c1c; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
            .section-title { color: #e2e8f0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-top: 40px; font-weight: 700; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; background-color: #111625; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #1e293b; }
            th { background-color: #1e293b; color: #fff; padding: 14px 18px; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
            td { padding: 14px 18px; border-bottom: 1px solid #1e293b; color: #cbd5e1; font-size: 0.95rem; }
            tr:last-child td { border-bottom: none; }
            tr:hover td { background-color: rgba(255,255,255,0.02); }
            
            .inner-list { margin: 0; padding-left: 15px; list-style-type: square; }
            .inner-list li { margin-bottom: 6px; color: #cbd5e1; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 2.2rem; letter-spacing: 2px; font-weight: 900; text-transform: uppercase;">${data.split_title}</h1>
            <p style="color: #94a3b8; font-style: italic; margin-top: 8px; font-size: 1.05rem;">"${data.overview}"</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">BIOMETRIC ANALYSIS BMI</div>
              <div style="font-size: 1.8rem; font-weight: 900; margin-top: 4px;">${data.calculated_bmi} <span style="font-size: 1.1rem; color: #b91c1c;">(${data.bmi_status})</span></div>
            </div>
            <div class="stat-card" style="border-left-color: #38bdf8;">
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">TARGET HYDRATION INTAKE</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: #38bdf8; margin-top: 4px;">${data.water_target_liters} LITERS</div>
            </div>
            <div class="stat-card" style="border-left-color: #f59e0b;">
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">DAILY ENERGY TARGET</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: #f59e0b; margin-top: 4px;">${data.total_daily_calories_target} KCAL</div>
            </div>
          </div>

          <div class="stat-card" style="border-left-color: #cbd5e1; margin-bottom: 40px; background-color: rgba(30, 41, 59, 0.3); width: auto;">
            <strong style="color: #cbd5e1; font-weight: 700; text-transform: uppercase;">CLINICAL BIOMETRIC ASSESSMENT NOTE:</strong> ${data.bmi_assessment}
          </div>

          <h2 class="section-title">Daily Calorie Target and Macro Distributions</h2>
          <table>
            <thead>
              <tr>
                <th>Macro Element Source</th>
                <th>Target Allocation Amount</th>
                <th>Percentage Split Level</th>
              </tr>
            </thead>
            <tbody>
              ${data.macro_distribution_table?.map(row => `
                <tr>
                  <td style="font-weight: 700; color: #fff;">${row.label}</td>
                  <td>${row.target_g} grams</td>
                  <td style="color: #f59e0b; font-weight: 700;">${row.percentage}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2 class="section-title">Workout Split Performance Schedule</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Training Split Phase</th>
                <th style="width: 25%;">Muscle Group Focus</th>
                <th style="width: 50%;">Assigned Exercise Movements and Protocols</th>
              </tr>
            </thead>
            <tbody>
              ${data.workout_table?.map(day => `
                <tr>
                  <td style="font-weight: 700; color: #fff; vertical-align: top;">${day.day_name}</td>
                  <td style="color: #b91c1c; font-weight: 700; vertical-align: top;">${day.focus}</td>
                  <td>
                    <ul class="inner-list">
                      ${day.exercises?.map(ex => `
                        <li><strong>${ex.name}</strong>: ${ex.sets} Sets x ${ex.reps}</li>
                      `).join('')}
                    </ul>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      targetTab.document.open();
      targetTab.document.write(htmlContent);
      targetTab.document.close();

    } catch (err) {
      setError(err.message || 'Failed to link with FastAPI backend.');
      targetTab.close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={uiStyles.container}>
      <div style={uiStyles.bgOverlay}></div>

      {reminder && (
        <div style={uiStyles.modalOverlay}>
          <div style={uiStyles.modalBox}>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2rem' }}>Selection Required</h3>
            <p style={{ margin: '0 0 20px 0', color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{reminder}</p>
            <button onClick={() => setReminder('')} style={uiStyles.modalButton}>Acknowledge</button>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <header style={uiStyles.headerBlock}>
          <h1 style={uiStyles.brandTitle}>BIOMETRIC SYSTEM ENGINE</h1>
          <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '1.1rem', letterSpacing: '1px' }}>
            INTEGRATED BMI TRACKING, WATER CONFIGURATIONS & DIET CALCULATION
          </p>
        </header>

        <div style={uiStyles.layoutGrid}>
          <section style={uiStyles.card}>
            <h2 style={uiStyles.cardTitle}>Configuration Panel</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              <div>
                <label style={uiStyles.label}>Training Environment</label>
                <div style={uiStyles.tabContainer}>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, workout_place: 'Gym' }))}
                    style={{ ...uiStyles.tabButton, backgroundColor: formData.workout_place === 'Gym' ? '#1e293b' : 'transparent', color: formData.workout_place === 'Gym' ? '#fff' : '#94a3b8' }}
                  >
                    Full Gym
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, workout_place: 'Home' }))}
                    style={{ ...uiStyles.tabButton, background: formData.workout_place === 'Home' ? 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)' : 'transparent', color: '#fff', boxShadow: formData.workout_place === 'Home' ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none' }}
                  >
                    Home Workout
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={uiStyles.label}>Weight (KG)</label>
                  <input type="number" name="weight_kg" placeholder="e.g. 72" value={formData.weight_kg} onChange={handleInputChange} style={uiStyles.inputBox} />
                </div>
                <div>
                  <label style={uiStyles.label}>Height (CM)</label>
                  <input type="number" name="height_cm" placeholder="e.g. 175" value={formData.height_cm} onChange={handleInputChange} style={uiStyles.inputBox} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={uiStyles.label}>Goal</label>
                  <select name="goal" value={formData.goal} onChange={handleInputChange} style={uiStyles.select}>
                    <option value="">Select Goal</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Endurance">Endurance</option>
                  </select>
                </div>
                <div>
                  <label style={uiStyles.label}>Experience Level</label>
                  <select name="experience_level" value={formData.experience_level} onChange={handleInputChange} style={uiStyles.select}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* 🌟 FIXED: Days Per Week select elements in single row configuration */}
              <div>
                <label style={uiStyles.label}>Days per Week</label>
                <select name="days_per_week" value={formData.days_per_week} onChange={handleInputChange} style={uiStyles.select}>
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5">5 Days</option>
                  <option value="6">6 Days</option>
                  <option value="7">7 Days</option>
                </select>
              </div>

              <div>
                <label style={uiStyles.label}>Equipment Arsenal</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {equipmentOptions.map((item) => {
                    const isChecked = formData.equipment.includes(item);
                    return (
                      <label key={item} style={{ ...uiStyles.pillCheckbox, backgroundColor: isChecked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)', borderColor: isChecked ? '#b91c1c' : '#334155', color: isChecked ? '#fff' : '#94a3b8', boxShadow: isChecked ? '0 0 10px rgba(239, 68, 68, 0.2)' : 'none' }}>
                        <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange(item)} style={{ marginRight: '6px', accentColor: '#b91c1c' }} />
                        {item}
                      </label>
                    );
                  })}
                </div>
              </div>
            </form>
          </section>

          <section style={uiStyles.card}>
            <h2 style={uiStyles.cardTitle}>Core Status</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={uiStyles.statusBox}>
                {routineData ? 'Plan compiled successfully. Check your open tabs.' : 'Empty state to later message.'}
              </div>

              <button type="button" onClick={handleSubmit} disabled={loading} style={uiStyles.button}>
                {loading ? 'COMPILING REGIMEN...' : 'LAUNCH PLAN'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const uiStyles = {
  container: { maxWidth: '100%', padding: '40px', fontFamily: '"Roboto", sans-serif', backgroundColor: '#0b0f19', minHeight: '100vh', position: 'relative' },
  bgOverlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
    backgroundImage: `linear-gradient(rgba(11, 15, 25, 0.85), rgba(11, 15, 25, 0.95)), url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070')`,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
  },
  headerBlock: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '30px' },
  brandTitle: { margin: 0, fontSize: '2.4rem', fontWeight: '900', letterSpacing: '3px', color: '#fff', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '20px', borderRadius: '4px', background: 'rgba(17, 22, 37, 0.4)', boxShadow: '0 0 20px rgba(239, 68, 68, 0.05)' },
  layoutGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '35px', alignItems: 'start' },
  card: { backgroundColor: 'rgba(17, 22, 37, 0.75)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '16px', border: '1px solid #b91c1c', boxShadow: '0 0 25px rgba(239, 68, 68, 0.15)' },
  cardTitle: { margin: '0 0 25px 0', fontSize: '1.3rem', color: '#fff', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tabContainer: { display: 'flex', backgroundColor: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b' },
  tabButton: { flex: 1, padding: '12px', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease' },
  label: { display: 'block', fontWeight: '700', marginBottom: '8px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' },
  inputBox: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f1422', color: '#fff', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f1422', color: '#f8fafc', cursor: 'pointer', outline: 'none' },
  pillCheckbox: { display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: '8px', border: '1px solid', fontSize: '0.9rem', cursor: 'pointer' },
  statusBox: { width: '100%', minHeight: '80px', padding: '15px', backgroundColor: '#0f1422', borderRadius: '8px', border: '1px solid #1e293b', color: '#94a3b8', boxSizing: 'border-box', display: 'flex', alignItems: 'center' },
  button: { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 20px rgba(185, 28, 28, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { backgroundColor: '#111625', border: '2px solid #b91c1c', padding: '25px', borderRadius: '12px', width: '380px', textAlign: 'center', boxShadow: '0 10px 30px rgba(185, 28, 28, 0.3)' },
  modalButton: { padding: '10px 24px', backgroundColor: '#b91c1c', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' },
  spinner: { width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.05)', borderTop: '4px solid #b91c1c', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};