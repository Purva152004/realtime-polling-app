
import { useState } from "react";
import api from "../services/api";
import FloatingShapes from "../components/FloatingShapes";
import { fireConfetti } from "../utils/confetti";

import "../styles/createPoll.css";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- CREATE POLL ---------- */
  const createPoll = async () => {
    setError("");
    setLink("");

    if (!question.trim() || options.some(o => !o.trim())) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/polls/create", {
        question,
        options: options.map(o => ({ text: o }))
      });

      setLink(`${window.location.origin}/poll/${res.data._id}`);
      fireConfetti();

      setQuestion("");
      setOptions(["", ""]);
    } catch {
      setError("Failed to create poll.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ADD OPTION ---------- */
  const addOption = () => {
    setOptions(prev => [...prev, ""]);
  };

  /* ---------- REMOVE OPTION ---------- */
  const removeOption = index => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  /* ---------- DRAG & DROP ---------- */
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("optionIndex", index);
  };

  const handleDrop = (e, index) => {
    const fromIndex = Number(e.dataTransfer.getData("optionIndex"));
    if (fromIndex === index) return;

    const updated = [...options];
    const moved = updated.splice(fromIndex, 1)[0];
    updated.splice(index, 0, moved);
    setOptions(updated);
  };

  return (
<div className="relative min-h-screen flex items-start justify-center pt-32 pb-16">

      <FloatingShapes />

      <div className="max-w-md w-full px-1">
      <div className="create-card animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">
          Create a Poll
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {options.length} options •{" "}
          {options.every(o => o.trim()) ? "Ready to publish" : "Incomplete"}
        </p>

          <input
            className="input mb-3"
            placeholder="Poll question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />

          {options.map((opt, i) => (
            <div
              key={i}
              draggable
              onDragStart={e => handleDragStart(e, i)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, i)}
              className="relative group"
            >
              <input
                className="input mb-2 pr-10"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => {
                  const copy = [...options];
                  copy[i] = e.target.value;
                  setOptions(copy);
                }}
              />

              {/* ❌ Remove button */}
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* ➕ Add option */}
          <button
            type="button"
            onClick={addOption}
            className="add-option-btn"
          >
            + Add another option
          </button>

          <button
            className={`button-primary mt-4 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={createPoll}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Poll"}
          </button>

          {error && <p className="error">{error}</p>}

          {link && (
            <div className="link-box animate-slide-up">
              <p className="font-semibold">Share link:</p>
              <a className="text-blue-600 break-all" href={link}>
                {link}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
