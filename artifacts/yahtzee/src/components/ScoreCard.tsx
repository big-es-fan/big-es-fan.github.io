import { cn } from "@/lib/utils";
import {
  Category,
  ScoreCard as ScoreCardType,
  UPPER_CATEGORIES,
  LOWER_CATEGORIES,
  upperSubtotal,
  upperBonus,
  lowerTotal,
  grandTotal,
} from "@/lib/yahtzee";
import ScoreRow from "@/components/ScoreRow";

interface ScoreCardProps {
  scoreCards: [ScoreCardType, ScoreCardType];
  playerNames: [string, string];
  currentPlayer: 0 | 1;
  dice: number[];
  hasRolled: boolean;
  onScore: (category: Category) => void;
}

export default function ScoreCardTable({
  scoreCards,
  playerNames,
  currentPlayer,
  dice,
  hasRolled,
  onScore,
}: ScoreCardProps) {
  const [card0, card1] = scoreCards;

  const sub0 = upperSubtotal(card0);
  const sub1 = upperSubtotal(card1);
  const bonus0 = upperBonus(card0);
  const bonus1 = upperBonus(card1);
  const lower0 = lowerTotal(card0);
  const lower1 = lowerTotal(card1);
  const total0 = grandTotal(card0);
  const total1 = grandTotal(card1);

  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-sm bg-card">
      <table className="w-full text-sm min-w-[280px]">
        <thead>
          <tr className="bg-muted/60 border-b border-border">
            <th className="px-2 py-2 text-left text-xs font-semibold text-muted-foreground w-auto">
              Category
            </th>
            <th
              className={cn(
                "px-2 py-2 text-center text-xs font-bold w-16",
                currentPlayer === 0 ? "text-primary" : "text-muted-foreground",
              )}
            >
              {playerNames[0]}
            </th>
            <th
              className={cn(
                "px-2 py-2 text-center text-xs font-bold w-16",
                currentPlayer === 1 ? "text-primary" : "text-muted-foreground",
              )}
            >
              {playerNames[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Upper section */}
          <tr className="bg-muted/30">
            <td colSpan={3} className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Upper Section
            </td>
          </tr>
          {UPPER_CATEGORIES.map((cat) => (
            <ScoreRow
              key={cat}
              category={cat}
              scoreCards={scoreCards}
              currentPlayer={currentPlayer}
              dice={dice}
              hasRolled={hasRolled}
              onScore={onScore}
            />
          ))}

          {/* Upper subtotal & bonus */}
          <tr className="bg-muted/20 border-t-2 border-border">
            <td className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Subtotal</td>
            <td className={cn("px-2 py-1.5 text-center text-xs font-bold", sub0 >= 63 ? "text-green-600 dark:text-green-400" : "text-foreground")}>
              {sub0} / 63
            </td>
            <td className={cn("px-2 py-1.5 text-center text-xs font-bold", sub1 >= 63 ? "text-green-600 dark:text-green-400" : "text-foreground")}>
              {sub1} / 63
            </td>
          </tr>
          <tr className="bg-muted/20 border-b-2 border-border">
            <td className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Bonus (+35)</td>
            <td className={cn("px-2 py-1.5 text-center text-xs font-bold", bonus0 > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
              {bonus0 > 0 ? "+35" : sub0 >= 63 ? "+35" : `need ${63 - sub0} more`}
            </td>
            <td className={cn("px-2 py-1.5 text-center text-xs font-bold", bonus1 > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
              {bonus1 > 0 ? "+35" : sub1 >= 63 ? "+35" : `need ${63 - sub1} more`}
            </td>
          </tr>

          {/* Lower section */}
          <tr className="bg-muted/30">
            <td colSpan={3} className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Lower Section
            </td>
          </tr>
          {LOWER_CATEGORIES.map((cat) => (
            <ScoreRow
              key={cat}
              category={cat}
              scoreCards={scoreCards}
              currentPlayer={currentPlayer}
              dice={dice}
              hasRolled={hasRolled}
              onScore={onScore}
            />
          ))}

          {/* Totals */}
          <tr className="bg-muted/20 border-t-2 border-border">
            <td className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Lower Total</td>
            <td className="px-2 py-1.5 text-center text-xs font-bold">{lower0}</td>
            <td className="px-2 py-1.5 text-center text-xs font-bold">{lower1}</td>
          </tr>
          <tr className="bg-primary/8 border-t-2 border-primary/30">
            <td className="px-2 py-2 text-sm font-bold text-foreground">GRAND TOTAL</td>
            <td className={cn("px-2 py-2 text-center text-sm font-extrabold", currentPlayer === 0 ? "text-primary" : "text-foreground")}>
              {total0}
            </td>
            <td className={cn("px-2 py-2 text-center text-sm font-extrabold", currentPlayer === 1 ? "text-primary" : "text-foreground")}>
              {total1}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
