// Генератор уровней для коридорного шутера Wolfenstein 3D
export class LevelGenerator {
  constructor() {
    this.rooms = [];
    this.corridors = [];
    this.doors = [];
    this.corridorWidth = 3;
    this.roomWidth = 10;
    this.roomHeight = 8;
    this.corridorSegmentLength = 6;
    this.numRooms = 5;
  }

  generate() {
    this.createRandomLevel();
    const firstRoom = this.rooms[0];
    return {
      rooms: this.rooms,
      corridors: this.corridors,
      doors: this.doors,
      startPosition: { 
        x: firstRoom.x + firstRoom.width / 2, 
        z: firstRoom.z + firstRoom.height / 2 
      }, // Начинаем в центре первой комнаты
      exitRoom: this.rooms.find(r => r.isExit)?.id || 0
    };
  }

    createRandomLevel() {
    this.rooms = [];
    this.corridors = [];
    this.doors = [];
    
    // Позиция для первой комнаты
    let roomPositions = [{ x: 0, z: 0 }];
    
    // Создаем первую комнату
    const firstRoom = {
      id: 0,
      x: -this.roomWidth / 2,
      z: -this.roomHeight / 2,
      width: this.roomWidth,
      height: this.roomHeight,
      isExit: this.numRooms === 1,
      hasEnemies: false,
      hasLoot: Math.random() > 0.6,
      hasPassageNorth: false,
      hasPassageSouth: false,
      hasPassageEast: false,
      hasPassageWest: false
    };
    
    this.rooms.push(firstRoom);
    console.log(`Создана первая комната 0: x=${firstRoom.x}, z=${firstRoom.z}`);
    
    // Создаем остальные комнаты и коридоры
    for (let i = 1; i < this.numRooms; i++) {
      const prevRoom = this.rooms[i - 1];
      
      // Выбираем случайное направление
      const directions = ['north', 'south', 'east', 'west'];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      // Вычисляем позицию новой комнаты
      let newRoomPos;
      switch (direction) {
        case 'north':
          newRoomPos = {
            x: prevRoom.x,
            z: prevRoom.z + prevRoom.height + this.corridorSegmentLength
          };
          break;
        case 'south':
          newRoomPos = {
            x: prevRoom.x,
            z: prevRoom.z - this.roomHeight - this.corridorSegmentLength
          };
          break;
        case 'east':
          newRoomPos = {
            x: prevRoom.x + prevRoom.width + this.corridorSegmentLength,
            z: prevRoom.z
          };
          break;
        case 'west':
          newRoomPos = {
            x: prevRoom.x - this.roomWidth - this.corridorSegmentLength,
            z: prevRoom.z
          };
          break;
      }
      
      // Создаем новую комнату
      const newRoom = {
        id: i,
        x: newRoomPos.x,
        z: newRoomPos.z,
        width: this.roomWidth,
        height: this.roomHeight,
        isExit: i === this.numRooms - 1,
        hasEnemies: i < this.numRooms - 1 && Math.random() > 0.4,
        hasLoot: Math.random() > 0.6,
        hasPassageNorth: false,
        hasPassageSouth: false,
        hasPassageEast: false,
        hasPassageWest: false
      };
      
      this.rooms.push(newRoom);
      console.log(`Создана комната ${i}: x=${newRoom.x}, z=${newRoom.z}, направление=${direction}`);
      
      // Создаем коридор между комнатами
      let corridor;
      switch (direction) {
        case 'north':
          corridor = {
            id: `corridor-${i}`,
            x: prevRoom.x + (prevRoom.width - this.corridorWidth) / 2,
            z: prevRoom.z + prevRoom.height,
            width: this.corridorWidth,
            height: this.corridorSegmentLength,
            direction: direction
          };
          break;
        case 'south':
          corridor = {
            id: `corridor-${i}`,
            x: prevRoom.x + (prevRoom.width - this.corridorWidth) / 2,
            z: newRoom.z + newRoom.height,
            width: this.corridorWidth,
            height: this.corridorSegmentLength,
            direction: direction
          };
          break;
        case 'east':
          corridor = {
            id: `corridor-${i}`,
            x: prevRoom.x + prevRoom.width,
            z: prevRoom.z + (prevRoom.height - this.corridorWidth) / 2,
            width: this.corridorSegmentLength,
            height: this.corridorWidth,
            direction: direction
          };
          break;
        case 'west':
          corridor = {
            id: `corridor-${i}`,
            x: newRoom.x + newRoom.width,
            z: prevRoom.z + (prevRoom.height - this.corridorWidth) / 2,
            width: this.corridorSegmentLength,
            height: this.corridorWidth,
            direction: direction
          };
          break;
      }
      
      this.corridors.push(corridor);
      console.log(`Создан коридор ${corridor.id}: направление=${direction}, x=${corridor.x}, z=${corridor.z}, w=${corridor.width}, h=${corridor.height}`);
      
             // СНАЧАЛА устанавливаем проходы в комнатах
       this.setRoomPassage(prevRoom, direction, true);
       this.setRoomPassage(newRoom, this.getOppositeDirection(direction), true);
       
       console.log(`Установлены проходы: комната ${prevRoom.id} - ${direction}, комната ${newRoom.id} - ${this.getOppositeDirection(direction)}`);
       
       // ПОТОМ создаем двери В ЭТИХ ПРОХОДАХ
       const door1Pos = this.getDoorPositionForRoom(prevRoom, direction);
       const door1 = {
         id: `door-${prevRoom.id}-${direction}`,
         position: door1Pos,
         direction: direction,
         connectsFrom: `room-${prevRoom.id}`,
         connectsTo: corridor.id,
         type: 'room-to-corridor'
       };
       this.doors.push(door1);
       
       const door2Pos = this.getDoorPositionForRoom(newRoom, this.getOppositeDirection(direction));
       const door2 = {
         id: `door-${newRoom.id}-${this.getOppositeDirection(direction)}`,
         position: door2Pos,
         direction: this.getOppositeDirection(direction),
         connectsFrom: corridor.id,
         connectsTo: `room-${newRoom.id}`,
         type: 'corridor-to-room'
       };
       this.doors.push(door2);
       
       console.log(`Созданы двери: ${door1.id} в (${door1.position.x}, ${door1.position.z}) и ${door2.id} в (${door2.position.x}, ${door2.position.z})`);
    }
    
    // В конце генерации выводим информацию о всех комнатах и их проходах
    console.log("=== ИТОГОВАЯ ИНФОРМАЦИЯ О КОМНАТАХ ===");
    this.rooms.forEach(room => {
      console.log(`Комната ${room.id} на (${room.x}, ${room.z}):`);
      console.log(`  Север: ${room.hasPassageNorth}`);
      console.log(`  Юг: ${room.hasPassageSouth}`);
      console.log(`  Восток: ${room.hasPassageEast}`);
      console.log(`  Запад: ${room.hasPassageWest}`);
    });
  }
  
  getOppositeDirection(direction) {
    const opposites = {
      'north': 'south',
      'south': 'north',
      'east': 'west',
      'west': 'east'
    };
    return opposites[direction];
  }
  
  setRoomPassage(room, direction, value) {
    switch (direction) {
      case 'north':
        room.hasPassageNorth = value;
        break;
      case 'south':
        room.hasPassageSouth = value;
        break;
      case 'east':
        room.hasPassageEast = value;
        break;
      case 'west':
        room.hasPassageWest = value;
        break;
    }
    console.log(`Комната ${room.id}: проход ${direction} = ${value}`);
  }
  
  getDoorPositionForRoom(room, direction) {
    const centerX = room.x + room.width / 2;
    const centerZ = room.z + room.height / 2;
    
    switch (direction) {
      case 'north':
        return { x: centerX, z: room.z + room.height };
      case 'south':
        return { x: centerX, z: room.z };
      case 'east':
        return { x: room.x + room.width, z: centerZ };
      case 'west':
        return { x: room.x, z: centerZ };
      default:
        return { x: centerX, z: centerZ };
    }
  }

  
}

export function generateLevel() {
  const generator = new LevelGenerator();
  return generator.generate();
} 