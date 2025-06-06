import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGame } from '../context/GameContext';
import * as THREE from 'three';

function Player({ controlsRef, level }) {
  const { state, dispatch } = useGame();
  const { camera } = useThree();
  const velocityRef = useRef(new THREE.Vector3());
  const keysRef = useRef({});
  
  const playerHeight = 1.8;
  const moveSpeed = 5;
  const playerRadius = 0.3;

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getCurrentRoom = (position) => {
    if (!level) return null;
    
    for (const room of level.rooms) {
      if (position.x >= room.x && position.x <= room.x + room.width &&
          position.z >= room.z && position.z <= room.z + room.height) {
        return room;
      }
    }
    return null;
  };

  const getCurrentCorridor = (position) => {
    if (!level || !level.corridors) return null;
    
    for (const corridor of level.corridors) {
      if (position.x >= corridor.x && position.x <= corridor.x + corridor.width &&
          position.z >= corridor.z && position.z <= corridor.z + corridor.height) {
        return corridor;
      }
    }
    return null;
  };

  const checkDoorCollision = (newPosition) => {
    if (!level || !level.doors) return false;

    for (const door of level.doors) {
      const doorPosition = door.position;
      const isOpen = state.doors[door.id] || false;
      
      // Only check collision with CLOSED doors
      if (!isOpen) {
        const distanceX = Math.abs(newPosition.x - doorPosition.x);
        const distanceZ = Math.abs(newPosition.z - doorPosition.z);
        
        // Door collision area (3 units wide, thin depth)
        let collision = false;
        if (door.direction === 'north' || door.direction === 'south') {
          // Horizontal door across corridor
          collision = distanceX <= (1.5 + playerRadius) && distanceZ <= (0.1 + playerRadius);
        } else {
          // Vertical door across corridor  
          collision = distanceX <= (0.1 + playerRadius) && distanceZ <= (1.5 + playerRadius);
        }
        
        if (collision) {
          return true;
        }
      }
    }
    return false;
  };

  const checkCollision = (newPosition) => {
    if (!level) return false;

          // Проверяем коллизии с закрытыми дверями
    if (checkDoorCollision(newPosition)) {
      console.log("BLOCKED BY DOOR");
      return true;
    }

    const wallThickness = 0.2;
    const doorWidth = 3; // Ширина прохода должна быть равна ширине коридора для свободного прохода

    // Проверяем, находится ли игрок в комнате или коридоре
    const currentRoom = getCurrentRoom(newPosition);
    const currentCorridor = getCurrentCorridor(newPosition);

    if (!currentRoom && !currentCorridor) {
      // Игрок не в комнате и не в коридоре - это столкновение
      console.log(`BLOCKED BY BOUNDARY: not in room or corridor. Position: x=${newPosition.x.toFixed(2)}, z=${newPosition.z.toFixed(2)}`);
      return true;
    }

    if (currentRoom) {
      console.log(`TEMP: Disabling room wall collisions for testing in room ${currentRoom.id}`);
      // TEMPORARILY DISABLE room wall collisions to test if Room component walls are the issue
      /*
      // Проверяем столкновения со стенами комнат с учетом проходов
      const roomLeft = currentRoom.x;
      const roomRight = currentRoom.x + currentRoom.width;
      const roomTop = currentRoom.z;
      const roomBottom = currentRoom.z + currentRoom.height;
      const roomCenterX = currentRoom.x + currentRoom.width / 2;
      const roomCenterZ = currentRoom.z + currentRoom.height / 2;
      
      // Западная стена (с проходом если hasPassageWest)
      if (newPosition.x <= roomLeft + wallThickness + playerRadius &&
          newPosition.z >= roomTop && newPosition.z <= roomBottom) {
        // Если есть проход на запад, проверяем находится ли игрок в области прохода
        if (currentRoom.hasPassageWest) {
          const distanceFromCenter = Math.abs(newPosition.z - roomCenterZ);
          if (distanceFromCenter <= doorWidth / 2) {
            return false; // В проходе - столкновения нет
          }
        }
        console.log(`BLOCKED BY WEST WALL in room ${currentRoom.id}`);
        return true; // Вне прохода или прохода нет - столкновение
      }
      
      // Восточная стена (с проходом если hasPassageEast)
      if (newPosition.x >= roomRight - wallThickness - playerRadius &&
          newPosition.z >= roomTop && newPosition.z <= roomBottom) {
        // Если есть проход на восток, проверяем находится ли игрок в области прохода
        if (currentRoom.hasPassageEast) {
          const distanceFromCenter = Math.abs(newPosition.z - roomCenterZ);
          if (distanceFromCenter <= doorWidth / 2) {
            return false; // В проходе - столкновения нет
          }
        }
        console.log(`BLOCKED BY EAST WALL in room ${currentRoom.id}`);
        return true; // Вне прохода или прохода нет - столкновение
      }
      
      // Северная стена (с проходом если hasPassageNorth)
      if (newPosition.z <= roomTop + wallThickness + playerRadius && 
          newPosition.x >= roomLeft && newPosition.x <= roomRight) {
        // Если есть проход на север, проверяем находится ли игрок в области прохода
        if (currentRoom.hasPassageNorth) {
          const distanceFromCenter = Math.abs(newPosition.x - roomCenterX);
          if (distanceFromCenter <= doorWidth / 2) {
            return false; // В проходе - столкновения нет
          }
        }
        console.log(`BLOCKED BY NORTH WALL in room ${currentRoom.id}`);
        return true; // Вне прохода или прохода нет - столкновение
      }
      
      // Южная стена (с проходом если hasPassageSouth)
      if (newPosition.z >= roomBottom - wallThickness - playerRadius && 
          newPosition.x >= roomLeft && newPosition.x <= roomRight) {
        // Если есть проход на юг, проверяем находится ли игрок в области прохода
        if (currentRoom.hasPassageSouth) {
          const distanceFromCenter = Math.abs(newPosition.x - roomCenterX);
          if (distanceFromCenter <= doorWidth / 2) {
            return false; // В проходе - столкновения нет
          }
        }
        console.log(`BLOCKED BY SOUTH WALL in room ${currentRoom.id}`);
        return true; // Вне прохода или прохода нет - столкновение
      }
      */
    }

    if (currentCorridor) {
      // Проверяем столкновения со стенами коридора
      const corrLeft = currentCorridor.x;
      const corrRight = currentCorridor.x + currentCorridor.width;
      const corrTop = currentCorridor.z;
      const corrBottom = currentCorridor.z + currentCorridor.height;
      
      // Проверяем направление коридора
      if (currentCorridor.direction === 'north' || currentCorridor.direction === 'south') {
        // Вертикальный коридор - проверяем боковые стены (X)
        if (newPosition.x <= corrLeft + wallThickness + playerRadius ||
            newPosition.x >= corrRight - wallThickness - playerRadius) {
          return true;
        }
      } else {
        // Горизонтальный коридор - проверяем верхние/нижние стены (Z)
        if (newPosition.z <= corrTop + wallThickness + playerRadius ||
            newPosition.z >= corrBottom - wallThickness - playerRadius) {
          return true;
        }
      }
    }
    
    return false;
  };



  useFrame((state, delta) => {
    if (!controlsRef.current || !level) return;

    velocityRef.current.set(0, 0, 0);

    // Движение - ограничиваем максимальный delta для стабильности
    const clampedDelta = Math.min(delta, 0.02);
    
    if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) {
      velocityRef.current.z -= moveSpeed * clampedDelta;
    }
    if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) {
      velocityRef.current.z += moveSpeed * clampedDelta;
    }
    if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) {
      velocityRef.current.x -= moveSpeed * clampedDelta;
    }
    if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) {
      velocityRef.current.x += moveSpeed * clampedDelta;
    }

    // Применяем поворот камеры к вектору движения
    if (velocityRef.current.length() > 0) {
      velocityRef.current.applyQuaternion(camera.quaternion);
      velocityRef.current.y = 0; // Не летаем
      
      const newPosition = camera.position.clone().add(velocityRef.current);
      
      // Проверяем столкновения
      const hasCollision = checkCollision(newPosition);
      if (!hasCollision) {
        camera.position.copy(newPosition);
        dispatch({ 
          type: 'UPDATE_PLAYER_POSITION', 
          payload: { x: newPosition.x, z: newPosition.z } 
        });
        
        // Проверяем смену комнаты
        const currentRoom = getCurrentRoom(newPosition);
        if (currentRoom && currentRoom.id !== state.currentRoom) {
          console.log(`Переход в комнату ${currentRoom.id}, isExit: ${currentRoom.isExit}`);
          dispatch({ type: 'SET_CURRENT_ROOM', payload: currentRoom.id });
        }
        

      } else {
        console.log('Движение заблокировано коллизией');
      }
    }

    // Фиксируем высоту камеры
    camera.position.y = playerHeight;
  });

  return null;
}

export default Player; 