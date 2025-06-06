import React from 'react';
import { useGame } from '../context/GameContext';
import audioManager from '../utils/AudioManager';

function GameOverScreen() {
  const { dispatch } = useGame();

  const handleRestart = () => {
    // Останавливаем музыку перед перезагрузкой
    audioManager.stopBackgroundMusic();
    dispatch({ type: 'RESET_GAME' });
    window.location.reload(); // Простой способ перезапустить игру
  };

  return (
    <div className="game-over-screen">
      <h1>ПОБЕДА!</h1>
      <h2>Вы нашли выход из лабиринта!</h2>
      <p style={{ 
        fontSize: '18px', 
        marginBottom: '2rem', 
        textAlign: 'center',
        color: '#a29bfe'
      }}>
        Поздравляем! Вы успешно прошли все комнаты<br/>
        и достигли светящегося портала.
      </p>
      
      <button 
        className="restart-button"
        onClick={handleRestart}
      >
        Играть снова
      </button>
    </div>
  );
}

export default GameOverScreen; 