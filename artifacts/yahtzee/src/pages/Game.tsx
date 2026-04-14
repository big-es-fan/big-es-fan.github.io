import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Category,
  ScoreCard,
  rollDie,
  calculateScore,
  isGameOver,
  grandTotal,
  ALL_CATEGORIES,
} from "@/lib/yahtzee";
import Die from "@/components/Die";
import ScoreCardTable from "@/components/ScoreCard";
import GameOver from "@/components/GameOver";
import { Dices, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

const MAX_ROLLS = 3;
const NUM_DICE = 5;

interface GameProps {
  playerNames: [string, string];
  onNewGame: () => void;
}

export default function Game({ playerNames, onNewGame }: GameProps) {
  const [dice, setDice] = useState<number[]>([1, 1, 1, 1, 1]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [rollsLeft, setRollsLeft] = useState(MAX_ROLLS);
  const [rolling, setRolling] = useState<boolean[]>([false, false, false, false, false]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [scoreCards, setScoreCards] = useState<[ScoreCard, ScoreCard]>([{}, {}]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(true);
  const [yahtzeeFlash, setYahtzeeFlash] = useState(false);

  const hasRolled = rollsLeft < MAX_ROLLS;

  const handleRoll = useCallback(() => {
    if (rollsLeft === 0) return;

    const newRolling = held.map((h) => !h);
    setRolling(newRolling);

    setTimeout(() => {
      setDice((prev) => prev.map((d, i) => (held[i] ? d : rollDie())));
      setRolling([false, false, false, false, false]);
    }, 250);

    setRollsLeft((r) => r - 1);
  }, [rollsLeft, held]);

  const handleToggleHeld = useCallback(
    (index: number) => {
      if (!hasRolled || rollsLeft === 0) return;
      setHeld((prev) => prev.map((h, i) => (i === index ? !h : h)));
    },
    [hasRolled, rollsLeft],
  );

  const handleScore = useCallback(
    (category: Category) => {
      if (!hasRolled) return;

      const score = calculateScore(category, dice);
      const isYahtzee = category === "yahtzee" && score === 50;

      if (isYahtzee) {
        setYahtzeeFlash(true);
        setTimeout(() => setYahtzeeFlash(false), 600);
      }

      setScoreCards((prev) => {
        const updated = [{ ...prev[0] }, { ...prev[1] }] as [ScoreCard, ScoreCard];
        updated[currentPlayer] = { ...updated[currentPlayer], [category]: score };
        return updated;
      });

      const nextPlayer: 0 | 1 = currentPlayer === 0 ? 1 : 0;
      const nextRound = currentPlayer === 1 ? round + 1 : round;

      setDice([1, 1, 1, 1, 1]);
      setHeld([false, false, false, false, false]);
      setRollsLeft(MAX_ROLLS);
      setCurrentPlayer(nextPlayer);
      setRound(nextRound);

      const newCard = { ...scoreCards[currentPlayer], [category]: score };
      const otherCard = scoreCards[currentPlayer === 0 ? 1 : 0];
      const bothDone =
        ALL_CATEGORIES.every((c) => c in newCard) &&
        ALL_CATEGORIES.every((c) => c in otherCard);
      if (bothDone) setGameOver(true);
    },
    [hasRolled, dice, currentPlayer, round, scoreCards],
  );

  const rollButtonLabel =
    rollsLeft === MAX_ROLLS
      ? "Roll Dice"
      : rollsLeft === 0
        ? "No rolls left"
        : `Roll Again (${rollsLeft} left)`;

  const rollDisabled = rollsLeft === 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-primary" />
          <span className="font-bold text-base">Yahtzee</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Round {round} / 13</span>
          <button
            data-testid="button-new-game-header"
            onClick={onNewGame}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Game
          </button>
        </div>
      </header>

      {/* Current player banner */}
      <div
        className={cn(
          "px-4 py-2 text-center text-sm font-bold",
          "bg-primary text-primary-foreground",
          yahtzeeFlash && "yahtzee-celebrate",
        )}
      >
        {yahtzeeFlash
          ? "YAHTZEE!"
          : `${playerNames[currentPlayer]}'s turn`}
      </div>

      <main className="flex-1 flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">
        {/* Dice area */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
            {dice.map((value, i) => (
              <Die
                key={i}
                index={i}
                value={value}
                held={held[i]}
                rolling={rolling[i]}
                disabled={!hasRolled || rollsLeft === 0}
                onToggle={() => handleToggleHeld(i)}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            {hasRolled && rollsLeft > 0 && (
              <p className="text-xs text-muted-foreground">Tap dice to hold them</p>
            )}
            <button
              data-testid="button-roll"
              onClick={handleRoll}
              disabled={rollDisabled}
              className={cn(
                "w-full max-w-xs py-3 rounded-xl font-bold text-sm transition-all duration-150",
                "flex items-center justify-center gap-2",
                rollDisabled
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-md",
              )}
            >
              <Dices className="w-4 h-4" />
              {rollButtonLabel}
            </button>
          </div>
        </div>

        {/* Score hint */}
        {hasRolled && (
          <p className="text-xs text-center text-muted-foreground">
            Tap a category below to score
          </p>
        )}

        {/* Score card toggle for mobile */}
        <button
          data-testid="button-toggle-scorecard"
          onClick={() => setShowScoreCard((s) => !s)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-muted text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors sm:hidden"
        >
          <span>Score Card</span>
          {showScoreCard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Score card */}
        <div className={cn(!showScoreCard && "hidden sm:block")}>
          <ScoreCardTable
            scoreCards={scoreCards}
            playerNames={playerNames}
            currentPlayer={currentPlayer}
            dice={dice}
            hasRolled={hasRolled}
            onScore={handleScore}
          />
        </div>
      </main>

      {gameOver && (
        <GameOver
          scoreCards={scoreCards}
          playerNames={playerNames}
          onNewGame={onNewGame}
        />
      )}
    </div>
  );
}
