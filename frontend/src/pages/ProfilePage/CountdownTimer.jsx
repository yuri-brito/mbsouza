import React, { useState, useEffect } from "react";

function CountdownTimer({ initialSeconds }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Limpa o intervalo quando o componente é desmontado ou quando o tempo chega a zero
      return () => clearInterval(interval);
    }
  }, [seconds]);
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
  return (
    <div>
      <p style={{ fontSize: 12 }}>Tempo restante: {formatTime(seconds)}</p>
    </div>
  );
}

export default CountdownTimer;
