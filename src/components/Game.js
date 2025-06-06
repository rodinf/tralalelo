import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { useGame } from '../context/GameContext';
import { generateLevel } from '../utils/levelGenerator';
import audioManager from '../utils/AudioManager';
import Level from './Level';
import Player from './Player';

function CameraController({ level }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (level && level.startPosition) {
      // Устанавливаем начальную позицию камеры в начале коридора
      camera.position.set(level.startPosition.x, 1.8, level.startPosition.z);
      camera.lookAt(level.startPosition.x, 1.8, level.startPosition.z + 5);
    }
  }, [camera, level]);

  return null;
}

function Game() {
  const { dispatch } = useGame();
  const [level, setLevel] = useState(null);
  const controlsRef = useRef();

  useEffect(() => {
    // Генерируем уровень при монтировании
    const newLevel = generateLevel();
    setLevel(newLevel);
    dispatch({ type: 'SET_LEVEL', payload: newLevel });
    
    // Загружаем и запускаем фоновую музыку
    audioManager.loadBackgroundMusic('/crocodildo.mp3');
    
    // Небольшая задержка перед запуском музыки для лучшего UX
    setTimeout(() => {
      audioManager.playBackgroundMusic();
    }, 100);
    
    // Очистка при размонтировании компонента
    return () => {
      audioManager.stopBackgroundMusic();
    };
  }, [dispatch]);

  if (!level) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: 'white',
        fontSize: '24px'
      }}>
        Генерация уровня...
      </div>
    );
  }

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ 
        fov: 75, 
        position: [1.5, 1.8, 1.5],
        near: 0.1,
        far: 50
      }}
      gl={{ 
        antialias: false,
        alpha: false,
        powerPreference: "high-performance"
      }}
      dpr={[1, 1.5]}
    >
      <CameraController level={level} />
      
      {/* Освещение */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.6}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Управление камерой */}
      <PointerLockControls 
        ref={controlsRef}
        enabled={true}
        camera-position={[5, 1.8, 5]}
      />

      {/* Уровень */}
      <Level level={level} />
      
      {/* Игрок */}
      <Player controlsRef={controlsRef} level={level} />

      {/* Туман для атмосферы */}
      <fog attach="fog" args={['#000000', 20, 50]} />
    </Canvas>
  );
}

export default Game; 