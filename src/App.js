import "./App.css";
import { useState, useEffect } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import deckOfCards from "./utils/CardDeck.js";
import CommunityCards from "./components/CommunityCards.js";
import DeckOfCards from "./components/DeckOfCards.js";
import PlayerHands from "./components/PlayerHands.js";
import DetermineWinner from "./utils/DetermineWinner.js";

function App() {
  const [communityCards, setCommunityCards] = useState(Array(5).fill(null));
  const [usedCards, setUsedCards] = useState(new Set());
  const [focusedCard, setFocusedCard] = useState({ idx: 0, card: null });
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerHands, setPlayerHands] = useState([
    { card1: null, card2: null },
    { card1: null, card2: null },
  ]);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const updateFocusedCard = () => {
    let i = focusedCard.idx > 5 + numPlayers ? 0 : focusedCard.idx;
    for (; i < focusedCard.idx + 5 + numPlayers; ++i) {
      const communityIdx = i % (5 + numPlayers);
      if (communityIdx <= 4) {
        // community card
        if (communityCards[communityIdx] === null) {
          setFocusedCard({ idx: communityIdx, card: null });
          return;
        }
      } else {
        const playerIdx = communityIdx - 5;
        // player card
        if (playerHands[playerIdx].card1 === null) {
          setFocusedCard({ idx: playerIdx + 5, card: 0 });
          return;
        } else if (playerHands[playerIdx].card2 === null) {
          setFocusedCard({ idx: playerIdx + 5, card: 1 });
          return;
        }
      }
    }
    // all positions are filled
    setFocusedCard({ idx: null, card: null });
  };

  useEffect(() => {
    // only update the focused card if the usedCards is changed or numplayers is changed
    updateFocusedCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usedCards, numPlayers]);

  const handleReset = () => {
    setCommunityCards(Array(5).fill(null));
    setUsedCards(new Set());
    setFocusedCard({ idx: 0, card: null });
    setWinnerInfo(null);
    setOpen(false);
    let newPlayerHands = [];
    for (let i = 0; i < numPlayers; ++i)
      newPlayerHands.push({ card1: null, card2: null });
    setPlayerHands(newPlayerHands);
  };

  const handleCalculateClick = (event) => {
    // check if community cards is complete (has 5 cards)
    let cc_count = 0;
    communityCards.forEach((card) => {
      if (card !== null) ++cc_count;
    });
    // check that all player hands are complete (each hand has two cards)
    let playerCount = 0;
    playerHands.forEach((hand) => {
      if (hand !== null && hand.card1 !== null && hand.card2 !== null)
        ++playerCount;
    });
    if (cc_count !== 5 || playerCount !== playerHands.length) {
      // display popper letting user know to fill out all cards
      setAnchorEl(event.currentTarget);
      setOpen(true);
      return;
    }

    const winnerInfo = DetermineWinner(communityCards, playerHands);
    setWinnerInfo(winnerInfo);
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
  };

  const handleDeckClick = (deckIndex) => {
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
    setFocusedCard({ idx: cardIndex, card: null });
  };

  const handlePlayerCardClick = (playerIdx, cardIdx) => {
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
  };

  return (
    <div className="App">
      <h1> TEXAS HOLDEM HAND ANALYZER</h1>
      <h3>Determines the winner based off of a complete poker hand</h3>
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
        {/* pop over shown if not all cards are filled */}
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <span>
            <button
              onClick={(e) => handleCalculateClick(e)}
              style={{ marginLeft: 1 + "rem" }}
            >
              Calculate
            </button>
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement={"bottom"}
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                  <Paper>
                    <Typography sx={{ p: 2 }}>
                      Make sure all card slots are filled.
                    </Typography>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </span>
        </ClickAwayListener>
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

          {/* winner information */}
          {winnerInfo !== null ? (
            <div>
              <h3>{winnerInfo.whoWon}</h3>
              <h3>{winnerInfo.handType}</h3>
              <h3>Winning Hand:</h3>
              <div className="winningHand">
                {winnerInfo.top5.map((card, i) => {
                  const rank = card.rank;
                  const suit = card.suit;
                  const color = ["♥︎", "♦︎"].includes(suit) ? "red" : "black";
                  return (
                    <div className={"miniCard"} key={"winningCard" + i}>
                      <div>{rank}</div>
                      <div style={{ color: color }}>{suit}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
