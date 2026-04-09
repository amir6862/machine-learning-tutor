# 🤖 Core Machine Learning —  Teacher

> An AI-powered interactive learning app for Core Machine Learning concepts, built with React and Claude AI.

---

## 📌 Overview

**ML Phase 2 Teacher** is a personal ML tutor that lets you select any of 12 core machine learning topics and learn through four different interactive modes — explanations, code examples, quizzes, and interview prep — all powered by Claude (claude-sonnet).

---

## ✨ Features

- 📚 **12 ML Topics** covering Supervised, Unsupervised, and Conceptual areas
- 🎓 **4 Learning Modes** tailored to different learning goals
- 💬 **Follow-up Chat** — ask follow-up questions in a conversational thread
- 🏷️ **Difficulty & Tag Badges** — color-coded by Beginner / Intermediate / Advanced
- ⚡ **Real-time AI Responses** via the Anthropic Claude API
- 🎨 **Clean, Minimal UI** with a dark sidebar and responsive layout

---

## 🧠 Topics Covered

| Topic | Category | Difficulty |
|---|---|---|
| 📈 Linear Regression | Supervised | Beginner |
| 🔀 Logistic Regression | Supervised | Beginner |
| 🌳 Decision Trees | Supervised | Beginner |
| 🌲 Random Forests | Supervised | Intermediate |
| ⚔️ Support Vector Machines | Supervised | Intermediate |
| 🔍 K-Nearest Neighbors | Supervised | Beginner |
| 🎲 Naive Bayes | Supervised | Beginner |
| 🚀 Gradient Boosting (XGBoost) | Supervised | Advanced |
| 🎯 K-Means Clustering | Unsupervised | Intermediate |
| 🔵 DBSCAN | Unsupervised | Intermediate |
| 🗜️ PCA (Dimensionality Reduction) | Unsupervised | Intermediate |
| ⚖️ Model Essentials & Evaluation | Concepts | Intermediate |

---

## 🎯 Learning Modes

| Mode | Description |
|---|---|
| 📖 **Explain It** | Simple explanation with real-world analogies |
| 💻 **Show Code** | Complete Python code using scikit-learn |
| 🧠 **Quiz Me** | 3-question progressively harder quiz with answers |
| 🎯 **Interview Q&A** | Top 5 ML interview questions with strong answers |

---

## 🛠️ Tech Stack

- **React** — UI framework (functional components + hooks)
- **Anthropic Claude API** — `claude-sonnet-4-20250514` for AI responses
- **Vanilla CSS-in-JS** — inline styles, no external CSS library

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- An [Anthropic API Key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/your-username/ml-phase2-teacher.git
cd ml-phase2-teacher
npm install
```

### Running the App

```bash
npm start
```

> ⚠️ **API Key:** This app calls the Anthropic API directly from the browser. Make sure your API key is configured according to your setup (environment variable, proxy, etc.). Never expose your API key in a public repository.

---

## 📁 Project Structure

```
ml-phase2-teacher/
├── src/
│   └── ml-phase2-teacher.jsx   # Main component (topics, modes, UI, API logic)
├── public/
│   └── index.html
├── package.json
└── README.md
```

---

## 🖼️ UI Preview

```
┌─────────────────────────────────────────────────────┐
│  PHASE 2   Core Machine Learning                    │
│  Your personal ML expert teacher                    │
├────────────┬────────────────────────────────────────┤
│ 📚 TOPICS  │  [📖 Explain] [💻 Code] [🧠 Quiz] [🎯] │
│            │                                        │
│ 📈 Linear  │  AI response displayed here...         │
│ 🌳 Trees   │                                        │
│ 🚀 XGBoost │  ┌─ Follow-up chat thread ────────┐   │
│ ...        │  └────────────────────────────────┘   │
│            │  [ Ask a follow-up... ]  [Send ↑]     │
└────────────┴────────────────────────────────────────┘
```

---

## 🤝 Contributing

Pull requests are welcome! If you'd like to add more topics, improve prompts, or extend learning modes, feel free to open an issue or PR.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Anthropic](https://www.anthropic.com/) for the Claude API
- [scikit-learn](https://scikit-learn.org/) referenced in all code examples
- Inspired by the goal of making ML approachable for every developer
