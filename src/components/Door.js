import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGame } from '../context/GameContext';
import * as THREE from 'three';

function Door({ door, position, rotation = [0, 0, 0] }) {
  const { state, dispatch } = useGame();
  const { camera } = useThree();
  const doorRef = useRef();
  const [isPlayerNear, setIsPlayerNear] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isOpen = state.doors[door.id] || false;
  const interactionDistance = 2;

  // Проверка близости игрока
  useFrame(() => {
    if (doorRef.current) {
      const doorPosition = new THREE.Vector3();
      doorRef.current.getWorldPosition(doorPosition);
      
      const distance = camera.position.distanceTo(doorPosition);
      const near = distance <= interactionDistance;
      
      if (near !== isPlayerNear) {
        setIsPlayerNear(near);
        if (near) {
          console.log(`Подошли к двери ${door.id}, нажмите E чтобы ${isOpen ? 'закрыть' : 'открыть'}`);
        }
      }
    }
  });

  // Обработка клавиши E
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyE' && isPlayerNear && !isAnimating) {
        console.log(`${isOpen ? 'Закрываем' : 'Открываем'} дверь ${door.id}`);
        setIsAnimating(true);
        dispatch({ type: 'TOGGLE_DOOR', payload: door.id });
        
        // Анимация длится 0.5 секунды
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlayerNear, isOpen, isAnimating, door.id, dispatch]);

  // Анимация двери
  useFrame((state) => {
    if (doorRef.current) {
      const targetRotationY = isOpen ? Math.PI / 2 : 0;
      const currentRotationY = doorRef.current.rotation.y;
      const diff = targetRotationY - currentRotationY;
      
      if (Math.abs(diff) > 0.01) {
        doorRef.current.rotation.y += diff * 0.1;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Дверь - поворачивается от левого края */}
      <group position={[-1.5, 0, 0]}>
        <mesh 
          ref={doorRef}
          position={[1.5, 1.5, 0]}
          castShadow
        >
          <boxGeometry args={[3, 3, 0.1]} />
          <meshLambertMaterial color={isOpen ? '#606060' : '#404040'} />
        </mesh>
      </group>

      {/* Индикатор интерактивности */}
      {isPlayerNear && (
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.3]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}

      {/* Индикатор состояния двери */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color={isOpen ? "#00ff00" : "#ff0000"} />
      </mesh>


    </group>
  );
}

export default Door; 