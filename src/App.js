import "./App.css";
import { useState } from "react";
import CommunityCards from "./components/CommunityCards.js";
import DeckOfCards from "./components/DeckOfCards.js";
import PlayerHands from "./components/PlayerHands.js";

const rankings = [
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const suits = ["♣︎", "♠︎", "♥︎", "♦︎"];
let i = 0;
let deckOfCards = [];
for (let rank of rankings) {
  for (let suit of suits) {
    deckOfCards.push({ rank: rank, suit: suit, position: i++ });
  }
}

function App() {
  const [communityCards, setCommunityCards] = useState(Array(5).fill(null));
  const [usedCards, setUsedCards] = useState(new Set());
  const [focusedCard, setFocusedCard] = useState(0);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerHands, setPlayerHands] = useState([
    { card1: null, card2: null },
    { card1: null, card2: null },
  ]);

  const handleReset = () => {
    setCommunityCards(Array(5).fill(null));
    setUsedCards(new Set());
    setFocusedCard(0);
    setNumPlayers(2);
    setPlayerHands([
      { card1: null, card2: null },
      { card1: null, card2: null },
    ]);
  };

  const updateFocusedCard = (isCommunityCard) => {
    for (let i = focusedCard; i < focusedCard + 5 + numPlayers; ++i) {
      const trueIdx = i % (5 + numPlayers);
      if (trueIdx <= 4) {
        // community card
        if (communityCards[trueIdx] === null) {
          setFocusedCard(trueIdx);
          return;
        }
      } else {
        const playerIdx = trueIdx - 5;
        // player card
        if (
          playerHands[playerIdx].card1 === null ||
          playerHands[playerIdx].card2 === null
        ) {
          setFocusedCard(playerIdx + 5);
          return;
        }
      }
      // all positions are filled
      setFocusedCard(null);
    }
  };

  const updateNumberOfPlayers = (n) => {
    const nInt = parseInt(n);
    let newPlayerHands = [];
    for (let i = 0; i < nInt; ++i) {
      newPlayerHands.push({ card1: null, card2: null });
    }
    let newUsedCards = new Set(usedCards);
    for (let i = 0; i < playerHands.length; ++i) {
      // keep these hands
      if (i < nInt) {
        const hand = JSON.parse(JSON.stringify(playerHands[i]));
        newPlayerHands[i] = hand;
      } else {
        // add the cards back to the deck
        if (playerHands[i].card1 !== null) {
          const pos = playerHands[i].card1.position;
          newUsedCards.delete(pos);
        }
        if (playerHands[i].card2 !== null) {
          const pos = playerHands[i].card2.position;
          newUsedCards.delete(pos);
        }
      }
    }
    setNumPlayers(nInt);
    setUsedCards(newUsedCards);
    setPlayerHands(newPlayerHands);
    console.log(nInt);
  };

  const handleDeckClick = (cardIndex) => {
    if (!usedCards.has(cardIndex) && focusedCard !== null) {
      const isCommunityCard = false;
      // update used cards set
      let newUsedCards = new Set(usedCards);
      newUsedCards.add(cardIndex);
      setUsedCards(newUsedCards);

      // update community card
      if (focusedCard <= 4) {
        isCommunityCard = true;
        let newCC = [...communityCards];
        newCC[focusedCard] = deckOfCards[cardIndex];
        setCommunityCards(newCC);
      }
      // update player card
      else {
        let newPlayerHands = [...playerHands];
        const playerIdx = focusedCard - 5;
        if (newPlayerHands[playerIdx].card1 === null) {
          newPlayerHands[playerIdx].card1 = deckOfCards[cardIndex];
        } else if (newPlayerHands[playerIdx].card2 === null) {
          newPlayerHands[playerIdx].card2 = deckOfCards[cardIndex];
        }
        setPlayerHands(newPlayerHands);
      }
      updateFocusedCard(isCommunityCard);
    }
  };
  const handleCommunityCardClick = (cardIndex) => {
    // check if there is a card already present in position, remove if true
    if (communityCards[cardIndex] !== null) {
      // update community cards
      let newCC = [...communityCards];
      const cardPosition = newCC[cardIndex].position;
      newCC[cardIndex] = null;
      setCommunityCards(newCC);

      // update used cards
      let newUsedCards = new Set(usedCards);
      newUsedCards.delete(cardPosition);
      setUsedCards(newUsedCards);
    }
    setFocusedCard(cardIndex);
  };

  const handlePlayerCardClick = (playerIdx, cardIdx) => {
    console.log(playerIdx, cardIdx);
  };

  return (
    <div className="App">
      <h1> TEXAS HOLDEM HAND ANALYZER</h1>
      <h3>
        Determines the % win of each hand based off of a complete poker hand
      </h3>
      <div style={{ margin: 1 + "rem" }}>
        <select
          value={numPlayers}
          onChange={(e) => updateNumberOfPlayers(e.target.value)}
          style={{ marginRight: 1 + "rem" }}
        >
          {[2, 3, 4, 5, 6, 7, 8].map((n) => {
            return (
              <option key={"Player " + n} value={n}>
                {n + " players"}
              </option>
            );
          })}
        </select>
        <button onClick={() => handleReset()} style={{ marginLeft: 1 + "rem" }}>
          Reset
        </button>
        <button style={{ marginLeft: 1 + "rem" }}> Calculate </button>
      </div>
      <div className="allCardsContainer">
        <DeckOfCards
          deckOfCards={deckOfCards}
          handleDeckClick={handleDeckClick}
          usedCards={usedCards}
        />
        <div className="ccAndPlayer">
          <CommunityCards
            communityCards={communityCards}
            handleCommunityCardClick={handleCommunityCardClick}
            focusedCard={focusedCard}
          />
          <PlayerHands
            playerHands={playerHands}
            focusedCard={focusedCard}
            handlePlayerCardClick={handlePlayerCardClick}
          ></PlayerHands>
        </div>
      </div>
    </div>
  );
}

export default App;
