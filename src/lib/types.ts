// =============================================================================
// CARD TYPES
// =============================================================================

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit | '?';
  rank: Rank | '?';
  hidden?: boolean;
}

// Type for display cards (compatible with GameTableCanvas)
export interface DisplayCard {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
}

// =============================================================================
// BLACKJACK TYPES
// =============================================================================

export type BlackjackPhase = 'betting' | 'playing' | 'dealer_turn' | 'finished';
export type BlackjackResult = 'win' | 'lose' | 'push' | 'blackjack' | 'bust' | 'dealer_bust' | null;

// =============================================================================
// COINFLIP TYPES
// =============================================================================

export interface CoinflipHistoryItem {
  resultHeads: boolean;
  won: boolean;
  betAmount: number;
}
