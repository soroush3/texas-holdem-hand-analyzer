import { rankings, suits } from "./CardDeck";

/*
  Hand rankings, reference https://www.cardplayer.com/rules-of-poker/hand-rankings
  for more details

  Royal Flush       1
  Straight Flush    2
  4 Of A Kind       3
  Full House        4
  Flush             5
  Straight          6
  3 Of A Kind       7
  2 Pair            8
  Pair              9
  High Card         10
*/

/**
  Modular functions determine each of the hand types.

  If the function determines it is of that hand type, 
  it will return the top 5 cards as a list.

  Otherwise, it will return an empty list.

  handOf7 is sorted by rank, A, K, Q ...
  most if not all of the functions depend on this
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
      for (const card2 of handOf7) {
        if (card2.suit === suit) top5.push(card2);
      }
      // make sure size is 5
      top5.splice(5);
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
  // aggregate cards by suit
  for (const card of handOf7) {
    suitMap.get(card.suit).push(card);
  }
  // go through suit arrays, determine if the cards in a given array forms a straight of 5 cards
  for (const cardList of suitMap.values()) {
    if (cardList.length >= 5) {
      let top5 = new Set();
      for (let i = 1; i < cardList.length; ++i) {
        const card1RankIdx = rankings.indexOf(cardList[i - 1].rank);
        const card2RankIdx = rankings.indexOf(cardList[i].rank);
        // adjacent cards are sequential
        if (card2RankIdx - card1RankIdx === 1) {
          top5.add(cardList[i - 1]);
          top5.add(cardList[i]);
          // not sequential
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
  let uniqueRank = new Set();
  let uniqueOf7 = [];
  // remove duplicates of ranks
  handOf7.forEach((card) => {
    if (!uniqueRank.has(card.rank)) {
      uniqueOf7.push(card);
      uniqueRank.add(card.rank);
    }
  });
  let top5 = new Set();
  //uniqueOf7 sorted by rank, see if the difference between adj cards is equal to 1
  for (let i = 1; i < uniqueOf7.length; ++i) {
    const card1RankIdx = rankings.indexOf(uniqueOf7[i - 1].rank);
    const card2RankIdx = rankings.indexOf(uniqueOf7[i].rank);
    // cards are sequential
    if (card2RankIdx - card1RankIdx === 1) {
      top5.add(uniqueOf7[i - 1]);
      top5.add(uniqueOf7[i]);
      // cards are not sequential
    } else top5.clear();
    if (top5.size === 5) return [...top5];
  }
  // need to determine if Ace low straight, Ace low straight can only be
  // 5 -> 4 -> 3 -> 2 -> A
  top5.clear();
  for (const rank of ["5", "4", "3", "2", "A"]) {
    const idx = uniqueOf7.findIndex((card) => {
      return card.rank === rank;
    });
    if (idx !== -1) top5.add(uniqueOf7[idx]);
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
    // found a quad (four cards of same rank), proceed to return
    if (rankMap.get(rank).length === 4) {
      let top5 = [...rankMap.get(rank)];
      // find the highest ranked card not in the quad array, add to top5
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
  // aggregate cards based on rank
  for (const card of handOf7) {
    if (!rankCount.has(card.rank)) {
      rankCount.set(card.rank, []);
    }
    rankCount.get(card.rank).push(card);
  }
  // find cards of three and cards of two
  for (const cardList of rankCount.values()) {
    if (cardList.length >= 3 && three.length === 0) three = cardList;
    else if (cardList.length >= 2 && two.length === 0) two = cardList;
  }
  // make sure the return array is of size 5
  three.splice(3);
  two.splice(2);
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
    // found a three of a kind, proceed to return
    if (rankMap.get(card.rank).length === 3) {
      let top5 = [...rankMap.get(card.rank)];
      // find the two highest ranked cards not in the triplet, add to top5
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
    // found a pair of the hand of 7
    if (rankMap.get(card.rank).length === 2) {
      // add to top 5
      top5.push(...rankMap.get(card.rank));
      // if we found two pairs, return them
      if (top5.length === 4) {
        for (const card of handOf7) {
          // add the highest ranked card not in the pairs to top 5
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
    // found the first pair of the hand of 7, return it immediately
    if (rankMap.get(card.rank).length === 2) {
      let top5 = [...rankMap.get(card.rank)];
      // add the three highest ranked cards not in the pair to top5
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
  let top5 = isRoyalFlush(handOf7);
  if (top5.length) {
    return { handRank: 1, handType: "Royal Flush", top5: top5 };
  }
  top5 = isStraightFlush(handOf7);
  if (top5.length) {
    const highRank = top5[0].rank;
    const handType = `Straight Flush, ${highRank} High`;
    return { handRank: 2, handType: handType, top5: top5 };
  }
  top5 = isFourOfAKind(handOf7);
  if (top5.length) {
    const highRank = top5[0].rank;
    const handType = `Four Of A Kind, ${highRank}'s`;
    return { handRank: 3, handType: handType, top5: top5 };
  }
  top5 = isFullHouse(handOf7);
  if (top5.length) {
    const threeRank = top5[0].rank;
    const twoRank = top5[top5.length - 1].rank;
    const handType = `Full House, ${threeRank}'s Full Of ${twoRank}'s `;
    return { handRank: 4, handType: handType, top5: top5 };
  }
  top5 = isFlush(handOf7);
  if (top5.length) {
    const handRank = top5[0].rank;
    const handType = `Flush, ${handRank} High`;
    return { handRank: 5, handType: handType, top5: top5 };
  }
  top5 = isStraight(handOf7);
  if (top5.length) {
    const handRank = top5[0].rank;
    const handType = `Straight, ${handRank} High`;
    return { handRank: 6, handType: handType, top5: top5 };
  }
  top5 = isThreeOfAKind(handOf7);
  if (top5.length) {
    const handRank = top5[0].rank;
    const handType = `Three Of A Kind, ${handRank}'s`;
    return { handRank: 7, handType: handType, top5: top5 };
  }
  top5 = isTwoPair(handOf7);
  if (top5.length) {
    const firstPairRank = top5[0].rank;
    const secondPairRank = top5[2].rank;
    const handType = `Two Pair, ${firstPairRank}'s And ${secondPairRank}'s`;
    return { handRank: 8, handType: handType, top5: top5 };
  }
  top5 = isPair(handOf7);
  if (top5.length) {
    const pairRank = top5[0].rank;
    const handType = `Pair, ${pairRank}'s`;
    return { handRank: 9, handType: handType, top5: top5 };
  }
  // high card
  const handType = `High Card, ${handOf7[0].rank} High`;
  return { handRank: 10, handType: handType, top5: handOf7.slice(0, 5) };
};

const getPlayerHandType = (communityCards, playerHand) => {
  // consider the 7 cards for a player and their hand type
  const handOf7 = [playerHand.card1, playerHand.card2, ...communityCards];
  return determineHandType(handOf7);
};

const DetermineWinner = (communityCards, playerHands) => {
  // transform player hands to player hand type
  const playersHandTypeArr = playerHands.map((playerHand, idx) => {
    return {
      finalHand: getPlayerHandType(communityCards, playerHand),
      playerIndex: idx,
    };
  });
  // sort the array based on hand rank, break ties by comparing the
  // top cards from each persons hand
  // key = hand type, val = player index
  let rankMap = new Map();
  playersHandTypeArr.sort((a, b) => {
    if (a.finalHand.handRank !== b.finalHand.handRank)
      return a.finalHand.handRank - b.finalHand.handRank;
    else {
      for (
        let i = 0;
        i < a.finalHand.top5.length && i < b.finalHand.top5.length;
        ++i
      ) {
        const aCardRank = a.finalHand.top5[i].rank;
        const bCardRank = b.finalHand.top5[i].rank;
        if (aCardRank !== bCardRank) {
          return rankings.indexOf(aCardRank) - rankings.indexOf(bCardRank);
        }
      }
      // if we reach here, the top card rankings are the same i.e. the two
      // hands tied
      if (!rankMap.has(a.finalHand.handRank)) {
        rankMap.set(a.finalHand.handRank, new Set());
      }
      rankMap.get(a.finalHand.handRank).add(a.playerIndex);
      rankMap.get(b.finalHand.handRank).add(b.playerIndex);

      return 0;
    }
  });

  const rankOfHand = playersHandTypeArr[0].finalHand.handRank;
  const handType = playersHandTypeArr[0].finalHand.handType;
  const indexOfHand = playersHandTypeArr[0].playerIndex;
  const top5 = playersHandTypeArr[0].finalHand.top5;

  // index 0 of the array (playersHandTypeArr) is either the complete winner
  // or it is tied for first with other players
  if (!rankMap.has(rankOfHand) || !rankMap.get(rankOfHand).has(indexOfHand)) {
    // this player is the singular winner of the poker hand
    return {
      whoWon: `Player ${indexOfHand + 1} wins!`,
      top5: top5,
      handType: handType,
      playerHandsResult: playersHandTypeArr,
    };
  } else {
    let tiedPlayers = [...rankMap.get(rankOfHand)].sort().map((player) => {
      return player + 1;
    });
    const whoWon = `Players ${tiedPlayers.slice(0, -1).join(", ")} and ${
      tiedPlayers[tiedPlayers.length - 1]
    } have tied!`;
    return {
      whoWon: whoWon,
      top5: top5,
      handType: handType,
      playerHandsResult: playersHandTypeArr,
    };
  }
};

export { DetermineWinner, getPlayerHandType };
