import "./App.css";
import TexasHoldem from "./TexasHoldem";

import ModalImage from "react-modal-image";
import HandRankings from "./assets/Hand-Rankings-Upswing-Poker.jpg";

function App() {
  return (
    <div className="App">
      <div className="topNav">
        <a
          className="navItem"
          href="https://github.com/soroush3/texas-holdem-hand-analyzer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          Github Repo
        </a>
        <ModalImage
          className="navItem"
          alt="Poker Hand Rankings"
          medium={HandRankings}
        />
      </div>
      <TexasHoldem />
    </div>
  );
}

export default App;
