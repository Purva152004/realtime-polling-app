import "../styles/footer.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo">🗳️</span>
          <div>
            <h3>Live Polls</h3>
            <p>Real-time voting platform</p>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links">
          <a href="/">Create Poll</a>
          <a href="https://github.com/Purva152004/realtime-polling-app" target="_blank">
            GitHub
          </a>
          <a href="#">Privacy</a>
        </div>

        {/* Credit */}
        <div className="footer-credit">
          <p>
            © {new Date().getFullYear()} Live Polls
          </p>
          <span>Built with ❤️ by Purva</span>
        </div>
      </div>
    </footer>
  );
}
