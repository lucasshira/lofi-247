import { Play, Pause, SpeakerHigh, SpeakerSimpleSlash } from "phosphor-react";
import { useState, useEffect } from "react";
import styles from './Player.module.css';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audio] = useState(new Audio('caminho/para/sua/musica.mp3'));

  useEffect(() => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.muted = isMuted;
    if (isMuted) {
      setVolume(0);
    } else {
      audio.volume = volume;
    }
  }, [isMuted, audio, volume]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  }

  const toggleMuted = () => {
    setIsMuted(prev => !prev);
    setVolume(0);
  }

  const handleVolumeChange = (e: any) => {
    const newVolume = e.target.value;
    setVolume(newVolume);

    // Desmutar se o volume não for 0
    if (newVolume > 0) {
      setIsMuted(false);
    }
  }

  return (
    <div className={styles.playerContainer}>
      {isPlaying ? (
        <Pause size={22} className={styles.icon} onClick={togglePlayPause} />
      ) : (
        <Play size={22} className={styles.icon} onClick={togglePlayPause} />
      )}

      {isMuted ? (
        <SpeakerSimpleSlash size={22} className={styles.icon} onClick={toggleMuted} />
      ) : (
        <SpeakerHigh size={22} className={styles.icon} onClick={toggleMuted} />
      )}

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className={styles.volumeSlider}
      />
    </div>
  );
}

export default Player;