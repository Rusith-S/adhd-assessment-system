/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "tailwindcss/tailwind.css";

const Puzzle_3 = ({ imageOptions, text, audio }) => {
  const gridSize = 3;
  const pieceSize = 150;
  const navigate = useNavigate();
  const { id: sessionId } = useParams();

  // We expect a single image URL; assign it to selectedImage.
  const selectedImage = imageOptions;

  const [pieces, setPieces] = useState([]);
  const [shuffledPieces, setShuffledPieces] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [mouseMoveTime, setMouseMoveTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const inactivityTimer = useRef(null);
  const lastMouseMoveTime = useRef(null);
  const audioRef = useRef(null);

  console.log("Puzzle_3: received selectedImage =", selectedImage);

  useEffect(() => {
    if (selectedImage) {
      generatePuzzle();
    }
  }, [selectedImage]);

  useEffect(() => {
    let interval;
    if (gameStarted) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted]);

  useEffect(() => {
    if (checkWin() && gameStarted) {
      setGameStarted(false);
      clearTimeout(inactivityTimer.current);
      handleFinish();
    }
  }, [shuffledPieces]);

  const generatePuzzle = () => {
    const tempPieces = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        tempPieces.push({
          id: row * gridSize + col,
          row,
          col,
        });
      }
    }
    const shuffled = [...tempPieces].sort(() => Math.random() - 0.5);
    setPieces(tempPieces);
    setShuffledPieces(shuffled);
  };

  // Handle game start (without audio)
  const handleStart = () => {
    setStartTime(Date.now());
    setTimer(0);
    setMoveCount(0);
    setMouseMoveTime(0);
    setGameStarted(true);
    generatePuzzle();
    resetInactivityTimer();
  };

  // Play audio on start and then start the game.
  const handleStartWithAudio = () => {
    if (audio) {
      audioRef.current = new Audio(audio);
      audioRef.current
        .play()
        .catch((err) => console.error("Audio playback failed:", err));
    }
    handleStart();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text"), 10);
    const draggedPieceIndex = shuffledPieces.findIndex(
      (p) => p.id === draggedId
    );
    const targetPieceIndex = shuffledPieces.findIndex((p) => p.id === targetId);

    if (draggedPieceIndex !== targetPieceIndex) {
      setMoveCount((prevCount) => prevCount + 1);
    }

    const newShuffledPieces = [...shuffledPieces];
    [
      newShuffledPieces[draggedPieceIndex],
      newShuffledPieces[targetPieceIndex],
    ] = [
      newShuffledPieces[targetPieceIndex],
      newShuffledPieces[draggedPieceIndex],
    ];
    setShuffledPieces(newShuffledPieces);
    resetInactivityTimer();
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text", id);
  };

  const checkWin = () => {
    return shuffledPieces.every(
      (piece, index) => piece.id === pieces[index].id
    );
  };

  // Update puzzle records after finishing
  const updatePuzzleRecords = async (completionTime) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "Authentication required!", "error");
      return;
    }
    try {
      const newRecord = {
        puzzleId: 1,
        moveCount: moveCount,
        completionTime,
        mouseMovementTime: (mouseMoveTime / 1000).toFixed(2),
        puzzleType: "easy",
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}game/puzzle-records/${sessionId}`,
        { puzzleRecords: [newRecord] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        title: "Congratulations!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(`/game-map/${sessionId}`);
      });
    } catch (error) {
      console.error("Error updating puzzle records:", error);
      Swal.fire("Error", "Failed to update puzzle records.", "error");
    }
  };

  const handleFinish = () => {
    const completionTime = (Date.now() - startTime) / 1000;
    clearTimeout(inactivityTimer.current);
    updatePuzzleRecords(completionTime);
    // Stop audio playback if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Track mouse movement only when active (elapsed < 200ms)
  const handleMouseMove = () => {
    const now = Date.now();
    if (!lastMouseMoveTime.current) {
      lastMouseMoveTime.current = now;
      return;
    }
    const elapsed = now - lastMouseMoveTime.current;
    if (elapsed < 200) {
      setMouseMoveTime((prev) => prev + elapsed);
    }
    lastMouseMoveTime.current = now;
    resetInactivityTimer();
  };

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    if (gameStarted) {
      inactivityTimer.current = setTimeout(() => {
        Swal.fire({
          title: "Are you still playing?",
          text: "You haven't moved for 20 seconds!",
          icon: "warning",
          confirmButtonText: "Continue",
        }).then(() => {
          resetInactivityTimer();
        });
      }, 20000);
    }
  };

  if (!selectedImage) {
    return <p>Image not available.</p>;
  }

  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove}>
      {/* Start Game Dialog */}
      {!gameStarted && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 text-lg bg-black bg-opacity-50 backdrop-blur-lg rounded-lg overflow-hidden ">
          <h2 className="text-3xl font-bold mb-4 text-blue-500">
            Puzzle Game | Level Easy
          </h2>
          <button
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleStartWithAudio}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Timer */}
      {gameStarted && (
        <div className="flex w-full justify-between">
          <div className="bg-blue-600 text-white px-4 py-2 rounded">
            ⏳ Time: {timer} sec
          </div>
          <div className="bg-red-600 text-white px-4 py-2 rounded">
            🖱️ Active Move Time: {(mouseMoveTime / 1000).toFixed(2)} sec
          </div>
        </div>
      )}

      {/* Two Columns: Left side displays the original complete image; right side displays shuffled puzzle */}
      <div className="flex flex-row gap-8">
        {/* Left column: Original Completed Photo */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-2">Completed Puzzle</h3>
          <div
            className="border border-gray-400"
            style={{
              width: gridSize * pieceSize,
              height: gridSize * pieceSize,
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: `${gridSize * pieceSize}px ${
                gridSize * pieceSize
              }px`,
            }}
          ></div>
        </div>

        {/* Right column: Shuffled Puzzle */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-2">Shuffled Puzzle</h3>
          <div
            className="grid grid-cols-3 gap-1 border border-gray-400"
            style={{ width: gridSize * pieceSize }}
          >
            {shuffledPieces.map((piece) => (
              <div
                key={piece.id}
                className="border border-gray-300 bg-cover"
                draggable
                onDragStart={(e) => handleDragStart(e, piece.id)}
                onDrop={(e) => handleDrop(e, piece.id)}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  width: pieceSize,
                  height: pieceSize,
                  backgroundImage: `url(${selectedImage})`,
                  backgroundPosition: `-${piece.col * pieceSize}px -${
                    piece.row * pieceSize
                  }px`,
                  backgroundSize: `${gridSize * pieceSize}px ${
                    gridSize * pieceSize
                  }px`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-lg bg-white bg-opacity-50 backdrop-blur-lg rounded-lg overflow-hidden p-4 mx-10 mt-4">
        {text}
      </div>
    </div>
  );
};

export default Puzzle_3;
