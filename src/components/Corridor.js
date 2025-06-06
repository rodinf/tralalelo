import React from 'react';

function Corridor({ corridor }) {
  const wallHeight = 3;
  const wallThickness = 0.2;

  return (
    <group position={[corridor.x, 0, corridor.z]}>
      {/* Пол коридора */}
      <mesh 
        position={[corridor.width / 2, 0.01, corridor.height / 2]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[corridor.width, corridor.height]} />
        <meshLambertMaterial color="#3a3a3a" />
      </mesh>

      {/* Потолок коридора */}
      <mesh 
        position={[corridor.width / 2, wallHeight, corridor.height / 2]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[corridor.width, corridor.height]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>

      {/* Левая стена коридора */}
      <mesh 
        position={[0, wallHeight / 2, corridor.height / 2]}
      >
        <boxGeometry args={[wallThickness, wallHeight, corridor.height]} />
        <meshLambertMaterial color="#6b4423" />
      </mesh>

      {/* Правая стена коридора */}
      <mesh 
        position={[corridor.width, wallHeight / 2, corridor.height / 2]}
      >
        <boxGeometry args={[wallThickness, wallHeight, corridor.height]} />
        <meshLambertMaterial color="#6b4423" />
      </mesh>

      {/* Если коридор горизонтальный (east-west), добавляем стены сверху и снизу */}
      {(corridor.direction === 'east' || corridor.direction === 'west') && (
        <>
          {/* Верхняя стена */}
          <mesh 
            position={[corridor.width / 2, wallHeight / 2, 0]}
          >
            <boxGeometry args={[corridor.width, wallHeight, wallThickness]} />
            <meshLambertMaterial color="#6b4423" />
          </mesh>

          {/* Нижняя стена */}
          <mesh 
            position={[corridor.width / 2, wallHeight / 2, corridor.height]}
          >
            <boxGeometry args={[corridor.width, wallHeight, wallThickness]} />
            <meshLambertMaterial color="#6b4423" />
          </mesh>
        </>
      )}

      {/* Если коридор вертикальный (north-south), левая и правая стены уже есть */}

      {/* Освещение в коридоре */}
      <pointLight
        position={[corridor.width / 2, wallHeight - 0.5, corridor.height / 2]}
        intensity={0.3}
        distance={corridor.width * 1.5}
        color="#ffd93d"
      />
    </group>
  );
}

export default Corridor; 