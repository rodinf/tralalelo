import React from 'react';
import { useGame } from '../context/GameContext';
import Minimap from './Minimap';
import GameOverScreen from './GameOverScreen';
import './UI.css';

function UI() {
  const { state } = useGame();

  if (state.gameWon) {
    return <GameOverScreen />;
  }

  return (
    <div className="ui-overlay">
      {/* Крестик прицела */}
      <div className="crosshair">
        <div className="crosshair-line crosshair-horizontal"></div>
        <div className="crosshair-line crosshair-vertical"></div>
      </div>

      {/* Панель статуса */}
      <div className="status-panel">
        <div className="status-item">
          <span className="status-label">Комната:</span>
          <span className="status-value">{state.currentRoom + 1}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Исследовано:</span>
          <span className="status-value">{state.visitedRooms.size}</span>
        </div>
      </div>

      {/* Инструкции */}
      <div className="instructions-panel">
        <p>WASD - движение</p>
        <p>Мышь - поворот</p>
        <p>E - открыть/закрыть двери</p>
        <p>E - активировать портал</p>
        <p>Найдите светящийся портал!</p>
      </div>

      {/* Мини-карта */}
      <Minimap />
    </div>
  );
}

export default UI; 