"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTokens } from "@/hooks/useTokens";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { Celebration } from "@/components/Celebration";
import { API_BASE, STARTING_BALANCE, DEFAULT_BET } from "@/lib/constants";
import { 
  createDeck, 
  dealCard, 
  calculateHand, 
  isBlackjack, 
  toDisplayCard,
  convertHiddenCards 
} from "@/lib/blackjack";
import type { Card, DisplayCard, BlackjackPhase, BlackjackResult, Suit, Rank } from "@/lib/types";
import styles from "./page.module.scss";

// Dynamic import for Three.js components (avoid SSR issues)
const GameTableCanvas = dynamic(
  () => import("@/components/Card3D").then((mod) => mod.GameTableCanvas),
  { ssr: false }
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Blackjack() {
  const tokens = useTokens(STARTING_BALANCE);
  
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gamePhase, setGamePhase] = useState<BlackjackPhase>("betting");
  const [result, setResult] = useState<BlackjackResult>(null);

  // Server game state token (for connected mode)
  const [serverGameState, setServerGameState] = useState<string | null>(null);

  // Wagering state
  const [currentBet, setCurrentBet] = useState(DEFAULT_BET);
  const [lastBet, setLastBet] = useState(0);

  // Stats
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);

  // Celebration effects
  const [showCelebration, setShowCelebration] = useState<"win" | "blackjack" | "lose" | null>(null);
  const [celebrationAmount, setCelebrationAmount] = useState(0);
  
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);

  // Adjust current bet if it exceeds balance
  useEffect(() => {
    if (currentBet > tokens.balance && tokens.balance > 0) {
      setCurrentBet(Math.min(DEFAULT_BET, tokens.balance));
    }
  }, [tokens.balance, currentBet]);

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

  const repeatLastBet = () => {
    if (lastBet > 0 && lastBet <= tokens.balance) {
      setCurrentBet(lastBet);
    }
  };

  const startGame = useCallback(async () => {
    if (currentBet === 0 || currentBet > tokens.balance || isLoading) return;

    setIsLoading(true);

    // Server-side game when connected
    if (tokens.isConnected && tokens.apiKey) {
      try {
        const response = await fetch(`${API_BASE}/api/games/blackjack`, {
          method: 'POST',
          headers: {
            'x-api-key': tokens.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'deal', bet: currentBet }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error('Deal error:', data.message);
          setIsLoading(false);
          return;
        }

        const { status, playerHand: pHand, dealerHand: dHand, balance, gameState: gsToken, result: gameResult } = data.data;

        // Convert hidden cards for display
        const displayDealerHand = convertHiddenCards(dHand);

        setPlayerHand(pHand);
        setDealerHand(displayDealerHand);
        tokens.setBalance(balance);
        setLastBet(currentBet);
        setServerGameState(gsToken || null);

        if (status === 'finished') {
          // Blackjack on deal
          setGamePhase('finished');
          setResult(gameResult as BlackjackResult);
          setGamesPlayed(prev => prev + 1);
          if (gameResult === 'blackjack') {
            setWins(prev => prev + 1);
            setShowCelebration('blackjack');
            setCelebrationAmount(Math.floor(currentBet * 1.5));
          }
          setCurrentBet(0);
        } else {
          setGamePhase('playing');
          setResult(null);
        }
      } catch (err) {
        console.error('Game error:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local mode
      tokens.addLocal(-currentBet);

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
      setGamePhase("playing");
      setResult(null);
      setLastBet(currentBet);
      setServerGameState(null);
      setIsLoading(false);

      // Check for player blackjack
      if (isBlackjack(playerCards)) {
        revealAndFinish(dealerCards, deck4, playerCards, currentBet);
      }
    }
  }, [currentBet, tokens, isLoading]);

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

    let gameResult: BlackjackResult;
    let payout = 0;

    if (playerBJ && !dealerBJ) {
      gameResult = "blackjack";
      payout = bet * 2.5;
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
      payout = bet;
    }

    setResult(gameResult);
    setGamePhase("finished");
    setGamesPlayed((prev) => prev + 1);
    
    if (payout > 0) {
      tokens.addLocal(payout);
    }
    
    if (gameResult === "win" || gameResult === "blackjack") {
      setWins((prev) => prev + 1);
      setShowCelebration(gameResult);
      const netWin = gameResult === "blackjack" ? Math.floor(bet * 1.5) : bet;
      setCelebrationAmount(netWin);
    }
    setCurrentBet(0);
  };

  const hit = useCallback(async () => {
    if (gamePhase !== "playing" || isLoading) return;

    // Server-side when connected
    if (tokens.isConnected && tokens.apiKey && serverGameState) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/games/blackjack`, {
          method: 'POST',
          headers: {
            'x-api-key': tokens.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'hit', gameState: serverGameState }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error('Hit error:', data.message);
          setIsLoading(false);
          return;
        }

        const { status, playerHand: pHand, dealerHand: dHand, balance, gameState: gsToken, result: gameResult } = data.data;

        setPlayerHand(pHand);
        tokens.setBalance(balance);

        if (status === 'finished') {
          setDealerHand(dHand);
          setGamePhase('finished');
          setResult(gameResult as BlackjackResult);
          setGamesPlayed(prev => prev + 1);
          setCurrentBet(0);
          setServerGameState(null);
        } else {
          const displayDealerHand = convertHiddenCards(dHand);
          setDealerHand(displayDealerHand);
          setServerGameState(gsToken);
        }
      } catch (err) {
        console.error('Hit error:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local mode
      const [newCard, newDeck] = dealCard(deck);
      const newHand = [...playerHand, newCard];
      setPlayerHand(newHand);
      setDeck(newDeck);

      if (calculateHand(newHand) > 21) {
        const revealedDealer = dealerHand.map((c) => ({ ...c, hidden: false }));
        setDealerHand(revealedDealer);
        setResult("lose");
        setGamePhase("finished");
        setGamesPlayed((prev) => prev + 1);
        setCurrentBet(0);
      }
    }
  }, [gamePhase, isLoading, tokens, serverGameState, deck, playerHand, dealerHand]);

  const stand = useCallback(async () => {
    if (gamePhase !== "playing" || isLoading) return;

    // Server-side when connected
    if (tokens.isConnected && tokens.apiKey && serverGameState) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/games/blackjack`, {
          method: 'POST',
          headers: {
            'x-api-key': tokens.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'stand', gameState: serverGameState }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error('Stand error:', data.message);
          setIsLoading(false);
          return;
        }

        const { playerHand: pHand, dealerHand: dHand, balance, result: gameResult } = data.data;

        setPlayerHand(pHand);
        setDealerHand(dHand);
        tokens.setBalance(balance);
        setGamePhase('finished');
        setResult(gameResult as BlackjackResult);
        setGamesPlayed(prev => prev + 1);
        setServerGameState(null);

        if (gameResult === 'win' || gameResult === 'dealer_bust') {
          setWins(prev => prev + 1);
          setShowCelebration('win');
          setCelebrationAmount(lastBet);
        } else if (gameResult === 'blackjack') {
          setWins(prev => prev + 1);
          setShowCelebration('blackjack');
          setCelebrationAmount(Math.floor(lastBet * 1.5));
        }
        setCurrentBet(0);
      } catch (err) {
        console.error('Stand error:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local mode
      revealAndFinish(dealerHand, deck, playerHand, lastBet);
    }
  }, [gamePhase, isLoading, tokens, serverGameState, dealerHand, deck, playerHand, lastBet]);

  const newGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGamePhase("betting");
    setResult(null);
    setCurrentBet(0);
    setServerGameState(null);
  };

  const playerTotal = calculateHand(playerHand);
  const dealerTotal = calculateHand(dealerHand);
  const isBust = playerTotal > 21;

  // Convert cards for display
  const displayDealerCards = dealerHand.map(toDisplayCard) as DisplayCard[];
  const displayPlayerCards = playerHand.filter(c => c.rank !== '?' && c.suit !== '?').map(toDisplayCard) as DisplayCard[];

  return (
    <div className={styles.container}>
      {/* Celebration overlay */}
      <Celebration type={showCelebration} amount={celebrationAmount} />

      {/* Grid overlay */}
      <div className={styles.gridOverlay} />

      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>∞</div>
            <div>
              <h1>BLACKJACK</h1>
              <p className={styles.subtitle}>WIREFRAMES</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <ApiKeyInput
              apiKey={tokens.apiKey}
              isConnected={tokens.isConnected}
              isLoading={tokens.isLoading}
              error={tokens.error}
              onSetApiKey={tokens.setApiKey}
              onClearApiKey={tokens.clearApiKey}
            />
            <div className={styles.balanceBox}>
              <span className={styles.balanceLabel}>BALANCE</span>
              <span className={styles.balanceValue}>${tokens.balance.toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Game Area */}
        <div className={styles.gameArea}>
          {/* Hand Labels */}
          <div className={styles.handLabels}>
            <div className={`${styles.handHeader} ${styles.dealerHeader}`}>
              <span className={styles.handLabel}>DEALER</span>
              <span className={styles.handTotal}>
                {gamePhase === "playing" ? "?" : dealerTotal || "—"}
              </span>
            </div>
          </div>

          {/* 3D Card Table */}
          <div className={styles.cardsTable}>
            <GameTableCanvas 
              dealerCards={displayDealerCards} 
              playerCards={displayPlayerCards} 
            />
            {dealerHand.length === 0 && playerHand.length === 0 && (
              <div className={styles.emptyTableOverlay}>Place your bet to start</div>
            )}
          </div>

          {/* Player Label */}
          <div className={styles.handLabels}>
            <div className={`${styles.handHeader} ${styles.playerHeader}`}>
              <span className={styles.handLabel}>PLAYER</span>
              <span className={`${styles.handTotal} ${isBust ? styles.bust : ""}`}>
                {playerTotal || "—"} {isBust && "BUST"}
              </span>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`${styles.resultDisplay} ${styles[`result${result === 'dealer_bust' ? 'Win' : result === 'bust' ? 'Lose' : result.charAt(0).toUpperCase() + result.slice(1)}`]}`}>
              <span className={styles.resultText}>
                {result === "blackjack" && "BLACKJACK!"}
                {(result === "win" || result === "dealer_bust") && "YOU WIN"}
                {(result === "lose" || result === "bust") && "DEALER WINS"}
                {result === "push" && "PUSH"}
              </span>
              <span className={styles.resultPayout}>
                {result === "blackjack" && `+$${Math.floor(lastBet * 1.5)}`}
                {(result === "win" || result === "dealer_bust") && `+$${lastBet}`}
                {(result === "lose" || result === "bust") && `-$${lastBet}`}
                {result === "push" && "BET RETURNED"}
              </span>
            </div>
          )}
        </div>

        {/* Betting Area */}
        {gamePhase === "betting" && (
          <div className={styles.bettingArea}>
            <div className={styles.betInputContainer}>
              <span className={styles.betLabel}>ENTER BET</span>
              <div className={styles.betInputWrapper}>
                <span className={styles.betCurrency}>$</span>
                <input
                  type="number"
                  className={styles.betInput}
                  value={currentBet || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setCurrentBet(Math.min(Math.max(0, value), tokens.balance));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && currentBet > 0) {
                      startGame();
                    }
                  }}
                  placeholder="0"
                  min={0}
                  max={tokens.balance}
                  autoFocus
                />
              </div>
              <span className={styles.betMax}>MAX: ${tokens.balance.toLocaleString()}</span>
            </div>

            {lastBet > 0 && lastBet <= tokens.balance && (
              <button className={styles.btnRepeat} onClick={repeatLastBet}>
                REPEAT LAST (${lastBet})
              </button>
            )}

            <button
              className={styles.btnDeal}
              onClick={startGame}
              disabled={currentBet === 0 || isLoading}
            >
              {isLoading ? 'DEALING...' : 'DEAL'}
            </button>
          </div>
        )}

        {/* Playing Controls */}
        {gamePhase === "playing" && (
          <div className={styles.controls}>
            <div className={styles.currentBetIndicator}>
              <span>BET: ${lastBet}</span>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.btnHit} onClick={hit} disabled={isLoading}>
                {isLoading ? '...' : 'HIT'}
              </button>
              <button className={styles.btnStand} onClick={stand} disabled={isLoading}>
                {isLoading ? '...' : 'STAND'}
              </button>
            </div>
          </div>
        )}

        {/* Game Over Controls */}
        {gamePhase === "finished" && (
          <div className={styles.controls}>
            {tokens.balance === 0 ? (
              <div className={styles.brokeMessage}>
                <p>You&apos;re out of chips!</p>
                <button
                  className={styles.btnNew}
                  onClick={() => {
                    if (tokens.isConnected) {
                      tokens.refetch();
                    } else {
                      tokens.addLocal(STARTING_BALANCE);
                    }
                    newGame();
                  }}
                >
                  START OVER (${STARTING_BALANCE.toLocaleString()})
                </button>
              </div>
            ) : (
              <button className={styles.btnNew} onClick={newGame}>
                NEW HAND
              </button>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <footer className={styles.footer}>
          <div className={styles.footerStats}>
            <span>
              GAMES: {gamesPlayed} | WINS: {wins} |{" "}
              {gamesPlayed > 0
                ? `${Math.round((wins / gamesPlayed) * 100)}%`
                : "—"}
            </span>
          </div>
          <span className={styles.footerBrand}>WIREFRAMES</span>
        </footer>
      </div>
    </div>
  );
}
