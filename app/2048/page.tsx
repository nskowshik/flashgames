'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 4;
const GAP = 15;

export default function Game2048() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Initialize game
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore2048');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    newGame();
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update best score in localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore2048', score.toString());
    }
  }, [score, bestScore]);

  const newGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);

    // Add two random tiles
    addRandomTileToGrid(newGrid);
    addRandomTileToGrid(newGrid);
    setGrid([...newGrid]);
  }, []);

  const addRandomTileToGrid = (currentGrid: number[][]) => {
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) return false;

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    currentGrid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    return true;
  };

  const slideAndMerge = (row: number[]): number[] => {
    // Remove zeros
    let newRow = row.filter((val) => val !== 0);

    // Merge adjacent equal values
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        setScore((prev) => prev + newRow[i]);
        newRow[i + 1] = 0;
      }
    }

    // Remove zeros again after merging
    newRow = newRow.filter((val) => val !== 0);

    // Pad with zeros
    while (newRow.length < GRID_SIZE) {
      newRow.push(0);
    }

    return newRow;
  };

  const moveLeft = (
    currentGrid: number[][]
  ): { grid: number[][]; moved: boolean } => {
    let moved = false;
    const newGrid = currentGrid.map((row) => {
      const newRow = slideAndMerge(row);
      if (newRow.join(',') !== row.join(',')) {
        moved = true;
      }
      return newRow;
    });
    return { grid: newGrid, moved };
  };

  const moveRight = (
    currentGrid: number[][]
  ): { grid: number[][]; moved: boolean } => {
    let moved = false;
    const newGrid = currentGrid.map((row) => {
      const newRow = slideAndMerge(row.slice().reverse()).reverse();
      if (newRow.join(',') !== row.join(',')) {
        moved = true;
      }
      return newRow;
    });
    return { grid: newGrid, moved };
  };

  const moveUp = (
    currentGrid: number[][]
  ): { grid: number[][]; moved: boolean } => {
    let moved = false;
    const newGrid = currentGrid.map((row) => [...row]);

    for (let col = 0; col < GRID_SIZE; col++) {
      const column: number[] = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        column.push(currentGrid[row][col]);
      }
      const newColumn = slideAndMerge(column);
      if (newColumn.join(',') !== column.join(',')) {
        moved = true;
      }
      for (let row = 0; row < GRID_SIZE; row++) {
        newGrid[row][col] = newColumn[row];
      }
    }
    return { grid: newGrid, moved };
  };

  const moveDown = (
    currentGrid: number[][]
  ): { grid: number[][]; moved: boolean } => {
    let moved = false;
    const newGrid = currentGrid.map((row) => [...row]);

    for (let col = 0; col < GRID_SIZE; col++) {
      const column: number[] = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        column.push(currentGrid[row][col]);
      }
      const newColumn = slideAndMerge(column.slice().reverse()).reverse();
      if (newColumn.join(',') !== column.join(',')) {
        moved = true;
      }
      for (let row = 0; row < GRID_SIZE; row++) {
        newGrid[row][col] = newColumn[row];
      }
    }
    return { grid: newGrid, moved };
  };

  const checkGameOver = (currentGrid: number[][]): boolean => {
    // Check for empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] === 0) return false;
      }
    }

    // Check for possible merges
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = currentGrid[row][col];

        // Check right
        if (col < GRID_SIZE - 1 && currentGrid[row][col + 1] === current) {
          return false;
        }

        // Check down
        if (row < GRID_SIZE - 1 && currentGrid[row + 1][col] === current) {
          return false;
        }
      }
    }

    return true;
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let result;
    switch (direction) {
      case 'up':
        result = moveUp(grid);
        break;
      case 'down':
        result = moveDown(grid);
        break;
      case 'left':
        result = moveLeft(grid);
        break;
      case 'right':
        result = moveRight(grid);
        break;
    }

    if (result?.moved) {
      const newGrid = [...result.grid];
      addRandomTileToGrid(newGrid);
      setGrid(newGrid);

      if (checkGameOver(newGrid)) {
        setGameOver(true);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (gameOver) return;

    const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
      W: 'up',
      S: 'down',
      A: 'left',
      D: 'right',
    };

    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      move(direction);
    }
  };

  // Touch handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartRef.current.x;
    const diffY = touchEndY - touchStartRef.current.y;

    const minSwipe = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipe) {
        move(diffX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(diffY) > minSwipe) {
        move(diffY > 0 ? 'down' : 'up');
      }
    }

    touchStartRef.current = null;
  };

  const getTileColor = (value: number): string => {
    const colors: Record<number, string> = {
      2: 'bg-[#eee4da] text-[#776e65]',
      4: 'bg-[#ede0c8] text-[#776e65]',
      8: 'bg-[#f2b179] text-[#f9f6f2]',
      16: 'bg-[#f59563] text-[#f9f6f2]',
      32: 'bg-[#f67c5f] text-[#f9f6f2]',
      64: 'bg-[#f65e3b] text-[#f9f6f2]',
      128: 'bg-[#edcf72] text-[#f9f6f2]',
      256: 'bg-[#edcc61] text-[#f9f6f2]',
      512: 'bg-[#edc850] text-[#f9f6f2]',
      1024: 'bg-[#edc53f] text-[#f9f6f2]',
      2048: 'bg-[#edc22e] text-[#f9f6f2] shadow-[0_0_30px_#edc22e]',
    };
    return colors[value] || 'bg-[#3c3a32] text-[#f9f6f2]';
  };

  const getFontSize = (value: number): string => {
    if (value >= 1024) return 'text-xl';
    if (value >= 128) return 'text-2xl';
    return 'text-3xl';
  };

  const cellSize = containerSize.width
    ? (containerSize.width - 32 - GAP * 3) / 4
    : 80;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-4"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">2048</h1>
          <div className="flex gap-2">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center min-w-[80px]">
              <span className="block text-xs text-white uppercase tracking-wider">
                Score
              </span>
              <span className="block text-2xl font-bold text-white">
                {score}
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center min-w-[80px]">
              <span className="block text-xs text-white uppercase tracking-wider">
                Best
              </span>
              <span className="block text-2xl font-bold text-white">
                {bestScore}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={newGame}
          className="w-full py-3 text-lg font-bold text-white bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-lg cursor-pointer hover:bg-white/30 transition-all mb-5"
        >
          New Game
        </button>

        <div
          ref={gameContainerRef}
          className="relative bg-[#bbadaa]/80 backdrop-blur-md rounded-xl p-4 aspect-square"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Grid cells */}
          <div className="grid grid-cols-4 grid-rows-4 gap-[15px] w-full h-full">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
              <div
                key={index}
                className="bg-[#cdc1b4]/60 rounded-lg w-full h-full"
              />
            ))}
          </div>

          {/* Tiles */}
          <div className="absolute top-4 left-4 right-4 bottom-4 pointer-events-none">
            {grid.map((row, rowIndex) =>
              row.map((value, colIndex) => {
                if (value === 0) return null;
                const x = colIndex * (cellSize + GAP);
                const y = rowIndex * (cellSize + GAP);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`absolute flex items-center justify-center font-bold rounded-lg transition-all duration-150 animate-in zoom-in ${getTileColor(
                      value
                    )} ${getFontSize(value)}`}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    {value}
                  </div>
                );
              })
            )}
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-[#eee4da]/90 rounded-xl flex flex-col items-center justify-center animate-in fade-in">
              <h2 className="text-5xl text-[#776e65] font-bold mb-5">
                Game Over!
              </h2>
              <button
                onClick={newGame}
                className="px-8 py-3 text-lg font-bold text-white bg-[#8f7a66] rounded-lg cursor-pointer hover:bg-[#9f8b77] transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 text-center text-white/80 text-sm">
          <p>Use arrow keys or WASD to move tiles</p>
        </div>
      </div>
    </div>
  );
}
