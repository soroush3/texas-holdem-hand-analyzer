import React from "react";

const PlayerHands = ({ playerHands, focusedCard, handlePlayerCardClick }) => {
  console.log("Player hands Render");
  return (
    <div className="playerHandsContainer">
      {playerHands.map((hand, i) => {
        const card1 = hand.card1;
        const card2 = hand.card2;
        const hasFocus = focusedCard.idx !== null && focusedCard.idx - 5 === i;
        const redArr = ["♥︎", "♦︎"];
        const card1Color =
          card1 !== null && redArr.includes(card1.suit) ? "red" : "black";
        const card2Color =
          card2 !== null && redArr.includes(card2.suit) ? "red" : "black";
        return (
          <div key={"Player Hand " + i} className="playerHandContainer">
            <h4> {"Player " + (i + 1)} </h4>
            <div className="playerHand">
              <div
                onClick={() => handlePlayerCardClick(i, 0)}
                className={
                  "playerCard" +
                  (hasFocus && focusedCard.card === 0 ? " focusedCard" : "")
                }
              >
                <div> {card1 !== null ? card1.rank : ""} </div>
                <div style={{ color: card1Color }}>
                  {card1 !== null ? card1.suit : ""}
                </div>
              </div>

              <div
                onClick={() => handlePlayerCardClick(i, 1)}
                className={
                  "playerCard" +
                  (hasFocus && focusedCard.card === 1 ? " focusedCard" : "")
                }
              >
                <div> {card2 !== null ? card2.rank : ""} </div>

                <div style={{ color: card2Color }}>
                  {card2 !== null ? card2.suit : ""}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerHands;
