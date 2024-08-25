import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Canvas = ({ bgImage }) => {
  const minScale = 0.05; // Minimum zoom scale (5%)
  const maxScale = 2; // Maximum zoom scale (200%)
  const initialScale = 0.1; // Initial zoom level (10% equivalent to 0.1 scale)

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(initialScale * 100); // Convert scale to percentage
  const transformRef = useRef(null);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleZoomChange = (scale) => {
    setZoomLevel(scale * 100);
  };

  const handleZoomIn = () => {
    if (transformRef.current) {
      transformRef.current.zoomIn();
    }
  };
  function handleTransform(e) {
    // console.log("test>", e.instance.transformState.scale); // output scale factor
    const newScale = transformRef.current.instance.transformState.scale;
    setZoomLevel(newScale * 100);
  }
  const handleZoomOut = () => {
    if (transformRef.current) {
      transformRef.current.zoomOut();
    }
  };

  const toggleFullScreen = () => {
    const canvasElement = document.getElementById("canvas-container");
    if (!document.fullscreenElement) {
      canvasElement.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      id="canvas-container"
      className="relative cursor-grab mx-auto mt-8 overflow-hidden rounded-3xl bg-zinc-200 w-full h-[40rem]"
    >
      <TransformWrapper
        key={1}
        ref={transformRef}
        initialScale={initialScale}
        initialPositionX={150}
        initialPositionY={50}
        minScale={minScale}
        maxScale={maxScale}
        centerOnInit={false}
        centerZoomedOut={false}
        limitToBounds={false}
        smooth={true}
        wheel={{ step: 0.01 }}
        zoomAnimation={{
          animationTime: 300,
          animationType: "ease-in-out",
        }}
        onTransformed={(e) => handleTransform(e)}
        onZoom={(ref) => handleZoomChange(ref.state.scale)}
      >
        {() => (
          <TransformComponent
            wrapperClass="w-full h-full flex items-center justify-center"
            contentClass="flex items-center justify-center w-full h-full"
          >
            <Draggable bounds="parent" position={position} onDrag={handleDrag}>
              <img
                src={bgImage}
                alt="Draggable Content"
                className="cursor-move max-w-none"
              />
            </Draggable>
          </TransformComponent>
        )}
      </TransformWrapper>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-4 bg-zinc-800 text-white p-2 rounded shadow-lg">
        <button
          className="hidden  px-2 py-1 rounded hover:bg-zinc-700"
          onClick={handleZoomOut}
        >
          -
        </button>
        <span className="text-sm font-medium">{Math.round(zoomLevel)}%</span>
        <button
          className="hidden   px-2 py-1 rounded hover:bg-zinc-700"
          onClick={handleZoomIn}
        >
          +
        </button>
        <button
          className="px-2 py-1 rounded hover:bg-zinc-700"
          onClick={toggleFullScreen}
        >
          Full Screen
        </button>
      </div>
    </div>
  );
};

export default Canvas;
