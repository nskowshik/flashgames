'use client';

import { useState, useEffect } from 'react';
import Card from '@/app/components/Card';
import { getBoard } from '@/app/api/board';

export default function Board() {
  const [boardData, setBoardData] = useState<any>([]);
  const [size, setSize] = useState<any>({});
  const [firstCard, setFirstCard] = useState<any>(null);
  const [moves, setMoves] = useState(0);
  const [lockMove, setLockMove] = useState(false);

  const flipSelectedCards = (card: any) => {
    if (lockMove || card?.flipped) return;

    if (!firstCard && card?.id) {
      setFirstCard(card);
      const updatedData = [...boardData];
      updatedData[card.cardId].flipped = !updatedData[card.cardId].flipped;
      setBoardData(updatedData);
    }
    if (firstCard && card?.id) {
      setMoves((prev) => prev + 1);
      setLockMove(true);
      const updatedData = [...boardData];
      updatedData[card.cardId].flipped = !updatedData[card.cardId].flipped;
      setBoardData(updatedData);
      if (firstCard.name !== card.name) {
        setTimeout(() => {
          const updatedData = [...boardData];
          updatedData[firstCard.cardId].flipped = false;
          updatedData[card.cardId].flipped = false;
          setBoardData(updatedData);
          setFirstCard(null);
          setLockMove(false);
        }, 1000);
      } else {
        setFirstCard(null);
        setLockMove(false);
      }
    }
  };

  const flipCard = (data: any) => {
    const updatedData = data?.map((el: any, index: number) => ({
      ...el,
      flipped: false,
      cardId: index,
    }));
    setBoardData(updatedData);
  };

  useEffect(() => {
    getBoard().then((data) => {
      flipCard(data.board);
      setSize(data.size);
    });
  }, []);

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          🧠 Memory Match
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Find all matching pairs!
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: size.row }, (_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4">
            {boardData
              ?.slice(rowIndex * size.col, (rowIndex + 1) * size.col)
              .map((cell: any, colIndex: any) => (
                <div key={`col-${colIndex}`} className="flex gap-4">
                  <Card
                    key={`card-${rowIndex}-${colIndex}`}
                    onClick={() => flipSelectedCards(cell)}
                  >
                    <span className="text-2xl font-bold text-white w-6 h-6 flex items-center justify-center">
                      {cell?.flipped ? cell?.name : '?'}
                    </span>
                  </Card>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        {boardData?.every((el: any) => el.flipped) ? (
          <p className="text-lg font-bold text-white">
            Congratulations! You won in {moves} moves!
          </p>
        ) : (
          <p className="text-lg font-bold text-white">Moves: {moves}</p>
        )}

        <button
          onClick={() => {
            getBoard().then((data) => {
              flipCard(data.board);
              setSize(data.size);
              setMoves(0);
              setFirstCard(null);
              setLockMove(false);
            });
          }}
          className="bg-neutral border border-neutral-200 rounded-lg px-4 py-2 mt-4 cursor-pointer"
          type="button"
          disabled={moves === 0}
        >
          Restart
        </button>
      </div>
    </>
  );
}
