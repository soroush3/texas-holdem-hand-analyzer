import React, { Component } from "react";

function Card(props) {
  function deleteCard() {
    props.onDelete(props.value);
  }

  return (
    <div className="card">
      {!props.playerHand && <button onClick={deleteCard}>Delete Card</button>}
      <div>{props.value}</div>
    </div>
  );
}

function PlayerHand(props) {
  function handleClick() {
    props.deleteHand(props.card1, props.card2);
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
    </div>
  );
}

export default class PokerHand extends Component {
  constructor(props) {
    super(props);
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
    const suits = ["Spades", "Hearts", "Clubs", "Diamonds"];

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
      percentages: new Map(),
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
      if (comCards[i].key === deletedCard) {
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
      let e = document.getElementById("selectCC");
      const newCardValue = e.value;
      const ccArr = this.state.communityCards;
      ccArr.push(
        <Card
          playerHand={false}
          key={newCardValue}
          value={newCardValue}
          onDelete={this.deleteCC}
        ></Card>
      );

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
              return card;
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
    if (this.state.communityCards.length !== 5) {
      alert("5 cards must be on the community board");
      return;
    }
    const playerHands = this.state.playerHands;
    for (let i = 0; i < playerHands.length; ++i) {
      const c1 = playerHands[i].card1;
      const c2 = playerHands[i].card2;
      playerHands[i].percentage = 50;
    }
    this.setState({
      playerHands: playerHands,
    });
  };
}

/*
  Royal Flush
  Straight Flush
  4 of a kind
  Full House
  Flush
  Straight
  3 of a kind
  2 pair
  pair
  High card
*/
