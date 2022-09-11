import React from "react";

const DeckOfCards = ({ deckOfCards, handleDeckClick, usedCards }) => {
  return (
    <div className="deckOfCards">
      <h3>Deck of Cards</h3>
      <div style={{ flexBasis: "100%" }}></div>
      {deckOfCards.map((card, i) => {
        const rank = card.rank;
        const suit = card.suit;
        const color = ["♥︎", "♦︎"].includes(suit) ? "red" : "black";
        const isDisabled = usedCards.has(i);
        return (
          <div
            onClick={() => handleDeckClick(i)}
            key={i}
            className={"cardDeck" + (isDisabled ? " disabledCard" : "")}
          >
            <div> {rank} </div>
            <div style={{ color: color }}>{suit}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DeckOfCards;
