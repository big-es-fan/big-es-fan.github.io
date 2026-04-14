import { cn } from "@/lib/utils";
import {
  Category,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  ScoreCard,
  calculateScore,
  isCategoryAvailable,
} from "@/lib/yahtzee";

interface ScoreRowProps {
  category: Category;
  scoreCards: [ScoreCard, ScoreCard];
  currentPlayer: 0 | 1;
  dice: number[];
  hasRolled: boolean;
  onScore: (category: Category) => void;
  isYahtzeeBonus?: boolean;
}

export default function ScoreRow({
  category,
  scoreCards,
  currentPlayer,
  dice,
  hasRolled,
  onScore,
  isYahtzeeBonus = false,
}: ScoreRowProps) {
  const currentCard = scoreCards[currentPlayer];
  const available = isCategoryAvailable(currentCard, category);
  const potential = available && hasRolled ? calculateScore(category, dice) : null;
  const canClick = available && hasRolled;

  return (
    <tr
      data-testid={`score-row-${category}`}
      className={cn(
        "border-b border-border/50 transition-colors",
        canClick && "cursor-pointer hover:bg-primary/5",
        isYahtzeeBonus && "bg-yellow-50 dark:bg-yellow-900/10",
      )}
      onClick={() => canClick && onScore(category)}
    >
      <td className="px-2 py-1.5">
        <div className="flex flex-col">
          <span className={cn("text-xs font-semibold", isYahtzeeBonus && "text-yellow-600 dark:text-yellow-400")}>
            {CATEGORY_LABELS[category]}
          </span>
          <span className="text-[10px] text-muted-foreground hidden sm:block">
            {CATEGORY_DESCRIPTIONS[category]}
          </span>
        </div>
      </td>

      {/* Player 1 column — always uses scoreCards[0] */}
      <td className="px-2 py-1.5 text-center w-16">
        {currentPlayer === 0 ? (
          <ScoreCell
            score={scoreCards[0][category]}
            potential={potential}
            canClick={canClick}
          />
        ) : (
          <FilledScore score={scoreCards[0][category]} />
        )}
      </td>

      {/* Player 2 column — always uses scoreCards[1] */}
      <td className="px-2 py-1.5 text-center w-16">
        {currentPlayer === 1 ? (
          <ScoreCell
            score={scoreCards[1][category]}
            potential={potential}
            canClick={canClick}
          />
        ) : (
          <FilledScore score={scoreCards[1][category]} />
        )}
      </td>
    </tr>
  );
}

function ScoreCell({
  score,
  potential,
  canClick,
}: {
  score: number | undefined;
  potential: number | null;
  canClick: boolean;
}) {
  if (score !== undefined) {
    return <span className="font-bold text-sm text-foreground">{score}</span>;
  }
  if (potential !== null) {
    return (
      <span
        className={cn(
          "text-sm font-semibold rounded px-1",
          potential > 0
            ? "text-primary bg-primary/10"
            : "text-muted-foreground bg-muted/50",
          canClick && "ring-1 ring-primary/30",
        )}
      >
        {potential}
      </span>
    );
  }
  return <span className="text-muted-foreground text-xs">—</span>;
}

function FilledScore({ score }: { score: number | undefined }) {
  if (score !== undefined) {
    return <span className="text-sm text-muted-foreground">{score}</span>;
  }
  return <span className="text-muted-foreground text-xs">—</span>;
}
