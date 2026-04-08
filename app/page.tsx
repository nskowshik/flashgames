'use client';

import { useRouter } from 'next/navigation';
import Card from './components/Card';

export default function Home() {
  const router = useRouter();

  const handleBoardGameClick = () => {
    router.push('/board');
  };

  return (
    <div className="flex flex-col flex-1 gap-4 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Flash Games</h1>

      <Card onClick={handleBoardGameClick}>Board Game</Card>
    </div>
  );
}
