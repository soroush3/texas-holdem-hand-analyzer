import "./App.css";
import { useState, useEffect } from "react";
import TexasHoldem from "./TexasHoldem";

import ModalImage from "react-modal-image";
import HandRankings from "./assets/Hand-Rankings-Upswing-Poker.jpg";

function App() {
  return (
    <div className="App">
      <div className="topNav">
        <button>
          <ModalImage alt="Poker Hand Rankings" medium={HandRankings} />
        </button>
      </div>
      <TexasHoldem />
    </div>
  );
}

export default App;
