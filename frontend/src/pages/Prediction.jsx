import { useState } from "react";
import api from "../services/api";

const fields = [
  {
    key: "age",
    label: "Age",
    type: "number",
    min: 29,
    max: 77,
    step: 1,
    placeholder: "Enter age (29–77)",
    hint: "Allowed range: 29–77 years",
  },
  {
    key: "sex",
    label: "Sex",
    type: "select",
    options: [
      [0, "Female"],
      [1, "Male"],
    ],
  },
  {
    key: "cp",
    label: "Chest pain type",
    type: "select",
    options: [
      [0, "Typical angina"],
      [1, "Atypical angina"],
      [2, "Non-anginal pain"],
      [3, "Asymptomatic"],
    ],
  },
  {
    key: "trestbps",
    label: "Resting blood pressure",
    type: "number",
    min: 94,
    max: 200,
    step: 1,
    placeholder: "Enter BP (94–200)",
    hint: "Allowed range: 94–200 mm Hg",
  },
  {
    key: "chol",
    label: "Cholesterol",
    type: "number",
    min: 126,
    max: 564,
    step: 1,
    placeholder: "Enter cholesterol (126–564)",
    hint: "Allowed range: 126–564 mg/dL",
  },
  {
    key: "fbs",
    label: "Fasting blood sugar >120",
    type: "select",
    options: [
      [0, "No"],
      [1, "Yes"],
    ],
  },
  {
    key: "restecg",
    label: "Resting ECG",
    type: "select",
    options: [
      [0, "Normal"],
      [1, "ST-T abnormality"],
      [2, "LV hypertrophy"],
    ],
  },
  {
    key: "thalach",
    label: "Maximum heart rate",
    type: "number",
    min: 71,
    max: 202,
    step: 1,
    placeholder: "Enter heart rate (71–202)",
    hint: "Allowed range: 71–202 bpm",
  },
  {
    key: "exang",
    label: "Exercise induced angina",
    type: "select",
    options: [
      [0, "No"],
      [1, "Yes"],
    ],
  },
  {
    key: "oldpeak",
    label: "ST depression (oldpeak)",
    type: "number",
    min: 0,
    max: 6.2,
    step: 0.1,
    placeholder: "Enter oldpeak (0–6.2)",
    hint: "Allowed range: 0–6.2",
  },
  {
    key: "slope",
    label: "Slope",
    type: "select",
    options: [
      [0, "Downsloping"],
      [1, "Flat"],
      [2, "Upsloping"],
    ],
  },
  {
    key: "ca",
    label: "Major vessels (0–4)",
    type: "number",
    min: 0,
    max: 4,
    step: 1,
    placeholder: "Enter value (0–4)",
    hint: "Allowed range: 0–4",
  },
  {
    key: "thal",
    label: "Thal",
    type: "select",
    options: [
      [0, "0"],
      [1, "1"],
      [2, "2"],
      [3, "3"],
    ],
  },
];

const initial = {
  age: "",
  sex: "",
  cp: "",
  trestbps: "",
  chol: "",
  fbs: "",
  restecg: "",
  thalach: "",
  exang: "",
  oldpeak: "",
  slope: "",
  ca: "",
  thal: "",
};

export default function Prediction() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    // Validate numeric ranges before sending to backend
    for (const field of fields) {
      if (field.type !== "number") continue;

      const value = Number(form[field.key]);

      if (form[field.key] === "") {
        setError(`${field.label} is required.`);
        return;
      }

      if (value < field.min || value > field.max) {
        setError(
          `${field.label} must be between ${field.min} and ${field.max}.`
        );
        return;
      }
    }

    setBusy(true);

    try {
      const values = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          key,
          Number(value),
        ])
      );

      const { data } = await api.post("/predictions", values);

      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Please check the values and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container narrow">
      <div className="page-heading">
        <div>
          <div className="eyebrow">Prediction</div>

          <h1>Enter clinical measurements</h1>

          <p>
            Enter values within the ranges represented in the
            heart disease dataset.
          </p>
        </div>
      </div>

      <form className="prediction-form" onSubmit={submit}>
        <div className="form-grid">
          {fields.map((field) => (
            <label key={field.key}>
              {field.label}

              {field.type === "select" ? (
                <select
                  required
                  value={form[field.key]}
                  onChange={(e) =>
                    change(field.key, e.target.value)
                  }
                >
                  <option value="">Select</option>

                  {field.options.map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    required
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) =>
                      change(field.key, e.target.value)
                    }
                  />

                  <small
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#6b7280",
                      fontSize: "12px",
                    }}
                  >
                    {field.hint}
                  </small>
                </>
              )}
            </label>
          ))}
        </div>

        {error && <div className="error">{error}</div>}

        <button
          className="btn primary full"
          disabled={busy}
          type="submit"
        >
          {busy
            ? "Running model..."
            : "Predict heart disease risk"}
        </button>
      </form>

      {result && <Result result={result} />}

      <div className="disclaimer">
        <strong>Important</strong>

        <p>
          The returned probability is a model output based on
          this dataset. It is not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}

function Result({ result }) {
  const pct = (result.probability * 100).toFixed(1);

  return (
    <section
      className={`result-card ${
        result.prediction === 1 ? "risk" : "lower"
      }`}
    >
      <div>
        <span className="result-label">Model result</span>

        <h2>
          {result.prediction === 1
            ? "Higher predicted risk"
            : "Lower predicted risk"}
        </h2>

        <p>
          Estimated probability from the trained model:{" "}
          <b>{pct}%</b>
        </p>
      </div>

      <div className="gauge">
        <b>{pct}%</b>
      </div>
    </section>
  );
}