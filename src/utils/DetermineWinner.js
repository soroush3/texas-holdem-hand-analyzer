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
  Modular functions determine each of the hand types.

  If the function determines it is of that hand type, 
  it will return the top 5 cards as a list.
  
  Otherwise, it will return an empty list.
*/

/**
  Determines if the hand is a Royal Flush.

  A Royal Flush consists of Ace, King, Queen, Jack, and 10 all of
  the same suit.
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
  Determines if the hand if a Flush.

  A Flush consists of 5 cards with the same suit.
*/
const isFlush = (handOf7) => {
  let suitMap = new Map();
  for (const card of handOf7) {
    const suit = card.suit;
    suitMap.set(suit, (suitMap.get(suit) ?? 0) + 1);
    if (suitMap.get(suit) === 5) {
      let top5 = [];
      for (const card of handOf7) {
        if (card.suit === suit) top5.push(card);
      }
      return top5;
    }
  }
  return [];
};

/**
  Determine if the hand is a straight flush.

  5 cards that are in sequence and have the same suit.
*/
const isStraightFlush = (handOf7) => {
  const suitMap = new Map();
  suits.forEach((suit) => {
    suitMap.set(suit, []);
  });
  for (const card of handOf7) {
    suitMap.get(card.suit).push(card);
  }

  for (const cardList of suitMap.values()) {
    if (cardList.length >= 5) {
      let top5 = new Set();
      for (let i = 1; i < cardList.length; ++i) {
        const card1RankIdx = rankings.indexOf(cardList[i - 1].rank);
        const card2RankIdx = rankings.indexOf(cardList[i].rank);

        if (card2RankIdx - card1RankIdx === 1) {
          top5.add(cardList[i - 1]);
          top5.add(cardList[i]);
        } else top5.clear();
      }

      if (top5.size === 5) return [...top5];
      // need to determine if Ace low straight, Ace low straight can only be
      // 5 -> 4 -> 3 -> 2 -> A
      top5.clear();
      for (const rank of ["5", "4", "3", "2", "A"]) {
        const idx = cardList.findIndex((card) => {
          return card.rank === rank;
        });
        if (idx !== -1) top5.add(cardList[idx]);
      }
      if (top5.size === 5) {
        return [...top5];
      }
    }
  }
  return [];
};

/**
  Determines if there are five cards in a sequence based on card rank.
*/
const isStraight = (handOf7) => {
  let top5 = new Set();
  for (let i = 1; i < handOf7.length; ++i) {
    const card1RankIdx = rankings.indexOf(handOf7[i - 1].rank);
    const card2RankIdx = rankings.indexOf(handOf7[i].rank);
    if (card2RankIdx - card1RankIdx === 1) {
      top5.add(handOf7[i - 1]);
      top5.add(handOf7[i]);
    } else if (card2RankIdx - card1RankIdx !== 0) top5.clear();
    if (top5.size === 5) return [...top5];
  }
  // need to determine if Ace low straight, Ace low straight can only be
  // 5 -> 4 -> 3 -> 2 -> A
  top5.clear();
  for (const rank of ["5", "4", "3", "2", "A"]) {
    const idx = handOf7.findIndex((card) => {
      return card.rank === rank;
    });
    if (idx !== -1) top5.add(handOf7[idx]);
  }
  return top5.size === 5 ? [...top5] : [];
};

/**
 * Determines if there are four cards of the same rank
 */
const isFourOfAKind = (handOf7) => {
  let rankMap = new Map();
  for (const card of handOf7) {
    const rank = card.rank;
    if (!rankMap.has(rank)) rankMap.set(rank, []);
    rankMap.get(rank).push(card);
    if (rankMap.get(rank).length === 4) {
      let top5 = [...rankMap.get(rank)];
      for (const card of handOf7) {
        if (card.rank !== rank) {
          top5.push(card);
          return top5;
        }
      }
    }
  }
  return [];
};

/**
  Determines if the hand contains three of a kind and a pair
*/
const isFullHouse = (handOf7) => {
  let two = [];
  let three = [];

  const rankCount = new Map();
  for (const card of handOf7) {
    if (!rankCount.has(card.rank)) {
      rankCount.set(card.rank, []);
    }
    rankCount.get(card.rank).push(card);
  }

  for (const cardList of rankCount.values()) {
    if (cardList.length >= 3 && three.length === 0) three = cardList;
    else if (cardList.length >= 2 && two.length === 0) two = cardList;
  }
  return three.length && two.length ? [...three, ...two] : [];
};

/**
  Determines if the hand contains three cards of the same rank
*/
const isThreeOfAKind = (handOf7) => {
  let rankMap = new Map();
  for (const card of handOf7) {
    if (!rankMap.has(card.rank)) rankMap.set(card.rank, []);
    rankMap.get(card.rank).push(card);
    if (rankMap.get(card.rank).length === 3) {
      let top5 = [...rankMap.get(card.rank)];
      for (const card2 of handOf7) {
        if (card2.rank !== card.rank) {
          top5.push(card2);
        }
        if (top5.length === 5) return top5;
      }
    }
  }
  return [];
};

/**
  Determines if the hand contains two different pairs
*/
const isTwoPair = (handOf7) => {
  let rankMap = new Map();
  let top5 = [];
  for (const card of handOf7) {
    if (!rankMap.has(card.rank)) rankMap.set(card.rank, []);
    rankMap.get(card.rank).push(card);
    if (rankMap.get(card.rank).length === 2) {
      top5.push(...rankMap.get(card.rank));
      if (top5.length === 4) {
        for (const card of handOf7) {
          if (top5.indexOf(card) === -1) {
            top5.push(card);
            return top5;
          }
        }
      }
    }
  }
  return [];
};

/**
  Determines if the hand contains a pair
*/
const isPair = (handOf7) => {
  let rankMap = new Map();
  for (const card of handOf7) {
    if (!rankMap.has(card.rank)) rankMap.set(card.rank, []);
    rankMap.get(card.rank).push(card);
    if (rankMap.get(card.rank).length === 2) {
      let top5 = [...rankMap.get(card.rank)];
      for (const card2 of handOf7) {
        if (card2.rank !== card.rank) top5.push(card2);
        if (top5.length === 5) return top5;
      }
    }
  }
  return [];
};

const determineHandType = (handOf7) => {
  // given 7 cards, determines the highest ranking hand type
  // sort by ranking A K Q ... 3 2
  handOf7.sort((a, b) => {
    return rankings.indexOf(a.rank) - rankings.indexOf(b.rank);
  });
  let result = isRoyalFlush(handOf7);
  if (result.length) {
    return { handRank: 1, top5: result };
  }
  result = isStraightFlush(handOf7);
  if (result.length) {
    return { handRank: 2, top5: result };
  }
  result = isFourOfAKind(handOf7);
  if (result.length) {
    return { handRank: 3, top5: result };
  }
  result = isFullHouse(handOf7);
  if (result.length) {
    return { handRank: 4, top5: result };
  }
  result = isFlush(handOf7);
  if (result.length) {
    return { handRank: 5, top5: result };
  }
  result = isStraight(handOf7);
  if (result.length) {
    return { handRank: 6, top5: result };
  }
  result = isThreeOfAKind(handOf7);
  if (result.length) {
    return { handRank: 7, top5: result };
  }
  result = isTwoPair(handOf7);
  if (result.length) {
    return { handRank: 8, top5: result };
  }
  result = isPair(handOf7);
  if (result.length) {
    return { handRank: 9, top5: result };
  }
  // high card
  return { handRank: 10, top5: handOf7.slice(0, 5) };
};

const DetermineWinner = (communityCards, playerHands) => {
  // check if community cards is complete (has 5 cards)
  let cc_count = 0;
  for (const card of communityCards) {
    if (card !== null) ++cc_count;
  }
  if (cc_count !== 5) {
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
  }
  // need to determine winner and break ties
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
