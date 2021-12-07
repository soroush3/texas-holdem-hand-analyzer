import { rankings, suits } from "./CardDeck";

/*
  Hand rankings, reference https://www.cardplayer.com/rules-of-poker/hand-rankings
  for more details

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

/**
  Modular functions determine each of the hand types
*/

/**
  Determines if the hand is a royal flush.
  A royal flush consists of Ace, King, Queen, Jack, and 10 all of
  the same suit
*/
const isRoyalFlush = (handOf7) => {
  let royalCards = [];
  let setOfCards = new Set(["A", "K", "Q", "J", "10"]);
  for (const card of handOf7) {
    if (setOfCards.has(card.rank)) {
      royalCards.push(card);
    }
  }
  return isFlush(royalCards);
};

/**
  Determines if the hand if a flush.
  A flush consists of 5 cards with the same suit
*/
const isFlush = (handOf7) => {
  let suitMap = new Map();
  for (const card of handOf7) {
    const suit = card.suit;
    suitMap.set(suit, (suitMap.get(suit) ?? 0) + 1);
    if (suitMap.get(suit) === 5) return true;
  }
  return false;
};

/**
  Determine if the hand is a straight flush.
  5 cards that are in sequence and have the same suit
*/
const isStraightFlush = (handOf7) => {
  const suitMap = new Map();
  suits.forEach((suit) => {
    suitMap.set(suit, []);
  });
  for (const card of handOf7) {
    const { suit, rank } = card;
    suitMap.get(suit).push(rank);
  }

  for (const rankList of suitMap.values()) {
    if (rankList.length >= 5) {
      let count = 0;
      for (let i = 1; i < rankList.length; ++i) {
        const card1RankIdx = rankings.indexOf(rankList[i - 1]);
        const card2RankIdx = rankings.indexOf(rankList[i]);

        if (card2RankIdx - card1RankIdx === 1) ++count;
        else if (card2RankIdx - card1RankIdx !== 0) count = 0;
      }
      if (count === 4) return true;
      // need to determine if Ace low straight, Ace low straight can only be
      // Ace -> 2 -> 3 -> 4 -> 5
      let aceLowCount = 0;
      for (const rank of ["A", "2", "3", "4", "5"]) {
        if (
          rankList.findIndex((cardRank) => {
            return cardRank === rank;
          }) !== -1
        ) {
          ++aceLowCount;
        }
      }
      if (aceLowCount === 5) return true;
    }
  }
  return false;
};

/**
  Determines if there are five cards in a sequence
*/
const isStraight = (handOf7) => {
  let count = 0;
  for (let i = 1; i < handOf7.length; ++i) {
    const card1RankIdx = rankings.indexOf(handOf7[i - 1].rank);
    const card2RankIdx = rankings.indexOf(handOf7[i].rank);
    if (card2RankIdx - card1RankIdx === 1) ++count;
    else if (card2RankIdx - card1RankIdx !== 0) count = 0;
    if (count === 4) return true;
  }
  // need to determine if Ace low straight, Ace low straight can only be
  // Ace -> 2 -> 3 -> 4 -> 5
  let aceLowCount = 0;
  for (const rank of ["A", "2", "3", "4", "5"]) {
    if (
      handOf7.findIndex((card) => {
        return card.rank === rank;
      }) !== -1
    )
      ++aceLowCount;
  }
  return aceLowCount === 5;
};

/**
 * Determines if there are four cards of the same rank
 */
const isFourOfAKind = (handOf7) => {
  let rankMap = new Map();
  for (const card of handOf7) {
    const rank = card.rank;
    rankMap.set(rank, (rankMap.get(rank) ?? 0) + 1);
    if (rankMap.get(rank) === 4) return true;
  }
  return false;
};

/**
  Determines if the hand contains three of a kind and a pair
*/
const isFullHouse = (handOf7) => {
  let two = false;
  let three = false;

  const rankCount = new Map();
  for (const card of handOf7) {
    const cardRank = card.rank;
    rankCount.set(cardRank, (rankCount.get(cardRank) ?? 0) + 1);
  }

  for (const count of rankCount.values()) {
    if (count === 3) three = true;
    else if (count === 2) two = true;
  }
  return two && three;
};

/**
  Determines if the hand contains three cards of the same rank
*/
const isThreeOfAKind = (handOf7) => {
  let rankMap = new Map();
  for (const card of handOf7) {
    const rank = card.rank;
    rankMap.set(rank, (rankMap.get(rank) ?? 0) + 1);
    if (rankMap.get(rank) === 3) return true;
  }
  return false;
};

/**
  Determines if the hand contains two different pairs
*/
const isTwoPair = (handOf7) => {
  let rankMap = new Map();
  let pairCount = 0;
  for (const card of handOf7) {
    const rank = card.rank;
    rankMap.set(rank, (rankMap.get(rank) ?? 0) + 1);
    if (rankMap.get(rank) === 2) ++pairCount;
  }
  return pairCount >= 2;
};

/**
  Determines if the hand contains at least a pair
*/
const isPair = (handOf7) => {
  let rankMap = new Map();
  for (const card of handOf7) {
    const rank = card.rank;
    rankMap.set(rank, (rankMap.get(rank) ?? 0) + 1);
    if (rankMap.get(rank) === 2) return true;
  }
  return false;
};

const determineHandType = (handOf7) => {
  // given 7 cards, determines the highest ranking hand type
  // sort by ranking A K Q ... 3 2
  handOf7.sort((a, b) => {
    return rankings.indexOf(a.rank) - rankings.indexOf(b.rank);
  });

  if (isRoyalFlush(handOf7)) {
    return 1;
  } else if (isStraightFlush(handOf7)) {
    return 2;
  } else if (isFourOfAKind(handOf7)) {
    return 3;
  } else if (isFullHouse(handOf7)) {
    return 4;
  } else if (isFlush(handOf7)) {
    return 5;
  } else if (isStraight(handOf7)) {
    return 6;
  } else if (isThreeOfAKind(handOf7)) {
    return 7;
  } else if (isTwoPair(handOf7)) {
    return 8;
  } else if (isPair(handOf7)) {
    return 9;
  } else {
    // high card
    return 10;
  }
};

const DetermineWinner = (communityCards, playerHands) => {
  // check if community cards is complete (has 5 cards)
  let ccCount = 0;
  for (const card of communityCards) {
    if (card !== null) ++ccCount;
  }
  if (ccCount !== 5) {
    alert("5 cards must be on the community board");
    return;
  }
  // check that all player hands are complete (each hand has two cards)
  let playerCount = 0;
  for (const player of playerHands) {
    if (player.card1 !== null && player.card2 !== null) ++playerCount;
  }
  if (playerCount !== playerHands.length) {
    alert("Make sure that all player hands are complete");
    return;
  }
  // grab the needed state values
  const board = communityCards;
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
    const finalHand = determineHandType(handOf7);
    // add this information to an array for processing
    playersHandTypeArr.push({ finalHand: finalHand, playerIndex: i });
    // update the values of the player hand object for re rendering
    // playerHands[i].handType = finalHand.handType;
    // playerHands[i].topCards = finalHand.topCards;
  }
  console.log(playersHandTypeArr);
  return;
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

export default DetermineWinner;
