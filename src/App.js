import "./App.css";
import TexasHoldem from "./TexasHoldem";

import ModalImage from "react-modal-image";
import HandRankings from "./assets/Hand-Rankings-Upswing-Poker.jpg";

function App() {
  return (
    <div className="App">
      <div className="topNav">
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
