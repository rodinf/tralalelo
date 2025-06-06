import React from 'react';
import { useGame } from '../context/GameContext';

function Minimap() {
  const { state } = useGame();

  if (!state.level) return null;

  const mapSize = 180;
  const padding = 10;

  // Находим границы уровня для масштабирования
  const minX = Math.min(...state.level.rooms.map(r => r.x));
  const maxX = Math.max(...state.level.rooms.map(r => r.x + r.width));
  const minZ = Math.min(...state.level.rooms.map(r => r.z));
  const maxZ = Math.max(...state.level.rooms.map(r => r.z + r.height));

  const levelWidth = maxX - minX;
  const levelHeight = maxZ - minZ;
  const scale = Math.min(mapSize / levelWidth, mapSize / levelHeight);

  const getRoomClasses = (room) => {
    let classes = 'minimap-room';
    
    if (state.visitedRooms.has(room.id)) {
      classes += ' visited';
    }
    
    if (room.id === state.currentRoom) {
      classes += ' current';
    }
    
    if (room.isExit) {
      classes += ' exit';
    }
    
    return classes;
  };

  const getPlayerPosition = () => {
    const playerX = ((state.playerPosition.x - minX) * scale) + padding;
    const playerZ = ((state.playerPosition.z - minZ) * scale) + padding;
    return { left: playerX, top: playerZ };
  };

  return (
    <div className="minimap">
      {state.level.rooms.map(room => {
        const roomX = ((room.x - minX) * scale) + padding;
        const roomZ = ((room.z - minZ) * scale) + padding;
        const roomWidth = room.width * scale;
        const roomHeight = room.height * scale;

        return (
          <div
            key={room.id}
            className={getRoomClasses(room)}
            style={{
              left: roomX,
              top: roomZ,
              width: roomWidth,
              height: roomHeight
            }}
          />
        );
      })}
      
      {/* Игрок на карте */}
      <div
        className="minimap-player"
        style={getPlayerPosition()}
      />
    </div>
  );
}

export default Minimap; 