import React from 'react';

function Room({ room }) {
  const wallHeight = 3;
  const wallThickness = 0.2;
  const doorWidth = 3;

  // Создаем текстуру для стен
  const wallColor = room.isExit ? '#4a90e2' : '#8b4513';
  
  // Debug passages
  console.log(`Room ${room.id} passages:`, {
    north: room.hasPassageNorth,
    south: room.hasPassageSouth, 
    east: room.hasPassageEast,
    west: room.hasPassageWest
  });

  // Функция для проверки наличия прохода в определенном направлении
  const hasPassage = (direction) => {
    switch (direction) {
      case 'north':
        return room.hasPassageNorth || false;
      case 'south':
        return room.hasPassageSouth || false;
      case 'east':
        return room.hasPassageEast || false;
      case 'west':
        return room.hasPassageWest || false;
      default:
        return false;
    }
  };

  // Функция для создания стены с проходом
  const createWallWithPassage = (direction, position, dimensions) => {
    const hasPass = hasPassage(direction);
    console.log(`Room ${room.id} creating ${direction} wall, hasPassage: ${hasPass}`);
    
    if (!hasPass) {
      // Обычная стена без прохода
      return (
        <mesh 
          position={position}
        >
          <boxGeometry args={dimensions} />
          <meshLambertMaterial color={wallColor} />
        </mesh>
      );
    } else {
      // Стена с проходом - создаем две части стены по бокам от прохода
      console.log(`Creating passage in ${direction} wall for room ${room.id}`);
      const isHorizontal = direction === 'north' || direction === 'south';
      const wallParts = [];

      if (isHorizontal) {
        // Горизонтальная стена - разбиваем по X
        const leftWidth = (room.width - doorWidth) / 2;
        const rightWidth = leftWidth;
        
        // Левая часть стены
        if (leftWidth > 0.1) {
          wallParts.push(
            <mesh 
              key="left"
              position={[leftWidth / 2, position[1], position[2]]}
            >
              <boxGeometry args={[leftWidth, dimensions[1], dimensions[2]]} />
              <meshLambertMaterial color={wallColor} />
            </mesh>
          );
        }

        // Правая часть стены
        if (rightWidth > 0.1) {
          wallParts.push(
            <mesh 
              key="right"
              position={[room.width - rightWidth / 2, position[1], position[2]]}
            >
              <boxGeometry args={[rightWidth, dimensions[1], dimensions[2]]} />
              <meshLambertMaterial color={wallColor} />
            </mesh>
          );
        }

        // TEMP: Add visible indicator where the passage should be
        wallParts.push(
          <mesh 
            key="passage-indicator"
            position={[room.width / 2, position[1], position[2]]}
          >
            <boxGeometry args={[doorWidth, 0.1, dimensions[2]]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
          </mesh>
        );
      } else {
        // Вертикальная стена - разбиваем по Z
        const topHeight = (room.height - doorWidth) / 2;
        const bottomHeight = topHeight;
        
        // Нижняя часть стены (ближе к Z=0)
        if (bottomHeight > 0.1) {
          wallParts.push(
            <mesh 
              key="bottom"
              position={[position[0], position[1], bottomHeight / 2]}
            >
              <boxGeometry args={[dimensions[0], dimensions[1], bottomHeight]} />
              <meshLambertMaterial color={wallColor} />
            </mesh>
          );
        }

        // Верхняя часть стены (ближе к Z=room.height)
        if (topHeight > 0.1) {
          wallParts.push(
            <mesh 
              key="top"
              position={[position[0], position[1], room.height - topHeight / 2]}
            >
              <boxGeometry args={[dimensions[0], dimensions[1], topHeight]} />
              <meshLambertMaterial color={wallColor} />
            </mesh>
          );
        }

        // TEMP: Add visible indicator where the passage should be
        wallParts.push(
          <mesh 
            key="passage-indicator"
            position={[position[0], position[1], room.height / 2]}
          >
            <boxGeometry args={[dimensions[0], 0.1, doorWidth]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
          </mesh>
        );
      }

      return wallParts;
    }
  };
  
  return (
    <group position={[room.x, 0, room.z]}>
      {/* Точечное освещение в центре комнаты */}
      <pointLight
        position={[room.width / 2, wallHeight - 0.5, room.height / 2]}
        intensity={room.isExit ? 0.8 : 0.4}
        distance={room.width * 1.2}
        color={room.isExit ? '#4ecdc4' : '#ffd93d'}
      />

      {/* Южная стена (z=0) */}
      {createWallWithPassage('south', [room.width / 2, wallHeight / 2, 0], [room.width, wallHeight, wallThickness])}

      {/* Северная стена (z=room.height) */}
      {createWallWithPassage('north', [room.width / 2, wallHeight / 2, room.height], [room.width, wallHeight, wallThickness])}

      {/* Западная стена (x=0) */}
      {createWallWithPassage('west', [0, wallHeight / 2, room.height / 2], [wallThickness, wallHeight, room.height])}

      {/* Восточная стена (x=room.width) */}
      {createWallWithPassage('east', [room.width, wallHeight / 2, room.height / 2], [wallThickness, wallHeight, room.height])}

      {/* Пол комнаты */}
      <mesh 
        position={[room.width / 2, 0.01, room.height / 2]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[room.width, room.height]} />
        <meshLambertMaterial color={room.isExit ? '#2c5aa0' : '#4a4a4a'} />
      </mesh>

      {/* Потолок */}
      <mesh 
        position={[room.width / 2, wallHeight, room.height / 2]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[room.width, room.height]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>

      {/* Декоративные элементы для выходной комнаты */}
      {room.isExit && (
        <>
          {/* Светящиеся кристаллы по углам */}
          <mesh position={[1, 1, 1]}>
            <octahedronGeometry args={[0.3]} />
            <meshBasicMaterial color="#4ecdc4" />
          </mesh>
          <mesh position={[room.width - 1, 1, 1]}>
            <octahedronGeometry args={[0.3]} />
            <meshBasicMaterial color="#4ecdc4" />
          </mesh>
          <mesh position={[1, 1, room.height - 1]}>
            <octahedronGeometry args={[0.3]} />
            <meshBasicMaterial color="#4ecdc4" />
          </mesh>
          <mesh position={[room.width - 1, 1, room.height - 1]}>
            <octahedronGeometry args={[0.3]} />
            <meshBasicMaterial color="#4ecdc4" />
          </mesh>
        </>
      )}
    </group>
  );
}

export default Room; 