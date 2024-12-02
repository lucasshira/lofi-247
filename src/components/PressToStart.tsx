import { useEffect } from "react";
import styles from "./PressToStart.module.css";

interface PressToStartProps {
  setIsStarted: (isStarted: boolean) => void;
}

const PressToStart = ({ setIsStarted }: PressToStartProps) => {
  const pressToStart = () => {
    setIsStarted(true);
  };

  useEffect(() => {
    const handleClick = () => {
      pressToStart();
    };

    const handleKeyDown = () => {
      pressToStart();
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div onClick={pressToStart} className={styles.pressToStartContainer}>
      <p className={styles.pressToStartMessage}>press any key to start</p>
    </div>
  );
};

export default PressToStart;
