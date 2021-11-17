import React from "react";

const DeckOfCards = ({ deckOfCards, handleDeckClick, usedCards }) => {
  console.log("Deck Render");
  return (
    <div className="deckOfCards">
      <h3 style={{ alignItems: "flex-end", justifyContent: "center" }}>
        Deck of Cards
      </h3>
      <div style={{ flexBasis: 100 + "%", height: 0 }}></div>
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
