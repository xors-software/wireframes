"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import for Three.js components (avoid SSR issues)
const GameTableCanvas = dynamic(
  () => import("@/components/Card3D").then((mod) => mod.GameTableCanvas),
  { ssr: false }
);
import { Celebration } from "@/components/Celebration";

// =============================================================================
// TYPES
// =============================================================================

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface Card {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
}

type GameState = "betting" | "playing" | "dealer_turn" | "finished";
type Result = "win" | "lose" | "push" | "blackjack" | null;

// =============================================================================
// CONSTANTS
// =============================================================================

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
const STARTING_BALANCE = 1000;

// =============================================================================
// GAME LOGIC
// =============================================================================

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getCardValue(card: Card): number[] {
  if (card.rank === "A") return [1, 11];
  if (["J", "Q", "K"].includes(card.rank)) return [10];
  return [parseInt(card.rank)];
}

function calculateHand(cards: Card[]): number {
  const visibleCards = cards.filter((c) => !c.hidden);
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

function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && calculateHand(cards) === 21;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Blackjack() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>("betting");
  const [result, setResult] = useState<Result>(null);

  // Wagering state
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [currentBet, setCurrentBet] = useState(0);
  const [lastBet, setLastBet] = useState(0);

  // Stats
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);

  // Celebration effects
  const [showCelebration, setShowCelebration] = useState<"win" | "blackjack" | "lose" | null>(null);
  const [celebrationAmount, setCelebrationAmount] = useState(0);

  // Clear celebration after animation
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(null);
        setCelebrationAmount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const dealCard = useCallback(
    (currentDeck: Card[]): [Card, Card[]] => {
      const newDeck = [...currentDeck];
      const card = newDeck.pop()!;
      return [card, newDeck];
    },
    []
  );

  const repeatLastBet = () => {
    if (lastBet > 0 && lastBet <= balance) {
      setCurrentBet(lastBet);
    }
  };

  const startGame = useCallback(() => {
    if (currentBet === 0) return;

    const newDeck = createDeck();

    const [card1, deck1] = dealCard(newDeck);
    const [card2, deck2] = dealCard(deck1);
    const [card3, deck3] = dealCard(deck2);
    const [card4, deck4] = dealCard(deck3);

    const playerCards = [card1, card3];
    const dealerCards = [{ ...card2, hidden: true }, card4];

    setDeck(deck4);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState("playing");
    setResult(null);
    setBalance((prev) => prev - currentBet);
    setLastBet(currentBet);

    // Check for player blackjack
    if (isBlackjack(playerCards)) {
      revealAndFinish(dealerCards, deck4, playerCards, currentBet);
    }
  }, [dealCard, currentBet]);

  const revealAndFinish = (
    dealer: Card[],
    currentDeck: Card[],
    player: Card[],
    bet: number
  ) => {
    // Reveal dealer's hidden card
    const revealedDealer: Card[] = dealer.map((c) => ({ ...c, hidden: false }));
    setDealerHand(revealedDealer);

    // Dealer draws until 17
    let dealerCards: Card[] = [...revealedDealer];
    let gameDeck = [...currentDeck];

    while (calculateHand(dealerCards) < 17) {
      const [newCard, newDeck] = dealCard(gameDeck);
      dealerCards = [...dealerCards, newCard];
      gameDeck = newDeck;
    }

    setDealerHand(dealerCards);
    setDeck(gameDeck);

    // Determine winner
    const playerTotal = calculateHand(player);
    const dealerTotal = calculateHand(dealerCards);
    const playerBJ = isBlackjack(player);
    const dealerBJ = isBlackjack(dealerCards);

    let gameResult: Result;
    let payout = 0;

    if (playerBJ && !dealerBJ) {
      gameResult = "blackjack";
      payout = bet * 2.5; // 3:2 payout for blackjack
    } else if (playerTotal > 21) {
      gameResult = "lose";
      payout = 0;
    } else if (dealerTotal > 21) {
      gameResult = "win";
      payout = bet * 2;
    } else if (playerTotal > dealerTotal) {
      gameResult = "win";
      payout = bet * 2;
    } else if (playerTotal < dealerTotal) {
      gameResult = "lose";
      payout = 0;
    } else {
      gameResult = "push";
      payout = bet; // Return original bet
    }

    setResult(gameResult);
    setGameState("finished");
    setGamesPlayed((prev) => prev + 1);
    setBalance((prev) => prev + payout);
    if (gameResult === "win" || gameResult === "blackjack") {
      setWins((prev) => prev + 1);
      setShowCelebration(gameResult);
      // Calculate net winnings (payout minus original bet)
      const netWin = gameResult === "blackjack" ? Math.floor(bet * 1.5) : bet;
      setCelebrationAmount(netWin);
    }
    setCurrentBet(0);
  };

  const hit = () => {
    if (gameState !== "playing") return;

    const [newCard, newDeck] = dealCard(deck);
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(newDeck);

    if (calculateHand(newHand) > 21) {
      // Bust - reveal dealer and end
      const revealedDealer = dealerHand.map((c) => ({ ...c, hidden: false }));
      setDealerHand(revealedDealer);
      setResult("lose");
      setGameState("finished");
      setGamesPlayed((prev) => prev + 1);
      setCurrentBet(0);
    }
  };

  const stand = () => {
    if (gameState !== "playing") return;
    revealAndFinish(dealerHand, deck, playerHand, lastBet);
  };

  const newGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState("betting");
    setResult(null);
    setCurrentBet(0);
  };

  const playerTotal = calculateHand(playerHand);
  const dealerTotal = calculateHand(dealerHand);
  const isBust = playerTotal > 21;

  return (
    <div className="blackjack-container">
      {/* Celebration overlay */}
      <Celebration type={showCelebration} amount={celebrationAmount} />

      {/* Grid overlay */}
      <div className="grid-overlay" />

      <div className="blackjack-content">
        {/* Header */}
        <header className="bj-header">
          <div className="bj-title">
            <div className="bj-logo">∞</div>
            <div>
              <h1>BLACKJACK</h1>
              <p className="bj-subtitle">WIREFRAMES</p>
            </div>
          </div>
          <div className="bj-stats">
            <div className="stat-box stat-balance">
              <span className="stat-label">BALANCE</span>
              <span className="stat-value">${balance.toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Game Area */}
        <div className="game-area">
          {/* Hand Labels */}
          <div className="hand-labels">
            <div className="hand-header dealer-header">
              <span className="hand-label">DEALER</span>
              <span className="hand-total">
                {gameState === "playing" ? "?" : dealerTotal || "—"}
              </span>
            </div>
          </div>

          {/* 3D Card Table - Single Canvas for both hands */}
          <div className="cards-table">
            {/* Always keep Canvas mounted to prevent WebGL context loss */}
            <GameTableCanvas 
              dealerCards={dealerHand} 
              playerCards={playerHand} 
            />
            {dealerHand.length === 0 && playerHand.length === 0 && (
              <div className="empty-table-overlay">Place your bet to start</div>
            )}
          </div>

          {/* Player Label */}
          <div className="hand-labels">
            <div className="hand-header player-header">
              <span className="hand-label">PLAYER</span>
              <span className={`hand-total ${isBust ? "bust" : ""}`}>
                {playerTotal || "—"} {isBust && "BUST"}
              </span>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`result-display result-${result}`}>
              <span className="result-text">
                {result === "blackjack" && "BLACKJACK!"}
                {result === "win" && "YOU WIN"}
                {result === "lose" && "DEALER WINS"}
                {result === "push" && "PUSH"}
              </span>
              <span className="result-payout">
                {result === "blackjack" && `+$${Math.floor(lastBet * 1.5)}`}
                {result === "win" && `+$${lastBet}`}
                {result === "lose" && `-$${lastBet}`}
                {result === "push" && "BET RETURNED"}
              </span>
            </div>
          )}
        </div>

        {/* Betting Area */}
        {gameState === "betting" && (
          <div className="betting-area">
            <div className="bet-input-container">
              <span className="bet-label">ENTER BET</span>
              <div className="bet-input-wrapper">
                <span className="bet-currency">$</span>
                <input
                  type="number"
                  className="bet-input"
                  value={currentBet || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setCurrentBet(Math.min(Math.max(0, value), balance));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && currentBet > 0) {
                      startGame();
                    }
                  }}
                  placeholder="0"
                  min={0}
                  max={balance}
                  autoFocus
                />
              </div>
              <span className="bet-max">MAX: ${balance.toLocaleString()}</span>
            </div>

            {lastBet > 0 && lastBet <= balance && (
              <button
                className="btn btn-secondary btn-repeat"
                onClick={repeatLastBet}
              >
                REPEAT LAST (${lastBet})
              </button>
            )}

            <button
              className="btn btn-deal"
              onClick={startGame}
              disabled={currentBet === 0}
            >
              DEAL
            </button>
          </div>
        )}

        {/* Playing Controls */}
        {gameState === "playing" && (
          <div className="controls">
            <div className="current-bet-indicator">
              <span>BET: ${lastBet}</span>
            </div>
            <div className="action-buttons">
              <button className="btn btn-hit" onClick={hit}>
                HIT
              </button>
              <button className="btn btn-stand" onClick={stand}>
                STAND
              </button>
            </div>
          </div>
        )}

        {/* Game Over Controls */}
        {gameState === "finished" && (
          <div className="controls">
            {balance === 0 ? (
              <div className="broke-message">
                <p>You&apos;re out of chips!</p>
                <button
                  className="btn btn-new"
                  onClick={() => {
                    setBalance(STARTING_BALANCE);
                    newGame();
                  }}
                >
                  START OVER ($1,000)
                </button>
              </div>
            ) : (
              <button className="btn btn-new" onClick={newGame}>
                NEW HAND
              </button>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <footer className="bj-footer">
          <div className="footer-stats">
            <span>
              GAMES: {gamesPlayed} | WINS: {wins} |{" "}
              {gamesPlayed > 0
                ? `${Math.round((wins / gamesPlayed) * 100)}%`
                : "—"}
            </span>
          </div>
          <span className="footer-brand">WIREFRAMES</span>
        </footer>
      </div>

      <style jsx>{`
        .blackjack-container {
          min-height: 100vh;
          background: #faf7f2;
          color: #1a1a1a;
          font-family: "SF Mono", "Monaco", "Inconsolata", monospace;
          position: relative;
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: repeating-linear-gradient(
              0deg,
              #000 0px,
              #000 1px,
              transparent 1px,
              transparent 24px
            ),
            repeating-linear-gradient(
              90deg,
              #000 0px,
              #000 1px,
              transparent 1px,
              transparent 24px
            );
        }

        .blackjack-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          position: relative;
        }

        /* Header */
        .bj-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 24px;
          border-bottom: 2px solid #1a1a1a;
          margin-bottom: 24px;
        }

        .bj-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bj-logo {
          width: 48px;
          height: 48px;
          background: #1a1a1a;
          color: #ff6b00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
        }

        .bj-title h1 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.2em;
          margin: 0;
        }

        .bj-subtitle {
          font-size: 10px;
          color: #8a8580;
          letter-spacing: 0.1em;
          margin: 4px 0 0 0;
        }

        .bj-stats {
          display: flex;
          gap: 8px;
          align-items: center;
        }


        .stat-box {
          background: #1a1a1a;
          color: #faf7f2;
          padding: 8px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-balance {
          background: #ff6b00;
          color: #1a1a1a;
        }

        .stat-label {
          font-size: 8px;
          letter-spacing: 0.15em;
          opacity: 0.7;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          font-variant-numeric: tabular-nums;
        }

        /* Game Area */
        .game-area {
          min-height: 500px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hand-labels {
          display: flex;
          justify-content: center;
        }

        .hand-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 8px 16px;
          background: #faf7f2;
          border: 2px solid #1a1a1a;
        }

        .dealer-header {
          background: #f0ebe3;
        }

        .cards-table {
          flex: 1;
          min-height: 400px;
          border: 2px solid #1a1a1a;
          background: #faf7f2;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .empty-table-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b5b0a8;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          pointer-events: none;
        }

        .hand-section {
          border: 2px solid #1a1a1a;
          padding: 16px;
          background: #faf7f2;
        }

        .dealer-section {
          background: #f0ebe3;
        }

        .hand-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          font-weight: 600;
        }

        .hand-total {
          font-size: 24px;
          font-weight: bold;
          font-variant-numeric: tabular-nums;
        }

        .hand-total.bust {
          color: #c25550;
        }

        .cards-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          min-height: 112px;
          align-items: center;
        }

        .empty-hand {
          color: #b5b0a8;
          font-size: 32px;
        }

        /* Result */
        .result-display {
          text-align: center;
          padding: 16px;
          border: 2px solid #1a1a1a;
          animation: resultPop 0.3s ease-out;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        @keyframes resultPop {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .result-text {
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0.2em;
        }

        .result-payout {
          font-size: 12px;
          opacity: 0.8;
        }

        .result-blackjack {
          background: #ff6b00;
          color: #1a1a1a;
        }

        .result-win {
          background: #1a1a1a;
          color: #ff6b00;
        }

        .result-lose {
          background: #c25550;
          color: #faf7f2;
        }

        .result-push {
          background: #8a8580;
          color: #faf7f2;
        }

        /* Betting Area */
        .betting-area {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bet-input-container {
          text-align: center;
          padding: 20px;
          border: 2px solid #1a1a1a;
          background: #f0ebe3;
        }

        .bet-label {
          display: block;
          font-size: 10px;
          letter-spacing: 0.2em;
          margin-bottom: 12px;
          opacity: 0.7;
        }

        .bet-input-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .bet-currency {
          font-size: 32px;
          font-weight: bold;
          color: #1a1a1a;
        }

        .bet-input {
          font-family: inherit;
          font-size: 32px;
          font-weight: bold;
          width: 150px;
          padding: 8px 12px;
          border: 2px solid #1a1a1a;
          background: #ffffff;
          text-align: center;
          font-variant-numeric: tabular-nums;
          outline: none;
          transition: all 0.15s ease;
        }

        .bet-input:focus {
          border-color: #ff6b00;
          box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
        }

        .bet-input::placeholder {
          color: #b5b0a8;
        }

        /* Hide number input spinners */
        .bet-input::-webkit-outer-spin-button,
        .bet-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .bet-input[type=number] {
          -moz-appearance: textfield;
        }

        .bet-max {
          display: block;
          font-size: 10px;
          letter-spacing: 0.1em;
          margin-top: 8px;
          opacity: 0.5;
        }

        .btn-repeat {
          align-self: center;
        }

        .btn-secondary {
          background: transparent;
          color: #1a1a1a;
          font-size: 11px;
          padding: 10px 16px;
        }

        .btn-secondary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f0ebe3;
        }

        /* Controls */
        .controls {
          margin-top: 24px;
        }

        .current-bet-indicator {
          text-align: center;
          font-size: 12px;
          margin-bottom: 12px;
          opacity: 0.7;
        }

        .btn {
          font-family: inherit;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0.2em;
          padding: 20px 40px;
          border: 2px solid #1a1a1a;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-deal,
        .btn-new {
          width: 100%;
          background: #1a1a1a;
          color: #ff6b00;
        }

        .btn-deal:disabled {
          background: #8a8580;
          color: #faf7f2;
        }

        .btn-deal:hover:not(:disabled),
        .btn-new:hover {
          background: #2a2a2a;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }

        .btn-hit {
          background: #ff6b00;
          color: #1a1a1a;
        }

        .btn-hit:hover {
          background: #ff7b1a;
        }

        .btn-stand {
          background: #faf7f2;
          color: #1a1a1a;
        }

        .btn-stand:hover {
          background: #f0ebe3;
        }

        .broke-message {
          text-align: center;
        }

        .broke-message p {
          margin-bottom: 16px;
          font-size: 14px;
        }

        /* Footer */
        .bj-footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #d0cbc3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 9px;
          letter-spacing: 0.15em;
          color: #b5b0a8;
        }

        .footer-stats {
          font-variant-numeric: tabular-nums;
        }

        .footer-brand {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
