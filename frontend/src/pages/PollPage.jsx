import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { socket } from "../socket";
import PollResults from "../components/PollResults";
import FloatingShapes from "../components/FloatingShapes";
import "../styles/pollPage.css";

export default function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);

  let voterId = localStorage.getItem("voterId");
  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem("voterId", voterId);
  }

  useEffect(() => {
    api.get(`/api/polls/${id}`).then(res => setPoll(res.data));
    socket.emit("joinPoll", id);
    socket.on("updateResults", setPoll);

    return () => socket.off("updateResults");
  }, [id]);

  const vote = async (index) => {
    if (voted) return;
    try {
      await api.post(`/polls/${id}/vote`, { optionIndex: index, voterId });
      setVoted(true);
    } catch {
      alert("You already voted.");
      setVoted(true);
    }
  };

  if (!poll) return <p className="text-center mt-20">Loading...</p>;

  return (

    <div className="relative min-h-screen flex items-center justify-center">
      
      {/* 🔹 Background animation */}
      <FloatingShapes />
    
    <div className="max-w-md w-full px-1 -mt-20">
      <div className="poll-card animate-fade-in">
        <h2 className="text-xl font-bold mb-4">{poll.question}</h2>

        {poll.options.map((o, i) => (
          <button
            key={i}
            className={`option-btn ${
              voted ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={() => vote(i)}
            disabled={voted}
          >
            {o.text}
          </button>
        ))}

        {voted && (
          <p className="text-green-600 text-sm mt-2">
            ✅ Thank you for voting!
          </p>
        )}

        <PollResults poll={poll} />
      </div>
    </div>
    </div>
  );
}
