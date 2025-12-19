import { Card, Suit, Rank } from './types';
import { SUITS, RANKS } from './constants';

// =============================================================================
// DECK FUNCTIONS
// =============================================================================

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  // Shuffle using Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function dealCard(currentDeck: Card[]): [Card, Card[]] {
  const newDeck = [...currentDeck];
  const card = newDeck.pop()!;
  return [card, newDeck];
}

// =============================================================================
// HAND CALCULATIONS
// =============================================================================

export function getCardValue(card: Card): number[] {
  if (card.rank === 'A') return [1, 11];
  if (['J', 'Q', 'K'].includes(card.rank)) return [10];
  if (card.rank === '?') return [0];
  return [parseInt(card.rank)];
}

export function calculateHand(cards: Card[]): number {
  const visibleCards = cards.filter((c) => !c.hidden && c.rank !== '?');
  let total = 0;
  let aces = 0;

  for (const card of visibleCards) {
    const values = getCardValue(card);
    if (values.length === 2) {
      aces++;
      total += 11;
    } else {
      total += values[0];
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

export function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && calculateHand(cards) === 21;
}

// =============================================================================
// CARD DISPLAY HELPERS
// =============================================================================

export function toDisplayCard(card: Card): { suit: Suit; rank: Rank; hidden?: boolean } {
  if (card.rank === '?' || card.suit === '?') {
    return { suit: '♠', rank: 'A', hidden: true };
  }
  return card as { suit: Suit; rank: Rank; hidden?: boolean };
}

export function convertHiddenCards(cards: Card[]): Card[] {
  return cards.map((c) => (c.rank === '?' ? { ...c, hidden: true } : c));
}
