"use server";

const BOARD_SIZE_ROW = 3;
const BOARD_SIZE_COL = 4;

const CARD_VALUES = [
  { name: "A", id: 1 },
  { name: "B", id: 2 },
  { name: "C", id: 3 },
  { name: "D", id: 4 },
  { name: "E", id: 5 },
  { name: "F", id: 6 },
  { name: "G", id: 7 },
  { name: "H", id: 8 },
  { name: "I", id: 9 },
  { name: "J", id: 10 },
  { name: "K", id: 11 },
  { name: "L", id: 12 },
];


export async function getBoard() {
  // Select 6 random values from CARD_VALUES
  const selectedCards = [...CARD_VALUES]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor((BOARD_SIZE_ROW * BOARD_SIZE_COL) / 2));
  
  const pairedCards = [...selectedCards, ...selectedCards];
  
  // Shuffle the paired cards
  const shuffledCards = pairedCards.sort(() => Math.random() - 0.5);
  
  return {
    board: shuffledCards,
    size: {
      row: BOARD_SIZE_ROW,
      col: BOARD_SIZE_COL,
    },
  };
}
