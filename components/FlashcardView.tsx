
import React, { useState, useEffect } from 'react';
import type { Flashcard } from '../types';

interface FlashcardViewProps {
  flashcards: Flashcard[] | null;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Reset flip state when card changes
    setIsFlipped(false);
  }, [currentIndex]);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No flashcards available. Generate some to start studying!</p>
      </div>
    );
  }

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        setIsAnimating(false);
    }, 150);
  };

  const handlePrev = () => {
     if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
        setIsAnimating(false);
    }, 150);
  };

  const card = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Flashcards</h2>
      <div className="w-full max-w-lg h-64 perspective-1000">
        <div
          className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white border border-slate-200 rounded-xl shadow-lg cursor-pointer">
            <p className="text-2xl font-bold text-center text-slate-800">{card.term}</p>
          </div>
          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-blue-600 border border-blue-700 rounded-xl shadow-lg cursor-pointer rotate-y-180">
            <p className="text-lg text-center text-white">{card.definition}</p>
          </div>
        </div>
      </div>
      
      <p className="text-slate-500 mt-4">
        {currentIndex + 1} / {flashcards.length}
      </p>

      <div className="flex justify-center items-center space-x-4 mt-4 w-full max-w-lg">
        <button
          onClick={handlePrev}
          className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Prev
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="bg-white text-blue-600 border-2 border-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors w-32"
        >
          Flip
        </button>
        <button
          onClick={handleNext}
          className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Next
        </button>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
