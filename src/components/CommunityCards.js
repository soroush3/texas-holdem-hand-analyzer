import React from "react";

const CommunityCards = ({
  communityCards,
  handleCommunityCardClick,
  focusedCard,
}) => {
  console.log("COMMUNITY CARD RENDER");
  return (
    <div>
      <h3> Community Cards </h3>
      <div className="communityBoard">
        {communityCards.map((card, i) => {
          const focusedCardClass = focusedCard.idx === i ? " focusedCard" : "";
          const isEmpty = communityCards[i] === null;
          const rank = isEmpty ? "" : card.rank;
          const suit = isEmpty ? "" : card.suit;
          const color = ["♥︎", "♦︎"].includes(suit) ? "red" : "black";
          return (
            <div
              onClick={() => handleCommunityCardClick(i)}
              className={"communityCard" + focusedCardClass}
              key={"CC" + i}
            >
              <div>{rank}</div>
              <div style={{ color: color }}>{suit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityCards;
