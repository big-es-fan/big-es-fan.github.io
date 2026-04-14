export type Category =
  | "ones"
  | "twos"
  | "threes"
  | "fours"
  | "fives"
  | "sixes"
  | "threeOfAKind"
  | "fourOfAKind"
  | "fullHouse"
  | "smallStraight"
  | "largeStraight"
  | "yahtzee"
  | "chance";

export const UPPER_CATEGORIES: Category[] = [
  "ones",
  "twos",
  "threes",
  "fours",
  "fives",
  "sixes",
];

export const LOWER_CATEGORIES: Category[] = [
  "threeOfAKind",
  "fourOfAKind",
  "fullHouse",
  "smallStraight",
  "largeStraight",
  "yahtzee",
  "chance",
];

export const ALL_CATEGORIES: Category[] = [
  ...UPPER_CATEGORIES,
  ...LOWER_CATEGORIES,
];

export const CATEGORY_LABELS: Record<Category, string> = {
  ones: "Ones",
  twos: "Twos",
  threes: "Threes",
  fours: "Fours",
  fives: "Fives",
  sixes: "Sixes",
  threeOfAKind: "Three of a Kind",
  fourOfAKind: "Four of a Kind",
  fullHouse: "Full House",
  smallStraight: "Sm. Straight",
  largeStraight: "Lg. Straight",
  yahtzee: "YAHTZEE",
  chance: "Chance",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  ones: "Sum of all 1s",
  twos: "Sum of all 2s",
  threes: "Sum of all 3s",
  fours: "Sum of all 4s",
  fives: "Sum of all 5s",
  sixes: "Sum of all 6s",
  threeOfAKind: "3 of one number — sum all",
  fourOfAKind: "4 of one number — sum all",
  fullHouse: "3 + 2 of a kind — 25 pts",
  smallStraight: "4 in a row — 30 pts",
  largeStraight: "5 in a row — 40 pts",
  yahtzee: "5 of a kind — 50 pts",
  chance: "Sum of all dice",
};

export type ScoreCard = Partial<Record<Category, number>>;

export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function rollDice(held: boolean[]): number[] {
  return held.map((h, i) => (h ? 0 : rollDie()));
}

function counts(dice: number[]): Record<number, number> {
  const c: Record<number, number> = {};
  for (const d of dice) {
    c[d] = (c[d] || 0) + 1;
  }
  return c;
}

function sum(dice: number[]): number {
  return dice.reduce((a, b) => a + b, 0);
}

function hasNOfAKind(dice: number[], n: number): boolean {
  const c = counts(dice);
  return Object.values(c).some((v) => v >= n);
}

function isFullHouse(dice: number[]): boolean {
  const c = Object.values(counts(dice)).sort();
  return JSON.stringify(c) === JSON.stringify([2, 3]);
}

function hasSmallStraight(dice: number[]): boolean {
  const unique = [...new Set(dice)].sort();
  const seqs = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
  ];
  return seqs.some((seq) => seq.every((n) => unique.includes(n)));
}

function hasLargeStraight(dice: number[]): boolean {
  const unique = [...new Set(dice)].sort();
  return (
    JSON.stringify(unique) === JSON.stringify([1, 2, 3, 4, 5]) ||
    JSON.stringify(unique) === JSON.stringify([2, 3, 4, 5, 6])
  );
}

export function calculateScore(category: Category, dice: number[]): number {
  switch (category) {
    case "ones":
      return dice.filter((d) => d === 1).reduce((a, b) => a + b, 0);
    case "twos":
      return dice.filter((d) => d === 2).reduce((a, b) => a + b, 0);
    case "threes":
      return dice.filter((d) => d === 3).reduce((a, b) => a + b, 0);
    case "fours":
      return dice.filter((d) => d === 4).reduce((a, b) => a + b, 0);
    case "fives":
      return dice.filter((d) => d === 5).reduce((a, b) => a + b, 0);
    case "sixes":
      return dice.filter((d) => d === 6).reduce((a, b) => a + b, 0);
    case "threeOfAKind":
      return hasNOfAKind(dice, 3) ? sum(dice) : 0;
    case "fourOfAKind":
      return hasNOfAKind(dice, 4) ? sum(dice) : 0;
    case "fullHouse":
      return isFullHouse(dice) ? 25 : 0;
    case "smallStraight":
      return hasSmallStraight(dice) ? 30 : 0;
    case "largeStraight":
      return hasLargeStraight(dice) ? 40 : 0;
    case "yahtzee":
      return hasNOfAKind(dice, 5) ? 50 : 0;
    case "chance":
      return sum(dice);
    default:
      return 0;
  }
}

export function upperSubtotal(scoreCard: ScoreCard): number {
  return UPPER_CATEGORIES.reduce((acc, cat) => acc + (scoreCard[cat] ?? 0), 0);
}

export function upperBonus(scoreCard: ScoreCard): number {
  return upperSubtotal(scoreCard) >= 63 ? 35 : 0;
}

export function lowerTotal(scoreCard: ScoreCard): number {
  return LOWER_CATEGORIES.reduce((acc, cat) => acc + (scoreCard[cat] ?? 0), 0);
}

export function grandTotal(scoreCard: ScoreCard): number {
  return upperSubtotal(scoreCard) + upperBonus(scoreCard) + lowerTotal(scoreCard);
}

export function isCategoryAvailable(
  scoreCard: ScoreCard,
  category: Category
): boolean {
  return !(category in scoreCard);
}

export function isGameOver(scoreCard: ScoreCard): boolean {
  return ALL_CATEGORIES.every((cat) => cat in scoreCard);
}
