import { useState } from "react";
import { Activity, Brain, ShieldCheck, AlertTriangle, Server, Sparkles } from "lucide-react";
import "./style.css";

export default function App() {
  const [form, setForm] = useState({
    age: 28,
    monthly_income: 3200,
    years_at_company: 2,
    job_satisfaction: 3,
    overtime: "Yes",
    work_life_balance: 2,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function predict(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          monthly_income: Number(form.monthly_income),
          years_at_company: Number(form.years_at_company),
          job_satisfaction: Number(form.job_satisfaction),
          work_life_balance: Number(form.work_life_balance)
        })
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ error: "Prediction service unavailable." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="logo"><Brain /></div>
          <div>
            <h1>S6 ML Prediction</h1>
            <p>Machine Learning Intelligence Platform</p>
          </div>
        </div>
        <div className="online"><span /> SYSTEM ONLINE</div>
      </header>

      <main>
        <section className="hero">
          <div>
            <div className="eyebrow"><Sparkles /> MACHINE LEARNING PLATFORM</div>
            <h2>Predict employee<br /><b>attrition risk.</b></h2>
            <p>
              Analyze employee characteristics with a machine-learning
              inference engine and receive an instant risk assessment.
            </p>
          </div>

          <div className="stats">
            <div><Brain /><strong>ML</strong><small>Inference Engine</small></div>
            <div><Server /><strong>API</strong><small>Cloudflare Worker</small></div>
            <div><ShieldCheck /><strong>LIVE</strong><small>Production System</small></div>
          </div>
        </section>

        <section className="grid">
          <form className="card" onSubmit={predict}>
            <div className="title">
              <Activity />
              <div>
                <h3>Employee Profile</h3>
                <p>Enter prediction parameters</p>
              </div>
            </div>

            <label>Age
              <input name="age" type="number" value={form.age} onChange={change} />
            </label>

            <label>Monthly Income
              <input name="monthly_income" type="number" value={form.monthly_income} onChange={change} />
            </label>

            <label>Years at Company
              <input name="years_at_company" type="number" step="0.5" value={form.years_at_company} onChange={change} />
            </label>

            <label>Job Satisfaction
              <select name="job_satisfaction" value={form.job_satisfaction} onChange={change}>
                <option value="1">1 — Very Low</option>
                <option value="2">2 — Low</option>
                <option value="3">3 — Moderate</option>
                <option value="4">4 — High</option>
                <option value="5">5 — Very High</option>
              </select>
            </label>

            <label>Overtime
              <select name="overtime" value={form.overtime} onChange={change}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>

            <label>Work-Life Balance
              <select name="work_life_balance" value={form.work_life_balance} onChange={change}>
                <option value="1">1 — Poor</option>
                <option value="2">2 — Fair</option>
                <option value="3">3 — Good</option>
                <option value="4">4 — Very Good</option>
                <option value="5">5 — Excellent</option>
              </select>
            </label>

            <button disabled={loading}>
              {loading ? "ANALYZING..." : "RUN ML PREDICTION →"}
            </button>
          </form>

          <div className="card result">
            {!result && (
              <div className="waiting">
                <Brain />
                <h3>Awaiting Prediction</h3>
                <p>Submit an employee profile to analyze attrition risk.</p>
              </div>
            )}

            {result?.error && (
              <div className="waiting">
                <AlertTriangle />
                <h3>Service Error</h3>
                <p>{result.error}</p>
              </div>
            )}

            {result && !result.error && (
              <div className="prediction">
                {result.attrition ? <AlertTriangle className="risk" /> : <ShieldCheck className="safe" />}
                <small>MODEL PREDICTION</small>
                <h3>{result.prediction}</h3>
                <div className="percentage">{result.risk_percentage}%</div>
                <p>Estimated attrition probability</p>
                <div className="bar">
                  <div style={{ width: `${result.risk_percentage}%` }} />
                </div>
                <div className="model">Cloudflare ML Inference Engine</div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>S6 Machine Learning Prediction • React • Cloudflare Workers</footer>
    </div>
  );
}
