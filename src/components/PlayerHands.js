import React from "react";

const PlayerHands = ({ playerHands, focusedCard, handlePlayerCardClick }) => {
  return (
    <div className="playerHandsContainer">
      {playerHands.map((hand, i) => {
        const card1 = hand.card1;
        const card2 = hand.card2;
        const hasFocus = focusedCard !== null && focusedCard - 5 === i;
        return (
          <div key={"Player Hand " + i} className="playerHandContainer">
            <h4> {"Player " + (i + 1)} </h4>
            <div className="playerHand">
              <div
                style={{ breakAfter: "always" }}
                onClick={() => handlePlayerCardClick(i - 5, 1)}
                className={
                  "playerCard" +
                  (hasFocus && card1 === null ? " focusedCard" : "")
                }
              >
                {card1 !== null ? card1.rank : ""}
                {card1 !== null ? card1.suit : ""}
              </div>

              <div
                onClick={() => handlePlayerCardClick(i - 5, 2)}
                className={
                  "playerCard" +
                  (hasFocus && card2 === null && card1 !== null
                    ? " focusedCard"
                    : "")
                }
              >
                {card2 !== null ? card2.rank : ""}
                {card2 !== null ? card2.suit : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerHands;
