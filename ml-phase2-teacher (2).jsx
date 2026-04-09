import { useState, useRef, useEffect } from "react";

const TOPICS = [
  {
    id: "linear-regression",
    title: "Linear Regression",
    emoji: "📈",
    tag: "Supervised",
    difficulty: "Beginner",
  },
  {
    id: "logistic-regression",
    title: "Logistic Regression",
    emoji: "🔀",
    tag: "Supervised",
    difficulty: "Beginner",
  },
  {
    id: "decision-trees",
    title: "Decision Trees",
    emoji: "🌳",
    tag: "Supervised",
    difficulty: "Beginner",
  },
  {
    id: "random-forests",
    title: "Random Forests",
    emoji: "🌲",
    tag: "Supervised",
    difficulty: "Intermediate",
  },
  {
    id: "svm",
    title: "Support Vector Machines",
    emoji: "⚔️",
    tag: "Supervised",
    difficulty: "Intermediate",
  },
  {
    id: "knn",
    title: "K-Nearest Neighbors",
    emoji: "🔍",
    tag: "Supervised",
    difficulty: "Beginner",
  },
  {
    id: "naive-bayes",
    title: "Naive Bayes",
    emoji: "🎲",
    tag: "Supervised",
    difficulty: "Beginner",
  },
  {
    id: "gradient-boosting",
    title: "Gradient Boosting (XGBoost)",
    emoji: "🚀",
    tag: "Supervised",
    difficulty: "Advanced",
  },
  {
    id: "kmeans",
    title: "K-Means Clustering",
    emoji: "🎯",
    tag: "Unsupervised",
    difficulty: "Intermediate",
  },
  {
    id: "dbscan",
    title: "DBSCAN",
    emoji: "🔵",
    tag: "Unsupervised",
    difficulty: "Intermediate",
  },
  {
    id: "pca",
    title: "PCA (Dimensionality Reduction)",
    emoji: "🗜️",
    tag: "Unsupervised",
    difficulty: "Intermediate",
  },
  {
    id: "model-essentials",
    title: "Model Essentials & Evaluation",
    emoji: "⚖️",
    tag: "Concepts",
    difficulty: "Intermediate",
  },
];

const MODES = [
  { id: "explain", label: "📖 Explain It", desc: "Simple explanation with analogies" },
  { id: "code", label: "💻 Show Code", desc: "Python code with comments" },
  { id: "quiz", label: "🧠 Quiz Me", desc: "Test your understanding" },
  { id: "interview", label: "🎯 Interview Q&A", desc: "Common interview questions" },
];

const DIFFICULTY_COLORS = {
  Beginner: { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
  Intermediate: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  Advanced: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
};

const TAG_COLORS = {
  Supervised: { bg: "#ede9fe", text: "#5b21b6" },
  Unsupervised: { bg: "#e0f2fe", text: "#0c4a6e" },
  Concepts: { bg: "#fce7f3", text: "#831843" },
};

export default function MLTeacher() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMode, setSelectedMode] = useState("explain");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [followUp, setFollowUp] = useState("");
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const buildPrompt = (topic, mode) => {
    const base = `You are an expert ML developer and teacher. The student is learning "${topic.title}" in Core Machine Learning (Phase 2).`;
    if (mode === "explain")
      return `${base} Explain "${topic.title}" in a clear, engaging way. Use:
1. A real-world analogy first (1-2 sentences)
2. What it is and how it works (3-5 sentences, simple English)
3. When to use it (2-3 bullet points)
4. Key intuition (1-2 sentences the student must remember)
Keep it conversational and motivating.`;
    if (mode === "code")
      return `${base} Show a complete, well-commented Python code example for "${topic.title}" using scikit-learn. Include:
1. Sample data (use make_classification or make_regression or simple arrays)
2. Model creation and training
3. Prediction and evaluation
4. Print results with labels
Keep comments clear for a learner. Show output as comments.`;
    if (mode === "quiz")
      return `${base} Create a 3-question quiz on "${topic.title}". For each question:
- Ask a conceptual or practical question
- Give 4 options (A, B, C, D)
- After all 3 questions, show answers with brief explanation
Make questions progressively harder. Format nicely.`;
    if (mode === "interview")
      return `${base} Give the top 5 interview questions about "${topic.title}" that ML developer roles ask. For each:
- The question (as an interviewer would ask)
- A strong, concise answer (3-5 sentences)
- One tip to stand out
Format clearly and professionally.`;
  };

  const fetchResponse = async (topic, mode, history = []) => {
    setLoading(true);
    setResponse("");
    setShowChat(false);

    const systemPrompt = `You are an expert ML developer and teacher. Be clear, practical, and encouraging. Format your responses with clear structure using emojis and sections where appropriate. Never be too academic — always connect to real-world use.`;

    const userMessage = buildPrompt(topic, mode);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c) => c.text || "").join("") || "No response.";
      setResponse(text);
      setChatHistory([{ role: "assistant", content: text }]);
    } catch (e) {
      setResponse("❌ Error fetching response. Please try again.");
    }
    setLoading(false);
  };

  const sendFollowUp = async () => {
    if (!followUp.trim() || !selectedTopic) return;
    const userMsg = followUp.trim();
    setFollowUp("");
    setShowChat(true);

    const newHistory = [...chatHistory, { role: "user", content: userMsg }];
    setChatHistory(newHistory);
    setLoading(true);

    const systemPrompt = `You are an expert ML teacher. The student is asking follow-up questions about "${selectedTopic.title}". Be concise, clear, and encouraging. Max 200 words per reply.`;

    const messages = newHistory.map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages,
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c) => c.text || "").join("") || "No response.";
      setChatHistory([...newHistory, { role: "assistant", content: text }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: "assistant", content: "❌ Error. Try again." }]);
    }
    setLoading(false);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setResponse("");
    setChatHistory([]);
    setShowChat(false);
    fetchResponse(topic, selectedMode);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    if (selectedTopic) fetchResponse(selectedTopic, mode);
  };

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.badge}>PHASE 2</div>
          <h1 style={styles.title}>Core Machine Learning</h1>
          <p style={styles.subtitle}>Your personal ML expert teacher — pick a topic, choose how to learn</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <p style={styles.sidebarLabel}>📚 12 TOPICS</p>
          {TOPICS.map((topic) => {
            const diff = DIFFICULTY_COLORS[topic.difficulty];
            const tag = TAG_COLORS[topic.tag];
            const isActive = selectedTopic?.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                style={{
                  ...styles.topicBtn,
                  background: isActive ? "#0f172a" : "#fff",
                  borderColor: isActive ? "#f59e0b" : "#e2e8f0",
                  boxShadow: isActive ? "0 0 0 2px #f59e0b" : "none",
                }}
              >
                <span style={styles.topicEmoji}>{topic.emoji}</span>
                <div style={styles.topicInfo}>
                  <span style={{ ...styles.topicTitle, color: isActive ? "#fff" : "#0f172a" }}>
                    {topic.title}
                  </span>
                  <div style={styles.topicTags}>
                    <span style={{ ...styles.tagPill, background: tag.bg, color: tag.text }}>
                      {topic.tag}
                    </span>
                    <span style={{ ...styles.tagPill, background: diff.bg, color: diff.text }}>
                      {topic.difficulty}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {!selectedTopic ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🧠</div>
              <h2 style={styles.emptyTitle}>Pick a topic to start learning</h2>
              <p style={styles.emptyDesc}>
                Select any algorithm from the left. I'll explain it, show you code, quiz you, or prep you for interviews.
              </p>
              <div style={styles.statsRow}>
                {["12 Topics", "4 Modes", "AI-Powered", "Free Forever"].map((s) => (
                  <div key={s} style={styles.statChip}>{s}</div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Topic Header */}
              <div style={styles.topicHeader}>
                <div style={styles.topicHeaderLeft}>
                  <span style={{ fontSize: 32 }}>{selectedTopic.emoji}</span>
                  <div>
                    <h2 style={styles.topicName}>{selectedTopic.title}</h2>
                    <div style={styles.topicTags}>
                      <span style={{ ...styles.tagPill, ...TAG_COLORS[selectedTopic.tag] }}>
                        {selectedTopic.tag}
                      </span>
                      <span style={{ ...styles.tagPill, ...DIFFICULTY_COLORS[selectedTopic.difficulty] }}>
                        {selectedTopic.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode Selector */}
              <div style={styles.modeRow}>
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    style={{
                      ...styles.modeBtn,
                      background: selectedMode === m.id ? "#0f172a" : "#f8fafc",
                      color: selectedMode === m.id ? "#f59e0b" : "#64748b",
                      borderColor: selectedMode === m.id ? "#f59e0b" : "#e2e8f0",
                    }}
                  >
                    <span style={styles.modeBtnLabel}>{m.label}</span>
                    <span style={styles.modeBtnDesc}>{m.desc}</span>
                  </button>
                ))}
              </div>

              {/* Response Area */}
              <div style={styles.responseBox}>
                {loading && !showChat ? (
                  <div style={styles.loadingBox}>
                    <div style={styles.spinner} />
                    <p style={styles.loadingText}>Your ML teacher is thinking...</p>
                  </div>
                ) : (
                  <pre style={styles.responseText}>{response}</pre>
                )}
              </div>

              {/* Chat Thread */}
              {showChat && chatHistory.length > 1 && (
                <div style={styles.chatBox}>
                  {chatHistory.slice(1).map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.chatBubble,
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        background: msg.role === "user" ? "#0f172a" : "#f1f5f9",
                        color: msg.role === "user" ? "#f59e0b" : "#0f172a",
                        borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      }}
                    >
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 14 }}>
                        {msg.content}
                      </pre>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ ...styles.chatBubble, background: "#f1f5f9", alignSelf: "flex-start" }}>
                      <div style={styles.spinner} />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}

              {/* Follow-up Input */}
              <div style={styles.inputRow}>
                <input
                  style={styles.input}
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendFollowUp()}
                  placeholder={`Ask a follow-up about ${selectedTopic.title}...`}
                />
                <button
                  onClick={sendFollowUp}
                  disabled={!followUp.trim() || loading}
                  style={{
                    ...styles.sendBtn,
                    opacity: !followUp.trim() || loading ? 0.5 : 1,
                  }}
                >
                  Send ↑
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "#0f172a",
    padding: "28px 32px",
    borderBottom: "3px solid #f59e0b",
  },
  headerInner: { maxWidth: 1200, margin: "0 auto" },
  badge: {
    display: "inline-block",
    background: "#f59e0b",
    color: "#0f172a",
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 3,
    padding: "4px 12px",
    borderRadius: 4,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: 700,
    margin: "0 0 6px",
    letterSpacing: -0.5,
  },
  subtitle: { color: "#94a3b8", fontSize: 15, margin: 0 },
  layout: { display: "flex", flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "24px 16px", gap: 20 },
  sidebar: {
    width: 260,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  sidebarLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#94a3b8",
    margin: "0 0 8px 4px",
  },
  topicBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    border: "1.5px solid",
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s",
    width: "100%",
  },
  topicEmoji: { fontSize: 20, flexShrink: 0 },
  topicInfo: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  topicTitle: { fontSize: 13, fontWeight: 600, lineHeight: 1.3 },
  topicTags: { display: "flex", gap: 4, flexWrap: "wrap" },
  tagPill: { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, fontFamily: "'Courier New', monospace" },
  main: { flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    background: "#fff",
    borderRadius: 16,
    border: "2px dashed #e2e8f0",
    textAlign: "center",
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" },
  emptyDesc: { color: "#64748b", fontSize: 15, maxWidth: 400, lineHeight: 1.6, margin: "0 0 24px" },
  statsRow: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" },
  statChip: {
    background: "#0f172a",
    color: "#f59e0b",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
  },
  topicHeader: {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 20px",
    border: "1.5px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topicHeaderLeft: { display: "flex", alignItems: "center", gap: 14 },
  topicName: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" },
  modeRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  modeBtn: {
    flex: 1,
    minWidth: 140,
    padding: "10px 14px",
    border: "1.5px solid",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    transition: "all 0.15s",
  },
  modeBtnLabel: { fontSize: 13, fontWeight: 700 },
  modeBtnDesc: { fontSize: 11, opacity: 0.7 },
  responseBox: {
    background: "#fff",
    borderRadius: 12,
    border: "1.5px solid #e2e8f0",
    padding: "24px",
    minHeight: 200,
    flex: 1,
  },
  loadingBox: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 160, gap: 16 },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #f59e0b",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#64748b", fontSize: 14 },
  responseText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    fontFamily: "'Georgia', serif",
    fontSize: 15,
    lineHeight: 1.75,
    color: "#1e293b",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#f8fafc",
    borderRadius: 12,
    border: "1.5px solid #e2e8f0",
    padding: 16,
    maxHeight: 300,
    overflowY: "auto",
  },
  chatBubble: {
    padding: "10px 14px",
    borderRadius: 16,
    maxWidth: "80%",
    fontSize: 14,
    lineHeight: 1.6,
  },
  inputRow: { display: "flex", gap: 10 },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    fontFamily: "'Georgia', serif",
    outline: "none",
    background: "#fff",
    color: "#0f172a",
  },
  sendBtn: {
    background: "#0f172a",
    color: "#f59e0b",
    border: "none",
    borderRadius: 10,
    padding: "12px 20px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
    letterSpacing: 1,
  },
};

// Inject spinner keyframes
const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleEl);
