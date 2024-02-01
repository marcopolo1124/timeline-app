import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Timeline.css";

const trackWidth = 100;
const panSpeed = 20;

const defaultArr = [
  { x1: 0, y1: 0, x2: 1000, y2: 58, clip: "clip1" },
  { x1: 1000, y1: 100, x2: 1400, y2: 135, clip: "clip2" },
  { x1: 1400, y1: 200, x2: 2000, y2: 229, clip: "clip5" },
  { x1: 2000, y1: 100, x2: 2300, y2: 144, clip: "clip4" },
  { x1: 2300, y1: 0, x2: 3000, y2: 61, clip: "clip3" },
  { x1: 3000, y1: 200, x2: 4818, y2: 267, clip: "clip2" },
];

const colorMap = {
  clip1: "green",
  clip2: "red",
  clip3: "cyan",
  clip4: "yellow",
  clip5: "purple",
};

export function TimeLine() {
  // const [time, setTime] = useState(0.0);
  const [drawClip, setDrawClip] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState(defaultArr);
  const [panOffset, setPanOffset] = useState(0);
  const [scale, setScale] = useState(1);

  let playheadRef = useRef(null);
  let containerRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mouseup", () => {
      setIsDragging(false);
    });

    return () => {
      window.removeEventListener("mouseup", window);
    };
  }, []);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.scale(scale, 1);

    ctx.translate(panOffset, 0);
    for (const { x1, y1, x2, clip } of elements) {
      ctx.fillStyle = colorMap[clip];
      ctx.fillRect(x1, y1, x2 - x1, 100);
    }
    ctx.restore();
  }, [elements, panOffset, scale]);

  return (
    <>
      <button onClick={() => setDrawClip("clip1")}>clip1</button>
      <button onClick={() => setDrawClip("clip2")}>clip2</button>
      <button onClick={() => setDrawClip("clip3")}>clip3</button>
      <button onClick={() => setDrawClip("clip4")}>clip4</button>
      <button onClick={() => setDrawClip("clip5")}>clip5</button>
      <button onClick={() => setDrawClip(null)}>none</button>

      <button onClick={() => setElements([])}>Reset</button>

      <input
        type="range"
        min={0.5}
        max={10}
        step={0.1}
        defaultValue={1}
        onChange={(e) => {
          setScale(e.target.value);
        }}
      ></input>
      <div
        className="timeline"
        ref={containerRef}
        onScroll={(e) => {}}
        onMouseMove={(e) => {
          if (isDragging) {
            // console.log(isDragging);
            playheadRef.current.style.left = `${e.clientX}px`;
          }
        }}
      >
        <canvas
          id="canvas"
          width={window.innerWidth}
          height="300px"
          tabIndex={1}
          onKeyDown={(e) => {
            const speed = panSpeed / scale;
            console.log({ speed, scale });
            if (e.key === "ArrowRight") {
              setPanOffset((prev) => prev - speed);
            }
            if (e.key === "ArrowLeft") {
              setPanOffset((prev) => Math.min(prev + speed, 0));
            }
          }}
          onMouseDown={(e) => {
            if (!drawClip) {
              return;
            }
            const { clientX, clientY } = e;
            const rect = e.target.getBoundingClientRect();
            const x = (clientX - panOffset * scale) / scale - rect.left;
            let y = clientY - rect.top;

            y = Math.floor(y / trackWidth) * trackWidth;

            const element = createElement(x, y, x, y);
            setElements((prev) => [...prev, element]);
            setIsDrawing(true);
            console.log(elements);
          }}
          onMouseUp={() => {
            setIsDrawing(false);
          }}
          onMouseMove={(e) => {
            if (!isDrawing) {
              return;
            }
            const { clientX, clientY } = e;
            const rect = e.target.getBoundingClientRect();

            setElements((prev) => {
              let copy = [...prev];
              if (copy.length === 0) return;

              let { x1, y1 } = copy[copy.length - 1];
              copy[copy.length - 1] = createElement(
                x1,
                y1,
                (clientX - panOffset * scale) / scale - rect.left,
                clientY - rect.top,
                drawClip
              );
              return copy;
            });
            console.log(elements);
          }}
        ></canvas>
        <div
          ref={playheadRef}
          className="playhead"
          onMouseDown={() => {
            if (!drawClip) {
              setIsDragging(true);
            }
          }}
          onMouseUp={() => {
            setIsDragging(false);
          }}
        ></div>
      </div>
    </>
  );
}

function createElement(x1, y1, x2, y2, clip) {
  return { x1, y1, x2, y2, clip };
}

function getMouseCoords(x, y, panOffset, scale) {
  return { x: (x - panOffset) * scale, y };
}
