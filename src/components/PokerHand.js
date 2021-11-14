import React, { Component } from "react";

function Card(props) {
  function deleteCard() {
    props.onDelete(props.value);
  }
  const [rank, suit] = props.value.split(" ");
  const color = ["♥︎", "♦︎"].includes(suit) ? "red" : "black";
  return (
    <div className="card" style={{ color: color }}>
      {!props.playerHand && <button onClick={deleteCard}>Delete Card</button>}
      <div>{rank}</div>
      <div>{suit}</div>
    </div>
  );
}

function PlayerHand(props) {
  function handleClick() {
    props.deleteHand(props.card1, props.card2);
  }
  let topCardString = "";
  for (const card of props.topCards) {
    topCardString = topCardString.concat(card + " ");
  }
  return (
    <div className="player-hand-container">
      <div>
        <button onClick={handleClick}> Delete Player Hand</button>
      </div>

      <div className="player-hand">
        <Card playerHand={true} key={props.card1} value={props.card1}></Card>
        <Card playerHand={true} key={props.card2} value={props.card2}></Card>
      </div>
      <div>Percentage: {props.percentage}</div>
      <div>Hand: {props.handType} </div>
      <div className="top-cards">Top Cards: {topCardString}</div>
    </div>
  );
}

export default class PokerHand extends Component {
  constructor(props) {
    super(props);
    // prettier-ignore
    const rankings = [
      "Ace", "King", "Queen", "Jack", 
      "10", "9", "8", "7", "6", "5", "4", "3", "2",
    ];
    const suits = ["♠︎", "♥︎", "♣︎", "♦︎"];
    // const suits = ["Spades", "Hearts", "Clubs", "Diamonds"];

    const deckOfCards = new Set();

    for (let i = 0; i < rankings.length; ++i) {
      for (let j = 0; j < suits.length; ++j) {
        deckOfCards.add(rankings[i] + " " + suits[j]);
      }
    }

    this.state = {
      deckOfCards: deckOfCards,
      rankings: rankings,
      suits: suits,
      communityCards: [],
      playerHands: [],
    };
  }

  reset = () => {
    const deck = this.state.deckOfCards;

    deck.clear();

    for (let rank of this.state.rankings) {
      for (let suit of this.state.suits) {
        deck.add(rank + " " + suit);
      }
    }

    this.setState({
      deckOfCards: deck,
      communityCards: [],
      playerHands: [],
    });
  };

  // delete Community Card
  deleteCC = (deletedCard) => {
    // add card back to deck
    const deck = this.state.deckOfCards;
    const comCards = this.state.communityCards;
    deck.add(deletedCard);

    for (let i = 0; i < comCards.length; ++i) {
      if (comCards[i] === deletedCard) {
        comCards.splice(i, 1);
        break;
      }
    }

    this.setState({
      deckOfCards: deck,
      communityCards: comCards,
    });
  };
  // add Community Card
  addCC = () => {
    if (this.state.communityCards.length < 5) {
      const newCardValue = document.getElementById("selectCC").value;
      const ccArr = this.state.communityCards;
      ccArr.push(newCardValue);

      const deck = this.state.deckOfCards;
      deck.delete(newCardValue);

      this.setState({
        communityCards: ccArr,
        deckOfCards: deck,
      });
    }
  };

  addPlayerHand = () => {
    let pc1 = document.getElementById("selectPC1").value;
    let pc2 = document.getElementById("selectPC2").value;
    if (this.state.playerHands.length < 10 && pc1 !== pc2) {
      // get state, playerHand arr and deck set
      const playerHands = this.state.playerHands;
      const deck = this.state.deckOfCards;

      // remove the selected cards from deck set
      deck.delete(pc1);
      deck.delete(pc2);
      // push the new player hand to the player hand arr
      let newPlayer = {
        card1: pc1,
        card2: pc2,
        percentage: null,
        handType: null,
        topCards: [],
      };

      playerHands.push(newPlayer);

      this.setState({
        playerHands: playerHands,
        deckOfCards: deck,
      });
    }
  };

  deletePlayerHand = (c1, c2) => {
    const playerHands = this.state.playerHands;
    const deck = this.state.deckOfCards;

    // find the player hand and remove it
    for (let i = 0; i < playerHands.length; ++i) {
      if (playerHands[i].card1 === c1 && playerHands[i].card2 === c2) {
        playerHands.splice(i, 1);
        break;
      }
    }
    // add the two cards back to the deck
    deck.add(c1);
    deck.add(c2);
    // set the state
    this.setState({
      playerHands: playerHands,
      deckOfCards: deck,
    });
  };

  renderCommunityCard(cardValue) {
    return (
      <Card
        playerHand={false}
        key={cardValue}
        value={cardValue}
        onDelete={this.deleteCC}
      ></Card>
    );
  }

  renderPlayerHand(playerHand) {
    return (
      <PlayerHand
        key={playerHand.card1 + " " + playerHand.card2}
        deleteHand={this.deletePlayerHand}
        card1={playerHand.card1}
        card2={playerHand.card2}
        isPlayerHand={true}
        percentage={playerHand.percentage}
        handType={playerHand.handType}
        topCards={playerHand.topCards}
      ></PlayerHand>
    );
  }

  render() {
    const deckOfCards = Array.from(this.state.deckOfCards);
    deckOfCards.sort((a, b) => {
      return (
        this.state.rankings.indexOf(a.split(" ")[0]) -
        this.state.rankings.indexOf(b.split(" ")[0])
      );
    });

    return (
      <div className="App">
        <div>
          <button onClick={this.reset}>Reset</button>
          <button onClick={this.calculatePercentages}> Calculate </button>
        </div>

        <div style={{ margin: "10px" }}>
          <button onClick={(e) => this.addCC(e.target.value)}>
            Add Community Card
          </button>
          <select id="selectCC">
            {deckOfCards.map((card, key) => {
              return (
                <option key={key} value={card}>
                  {card}
                </option>
              );
            })}
          </select>
        </div>

        {this.state.communityCards.length !== 0 ? (
          <div className="community-board">
            {this.state.communityCards.map((card) => {
              return this.renderCommunityCard(card);
            })}
          </div>
        ) : null}
        <br></br>
        <div>
          <button
            onClick={this.addPlayerHand}
            style={{ marginBlockStart: "25px" }}
          >
            Add Player Hand
          </button>
          <select id="selectPC1">
            {deckOfCards.map((card, key) => {
              return (
                <option key={key} value={card}>
                  {card}
                </option>
              );
            })}
          </select>
          <select id="selectPC2">
            {deckOfCards.map((card, key) => {
              return (
                <option key={key} value={card}>
                  {card}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          {this.state.playerHands.map((playerHand) => {
            return this.renderPlayerHand(playerHand);
          })}
        </div>
      </div>
    );
  }

  calculatePercentages = () => {
    // check if community cards has all 5 cards
    if (this.state.communityCards.length !== 5) {
      alert("5 cards must be on the community board");
      return;
    }
    // check if there is at least one player hand
    if (this.state.playerHands === 0) return;
    // grab the needed state values
    const playerHands = this.state.playerHands;
    const board = this.state.communityCards;
    const playersHandTypeArr = [];
    // iterate through each players hands
    for (let i = 0; i < playerHands.length; ++i) {
      // grab the 5 cards on the board and the players 2 card hand
      let handOf7 = [];
      const c1 = playerHands[i].card1;
      const c2 = playerHands[i].card2;
      handOf7.push(c1, c2, ...board);
      // call function to determine the players Hand
      // final hand: { 'handType': string, 'topCards': arr}
      const finalHand = this.determineHandType(handOf7);
      // add this information to an array for processing
      playersHandTypeArr.push({ finalHand: finalHand, index: i });
      // update the values of the player hand object for re rendering
      playerHands[i].handType = finalHand.handType;
      playerHands[i].topCards = finalHand.topCards;
    }
    // sort the array based on hand rank, break ties by comparing the
    // top cards from each persons hand
    let rankMap = new Map();
    playersHandTypeArr.sort((a, b) => {
      if (a.finalHand.handRank !== b.finalHand.handRank)
        return a.finalHand.handRank - b.finalHand.handRank;
      else {
        for (
          let i = 0;
          i < a.finalHand.topCards.length && i < b.finalHand.topCards.length;
          ++i
        ) {
          const aCardRank = a.finalHand.topCards[i].split(" ")[0];
          const bCardRank = b.finalHand.topCards[i].split(" ")[0];
          if (aCardRank !== bCardRank) {
            return (
              this.state.rankings.indexOf(aCardRank) -
              this.state.rankings.indexOf(bCardRank)
            );
          }
        }
        // if we reach here, the top card rankings are the same i.e. the two
        // hands tied
        if (!rankMap.has(a.finalHand.handRank)) {
          rankMap.set(a.finalHand.handRank, new Set());
        }
        rankMap.get(a.finalHand.handRank).add(a.index);
        rankMap.get(b.finalHand.handRank).add(b.index);

        return 0;
      }
    });
    // reset the winning percentages of all hands
    for (let i = 0; i < playerHands.length; ++i) {
      playerHands[i].percentage = 0;
    }
    // process the percentages based on the sorting done above
    const rankOfHand = playersHandTypeArr[0].finalHand.handRank;
    const indexOfHand = playersHandTypeArr[0].index;

    // index 0 of the array (playersHandTypeArr) is either the complete winner
    // or it is tied for first with other players
    if (!rankMap.has(rankOfHand) || !rankMap.get(rankOfHand).has(indexOfHand)) {
      // this player is the singular winner of the poker hand
      playerHands[indexOfHand].percentage = 100;
    } else {
      // the player index 0 is tied for first
      const setOfPlayersWhoWon = rankMap.get(rankOfHand);
      const numOfPlayers = setOfPlayersWhoWon.size;
      for (const playerIndex of setOfPlayersWhoWon) {
        playerHands[playerIndex].percentage = 100 / numOfPlayers;
      }
    }

    this.setState({
      playerHands: playerHands,
    });
  };

  determineHandType = (handOf7) => {
    // given 7 cards, determines the highest ranking hand type
    // pre processing
    const suitCount = new Map();
    const rankCount = new Map();
    for (let suit of this.state.suits) {
      suitCount.set(suit, []);
    }

    for (let rank of this.state.rankings) {
      rankCount.set(rank, []);
    }

    handOf7.sort((a, b) => {
      return (
        this.state.rankings.indexOf(a.split(" ")[0]) -
        this.state.rankings.indexOf(b.split(" ")[0])
      );
    });

    let isFlush = null;
    let is4OfKind = null;
    // process number of suits and number of ranks
    for (let card of handOf7) {
      const [rank, suit] = card.split(" ");
      suitCount.get(suit).push(card);
      if (suitCount.get(suit).length === 5) isFlush = suit;
      rankCount.get(rank).push(card);
      if (rankCount.get(rank).length === 4) is4OfKind = rank;
    }

    // sort the isFlush array of cards based on card rank
    if (isFlush !== null) {
      suitCount.get(isFlush).sort((a, b) => {
        return (
          this.state.rankings.indexOf(a.split(" ")[0]) -
          this.state.rankings.indexOf(b.split(" ")[0])
        );
      });
      isFlush = suitCount.get(isFlush);
    }
    // determines if Royal Flush or Sraight Flush
    let isFlushStraight = null;
    if (isFlush !== null) {
      // adjust the array to have 7 cards for the 'isHandStraight' function
      let flushStraightArr = [];
      while (flushStraightArr.length + isFlush.length < 7) {
        flushStraightArr.push(isFlush[0]);
      }
      flushStraightArr.push(...isFlush);
      isFlushStraight = this.isHandStraight(flushStraightArr);
      // if this var is not null, need to determine between royal or straight flush
      if (isFlushStraight !== null) {
        // see if first two cards are an Ace and King, if so, it is a Royal Flush
        if (
          isFlushStraight[0].split(" ")[0] === "Ace" &&
          isFlushStraight[1].split(" ")[0] === "King"
        ) {
          return {
            handType: "Royal Flush",
            topCards: isFlushStraight,
            handRank: 1,
          };
        }
        // else, it is a Straight Flush
        else {
          return {
            handType: "Straight Flush",
            topCards: isFlushStraight,
            handRank: 2,
          };
        }
      }
    }
    // determine if 4 of a kind
    if (is4OfKind !== null) {
      let fourOfAKindArr = rankCount.get(is4OfKind);
      const fourOfKindRank = fourOfAKindArr[0].split(" ")[0];
      // need to find the 5th best card
      for (let card of handOf7) {
        let rank = card.split(" ")[0];
        if (rank !== fourOfKindRank) {
          // determine if card should be pushed to front or back determined
          // on rank
          if (
            this.state.rankings.indexOf(rank) <
            this.state.rankings.indexOf(fourOfKindRank)
          ) {
            fourOfAKindArr.unshift(card);
          } else {
            fourOfAKindArr.push(card);
          }
          return {
            handType: "Four Of A Kind",
            topCards: fourOfAKindArr,
            handRank: 3,
          };
        }
      }
    }
    const pairOf3Arr = [];
    const pairOf2Arr = [];
    // take count of three of a kind and two of a kind
    for (let pair of rankCount) {
      if (pair[1].length === 3) pairOf3Arr.push(pair[1]);
      else if (pair[1].length === 2) pairOf2Arr.push(pair[1]);
    }
    // sort 3 of a kind's based on rank
    pairOf3Arr.sort((a, b) => {
      return (
        this.state.rankings.indexOf(a[0].split(" ")[0]) -
        this.state.rankings.indexOf(b[0].split(" ")[0])
      );
    });
    // sort 2 of a kind's based on rank
    pairOf2Arr.sort((a, b) => {
      return (
        this.state.rankings.indexOf(a[0].split(" ")[0]) -
        this.state.rankings.indexOf(b[0].split(" ")[0])
      );
    });
    // determine if full house
    if (pairOf3Arr.length >= 1 && pairOf3Arr.length + pairOf2Arr.length >= 2) {
      // grab the rank of the 3 pair
      const rank1 = pairOf3Arr[0][0].split(" ")[0] + "s";
      // combine the rest of the elements from 3PairArr and 2PairArr
      const pairOf2orHigherArr = [];
      if (pairOf3Arr.length > 1) pairOf2orHigherArr.push(pairOf3Arr[1]);
      pairOf2orHigherArr.push(...pairOf2Arr);
      // sort the contents
      pairOf2orHigherArr.sort((a, b) => {
        return (
          this.state.rankings.indexOf(a[0].split(" ")[0]) -
          this.state.rankings.indexOf(b[0].split(" ")[0])
        );
      });
      // grab the highest ranked 2 pair
      const rank2 = pairOf2orHigherArr[0][0].split(" ")[0] + "s";
      // grab the top 5 cards that make the hand
      const topCards = [];
      topCards.push(...pairOf3Arr[0]);
      for (let i = 0; i < 2; ++i) {
        topCards.push(pairOf2orHigherArr[0][i]);
      }
      return {
        handType: `Full House ${rank1} Full Of ${rank2}`,
        topCards: topCards,
        handRank: 4,
      };
    }

    // determine if Flush
    if (isFlush !== null) {
      // the length of the flush array may be larger than 7, it is already sorted
      while (isFlush.length > 5) {
        isFlush.pop();
      }
      return { handType: "Flush", topCards: isFlush, handRank: 5 };
    }
    // determine if straight
    let straightArr = this.isHandStraight(handOf7);
    if (straightArr !== null) {
      const rank = straightArr[0].split(" ")[0];
      return {
        handType: `Straight, ${rank} High`,
        topCards: straightArr,
        handRank: 6,
      };
    }
    // determine if 3 of a kind
    if (pairOf3Arr.length === 1) {
      const rank = pairOf3Arr[0][0].split(" ")[0];
      // add 3 of a kind to the top cards array
      const topCards = [...pairOf3Arr[0]];
      // add the next two best cards to the top cards array
      for (const card of handOf7) {
        if (!pairOf3Arr[0].includes(card)) {
          topCards.push(card);
        }
        if (topCards.length === 5) break;
      }
      return {
        handType: `Three Of A Kind, ${rank}s`,
        topCards: topCards,
        handRank: 7,
      };
    }
    // determine if two pair
    if (pairOf2Arr.length > 1) {
      const rank1 = pairOf2Arr[0][0].split(" ")[0];
      const rank2 = pairOf2Arr[1][0].split(" ")[0];
      const topCards = [...pairOf2Arr[0], ...pairOf2Arr[1]];
      // find the last best card
      for (const card of handOf7) {
        if (!topCards.includes(card)) {
          topCards.push(card);
          break;
        }
      }
      return {
        handType: `Two Pairs, ${rank1}s and ${rank2}s`,
        topCards: topCards,
        handRank: 8,
      };
    }

    // determine if single pair
    if (pairOf2Arr.length === 1) {
      const rank = pairOf2Arr[0][0].split(" ")[0];
      const topCards = [...pairOf2Arr[0]];
      for (const card of handOf7) {
        if (!topCards.includes(card)) {
          topCards.push(card);
        }
        if (topCards.length === 5) break;
      }
      return { handType: `Pair of ${rank}s`, topCards: topCards, handRank: 9 };
    }

    // lastly, the player has at best a high card
    const topCards = [];
    for (let i = 0; i < 5; ++i) {
      topCards.push(handOf7[i]);
    }
    const rank = topCards[0].split(" ")[0];
    return { handType: `${rank} High`, topCards: topCards, handRank: 10 };
  };

  isHandStraight = (handOf7) => {
    // determines if the hand of 7 contains a straight, 5 cards in a row
    if (handOf7.length !== 7) return null;
    let faceMap = new Map();
    faceMap.set("Ace", 14);
    faceMap.set("King", 13);
    faceMap.set("Queen", 12);
    faceMap.set("Jack", 11);

    for (let i = 0; i < handOf7.length && i <= 2; ++i) {
      let straightCards = [handOf7[i]];
      for (let j = i + 1; j < handOf7.length; ++j) {
        let first = handOf7[j - 1].split(" ")[0];
        let second = handOf7[j].split(" ")[0];
        if (faceMap.has(first)) first = faceMap.get(first);
        if (faceMap.has(second)) second = faceMap.get(second);
        first = parseInt(first);
        second = parseInt(second);
        if (first - second === 0) continue;
        // determine if the cards are next to eachother
        if (first - second === 1) {
          straightCards.push(handOf7[j]);
        } else break;
        if (straightCards.length === 5) {
          return straightCards;
        }
      }
    }
    // need to determine if Ace low straight, Ace low straight can only be
    // Ace -> 2 -> 3 -> 4 -> 5
    if (
      handOf7[0].split(" ")[0] === "Ace" &&
      handOf7[6].split(" ")[0] === "2" &&
      handOf7[5].split(" ")[0] === "3" &&
      handOf7[4].split(" ")[0] === "4" &&
      handOf7[3].split(" ")[0] === "5"
    ) {
      return [handOf7[3], handOf7[4], handOf7[5], handOf7[6], handOf7[0]];
    }
    return null;
  };
}

/*
A J 10 9 4 3 2 
  Royal Flush       1
  Straight Flush    2
  4 of a kind       3
  Full House        4
  Flush             5
  Straight          6
  3 of a kind       7
  2 pair            8
  pair              9
  High card         10
*/
