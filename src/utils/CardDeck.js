export const rankings = [
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

export const suits = ["♣︎", "♠︎", "♥︎", "♦︎"];

let i = 0;
let deckOfCards = [];
for (let rank of rankings) {
  for (let suit of suits) {
    deckOfCards.push({ rank: rank, suit: suit, position: i++ });
  }
}

export default deckOfCards;
