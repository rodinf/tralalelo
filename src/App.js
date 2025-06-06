import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import UI from './components/UI';
import GameOverScreen from './components/GameOverScreen';
import { GameProvider, useGame } from './context/GameContext';
import './App.css';

function GameContent() {
  const { state } = useGame();
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !gameStarted) {
        setGameStarted(true);
        setShowInstructions(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  return (
    <div className="app">
      {!gameStarted && showInstructions && (
        <div className="start-screen">
          <h1>WOLFENSTEIN 3D</h1>
          <h2>React Edition</h2>
          <div className="instructions">
            <p>WASD или стрелки - движение</p>
            <p>E - открывать двери и активировать портал</p>
            <p>Исследуйте коридоры и комнаты</p>
            <p>Найдите светящийся выход!</p>
          </div>
          <p className="start-hint">Нажмите ПРОБЕЛ для начала</p>
        </div>
      )}
      
      {gameStarted && !state.gameWon && (
        <>
          <Game />
          <UI />
        </>
      )}
      
      {state.gameWon && (
        <GameOverScreen />
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App; 