"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.scss";
import { useTokens } from "@/hooks/useTokens";

// =============================================================================
// CONSTANTS
// =============================================================================

const API_BASE = 'https://api.xors.xyz';

// =============================================================================
// TYPES
// =============================================================================

interface HistoryItem {
  resultHeads: boolean;
  won: boolean;
  betAmount: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const DEFAULT_BET = 500;

export default function CoinflipGame() {
  const tokens = useTokens(1000);
  
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  
  const [guessHeads, setGuessHeads] = useState(true);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<{
    message: string;
    won: boolean;
  } | null>(null);
  const [coinSide, setCoinSide] = useState<"heads" | "tails">("heads");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Adjust bet amount if it exceeds balance
  useEffect(() => {
    if (betAmount > tokens.balance) {
      setBetAmount(Math.min(DEFAULT_BET, tokens.balance));
    }
  }, [tokens.balance, betAmount]);

  const flip = useCallback(async () => {
    if (isFlipping || betAmount <= 0 || betAmount > tokens.balance) return;

    setIsFlipping(true);
    const guess = guessHeads ? 'heads' : 'tails';

    // Server-side game when connected, local otherwise
    if (tokens.isConnected && tokens.apiKey) {
      try {
        const response = await fetch(`${API_BASE}/api/games/coinflip`, {
          method: 'POST',
          headers: {
            'x-api-key': tokens.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bet: betAmount, guess }),
        });

        const data = await response.json();

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!response.ok || !data.success) {
          setLastResult({ message: data.message || 'ERROR', won: false });
          setIsFlipping(false);
          setTimeout(() => setLastResult(null), 2000);
          return;
        }

        const { result, won, balance: newBalance } = data.data;
        const resultHeads = result === 'heads';

        setCoinSide(resultHeads ? "heads" : "tails");
        tokens.setBalance(newBalance);

        if (won) {
          setGamesWon(prev => prev + 1);
          setTotalWinnings(prev => prev + betAmount);
        } else {
          setTotalWinnings(prev => prev - betAmount);
        }

        setGamesPlayed(prev => prev + 1);
        setLastResult({
          message: won ? `WIN +${betAmount}` : `LOSS -${betAmount}`,
          won,
        });
        setHistory(prev => [
          { resultHeads, won, betAmount },
          ...prev.slice(0, 9),
        ]);
        setIsFlipping(false);
        setTimeout(() => setLastResult(null), 2000);
      } catch (err) {
        console.error('Game error:', err);
        setLastResult({ message: 'CONNECTION ERROR', won: false });
        setIsFlipping(false);
        setTimeout(() => setLastResult(null), 2000);
      }
    } else {
      // Local mode - client-side logic
      tokens.addLocal(-betAmount);

      // Simulate coin flip after animation
      setTimeout(() => {
        const resultHeads = Math.random() < 0.5;
        const won = resultHeads === guessHeads;

        setCoinSide(resultHeads ? "heads" : "tails");

        if (won) {
          tokens.addLocal(betAmount * 2);
          setGamesWon(prev => prev + 1);
          setTotalWinnings(prev => prev + betAmount);
        } else {
          setTotalWinnings(prev => prev - betAmount);
        }

        setGamesPlayed(prev => prev + 1);
        setLastResult({
          message: won ? `WIN +${betAmount}` : `LOSS -${betAmount}`,
          won,
        });
        setHistory(prev => [
          { resultHeads, won, betAmount },
          ...prev.slice(0, 9),
        ]);
        setIsFlipping(false);
        setTimeout(() => setLastResult(null), 2000);
      }, 1000);
    }
  }, [isFlipping, betAmount, tokens, guessHeads]);

  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  const betPresets = [100, 250, 500, 1000];

  const handleReset = () => {
    if (tokens.isConnected) {
      tokens.refetch();
    } else {
      tokens.addLocal(1000 - tokens.balance);
    }
    setGamesPlayed(0);
    setGamesWon(0);
    setTotalWinnings(0);
    setHistory([]);
    setBetAmount(DEFAULT_BET);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridOverlay} />
      
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Coinflip</h1>
            <div className={styles.subtitle}>WIREFRAMES</div>
          </div>
          <div className={styles.status}>● READY</div>
        </header>

        {/* Balance Display */}
        <div className={styles.balanceBox}>
          <div className={styles.balanceLabel}>BALANCE</div>
          <div className={styles.balanceValue}>
            {tokens.balance.toString().padStart(6, '0')}
          </div>
          <div className={styles.balanceUnit}>TOKENS</div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>GAMES</div>
            <div className={styles.statValue}>{gamesPlayed}</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>WIN%</div>
            <div className={styles.statValue}>{winRate}</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>NET</div>
            <div className={`${styles.statValue} ${totalWinnings < 0 ? styles.negative : ''}`}>
              {totalWinnings >= 0 ? '+' : ''}{totalWinnings}
            </div>
          </div>
        </div>

        {/* Coin Display */}
        <div className={styles.coinBox}>
          <div 
            className={`${styles.coinContainer} ${isFlipping ? styles.flipping : ''}`}
            style={{ 
              transform: isFlipping ? undefined : (coinSide === 'tails' ? 'rotateY(180deg)' : 'rotateY(0deg)')
            }}
          >
            <div className={styles.coinFace}>H</div>
            <div className={`${styles.coinFace} ${styles.back}`}>T</div>
          </div>
          <div className={styles.coinLabel}>
            {isFlipping ? 'FLIPPING...' : coinSide.toUpperCase()}
          </div>
        </div>

        {/* Guess Selection */}
        <div className={styles.guessGrid}>
          <button
            onClick={() => setGuessHeads(true)}
            className={`${styles.guessButton} ${guessHeads ? styles.active : ''}`}
          >
            <div className={styles.guessLabel}>SELECT</div>
            <div className={styles.guessValue}>HEADS</div>
          </button>
          <button
            onClick={() => setGuessHeads(false)}
            className={`${styles.guessButton} ${!guessHeads ? styles.active : ''}`}
          >
            <div className={styles.guessLabel}>SELECT</div>
            <div className={styles.guessValue}>TAILS</div>
          </button>
        </div>

        {/* Bet Amount */}
        <div className={styles.betBox}>
          <div className={styles.betLabel}>BET AMOUNT</div>
          <div className={styles.betPresets}>
            {betPresets.map((amt) => (
              <button
                key={amt}
                onClick={() => setBetAmount(Math.min(amt, tokens.balance))}
                className={`${styles.betPreset} ${betAmount === amt ? styles.active : ''}`}
              >
                {amt}
              </button>
            ))}
            <button
              onClick={() => setBetAmount(tokens.balance)}
              className={styles.betPreset}
            >
              MAX
            </button>
          </div>
          <div className={styles.betInputWrapper}>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.min(Number(e.target.value), tokens.balance))}
              className={styles.betInput}
              min={1}
              max={tokens.balance}
            />
          </div>
        </div>

        {/* Flip Button */}
        <button
          onClick={flip}
          disabled={isFlipping || betAmount <= 0 || betAmount > tokens.balance || tokens.isLoading}
          className={styles.flipButton}
        >
          {isFlipping ? 'FLIPPING...' : 'FLIP'}
        </button>

        {/* Result Message */}
        {lastResult && (
          <div className={`${styles.result} ${!lastResult.won ? styles.loss : ''}`}>
            {lastResult.message}
          </div>
        )}

        {/* History */}
        <div className={styles.historyBox}>
          <div className={styles.historyHeader}>
            <div className={styles.historyLabel}>HISTORY</div>
          </div>
          {history.length === 0 ? (
            <div className={styles.historyEmpty}>NO DATA</div>
          ) : (
            <div className={styles.historyList}>
              {history.map((h, i) => (
                <div key={i}>
                  <span className={styles.historyResult}>
                    {h.resultHeads ? 'H' : 'T'}
                  </span>
                  <span className={`${styles.historyAmount} ${!h.won ? styles.loss : ''}`}>
                    {h.won ? '+' : '-'}{h.betAmount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Button */}
        {tokens.balance === 0 && (
          <button onClick={handleReset} className={styles.resetButton}>
            START OVER (1,000)
          </button>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerText}>WIREFRAMES</div>
          <div className={styles.footerVersion}>V0.1.0</div>
        </footer>
      </div>
    </div>
  );
}
