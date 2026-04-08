"use client";

import { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import { getBoard } from "@/app/api/board";

export default function Board() {
  const [boardData, setBoardData] = useState<any>([]);
  const [size, setSize] = useState<any>({});
  const [firstCard, setFirstCard] = useState<any>(null);
  const [secondCard, setSecondCard] = useState<any>(null);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const flipSelectedCards = (card: any) => {
    if (!firstCard && card?.cardId) {
      setFirstCard(card);
      const updatedData = [...boardData];
      updatedData[card.cardId].flipped = !updatedData[card.cardId].flipped;
      setBoardData(updatedData);
    }
    if (firstCard && card?.cardId) {
      setSecondCard(card);
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
          setSecondCard(null);
        }, 1000);
      } else {
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
                    {cell?.flipped ? cell?.name : "?"}
                  </span>
                </Card>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
