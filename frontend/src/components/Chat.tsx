"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  id: number;
  content: string;
  sender: "user" | "justinAI";
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hi! Ask me about Justin's skills or experience.", sender: "justinAI" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { id: Date.now(), content: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
  
    try {
      const res = await fetch("https://justin-intelligence-layer-production.up.railway.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content
          }))
        }),
      });
  
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
  
      // Add an empty AI message first
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: "",
        sender: "justinAI",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
  
      // Append tokens as they stream in
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
  
    } catch (error) {
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "justinAI",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0d0d0d;
          --surface: #141414;
          --surface-2: #1c1c1c;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.14);
          --text: #f0f0f0;
          --text-muted: #6b6b6b;
          --text-dim: #3a3a3a;
          --accent: #e8ff5a;
          --accent-dim: rgba(232,255,90,0.08);
          --accent-glow: rgba(232,255,90,0.15);
          --user-bubble: #1e1e1e;
          --radius-msg: 18px;
          --font: 'Sora', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        html, body { height: 100%; background: var(--bg); }

        .chat-root {
          font-family: var(--font);
          background: var(--bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text);
          position: relative;
          overflow: hidden;
        }

        /* Subtle background grain */
        .chat-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        /* Top glow accent */
        .chat-root::after {
          content: '';
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(232,255,90,0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .chat-layout {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 720px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 28px 28px 0;
          flex-shrink: 0;
        }

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .avatar-inner {
          width: 16px;
          height: 16px;
          background: var(--bg);
          border-radius: 4px;
        }

        .header-text h1 {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text);
          line-height: 1;
        }

        .header-text p {
          font-size: 11px;
          font-weight: 400;
          color: var(--text-muted);
          margin-top: 3px;
          font-family: var(--font-mono);
          letter-spacing: 0.02em;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          margin-top: 3px;
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--accent);
          animation: pulse 2.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Messages area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .message-row {
          display: flex;
          animation: fadeSlideIn 0.25s ease forwards;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .message-row.user { justify-content: flex-end; }
        .message-row.ai   { justify-content: flex-start; }

        .message-bubble {
          max-width: 78%;
          padding: 12px 16px;
          font-size: 14.5px;
          line-height: 1.65;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .message-bubble.user {
          background: var(--user-bubble);
          color: var(--text);
          border-radius: var(--radius-msg) var(--radius-msg) 4px var(--radius-msg);
          border: 1px solid var(--border);
        }

        .message-bubble.ai {
          background: transparent;
          color: var(--text);
          border-radius: var(--radius-msg) var(--radius-msg) var(--radius-msg) 4px;
          padding-left: 0;
        }

        /* AI label */
        .ai-label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }

        /* Typing indicator */
        .typing-row {
          display: flex;
          justify-content: flex-start;
          animation: fadeSlideIn 0.2s ease forwards;
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 14px 4px;
        }

        .typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.30s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }

        /* Divider */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0 8px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .divider-label {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.06em;
        }

        /* Input area */
        .input-area {
          padding: 16px 28px 28px;
          flex-shrink: 0;
        }

        .input-container {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px 14px 10px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-container:focus-within {
          border-color: var(--border-hover);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        textarea.chat-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: var(--font);
          font-size: 14.5px;
          line-height: 1.55;
          font-weight: 400;
          letter-spacing: -0.01em;
          resize: none;
          width: 100%;
          min-height: 24px;
          max-height: 160px;
          overflow-y: auto;
          scrollbar-width: none;
        }

        textarea.chat-input::placeholder { color: var(--text-muted); }
        textarea.chat-input::-webkit-scrollbar { display: none; }

        .input-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .input-hint {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.03em;
        }

        .send-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--accent);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s ease, transform 0.15s ease;
          flex-shrink: 0;
        }

        .send-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .send-btn:active { transform: scale(0.95); }
        .send-btn:disabled { opacity: 0.25; cursor: default; transform: none; }

        .send-icon {
          width: 14px;
          height: 14px;
          fill: none;
          stroke: #0d0d0d;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* Footer */
        .chat-footer {
          text-align: center;
          padding-bottom: 4px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.04em;
        }

        /* Empty state suggestions */
        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .suggestion-chip {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 12.5px;
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          letter-spacing: -0.01em;
        }

        .suggestion-chip:hover {
          border-color: var(--accent);
          color: var(--text);
          background: var(--accent-dim);
        }

        .message-bubble p {
          margin-bottom: 8px;
        }

        .message-bubble ul, 
        .message-bubble ol {
          margin: 8px 0;
          padding-left: 28px;
        }

        .message-bubble li {
          margin-bottom: 6px;
        }

        .message-bubble strong {
          color: var(--accent);
        }
      `}</style>

      <div className="chat-root">
        <div className="chat-layout">

          {/* Header */}
          <header className="chat-header">
            <div className="avatar">
              <div className="avatar-inner" />
            </div>
            <div className="header-text">
              <h1>Justin AI</h1>
              <p>portfolio assistant</p>
            </div>
            <div className="status-dot" style={{ marginLeft: "auto" }} />
          </header>

          {/* Messages */}
          <div className="messages-area">
            {messages.length === 1 && (
              <div style={{ marginBottom: 12 }}>
                <div className="suggestions">
                  {["What are Justin's skills?", "Tell me about his experience", "What has he built?", "Is he available to hire?"].map((s) => (
                    <button
                      key={s}
                      className="suggestion-chip"
                      onClick={() => {
                        setInput(s);
                        inputRef.current?.focus();
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => {
              const isAI = msg.sender === "justinAI";
              const prevSender = i > 0 ? messages[i - 1].sender : null;
              const showLabel = isAI && prevSender !== "justinAI";

              return (
                <div key={msg.id} className={`message-row ${isAI ? "ai" : "user"}`}>
                  <div className={`message-bubble ${isAI ? "ai" : "user"}`}>
                    {isAI && showLabel && <span className="ai-label">Justin AI</span>}
                    <ReactMarkdown
                  components={{
                      ul: ({node, ...props}) => <ul style={{listStyleType: 'disc', paddingLeft: '28px', margin: '8px 0'}} {...props} />,
                      ol: ({node, ...props}) => <ol style={{listStyleType: 'decimal', paddingLeft: '28px', margin: '8px 0'}} {...props} />,
                      li: ({node, ...props}) => <li style={{marginBottom: '6px'}} {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="typing-row">
                <div className="typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <div className="input-container">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Ask me anything about Justin..."
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <div className="input-actions">
                <span className="input-hint">shift+enter for new line</span>
                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send"
                >
                  <svg className="send-icon" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="chat-footer" style={{ marginTop: 12 }}>
              justin ai · portfolio 2025
            </p>
          </div>

        </div>
      </div>
    </>
  );
}