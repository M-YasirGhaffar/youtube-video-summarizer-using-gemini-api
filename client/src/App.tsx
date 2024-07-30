import { useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import Input from "./Input";
import "./App.css";

const EXAMPLES = [
  { label: "TED — How to make stress your friend", url: "https://www.youtube.com/watch?v=RcGyVTAoXEU" },
  { label: "MKBHD — Latest tech review", url: "https://www.youtube.com/watch?v=NU4zsjX3UO4" },
  { label: "Veritasium — The Biggest Myth in Education", url: "https://www.youtube.com/watch?v=rhgwIhB58PA" },
];

const App: React.FC = () => {
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleSearch = async () => {
    if (!videoUrl.trim()) return;
    setIsLoading(true);
    setError("");
    setSummary("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}`,
        { videoUrl }
      );
      setSummary(response.data.summary);
    } catch (err) {
      setError(
        "Could not summarize this video. The video may not have captions available, or the API quota may be exceeded."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExample = (url: string) => {
    setVideoUrl(url);
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-badge">
          <span className="hero-dot" />
          Powered by Gemini AI
        </div>
        <h1 className="hero-title">
          Turn any YouTube video into <span className="hero-grad">structured notes</span>
        </h1>
        <p className="hero-subtitle">
          Paste a YouTube link and get a detailed, well-formatted summary in seconds.
          No more sitting through hour-long videos looking for the key points.
        </p>
      </header>

      <div className="input-wrapper">
        <Input
          searchQuery={videoUrl}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      {!summary && !isLoading && !error && (
        <div className="examples">
          <p className="examples-label">Try one of these:</p>
          <div className="examples-grid">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.url}
                className="example-card"
                onClick={() => handleExample(ex.url)}
              >
                <span className="example-icon">▶</span>
                <span className="example-text">{ex.label}</span>
              </button>
            ))}
          </div>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Fast</h3>
              <p>Summaries in under 30 seconds for most videos</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📝</div>
              <h3>Structured</h3>
              <p>Headings, bullet points, and key takeaways</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎯</div>
              <h3>Accurate</h3>
              <p>Uses the video's actual transcript, not guesses</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Fetching transcript and generating summary…</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {summary && (
        <div className="output-wrapper">
          <div className="markdown-wrapper">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Built with React, Vite, and the Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
