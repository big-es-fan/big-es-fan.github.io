import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Setup from "@/pages/Setup";
import Game from "@/pages/Game";

const queryClient = new QueryClient();

function AppContent() {
  const [playerNames, setPlayerNames] = useState<[string, string] | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = (names: [string, string]) => {
    setPlayerNames(names);
    setGameKey((k) => k + 1);
  };

  const handleNewGame = () => {
    setPlayerNames(null);
  };

  if (!playerNames) {
    return <Setup onStart={handleStart} />;
  }

  return (
    <Game
      key={gameKey}
      playerNames={playerNames}
      onNewGame={handleNewGame}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
