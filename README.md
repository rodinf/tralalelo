# Wolfenstein 3D Style Game

A 3D first-person arcade game built with React and Three.js, inspired by Wolfenstein 3D.

## Features

- 🎮 **3D First-Person View**: Navigate through rooms and corridors in true 3D
- 🏗️ **Procedural Level Generation**: Randomly generated rooms and corridors for endless replayability
- 🚪 **Interactive Doors**: Open and close doors with the E key
- 🎯 **Goal-Based Gameplay**: Find the glowing exit portal to win
- 🎵 **Background Music**: Atmospheric music during gameplay
- 🔍 **Collision Detection**: Realistic wall and door collision system
- 🗺️ **Minimap**: Keep track of your location (if implemented)

## Controls

- **WASD** or **Arrow Keys**: Move around
- **Mouse**: Look around (first-person view)
- **E**: Interact with doors and activate exit portal
- **Click**: Lock/unlock pointer (for mouse look)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fedorrodin/tralalelo.git
cd tralalelo
```

2. Install dependencies:
```bash
npm install
```

3. Add your music file:
   - Place `crocodildo.mp3` in the `public/` folder for background music

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to play the game

## Building for Production

To create a production build:

```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured for GitHub Pages deployment:

1. Make sure you have a GitHub repository set up
2. Update the `homepage` field in `package.json` to match your GitHub Pages URL
3. Deploy with:

```bash
npm run deploy
```

The game will be available at: `https://username.github.io/tralalelo`

## Technology Stack

- **React 18.2.0**: UI framework
- **Three.js 0.160.0**: 3D graphics library
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components for react-three-fiber

## Project Structure

```
src/
├── components/          # React components
│   ├── Game.js         # Main game component
│   ├── Player.js       # Player movement and collision
│   ├── Room.js         # Room rendering with walls
│   ├── Door.js         # Interactive door component
│   ├── Level.js        # Level container
│   └── ExitPortal.js   # Victory condition
├── context/            # React context for game state
├── utils/              # Utility functions
│   ├── levelGenerator.js  # Procedural level generation
│   └── AudioManager.js    # Background music management
└── App.js              # Main app component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE). 