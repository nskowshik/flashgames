"use client";

import { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import { getBoard } from "@/app/api/board";

export default function Board() {
  const [boardData, setBoardData] = useState<any>([]);
  const [size, setSize] = useState<any>({});

  useEffect(() => {
    getBoard().then((data) => {
      setBoardData(data);
      setSize(data.size);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: size.row }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {boardData?.board
            ?.slice(rowIndex * size.col, (rowIndex + 1) * size.col)
            .map((cell: any, colIndex: any) => (
              <div key={`col-${colIndex}`} className="flex gap-4">
                <Card key={`card-${rowIndex}-${colIndex}`}>
                  <span className="text-2xl font-bold text-white w-6 h-6 flex items-center justify-center">
                    {cell?.name}
                  </span>
                </Card>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
