import { useState } from "react";
import { Dices } from "lucide-react";

interface SetupProps {
  onStart: (names: [string, string]) => void;
}

export default function Setup({ onStart }: SetupProps) {
  const [name1, setName1] = useState("Player 1");
  const [name2, setName2] = useState("Player 2");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n1 = name1.trim() || "Player 1";
    const n2 = name2.trim() || "Player 2";
    onStart([n1, n2]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg mb-4">
            <Dices className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Yahtzee</h1>
          <p className="text-muted-foreground text-sm mt-1">2 Player Local Game</p>
        </div>

        {/* Setup form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-base font-bold mb-4 text-center">Enter Player Names</h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="player1"
                className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
              >
                Player 1
              </label>
              <input
                id="player1"
                data-testid="input-player1"
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="Player 1"
              />
            </div>

            <div>
              <label
                htmlFor="player2"
                className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
              >
                Player 2
              </label>
              <input
                id="player2"
                data-testid="input-player2"
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="Player 2"
              />
            </div>
          </div>

          <button
            type="submit"
            data-testid="button-start-game"
            className="mt-6 w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Dices className="w-4 h-4" />
            Start Game
          </button>
        </form>

        <div className="mt-6 bg-card border border-border rounded-xl p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground text-sm mb-2">How to play</p>
          <p>Roll up to 3 times per turn. Hold dice between rolls.</p>
          <p>Score in each category once. Fill all 13 to end the game.</p>
          <p>Upper bonus: score 63+ in the upper section for +35 pts.</p>
        </div>
      </div>
    </div>
  );
}
