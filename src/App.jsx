import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    goal: '', 
    experience_level: 'Intermediate',
    days_per_week: 4,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (reminder) setReminder(''); 
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
      setReminder('Please select your Training Environment (Full Gym or Home)!');
      return;
    }
    if (!formData.goal) {
      setReminder('Please pick a clear Fitness Goal from the dropdown selection!');
      return;
    }
    if (!formData.weight_kg || !formData.height_cm) {
      setReminder('Enter valid Height & Weight metrics to compute your structural BMI thresholds!');
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
          body { background-color: #111; color: #f8fafc; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: 'Roboto', sans-serif; }
          .spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.05); border-top: 4px solid #ef4444; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
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
            body { font-family: 'Roboto', sans-serif; background-color: #111; color: #e2e8f0; padding: 40px; margin: 0; }
            .header { text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 20px; margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .stat-card { background-color: #1a1a1a; border: 1px solid #2a2a2a; padding: 20px; border-radius: 12px; border-left: 4px solid #ef4444; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
            .section-title { color: #ef4444; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #2a2a2a; padding-bottom: 8px; margin-top: 40px; font-weight: 700; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; background-color: #1a1a1a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            th { background-color: #2a2a2a; color: #ef4444; padding: 14px 18px; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
            td { padding: 14px 18px; border-bottom: 1px solid #2a2a2a; color: #cbd5e1; font-size: 0.95rem; }
            tr:last-child td { border-bottom: none; }
            tr:hover td { background-color: rgba(255,255,255,0.02); }
            
            .inner-list { margin: 0; padding-left: 15px; }
            .inner-list li { margin-bottom: 4px; }
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
              <div style="font-size: 1.8rem; font-weight: 900; margin-top: 4px;">${data.calculated_bmi} <span style="font-size: 1.1rem; color: #ef4444;">(${data.bmi_status})</span></div>
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
                  <td style="color: #ef4444; font-weight: 700; vertical-align: top;">${day.focus}</td>
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

          <h2 class="section-title" style="color: #f59e0b;">Tailored Indian Origin Macro Nutrition</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Meal Timing Window</th>
                <th style="width: 60%;">Authentic Indian Food Items and Quantities</th>
                <th style="width: 15%;">Estimated Protein</th>
              </tr>
            </thead>
            <tbody>
              ${data.indian_diet_table?.map(meal => `
                <tr>
                  <td style="font-weight: 700; color: #f59e0b; vertical-align: top;">${meal.meal_time}</td>
                  <td style="color: #e2e8f0; line-height: 1.6;">${meal.food_items}</td>
                  <td style="color: #38bdf8; font-weight: 700; vertical-align: top;">${meal.protein_g}g Protein</td>
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
      <div style={uiStyles.bgOverlay}>
        <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070" alt="Gym" style={uiStyles.bgImage} />
        <img src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2070" alt="Home" style={uiStyles.bgImage} />
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <header style={uiStyles.headerBlock}>
          <h1 style={uiStyles.brandTitle}>BIOMETRIC SYSTEM ENGINE</h1>
          <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '1.1rem', letterSpacing: '1px' }}>
            INTEGRATED BMI TRACKING, WATER CONFIGURATIONS & DIET CALCULATION
          </p>
        </header>

        {reminder && <div style={uiStyles.reminderBanner}>{reminder}</div>}

        <div style={uiStyles.layoutGrid}>
          <section style={uiStyles.card}>
            <h2 style={uiStyles.cardTitle}>Biometric Parameters</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              <div>
                <label style={uiStyles.label}>Training Environment</label>
                <div style={uiStyles.tabContainer}>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, workout_place: 'Gym' }))}
                    style={{ ...uiStyles.tabButton, backgroundColor: formData.workout_place === 'Gym' ? '#ef4444' : 'transparent' }}
                  >
                    Full Gym
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, workout_place: 'Home' }))}
                    style={{ ...uiStyles.tabButton, backgroundColor: formData.workout_place === 'Home' ? '#ef4444' : 'transparent' }}
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

              <div>
                <label style={uiStyles.label}>Fitness Goal</label>
                <select name="goal" value={formData.goal} onChange={handleInputChange} style={uiStyles.select}>
                  <option value="">-- Choose Target Objective --</option>
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

              <div>
                <label style={uiStyles.label}>Weekly Frequency: <span style={{ color: '#ef4444' }}>{formData.days_per_week} Training Days</span></label>
                <input type="range" name="days_per_week" min="1" max="7" value={formData.days_per_week} onChange={handleInputChange} style={{ width: '100%', accentColor: '#ef4444' }} />
              </div>

              <div>
                <label style={uiStyles.label}>Equipment Arsenal</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {equipmentOptions.map((item) => {
                    const isChecked = formData.equipment.includes(item);
                    return (
                      <label key={item} style={{ ...uiStyles.pillCheckbox, backgroundColor: isChecked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)', borderColor: isChecked ? '#ef4444' : '#334155', color: isChecked ? '#f8fafc' : '#94a3b8' }}>
                        <input type="checkbox" checked={isChecked} onChange={() => handleCheckboxChange(item)} style={{ marginRight: '6px', accentColor: '#ef4444' }} />
                        {item}
                      </label>
                    );
                  })}
                </div>
              </div>

              <button type="submit" disabled={loading} style={uiStyles.button}>
                {loading ? 'COMPILING REGIMEN...' : 'LAUNCH PLAN'}
              </button>
            </form>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {error && <div style={uiStyles.errorCard}><strong>Diagnostic Error:</strong> {error}</div>}

            {!routineData && !loading && !error && (
              <div style={uiStyles.emptyState}>
                <p style={{ fontSize: '1.4rem', color: '#f1f5f9', fontWeight: '800', textTransform: 'uppercase' }}>Core Status: Standby</p>
                <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>Configure parameters. All targeted data compiles straight to clean matrix layout tables inside a separate tab view.</p>
              </div>
            )}

            {loading && (
              <div style={uiStyles.emptyState}>
                <div style={uiStyles.spinner}></div>
                <p style={{ marginTop: '20px', fontWeight: '700', color: '#ef4444', letterSpacing: '2px' }}>TAB DISPATCH ACTIVE...</p>
              </div>
            )}

            {routineData && (
              <div style={uiStyles.emptyState}>
                <p style={{ fontSize: '1.4rem', color: '#22c55e', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>COMPILATION COMPLETE</p>
                <p style={{ margin: '8px 0 0 0', color: '#cbd5e1' }}>Tables loaded cleanly into the isolated window layer. Check your open tabs!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const uiStyles = {
  container: { maxWidth: '100%', padding: '40px', fontFamily: '"Roboto", sans-serif', backgroundColor: '#111', minHeight: '100vh', position: 'relative' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', zIndex: 1 },
  bgImage: { width: '50%', height: '100%', objectFit: 'cover', opacity: 0.12 },
  headerBlock: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '30px' },
  brandTitle: { margin: 0, fontSize: '2.4rem', fontWeight: '900', letterSpacing: '3px', color: '#fff' },
  reminderBanner: { backgroundColor: '#7f1d1d', border: '1px solid #f87171', color: '#fca5a5', padding: '15px', borderRadius: '8px', marginBottom: '30px', fontWeight: '700', textAlign: 'center', fontSize: '1.05rem' },
  layoutGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px', alignItems: 'start' },
  card: { backgroundColor: 'rgba(26, 26, 26, 0.8)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' },
  cardTitle: { margin: '0 0 25px 0', fontSize: '1.3rem', color: '#fff', fontWeight: '800', borderLeft: '4px solid #ef4444', paddingLeft: '12px', textTransform: 'uppercase' },
  tabContainer: { display: 'flex', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid #2a2a2a' },
  tabButton: { flex: 1, padding: '12px', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: '700', color: '#fff', cursor: 'pointer' },
  label: { display: 'block', fontWeight: '700', marginBottom: '8px', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' },
  inputBox: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #2a2a2a', backgroundColor: '#1a1a1a', color: '#fff', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #2a2a2a', backgroundColor: '#1a1a1a', color: '#f8fafc', cursor: 'pointer' },
  pillCheckbox: { display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: '8px', border: '1px solid', fontSize: '0.9rem', cursor: 'pointer' },
  button: { width: '100%', padding: '15px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxSshadow: '0 4px 20px rgba(239, 68, 68, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' },
  emptyState: { backgroundColor: 'rgba(26, 26, 26, 0.6)', backdropFilter: 'blur(8px)', border: '2px dashed #2a2a2a', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  errorCard: { backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '15px', borderRadius: '8px' },
  spinner: { width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.05)', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};