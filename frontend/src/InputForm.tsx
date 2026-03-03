import { type FormEvent, useState } from "react";
import { type AnalyzeResponse, analyze } from "./api";

interface InputFormProps {
  onResult: (result: AnalyzeResponse) => void;
  onError: (message: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export function InputForm({
  onResult,
  onError,
  onLoadingChange,
}: InputFormProps) {
  const [text, setText] = useState("");
  const [useOwnKey, setUseOwnKey] = useState(false);
  const [groqKey, setGroqKey] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onError("");

    if (!text.trim()) {
      onError("Please paste some text to analyze.");
      return;
    }

    if (useOwnKey && !groqKey.trim()) {
      onError("Please provide your Groq API key or switch to app key.");
      return;
    }

    onLoadingChange(true);
    try {
      const result = await analyze({
        text,
        use_own_key: useOwnKey,
        groq_api_key: useOwnKey ? groqKey.trim() : undefined,
      });
      onResult(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred.";
      onError(message);
    } finally {
      onLoadingChange(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h2>Input</h2>
      <label className="field">
        <span>Paste up to two pages of text</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          placeholder="Paste your content here..."
        />
      </label>

      <fieldset className="field">
        <legend>Groq API key</legend>
        <label className="inline">
          <input
            type="radio"
            name="key-mode"
            checked={!useOwnKey}
            onChange={() => setUseOwnKey(false)}
          />
          <span>Use app key (server configured)</span>
        </label>
        <label className="inline">
          <input
            type="radio"
            name="key-mode"
            checked={useOwnKey}
            onChange={() => setUseOwnKey(true)}
          />
          <span>Use my own Groq key</span>
        </label>

        {useOwnKey && (
          <input
            type="password"
            value={groqKey}
            onChange={(e) => setGroqKey(e.target.value)}
            placeholder="sk_..."
          />
        )}
      </fieldset>

      <button type="submit" className="primary">
        Analyze
      </button>
    </form>
  );
}
