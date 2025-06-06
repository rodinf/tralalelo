class AudioManager {
  constructor() {
    this.backgroundMusic = null;
    this.isPlaying = false;
  }

  loadBackgroundMusic(audioPath) {
    try {
      this.backgroundMusic = new Audio(audioPath);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.5;
      
      // Add event listeners for load success/failure
      this.backgroundMusic.addEventListener('canplaythrough', () => {
        console.log('Background music loaded successfully:', audioPath);
      });
      
      this.backgroundMusic.addEventListener('error', (e) => {
        console.error('Failed to load audio file. Please make sure crocodildo.mp3 exists in the public folder:', e);
      });
      
      console.log('Attempting to load background music:', audioPath);
    } catch (error) {
      console.error('Failed to create audio object:', error);
    }
  }

  playBackgroundMusic() {
    if (this.backgroundMusic && !this.isPlaying) {
      this.backgroundMusic.play()
        .then(() => {
          this.isPlaying = true;
          console.log('Background music started');
        })
        .catch(error => {
          console.error('Failed to play background music. Make sure crocodildo.mp3 exists in the public folder:', error);
        });
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic && this.isPlaying) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isPlaying = false;
      console.log('Background music stopped');
    }
  }

  setVolume(volume) {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// Create a singleton instance
const audioManager = new AudioManager();

export default audioManager; 