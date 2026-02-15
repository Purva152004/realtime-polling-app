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

  const createPoll = async () => {
    setError("");
    setLink("");

    if (!question.trim() || options.some(o => !o.trim())) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/polls/create", {
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

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background animation */}
      <FloatingShapes />


      {/* Foreground content */}
      <div className="max-w-md w-full px-1 -mt-20">
        <div className="create-card animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            Create a Poll
          </h2>

          <input
            className="input mb-3"
            placeholder="Poll question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />

          {options.map((opt, i) => (
            <input
              key={i}
              className="input mb-2"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => {
                const copy = [...options];
                copy[i] = e.target.value;
                setOptions(copy);
              }}
            />
          ))}

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
