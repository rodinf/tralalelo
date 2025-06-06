import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  playerPosition: { x: 0, z: 0 },
  currentRoom: 0,
  visitedRooms: new Set([0]),
  gameWon: false,
  doors: {},
  level: null,
  playerHealth: 100
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PLAYER_POSITION':
      return {
        ...state,
        playerPosition: action.payload
      };
    
    case 'SET_CURRENT_ROOM':
      return {
        ...state,
        currentRoom: action.payload,
        visitedRooms: new Set([...state.visitedRooms, action.payload])
      };
    
    case 'TOGGLE_DOOR':
      return {
        ...state,
        doors: {
          ...state.doors,
          [action.payload]: !state.doors[action.payload]
        }
      };
    
    case 'SET_LEVEL':
      // TEMPORARILY open all doors for testing
      const doors = {};
      if (action.payload && action.payload.doors) {
        action.payload.doors.forEach(door => {
          doors[door.id] = true; // TEMP: All doors open for testing
        });
      }
      return {
        ...state,
        level: action.payload,
        doors: doors
      };
    
    case 'WIN_GAME':
      return {
        ...state,
        gameWon: true
      };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        visitedRooms: new Set([0])
      };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 