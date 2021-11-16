import "./App.css";
import { useState, useCallback } from "react";
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
  const [focusedCard, setFocusedCard] = useState({ idx: 0, card: null });
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerHands, setPlayerHands] = useState([
    { card1: null, card2: null },
    { card1: null, card2: null },
  ]);

  const handleReset = useCallback(() => {
    setCommunityCards(Array(5).fill(null));
    setUsedCards(new Set());
    setFocusedCard({ idx: 0, card: null });
    setNumPlayers(2);
    setPlayerHands([
      { card1: null, card2: null },
      { card1: null, card2: null },
    ]);
  }, []);

  const updateFocusedCard = useCallback(() => {
    for (let i = focusedCard.idx; i < focusedCard.idx + 5 + numPlayers; ++i) {
      const trueIdx = i % (5 + numPlayers);
      if (trueIdx <= 4) {
        // position that was just updateded, skip it
        if (focusedCard.idx === trueIdx) continue;
        // community card
        if (communityCards[trueIdx] === null) {
          setFocusedCard({ idx: trueIdx, card: null });
          return;
        }
      } else {
        const playerIdx = trueIdx - 5;
        // player card
        if (
          playerHands[playerIdx].card1 === null &&
          (trueIdx !== focusedCard.idx || focusedCard.card !== 0)
        ) {
          setFocusedCard({ idx: playerIdx + 5, card: 0 });
          return;
        } else if (
          playerHands[playerIdx].card2 === null &&
          (trueIdx !== focusedCard.idx || focusedCard.card !== 1)
        ) {
          setFocusedCard({ idx: playerIdx + 5, card: 1 });
          return;
        }
      }
    }
    // all positions are filled
    setFocusedCard({ idx: null, card: null });
  }, [communityCards, focusedCard, numPlayers, playerHands]);

  const updateNumberOfPlayers = useCallback(
    (n) => {
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
    },
    [playerHands, usedCards]
  );

  const handleDeckClick = useCallback(
    (deckIndex) => {
      if (!usedCards.has(deckIndex) && focusedCard.idx !== null) {
        // update used cards set
        let newUsedCards = new Set(usedCards);
        newUsedCards.add(deckIndex);
        setUsedCards(newUsedCards);

        // update community card
        if (focusedCard.idx <= 4) {
          let newCC = [...communityCards];
          newCC[focusedCard.idx] = deckOfCards[deckIndex];
          setCommunityCards(newCC);
        }
        // update player card
        else {
          let newPlayerHands = playerHands.map((hand) => ({ ...hand }));
          const playerIdx = focusedCard.idx - 5;
          if (focusedCard.card === 0) {
            newPlayerHands[playerIdx].card1 = deckOfCards[deckIndex];
          } else if (focusedCard.card === 1) {
            newPlayerHands[playerIdx].card2 = deckOfCards[deckIndex];
          }
          setPlayerHands(newPlayerHands);
        }
        updateFocusedCard();
      }
    },
    [communityCards, focusedCard, playerHands, updateFocusedCard, usedCards]
  );
  const handleCommunityCardClick = useCallback(
    (cardIndex) => {
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
      setFocusedCard({ idx: cardIndex, card: null });
    },
    [communityCards, usedCards]
  );

  const handlePlayerCardClick = useCallback(
    (playerIdx, cardIdx) => {
      // check if there is a card already present in position, remove if true
      if (
        (playerHands[playerIdx].card1 !== null && cardIdx === 0) ||
        (playerHands[playerIdx].card2 !== null && cardIdx === 1)
      ) {
        let newPlayerHands = playerHands.map((hand) => ({ ...hand }));
        let cardToAddBack = null;
        if (cardIdx === 0) {
          cardToAddBack = newPlayerHands[playerIdx].card1.position;
          newPlayerHands[playerIdx].card1 = null;
        } else if (cardIdx === 1) {
          cardToAddBack = newPlayerHands[playerIdx].card2.position;
          newPlayerHands[playerIdx].card2 = null;
        }
        // remove the card deckIndex as being used
        let newUsedCards = new Set(usedCards);
        newUsedCards.delete(cardToAddBack);
        setUsedCards(newUsedCards);
        setPlayerHands(newPlayerHands);
      }
      setFocusedCard({ idx: playerIdx + 5, card: cardIdx });
    },
    [playerHands, usedCards]
  );

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
