import "./style.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import type { AnalyzeResponse } from "./api";
import { InputForm } from "./InputForm";
import { ResultView } from "./ResultView";

function App() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="app">
      <header className="header">
        <h2>AI Summary & Sentiment / Emoji Translator</h2>
        <p className="muted">
          Paste up to two pages of text and get a four-line summary, sentiment,
          and the key sentences that drove that sentiment.
        </p>
      </header>

      <main className="layout">
        <InputForm
          onResult={(r) => {
            setError("");
            setResult(r);
          }}
          onError={(msg) => {
            setResult(null);
            setError(msg);
          }}
          onLoadingChange={setLoading}
        />
        <ResultView result={result} loading={loading} error={error} />
      </main>
    </div>
  );
}

const container = document.querySelector<HTMLDivElement>("#app");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
