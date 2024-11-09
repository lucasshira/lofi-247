import { useState } from "react";
import Player from "./components/Player";
import PressToStart from "./components/PressToStart";

function App() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div>
      {!isStarted ? <PressToStart setIsStarted={setIsStarted} /> : <Player />}
    </div>
  );
}

export default App;
