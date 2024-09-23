import { PlayCircle, PauseCircle, SpeakerHigh, SpeakerSimpleSlash, RewindCircle, FastForwardCircle } from "phosphor-react";
import { useRef, useState, useEffect } from "react";
import styles from './Player.module.css';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const channels = [
    'mwPR8aizAyo',
    '5yx6BWlEVcY',
    '7NOSDKb0HlU',
    'tNkZsRW7h2c',
    'qH3fETPsqXU'
  ];

  const gifs = [
    'https://media.giphy.com/media/pVGsAWjzvXcZW4ZBTE/giphy.gif',
    'https://media.giphy.com/media/ckr4W2ppxPBeIF8dx4/giphy.gif',
    'https://media.giphy.com/media/ttknk7M3d3UBEeZsii/giphy.gif',
    'https://media.giphy.com/media/ssq8oGi0pPO5rMLrEV/giphy.gif',
    "https://media.giphy.com/media/v2WuhMBzb3h5e/giphy.gif",
    "https://media.giphy.com/media/E8GfFH47PKeyI/giphy.gif",
    "https://media.giphy.com/media/NKEt9elQ5cR68/giphy.gif",
    "https://media.giphy.com/media/9B7XwCQZRQfQs/giphy.gif"
  ];

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledGifs = shuffleArray(gifs);

  const currentChannel = channels[currentChannelIndex];
  const currentGif = shuffledGifs[currentChannelIndex];

  useEffect(() => {
    document.body.style.background = `url('${currentGif}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannelIndex]);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      setTimeout(() => {
        setIsAnimating(true);
      }, 2000)
    } else {
      setIsAnimating(false);
    }
  }, [isPlaying, isMuted]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMuted = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: newMutedState ? 'mute' : 'unMute', args: [] }),
        '*'
      );
    }
  };

  const playChannelSwitchSound = () => {
    const audio = new Audio('/assets/channel_switch.mp3');
    audio.play();
  };

  const skipForwardButton = () => {
    playChannelSwitchSound();
    setCurrentChannelIndex((prevIndex) => (prevIndex + 1) % channels.length);
  };

  const rewindButton = () => {
    playChannelSwitchSound();
    setCurrentChannelIndex((prevIndex) => (prevIndex - 1 + channels.length) % channels.length);
  };

  return (
    <>
      <div className={styles.messageContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className={styles.musicIcon}
        >
          <path fill="purple" d="M12 3v10.55A4 4 0 1 0 14 20V7h3V3h-5z" />
        </svg>
        <h3 className={styles.welcomeMessage}>Chill and relax listening to some lofi sounds! :)</h3>
      </div>

      <div className={styles.playerContainer}>
        <div style={{ display: 'none' }}>
          <iframe
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${currentChannel}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
            frameBorder="0"
            allow="autoplay"
            title="LoFi Music Stream"
          ></iframe>
        </div>

        <div className={styles.controls}>
          {isPlaying ? (
            <PauseCircle size={26} className={styles.icon} onClick={togglePlayPause} />
          ) : (
            <PlayCircle size={26} className={styles.icon} onClick={togglePlayPause} />
          )}

          <RewindCircle size={26} className={styles.icon} onClick={rewindButton} />
          <FastForwardCircle size={26} className={styles.icon} onClick={skipForwardButton} />

          {isMuted ? (
            <SpeakerSimpleSlash size={26} className={styles.icon} onClick={toggleMuted} />
          ) : (
            <SpeakerHigh size={26} className={styles.icon} onClick={toggleMuted} />
          )}

          <div className={styles.volumeIndicator}>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className={`${styles.volumeBar} ${isAnimating && index < 10 ? styles.active : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Player;
