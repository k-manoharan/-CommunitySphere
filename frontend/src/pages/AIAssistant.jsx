import React, { useState } from "react";
import { askAgent } from "../services/api";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";

export default function AIAssistant() {
  const [activeAgent, setActiveAgent] = useState("citizen"); // citizen, analyst, planner
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your Citizen Assistant. You can ask me questions like 'Suggest the safest travel route' or 'What preparations should I make for heavy rain?'.",
      source: "Local System Initializer"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const agents = [
    { 
      id: "citizen", 
      name: "Citizen Assistant", 
      desc: "Answers public questions, routing detours, & flood preparation tips.",
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
    },
    { 
      id: "analyst", 
      name: "Community Analyst", 
      desc: "Detailed environmental metrics, AQI trends, and risk index assessments.",
      color: "border-indigo-500/20 text-indigo-400 bg-indigo-500/5"
    },
    { 
      id: "planner", 
      name: "Emergency Planner", 
      desc: "Tactical resource staging lists & evacuations advice for authorities.",
      color: "border-amber-500/20 text-amber-400 bg-amber-500/5"
    }
  ];

  const suggestedQuestions = {
    citizen: [
      "Will my area face flooding tomorrow?",
      "Which routes should I avoid during rain?",
      "What emergency prep items should I pack?"
    ],
    analyst: [
      "Compare East Coast flood risks vs West Suburbs.",
      "Analyze AQI particulate spikes in Zone 5.",
      "What are the historical predictors for Zone 2?"
    ],
    planner: [
      "Create emergency response plan for Zone 2 flooding.",
      "Where should we position spare ambulances?",
      "Optimize waste truck route changes during high traffic."
    ]
  };

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: queryText }]);
    setInput("");
    setLoading(true);

    try {
      const data = await askAgent(activeAgent, queryText);
      setMessages((prev) => [
        ...prev, 
        { sender: "bot", text: data.reply, source: data.source }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { sender: "bot", text: "Error: Failed to reach agent. Please check if backend is running.", source: "System Error" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="shrink-0">
        <h2 className="font-header font-extrabold text-3xl text-white">Gemini Decision Intelligence Assistant</h2>
        <p className="text-gray-400 text-sm mt-1">Select specialized agents trained in predictive community support.</p>
      </div>

      <div className="grow flex gap-6 overflow-hidden">
        {/* Chat History and Input */}
        <div className="flex-grow glass-panel rounded-2xl p-6 flex flex-col h-full overflow-hidden">
          {/* Chat Messages */}
          <div className="grow overflow-y-auto space-y-4 pr-2 mb-4 scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border text-xs ${
                  msg.sender === "user" 
                    ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400" 
                    : "bg-gray-800 border-gray-700 text-gray-300"
                }`}>
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none"
                }`}>
                  {/* Handle newlines in text */}
                  <div className="whitespace-pre-line">{msg.text}</div>
                  
                  {msg.source && (
                    <span className="text-[10px] text-indigo-400 font-bold block mt-2 opacity-60 text-right uppercase tracking-wider flex items-center justify-end gap-1">
                      <Sparkles size={8} /> Source: {msg.source}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300">
                  <Bot size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 text-sm rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                  Generating decision analysis...
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggested prompts tag ticker */}
          <div className="shrink-0 mb-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Suggested Questions:</span>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions[activeAgent].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="bg-gray-900 border border-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="shrink-0 flex gap-3 border-t border-gray-800/80 pt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ask the ${agents.find(a => a.id === activeAgent)?.name}...`}
              className="grow bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-3 flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Agent Profile Selector Sidebar */}
        <div className="w-80 shrink-0 space-y-4 h-full">
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h4 className="font-header font-bold text-sm text-gray-300 uppercase tracking-wider">Agent Profiles</h4>
            <div className="space-y-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setActiveAgent(agent.id);
                    setMessages([
                      {
                        sender: "bot",
                        text: `Hello! I am your ${agent.name}. ${agent.desc}`,
                        source: "Agent Reconfiguration"
                      }
                    ]);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeAgent === agent.id 
                      ? "border-indigo-500 bg-indigo-500/5 shadow-md"
                      : "border-gray-800 bg-gray-900/40 hover:border-gray-700"
                  }`}
                >
                  <span className="font-bold text-sm text-white block mb-1">{agent.name}</span>
                  <p className="text-xs text-gray-400 leading-relaxed">{agent.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
