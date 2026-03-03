import type { AnalyzeResponse, Highlight, Sentiment } from "./api";

interface ResultViewProps {
  result: AnalyzeResponse | null;
  loading: boolean;
  error: string;
}

function sentimentLabel(sentiment: Sentiment): string {
  switch (sentiment) {
    case "positive":
      return "Positive";
    case "negative":
      return "Negative";
    default:
      return "Neutral";
  }
}

export function ResultView({ result, loading, error }: ResultViewProps) {
  return (
    <div className="panel">
      <h2>Result</h2>
      {loading && <p className="muted">Analyzing text…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && !result && (
        <p className="muted">Results will appear here after you analyze.</p>
      )}

      {result && !loading && !error && (
        <>
          <section>
            <h3>Summary (4 lines)</h3>
            <ul className="summary-list">
              {result.summary_lines.map((line, idx) => (
                <li key={idx}>{line || <span className="muted">—</span>}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Sentiment</h3>
            <span className={`badge badge-${result.sentiment}`}>
              {sentimentLabel(result.sentiment)}
            </span>
          </section>

          <section>
            <h3>Highlights with emojis</h3>
            {result.highlights.length === 0 ? (
              <p className="muted">No highlight sentences returned.</p>
            ) : (
              <ul className="highlights">
                {result.highlights.map((h: Highlight, idx: number) => (
                  <li key={idx}>
                    <span className="emoji">{h.emoji}</span>
                    <span>{h.sentence}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

