import { cn } from "@/lib/utils";
import { ScoreCard, grandTotal } from "@/lib/yahtzee";
import { Trophy, RotateCcw } from "lucide-react";

interface GameOverProps {
  scoreCards: [ScoreCard, ScoreCard];
  playerNames: [string, string];
  onNewGame: () => void;
}

export default function GameOver({ scoreCards, playerNames, onNewGame }: GameOverProps) {
  const scores = [grandTotal(scoreCards[0]), grandTotal(scoreCards[1])];
  const isDraw = scores[0] === scores[1];
  const winnerIndex = isDraw ? null : scores[0] > scores[1] ? 0 : 1;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold mb-1">Game Over!</h2>

        {isDraw ? (
          <p className="text-lg text-muted-foreground mb-6">It's a draw!</p>
        ) : (
          <p className="text-lg mb-1">
            <span className="font-bold text-primary">{playerNames[winnerIndex!]}</span> wins!
          </p>
        )}

        <div className="flex gap-4 justify-center mt-4 mb-6">
          {playerNames.map((name, i) => (
            <div
              key={i}
              data-testid={`final-score-player-${i}`}
              className={cn(
                "flex-1 rounded-xl p-4 border",
                winnerIndex === i
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground",
              )}
            >
              <div className="text-xs font-semibold mb-1">{name}</div>
              <div className="text-3xl font-extrabold">{scores[i]}</div>
            </div>
          ))}
        </div>

        <button
          data-testid="button-new-game"
          onClick={onNewGame}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </div>
    </div>
  );
}
