'use client';

import { useRouter } from 'next/navigation';
import Card from './components/Card';

const games = [
  {
    id: 'memory',
    name: 'Memory Match',
    icon: '🧠',
    description: 'Test your memory skills',
    route: '/memory',
  },
];

export default function Home() {
  const router = useRouter();

  const handleGameClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex flex-col flex-1 gap-8 items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Flash Games
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Play classic games while waiting for your AI response
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {games.map((game) => (
          <Card key={game.id} onClick={() => handleGameClick(game.route)}>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">{game.icon}</div>
              {game.name}
              <div className="text-sm mt-2">{game.description}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
