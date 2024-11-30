import { useRef, useState, useEffect } from "react";
import styles from "./Player.module.css";

import { channels } from "../channels";
import { gifs } from "../gifs";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const [currentVolume, setCurrentVolume] = useState(() => {
    const savedVolume = localStorage.getItem("playerVolume");
    const volume = savedVolume ? Number(savedVolume) : 100;
    if (isNaN(volume)) return 100;

    return volume;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [, setIsAnimating] = useState(false);
  const [showSwitchGif, setShowSwitchGif] = useState(false);
  const [turnOffScreen, setTurnOffScreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const channelSwitchGif =
    "https://media.giphy.com/media/3o6vXRxrhj7Ov94Gbu/giphy.gif";

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
    if (!showSwitchGif && !turnOffScreen) {
      document.body.style.background = `url('${currentGif}') no-repeat center center fixed`;
      document.body.style.backgroundSize = "cover";
    }

    if (turnOffScreen) {
      document.body.style.background = "black";
      document.body.style.backgroundSize = "cover";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannelIndex, showSwitchGif, turnOffScreen]);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      setTimeout(() => {
        setIsAnimating(true);
      }, 2000);
    } else {
      setIsAnimating(false);
    }
  }, [isPlaying, isMuted]);

  useEffect(() => {
    localStorage.setItem("playerVolume", currentVolume.toString());
  }, [currentVolume]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleVolumeClick = (index: number) => {
    const newVolume = (index + 1) * 10;
    setCurrentVolume(newVolume);

    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "setVolume",
          args: [newVolume],
        }),
        "*"
      );
    }
  };

  const toggleMuted = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: newMutedState ? "mute" : "unMute",
          args: [],
        }),
        "*"
      );
    }
  };

  const playChannelSwitchSound = () => {
    const audio = new Audio("/assets/channel_switch.mp3");
    audio.play();
  };

  const switchChannel = (newIndex: number) => {
    playChannelSwitchSound();

    setShowSwitchGif(true);
    document.body.style.background = `url('${channelSwitchGif}') no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";

    setTimeout(() => {
      setCurrentChannelIndex(newIndex);
      setShowSwitchGif(false);
    }, 200);
  };

  const skipForwardButton = () => {
    const nextIndex = (currentChannelIndex + 1) % channels.length;
    switchChannel(nextIndex);
  };

  const rewindButton = () => {
    const prevIndex =
      (currentChannelIndex - 1 + channels.length) % channels.length;
    switchChannel(prevIndex);
  };

  const toggleTurnOffScreen = () => {
    setTurnOffScreen((prev) => !prev);
  };

  return (
    <>
      <div className={styles.messageContainer}>
        <div className={styles.leftContainer}>
          <h3 className={styles.welcomeMessage}>
            A cozy soundtrack for your day – lofi hip hop, 24/7 ☕
          </h3>
        </div>

        <div className={styles.icons}>
          <svg
            onClick={toggleTurnOffScreen}
            className={styles.lamp}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13 2h-2v4h2zm2 6H9v2H7v4h2v4h6v-4h2v-4h-2zm0 2v4h-2v2h-2v-2H9v-4zM9 20h6v2H9zm14-9v2h-4v-2zM5 13v-2H1v2zm12-7h2v2h-2zm2 0h2V4h-2zM5 6h2v2H5zm0 0V4H3v2z"
            />
          </svg>

          <a
            className={styles.github}
            href="https://github.com/lucasshira"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 2h4v2H7v2H5zm0 10H3V6h2zm2 2H5v-2h2zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2zm0 0v2H7v-2zm6-12v2H9V4zm4 2h-2V4h-2V2h4zm0 6V6h2v6zm-2 2v-2h2v2zm-2 2v-2h2v2zm0 2h-2v-2h2zm0 0h2v4h-2z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className={styles.playerContainer}>
        <div style={{ display: "none" }}>
          <iframe
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${
              currentChannel.channel
            }?autoplay=${isPlaying ? 1 : 0}&mute=${
              isMuted ? 1 : 0
            }&enablejsapi=1`}
            allow="autoplay"
            title={currentChannel.channelName}
          ></iframe>
        </div>

        <div className={styles.controls}>
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              onClick={togglePlayPause}
              className={styles.icon}
            >
              <path fill="currentColor" d="M10 4H5v16h5zm9 0h-5v16h5z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              onClick={togglePlayPause}
              className={styles.icon}
            >
              <path
                fill="currentColor"
                d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2z"
              />
            </svg>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            onClick={rewindButton}
            className={styles.icon}
          >
            <path
              fill="currentColor"
              d="M6 4h2v16H6zm12 0h-2v2h-2v3h-2v2h-2v2h2v3h2v2h2v2h2z"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            onClick={skipForwardButton}
            className={styles.icon}
          >
            <path
              fill="currentColor"
              d="M6 4h2v2h2v2h2v2h2v4h-2v2h-2v2H8v2H6zm12 0h-2v16h2z"
            />
          </svg>

          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              onClick={toggleMuted}
              className={styles.icon}
            >
              <path
                fill="currentColor"
                d="M13 2h-2v2H9v2H7v2H3v8h4v2h2v2h2v2h2zM9 18v-2H7v-2H5v-4h2V8h2V6h2v12zm10-6.777h-2v-2h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2zm0 0h2v-2h-2z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              onClick={toggleMuted}
              className={styles.icon}
            >
              <path
                fill="currentColor"
                d="M11 2h2v20h-2v-2H9v-2h2V6H9V4h2zM7 8V6h2v2zm0 8H3V8h4v2H5v4h2zm0 0v2h2v-2zm10-6h-2v4h2zm2-2h2v8h-2zm0 8v2h-4v-2zm0-10v2h-4V6z"
              />
            </svg>
          )}

          <div className={styles.volumeIndicator}>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className={`${styles.volumeBar} ${
                  index < currentVolume / 10 && !isMuted ? styles.active : ""
                }`}
                onClick={() => handleVolumeClick(index)}
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
};

export default Player;
