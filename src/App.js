import "./App.css";
import PokerHand from "./components/PokerHand";

function App() {
  return (
    <div className="App">
      <h1> TEXAS HOLDEM HAND ANALYZER</h1>
      <h3>
        Determines the % win of each hand based off of a complete poker hand
      </h3>
      <PokerHand></PokerHand>
    </div>
  );
}

export default App;
