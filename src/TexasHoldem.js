import { useState, useEffect, useRef } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import deckOfCards from "./utils/CardDeck.js";
import CommunityCards from "./components/CommunityCards.js";
import DeckOfCards from "./components/DeckOfCards.js";
import PlayerHands from "./components/PlayerHands.js";
import { DetermineWinner, getPlayerHandType } from "./utils/DetermineWinner.js";

function TexasHoldem() {
  const [communityCards, setCommunityCards] = useState(Array(5).fill(null));
  const [usedCards, setUsedCards] = useState(new Set());
  const [focusedCard, setFocusedCard] = useState({ idx: 0, card: null });
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerHands, setPlayerHands] = useState([
    { card1: null, card2: null, info: null },
    { card1: null, card2: null, info: null },
  ]);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCardErrorPopper, setShowCardErrorPopper] = useState(false);

  const prevUsedCardsLen = useRef(usedCards.size);
  const prevNumberOfPlayers = useRef(numPlayers);
  useEffect(() => {
    // only update the focused card if the usedCards len has become larger or numplayers has changed
    if (
      prevUsedCardsLen.current < usedCards.size ||
      prevNumberOfPlayers.current !== numPlayers
    ) {
      // only called in useEffect as the card states need to be updated before updating the focused card
      const newFocusedCard = getNewFocusedCard({
        focusedCard,
        numPlayers,
        communityCards,
        playerHands,
      });
      setFocusedCard(newFocusedCard);
    }
    prevUsedCardsLen.current = usedCards.size;
    prevNumberOfPlayers.current = numPlayers;
  });

  const handleReset = () => {
    setCommunityCards(Array(5).fill(null));
    setUsedCards(new Set());
    setFocusedCard({ idx: 0, card: null });
    setWinnerInfo(null);
    setShowCardErrorPopper(false);
    let newPlayerHands = [];
    for (let i = 0; i < numPlayers; ++i)
      newPlayerHands.push({ card1: null, card2: null, info: null });
    setPlayerHands(newPlayerHands);
  };

  /**
   * Determines the winner of the hand and sets winner and player hand information if the table
   * is complete
   */
  const handleCalculateClick = (event) => {
    // not all community and player cards selected
    if (!isTableComplete({ communityCards, playerHands })) {
      // display popper letting user know to fill out all cards
      setAnchorEl(event.currentTarget);
      setShowCardErrorPopper(true);
      return;
    }

    const winnerInfo = DetermineWinner(communityCards, playerHands);
    const newPlayerHands = playerHands.map((playerHand) => {
      const playerHandInfo = getPlayerHandType(communityCards, playerHand);
      return { ...playerHand, info: playerHandInfo };
    });
    setPlayerHands(newPlayerHands);
    setWinnerInfo(winnerInfo);
  };

  /**
   * Updates the number of players. When the number of players is reduced and the removed players
   * have cards, they are returned to the deck.
   */
  const updateNumberOfPlayers = (n) => {
    const { newPlayerHands, newUsedCards } = getNewUsedCardsAndPlayerHands({
      n,
      playerHands,
      usedCards,
    });
    setPlayerHands(newPlayerHands);
    setUsedCards(newUsedCards);
    setNumPlayers(n);
    setWinnerInfo(null);
  };

  /**
   * The card clicked from the deck is moved to the focused card position
   */
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

  /**
   * Changes the focused card to the index of the community card board.
   * If there was a card in that position, it is removed and added back to the deck.
   */
  const handleCommunityCardClick = (cardIndex) => {
    // check if there is a card already present in position, remove if true
    if (communityCards[cardIndex] !== null) {
      // update community cards
      let newCC = [...communityCards];
      const cardPosition = newCC[cardIndex].position;
      newCC[cardIndex] = null;
      setCommunityCards(newCC);

      // update players winning info
      const newPlayerHands = playerHands.map((playerHand) => {
        return { card1: playerHand.card1, card2: playerHand.card2, info: null };
      });

      // update used cards
      let newUsedCards = new Set(usedCards);
      newUsedCards.delete(cardPosition);
      setUsedCards(newUsedCards);
      setWinnerInfo(null);
      setPlayerHands(newPlayerHands);
    }
    setFocusedCard({ idx: cardIndex, card: null });
  };

  /**
   * Changes the focused card to the index of the player card.
   * If there was a card in that position, it is removed and added back to the deck.
   */
  const handlePlayerCardClick = (playerIdx, cardIdx) => {
    // check if there is a card already present in position, remove if true
    if (
      (playerHands[playerIdx].card1 !== null && cardIdx === 0) ||
      (playerHands[playerIdx].card2 !== null && cardIdx === 1)
    ) {
      let newPlayerHands = playerHands.map((playerHand) => ({
        ...playerHand,
        info: null,
      }));
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
    setWinnerInfo(null);
  };

  return (
    <div className="App">
      <h1> TEXAS HOLD'EM HAND ANALYZER</h1>
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
        <ClickAwayListener onClickAway={() => setShowCardErrorPopper(false)}>
          <span>
            <button
              onClick={(e) => handleCalculateClick(e)}
              style={{ marginLeft: 1 + "rem" }}
            >
              Calculate
            </button>
            <Popper
              open={showCardErrorPopper}
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
        <DeckOfCards usedCards={usedCards} handleDeckClick={handleDeckClick} />
        <div className="ccAndPlayer">
          <CommunityCards
            communityCards={communityCards}
            focusedCard={focusedCard}
            handleCommunityCardClick={handleCommunityCardClick}
          />
          <PlayerHands
            playerHands={playerHands}
            focusedCard={focusedCard}
            handlePlayerCardClick={handlePlayerCardClick}
          ></PlayerHands>

          {/* winner information */}
          {winnerInfo !== null ? (
            <div>
              <h1>{winnerInfo.whoWon}</h1>
              <h2>{winnerInfo.handType}</h2>
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

/**
 * Finds and returns the new focused card by finding the first available slot starting from
 * its current position
 */
const getNewFocusedCard = ({
  focusedCard,
  numPlayers,
  communityCards,
  playerHands,
}) => {
  for (
    let i = focusedCard.idx > 5 + numPlayers ? 0 : focusedCard.idx;
    i < focusedCard.idx + 5 + numPlayers;
    ++i
  ) {
    const communityIdx = i % (5 + numPlayers);
    if (communityIdx <= 4) {
      // community card
      if (communityCards[communityIdx] === null) {
        return { idx: communityIdx, card: null };
      }
    } else {
      const playerIdx = communityIdx - 5;
      // player card
      if (playerHands[playerIdx].card1 === null) {
        return { idx: playerIdx + 5, card: 0 };
      } else if (playerHands[playerIdx].card2 === null) {
        return { idx: playerIdx + 5, card: 1 };
      }
    }
  }
  // all positions are filled
  return { idx: null, card: null };
};

/**
 * Returns new used cards and player hands when the number of players is reduced as the removed
 * players may have held cards
 */
const getNewUsedCardsAndPlayerHands = ({ n, playerHands, usedCards }) => {
  let newPlayerHands = [];
  for (let i = 0; i < n; ++i) {
    newPlayerHands.push({ card1: null, card2: null, info: null });
  }
  let newUsedCards = new Set(usedCards);
  for (let i = 0; i < playerHands.length; ++i) {
    // keep these hands
    if (i < n) {
      const playerHand = playerHands[i];
      const hand = {
        card1: playerHand.card1,
        card2: playerHand.card2,
        info: null,
      };
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
  return { newPlayerHands, newUsedCards };
};

const isTableComplete = ({ communityCards, playerHands }) => {
  // check if community cards is complete (has 5 cards)
  const communityCardsCount = communityCards.reduce((count, card) => {
    return card !== null ? count + 1 : count;
  }, 0);
  // check that all player hands are complete (each hand has two cards)
  const playerHandCount = playerHands.reduce((count, hand) => {
    return hand !== null && hand.card1 !== null && hand.card2 !== null
      ? count + 1
      : count;
  }, 0);

  return communityCardsCount === 5 && playerHandCount === playerHands.length;
};

export default TexasHoldem;
