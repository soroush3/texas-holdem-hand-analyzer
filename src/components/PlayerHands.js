import ReactTooltip from "react-tooltip";

const PlayerHands = ({ playerHands, focusedCard, handlePlayerCardClick }) => {
  return (
    <div className="playerHandsContainer">
      {playerHands.map((playerHand, i) => {
        const card1 = playerHand.card1;
        const card2 = playerHand.card2;
        const info = playerHand.info;
        const hasFocus = focusedCard.idx !== null && focusedCard.idx - 5 === i;
        const redArr = ["♥︎", "♦︎"];
        const card1Color =
          card1 !== null && redArr.includes(card1.suit) ? "red" : "black";
        const card2Color =
          card2 !== null && redArr.includes(card2.suit) ? "red" : "black";
        return (
          <div key={"Player Hand " + i} className="playerHandContainer">
            {/* tooltip for when player hand info is available, "Player x" is clickable */}
            {info && (
              <ReactTooltip
                id={`playerHandInfo_${i}`}
                effect="solid"
                type="light"
                className="opaque"
              >
                <h2 style={{ color: "black" }}>{info.handType}</h2>
                <h3 style={{ color: "black" }}>Hand:</h3>
                <div className="winningHand">
                  {info.top5.map((card, i) => {
                    const rank = card.rank;
                    const suit = card.suit;
                    const color = ["♥︎", "♦︎"].includes(suit) ? "red" : "black";
                    return (
                      <div className={"miniCard"} key={"winningCard" + i}>
                        <div style={{ color: "black" }}>{rank}</div>
                        <div style={{ color: color }}>{suit}</div>
                      </div>
                    );
                  })}
                </div>
              </ReactTooltip>
            )}
            <h4
              // links tooltip to this header indicating which Player number
              data-tip
              data-for={`playerHandInfo_${i}`}
              style={{ cursor: info ? "pointer" : null }}
            >
              {"Player " + (i + 1) + (info ? " ⓘ" : "")}
            </h4>
            <div className="playerHand">
              {/* first card */}
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
              {/* second card */}
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
