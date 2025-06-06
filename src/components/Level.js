import React from 'react';
import Room from './Room';
import Corridor from './Corridor';
import Door from './Door';
import ExitPortal from './ExitPortal';

function Level({ level }) {
  if (!level) return null;

  return (
    <group>
      {/* Пол */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>

      {/* Комнаты */}
      {level.rooms.map(room => (
        <group key={room.id}>
          <Room room={room} />
          {/* Отладочный маркер в центре комнаты */}
          <mesh position={[room.x + room.width/2, 2.5, room.z + room.height/2]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshBasicMaterial color={room.isExit ? "#00ff00" : "#00ffff"} />
          </mesh>
        </group>
      ))}

      {/* Коридоры */}
      {level.corridors && level.corridors.map(corridor => (
        <group key={corridor.id}>
          <Corridor corridor={corridor} />
          {/* Отладочный маркер в центре коридора */}
          <mesh position={[corridor.x + corridor.width/2, 2, corridor.z + corridor.height/2]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
        </group>
      ))}

      {/* Двери */}
      {level.doors && level.doors.map(door => {
        // Определяем поворот двери в зависимости от направления
        const rotation = door.direction === 'east' || door.direction === 'west' 
          ? [0, Math.PI / 2, 0] 
          : [0, 0, 0];
        
        return (
          <Door 
            key={door.id} 
            door={door} 
            position={[door.position.x, 0, door.position.z]}
            rotation={rotation}
          />
        );
      })}

      {/* Выход */}
      {level.rooms.map(room => 
        room.isExit ? (
          <ExitPortal key={`exit-${room.id}`} room={room} />
        ) : null
      )}
    </group>
  );
}

export default Level; 