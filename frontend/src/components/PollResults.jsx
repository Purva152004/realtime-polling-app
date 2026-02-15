import "../styles/results.css";

export default function PollResults({ poll }) {
  const total = poll.options.reduce((a, b) => a + b.votes, 0);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Live Results</h3>

      {poll.options.map((o, i) => {
        const percent = total ? (o.votes / total) * 100 : 0;
        return (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{o.text}</span>
              <span>{o.votes} votes</span>
            </div>
            <div className="bg-gray-200 rounded">
              <div
                className="result-bar"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}