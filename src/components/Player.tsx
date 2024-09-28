import { PlayCircle, PauseCircle, SpeakerHigh, SpeakerSimpleSlash, RewindCircle, FastForwardCircle } from "phosphor-react";
import { useRef, useState, useEffect } from "react";
import styles from './Player.module.css';

import { channels } from '../channels';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const gifs = [
    'https://media.giphy.com/media/pVGsAWjzvXcZW4ZBTE/giphy.gif',
    'https://media.giphy.com/media/ttknk7M3d3UBEeZsii/giphy.gif',
    'https://media.giphy.com/media/ssq8oGi0pPO5rMLrEV/giphy.gif',
    "https://media.giphy.com/media/v2WuhMBzb3h5e/giphy.gif",
    "https://media.giphy.com/media/E8GfFH47PKeyI/giphy.gif",
    "https://media.giphy.com/media/wjjvv8CEWSdAcdlgtP/giphy.gif",
    "https://media.giphy.com/media/xUOwGcu6wd0cXBj5n2/giphy.gif",
    "https://media.giphy.com/media/jUJgL0iByjsAS2MQH1/giphy.gif",
    "https://media.giphy.com/media/vMSXa7KFGx49aeeXhe/giphy.gif",
    "https://media.giphy.com/media/XbJYBCi69nyVOffLIU/giphy.gif",
    "https://media.giphy.com/media/RMwgs5kZqkRyhF24KK/giphy.gif",
    "https://media.giphy.com/media/l19ipdY2pjK3d8Omtz/giphy.gif",
    "https://media.giphy.com/media/84SFZf1BKgzeny1WxQ/giphy.gif",
    "https://media.giphy.com/media/dSdSQmzlJopuqueF2i/giphy.gif",
    "https://media.giphy.com/media/1zgzISaYrnMAYRJJEr/giphy.gif",
    "https://media.giphy.com/media/1fnu914Z79qQpVi2xZ/giphy.gif",
    "https://media.giphy.com/media/xTcnT45z6H5gxFYZZS/giphy.gif",
    "https://media.giphy.com/media/dvreHY4p06lzVSDrvj/giphy.gif",
    "https://media.giphy.com/media/9jwuxt5bXKadi/giphy.gif",
    "https://media.giphy.com/media/p71BYIPogqBPy/giphy.gif",
    "https://media.giphy.com/media/5ZYA31R5OP6JdmVP3f/giphy.gif",
    "https://media.giphy.com/media/orTCRDwFyW5zFHe4kS/giphy.gif",
    "https://media.giphy.com/media/2yzgWbRc97QOIUpklz/giphy.gif",
    "https://media.giphy.com/media/4DNPcZOIcgnwA/giphy.gif",
    "https://media.giphy.com/media/97e6IX0kayYTK/giphy.gif",
    "https://media.giphy.com/media/Basrh159dGwKY/giphy.gif",
    "https://media.giphy.com/media/9LZTcawH3mc8V2oUqk/giphy.gif",
    "https://media.giphy.com/media/gH1jGsCnQBiFHWMFzh/giphy.gif",
    "https://media.giphy.com/media/ZCZ7FHlu3sPek3h0zP/giphy.gif",
  ];

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledGifs = shuffleArray(gifs);

  console.log(channels)

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
        <h3 className={styles.welcomeMessage}>Chill and relax listening to some lofi sounds ツ</h3>
      </div>

      <div className={styles.playerContainer}>
        <div style={{ display: 'none' }}>
          <iframe
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${currentChannel.channel}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
            allow="autoplay"
            title={currentChannel.channelName}
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

      <div>
        <p className={styles.channelName}>
          <div className={styles.waveContainer}>
            <span className={styles.wave}>┃</span>
            <span className={styles.wave}>┃</span>
            <span className={styles.wave}>┃</span>
            <span className={styles.wave}>┃</span>
          </div>
          {currentChannel.channelName}
        </p>
      </div>
    </>
  );
}

export default Player;
