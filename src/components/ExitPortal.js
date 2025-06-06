import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGame } from '../context/GameContext';
import audioManager from '../utils/AudioManager';
import * as THREE from 'three';

function ExitPortal({ room }) {
  const { dispatch } = useGame();
  const { camera } = useThree();
  const portalRef = useRef();
  const particlesRef = useRef();

  // Анимация портала и проверка близости игрока
  const [isPlayerNear, setIsPlayerNear] = React.useState(false);
  
  // Обработка активации портала через клавишу E
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyE' && isPlayerNear) {
        console.log('Портал активирован клавишей E!');
        audioManager.stopBackgroundMusic();
        dispatch({ type: 'WIN_GAME' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlayerNear, dispatch]);
  
  useFrame((state) => {
    // Упрощенная анимация с меньшей частотой обновления
    if (portalRef.current && state.clock.elapsedTime % 0.1 < 0.016) {
      portalRef.current.rotation.y += 0.02;
      portalRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    if (particlesRef.current && state.clock.elapsedTime % 0.1 < 0.016) {
      particlesRef.current.rotation.y -= 0.01;
    }
    
    // Проверяем близость игрока реже
    if (state.clock.elapsedTime % 0.2 < 0.016) {
      const centerX = room.x + room.width / 2;
      const centerZ = room.z + room.height / 2;
      const playerPos = camera.position;
      
      const distance = Math.sqrt(
        Math.pow(playerPos.x - centerX, 2) + 
        Math.pow(playerPos.z - centerZ, 2)
      );
      
      const nearPortal = distance <= 3;
      if (nearPortal !== isPlayerNear) {
        console.log(`Игрок ${nearPortal ? 'подошел к' : 'отошел от'} порталу. Расстояние: ${distance.toFixed(2)}`);
        setIsPlayerNear(nearPortal);
      }
    }
  });

  const handlePortalClick = React.useCallback((e) => {
    // Останавливаем распространение события
    e.stopPropagation();
    
    // Проверяем расстояние до игрока
    const centerX = room.x + room.width / 2;
    const centerZ = room.z + room.height / 2;
    const playerPos = camera.position;
    
    const distance = Math.sqrt(
      Math.pow(playerPos.x - centerX, 2) + 
      Math.pow(playerPos.z - centerZ, 2)
    );
    
    // Активируем портал только если игрок достаточно близко (в радиусе 3 единиц)
    if (distance <= 3) {
      console.log('Портал активирован! Игрок достаточно близко.');
      audioManager.stopBackgroundMusic();
      dispatch({ type: 'WIN_GAME' });
    } else {
      console.log(`Игрок слишком далеко от портала. Расстояние: ${distance.toFixed(2)}`);
    }
  }, [room, camera, dispatch]);

  const centerX = room.x + room.width / 2;
  const centerZ = room.z + room.height / 2;
  
  // Отладочная информация о позиции портала
  React.useEffect(() => {
    console.log(`Портал создан в комнате ${room.id} на позиции: x=${centerX}, z=${centerZ}`);
    console.log(`Комната: x=${room.x}, z=${room.z}, width=${room.width}, height=${room.height}`);
    console.log(`Проходы: север=${room.hasPassageNorth}, юг=${room.hasPassageSouth}`);
  }, [room.id, centerX, centerZ, room.x, room.z, room.width, room.height, room.hasPassageNorth, room.hasPassageSouth]);

  return (
    <group position={[centerX, 2, centerZ]}>
      {/* Основной портал */}
      <mesh 
        ref={portalRef} 
        onClick={handlePortalClick}
        castShadow
      >
        <torusGeometry args={[1.5, 0.3, 8, 16]} />
        <meshBasicMaterial 
          color={isPlayerNear ? "#00ff88" : "#4ecdc4"} 
        />
      </mesh>

      {/* Внутреннее свечение */}
      <mesh onClick={handlePortalClick}>
        <circleGeometry args={[1.5]} />
        <meshBasicMaterial 
          color={isPlayerNear ? "#88ff00" : "#6c5ce7"}
          transparent 
          opacity={isPlayerNear ? 0.8 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Индикатор активности */}
      {isPlayerNear && (
        <>
          <mesh position={[0, -1, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          
          {/* Текстовая подсказка */}
          <mesh position={[0, 3, 0]}>
            <planeGeometry args={[4, 1]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>
        </>
      )}

      {/* Упрощенные частицы вокруг портала */}
      <group ref={particlesRef}>
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const radius = 2.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#ffd93d" />
            </mesh>
          );
        })}
      </group>

      {/* Свет от портала */}
      <pointLight
        intensity={1}
        distance={10}
        color="#4ecdc4"
      />
    </group>
  );
}

export default ExitPortal; 