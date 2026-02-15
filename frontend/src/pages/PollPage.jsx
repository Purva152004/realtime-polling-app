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
  const [selected, setSelected] = useState([]);

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

  const submitVote = async () => {
  try {
    const res = await api.post(`/api/polls/${id}/vote`, {
      optionIndexes: selected,
      voterId
    });

    setPoll(res.data);
    setSelected([]);
  } catch (err) {
    alert(err.response?.data?.message || "Vote failed");
  }
};
//

  if (!poll) return <p className="text-center mt-32">Loading...</p>;

  return (
    <div className="relative min-h-screen flex items-start justify-center pt-32 pb-16">
      <FloatingShapes />

      <div className="max-w-md w-full px-1">
        <div className="poll-card animate-fade-in">
          <h2 className="text-xl font-bold mb-4">{poll.question}</h2>

          {poll.options.map((o, i) => (
            <label key={i} className="flex items-center gap-2 mb-2">
              <input
                type={poll.allowMultiple ? "checkbox" : "radio"}
                name="vote"
                checked={selected.includes(i)}
                onChange={() =>
                  poll.allowMultiple
                    ? setSelected(prev =>
                        prev.includes(i)
                          ? prev.filter(x => x !== i)
                          : [...prev, i]
                      )
                    : setSelected([i])
                }
                className="accent-indigo-600"
              />
              <span>{o.text}</span>
            </label>
          ))}

          <button
            className="button-primary mt-4"
            disabled={selected.length === 0}
            onClick={submitVote}
          >
            Submit Vote
          </button>

          <PollResults poll={poll} />
        </div>
      </div>
    </div>
  );
}
