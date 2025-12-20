"use client";

import { useState, useEffect, useCallback } from "react";
import { useTokens } from "@/hooks/useTokens";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { API_BASE, STARTING_BALANCE } from "@/lib/constants";
import styles from "./page.module.scss";

// =============================================================================
// TYPES
// =============================================================================

interface Market {
  id: string;
  question: string;
  creator_id: string;
  creator_username: string;
  yes_pool: number;
  no_pool: number;
  yes_price: number;
  resolved: boolean;
  outcome: boolean | null;
}

interface Bet {
  id: string;
  user_id: string;
  market_id: string;
  is_yes: boolean;
  amount: number;
  shares: number;
  price: number;
}

// =============================================================================
// COMPONENTS
// =============================================================================

function MarketCard({
  market,
  onBet,
  onResolve,
  isCreator,
}: {
  market: Market;
  onBet: (market: Market, side: "yes" | "no") => void;
  onResolve: (market: Market) => void;
  isCreator: boolean;
}) {
  const noPrice = 100 - market.yes_price;

  if (market.resolved) {
    return (
      <div className={`${styles.marketCard} ${styles.resolved}`}>
        <div className={styles.marketHeader}>
          <span className={`${styles.resolutionBadge} ${market.outcome ? styles.yes : styles.no}`}>
            Resolved: {market.outcome ? "YES" : "NO"}
          </span>
        </div>
        <h3 className={styles.marketQuestion}>{market.question}</h3>
        <div className={styles.marketCreator}>
          Created by {market.creator_username}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.marketCard}>
      <div className={styles.marketHeader}>
        <h3 className={styles.marketQuestion}>{market.question}</h3>
        {isCreator && (
          <button
            onClick={() => onResolve(market)}
            className={styles.resolveButton}
            title="Resolve this market (you are the creator)"
          >
            ⚖️
          </button>
        )}
      </div>

      <div className={styles.marketCreator}>
        Created by {market.creator_username}
      </div>

      <div className={styles.probabilityBar}>
        <div
          className={styles.yesFill}
          style={{ width: `${market.yes_price}%` }}
        />
      </div>

      <div className={styles.poolInfo}>
        <span>YES Pool: ${(market.yes_pool / 100).toFixed(2)}</span>
        <span>NO Pool: ${(market.no_pool / 100).toFixed(2)}</span>
      </div>

      <div className={styles.betButtons}>
        <button
          onClick={() => onBet(market, "yes")}
          className={styles.yesButton}
        >
          Yes {market.yes_price}¢
        </button>
        <button onClick={() => onBet(market, "no")} className={styles.noButton}>
          No {noPrice}¢
        </button>
      </div>
    </div>
  );
}

function BetModal({
  market,
  side,
  balance,
  onClose,
  onConfirm,
}: {
  market: Market;
  side: "yes" | "no";
  balance: number;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const price = side === "yes" ? market.yes_price : 100 - market.yes_price;
  const amountCents = Math.round(parseFloat(amount || "0") * 100);
  const shares = amountCents ? (amountCents / price) * 100 : 0;
  const payout = shares / 100;
  const profit = payout - parseFloat(amount || "0");
  const balanceDollars = balance / 100;
  const canAfford = amountCents <= balance;

  const handleBet = async () => {
    if (!amount || amountCents <= 0 || !canAfford) return;
    setLoading(true);
    try {
      await onConfirm(amountCents);
      onClose();
    } catch (e) {
      console.error("Bet failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackdrop} onClick={onClose} />

      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{market.question}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.modalOutcome}>
          <div className={styles.outcomeLabel}>Outcome</div>
          <div className={styles.outcomeButtons}>
            <div
              className={`${styles.outcomeOption} ${side === "yes" ? styles.activeYes : ""}`}
            >
              Yes {market.yes_price}¢
            </div>
            <div
              className={`${styles.outcomeOption} ${side === "no" ? styles.activeNo : ""}`}
            >
              No {100 - market.yes_price}¢
            </div>
          </div>
        </div>

        <div className={styles.modalAmount}>
          <div className={styles.amountHeader}>
            <span>Amount (USD)</span>
            <span>Balance: ${balanceDollars.toFixed(2)}</span>
          </div>
          <div className={styles.amountInput}>
            <span className={styles.dollarSign}>$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className={styles.quickAmounts}>
            {[1, 5, 10, 25].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v.toString())}
                disabled={v * 100 > balance}
              >
                ${v}
              </button>
            ))}
          </div>
          {!canAfford && amount && (
            <p className={styles.insufficientBalance}>Insufficient balance</p>
          )}
        </div>

        <div className={styles.modalStats}>
          <div className={styles.statRow}>
            <span>Avg price</span>
            <span>{price}¢</span>
          </div>
          <div className={styles.statRow}>
            <span>Shares</span>
            <span>{(shares / 100).toFixed(2)}</span>
          </div>
          <div className={styles.statRow}>
            <span>Potential return</span>
            <span className={styles.profit}>
              ${payout.toFixed(2)} (+${profit.toFixed(2)})
            </span>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            onClick={handleBet}
            disabled={!amount || amountCents <= 0 || loading || !canAfford}
            className={`${styles.confirmButton} ${side === "yes" ? styles.confirmYes : styles.confirmNo}`}
          >
            {loading
              ? "Submitting..."
              : amount && canAfford
                ? `Buy ${side === "yes" ? "Yes" : "No"}`
                : "Enter amount"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (question: string) => Promise<void>;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      await onCreate(question.trim());
      onClose();
    } catch (e) {
      console.error("Create failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackdrop} onClick={onClose} />

      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create a Market</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <label className={styles.inputLabel}>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will X happen?"
            className={styles.textInput}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <p className={styles.inputHint}>
            You will be able to resolve this market later.
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button
            onClick={handleCreate}
            disabled={!question.trim() || loading}
            className={`${styles.confirmButton} ${styles.confirmYes}`}
          >
            {loading ? "Creating..." : "Create market"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResolveModal({
  market,
  onClose,
  onResolve,
}: {
  market: Market;
  onClose: () => void;
  onResolve: (outcome: boolean) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async (outcome: boolean) => {
    setLoading(true);
    try {
      await onResolve(outcome);
      onClose();
    } catch (e) {
      console.error("Resolve failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackdrop} onClick={onClose} />

      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Resolve Market</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.resolveQuestion}>{market.question}</p>
          <p className={styles.inputHint}>
            What was the outcome? Winners will receive their shares of the pool.
          </p>
        </div>

        <div className={styles.resolveButtons}>
          <button
            onClick={() => handleResolve(true)}
            disabled={loading}
            className={styles.resolveYes}
          >
            {loading ? "..." : "YES Won"}
          </button>
          <button
            onClick={() => handleResolve(false)}
            disabled={loading}
            className={styles.resolveNo}
          >
            {loading ? "..." : "NO Won"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConnectionStatus({ connected }: { connected: boolean }) {
  if (connected) return null;

  return (
    <div className={styles.connectionWarning}>
      <div className={styles.warningTitle}>⚠ Not connected</div>
      <div className={styles.warningText}>
        Enter your API key to start betting with real XORS tokens
      </div>
    </div>
  );
}

// =============================================================================
// MAIN
// =============================================================================

export default function PolymarketGame() {
  const tokens = useTokens(STARTING_BALANCE);

  const [markets, setMarkets] = useState<Market[]>([]);
  const [search, setSearch] = useState("");
  const [bet, setBet] = useState<{ market: Market; side: "yes" | "no" } | null>(
    null
  );
  const [showCreate, setShowCreate] = useState(false);
  const [resolveMarket, setResolveMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch markets
  const fetchMarkets = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/games/polymarket`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success && data.data?.markets) {
        setMarkets(data.data.markets);
      }
    } catch (err) {
      console.error("Failed to fetch markets:", err);
    }
  }, []);

  // Get user ID from API key verification
  const fetchUserId = useCallback(async () => {
    if (!tokens.apiKey) return;

    try {
      const response = await fetch(`${API_BASE}/api/users/viewer`, {
        headers: {
          "x-api-key": tokens.apiKey,
        },
      });

      const data = await response.json();
      if (data.data?.id) {
        setUserId(data.data.id);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }, [tokens.apiKey]);

  // Initial fetch
  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  // Fetch user ID when connected
  useEffect(() => {
    if (tokens.isConnected && tokens.apiKey) {
      fetchUserId();
    }
  }, [tokens.isConnected, tokens.apiKey, fetchUserId]);

  // Polling for updates
  useEffect(() => {
    const interval = setInterval(fetchMarkets, 5000);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  // Create market
  const handleCreateMarket = async (question: string) => {
    if (!tokens.apiKey) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/games/polymarket`, {
        method: "POST",
        headers: {
          "x-api-key": tokens.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "create_market", question }),
      });

      const data = await response.json();
      if (data.success && data.data?.market) {
        setMarkets((prev) => [data.data.market, ...prev]);
      }
    } catch (err) {
      console.error("Failed to create market:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Place bet
  const handlePlaceBet = async (
    market: Market,
    isYes: boolean,
    amount: number
  ) => {
    if (!tokens.apiKey) return;

    const response = await fetch(`${API_BASE}/api/games/polymarket`, {
      method: "POST",
      headers: {
        "x-api-key": tokens.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "place_bet",
        market_id: market.id,
        is_yes: isYes,
        amount,
      }),
    });

    const data = await response.json();
    if (data.success) {
      tokens.setBalance(data.data.balance);
      // Update market with new price
      setMarkets((prev) =>
        prev.map((m) =>
          m.id === market.id
            ? { ...m, yes_price: data.data.new_yes_price }
            : m
        )
      );
    }
  };

  // Resolve market
  const handleResolveMarket = async (market: Market, outcome: boolean) => {
    if (!tokens.apiKey) return;

    const response = await fetch(`${API_BASE}/api/games/polymarket`, {
      method: "POST",
      headers: {
        "x-api-key": tokens.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "resolve_market",
        market_id: market.id,
        outcome,
      }),
    });

    const data = await response.json();
    if (data.success) {
      tokens.setBalance(data.data.balance);
      setMarkets((prev) =>
        prev.map((m) =>
          m.id === market.id ? { ...m, resolved: true, outcome } : m
        )
      );
    }
  };

  const filtered = markets.filter((m) =>
    m.question.toLowerCase().includes(search.toLowerCase())
  );

  const activeMarkets = filtered.filter((m) => !m.resolved);
  const resolvedMarkets = filtered.filter((m) => m.resolved);

  return (
    <div className={styles.container}>
      {/* Grid overlay */}
      <div className={styles.gridOverlay} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>∞</div>
          <div>
            <h1 className={styles.title}>POLYMARKET</h1>
            <p className={styles.subtitle}>PREDICTION MARKETS</p>
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
          {tokens.isConnected && (
            <div className={styles.balance}>
              <span className={styles.balanceLabel}>BALANCE</span>
              <span className={styles.balanceValue}>
                ${(tokens.balance / 100).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <ConnectionStatus connected={tokens.isConnected} />

        {/* Search and Create */}
        <div className={styles.toolbar}>
          <div className={styles.searchContainer}>
            <svg
              className={styles.searchIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search markets..."
              className={styles.searchInput}
            />
          </div>
          {tokens.isConnected && (
            <button
              onClick={() => setShowCreate(true)}
              className={styles.createButton}
            >
              + Create Market
            </button>
          )}
        </div>

        {/* Active Markets */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Active Markets</h2>
          <div className={styles.marketGrid}>
            {activeMarkets.map((market) => (
              <MarketCard
                key={market.id}
                market={market}
                onBet={(m, side) => {
                  if (!tokens.isConnected) return;
                  setBet({ market: m, side });
                }}
                onResolve={(m) => setResolveMarket(m)}
                isCreator={userId === market.creator_id}
              />
            ))}
          </div>
          {activeMarkets.length === 0 && (
            <div className={styles.emptyState}>
              No active markets.{" "}
              {tokens.isConnected ? "Create one!" : "Connect to create one!"}
            </div>
          )}
        </section>

        {/* Resolved Markets */}
        {resolvedMarkets.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Resolved Markets</h2>
            <div className={styles.marketGrid}>
              {resolvedMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  onBet={() => {}}
                  onResolve={() => {}}
                  isCreator={false}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      {bet && (
        <BetModal
          market={bet.market}
          side={bet.side}
          balance={tokens.balance}
          onClose={() => setBet(null)}
          onConfirm={(amount) =>
            handlePlaceBet(bet.market, bet.side === "yes", amount)
          }
        />
      )}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateMarket}
        />
      )}

      {resolveMarket && (
        <ResolveModal
          market={resolveMarket}
          onClose={() => setResolveMarket(null)}
          onResolve={(outcome) => handleResolveMarket(resolveMarket, outcome)}
        />
      )}
    </div>
  );
}

