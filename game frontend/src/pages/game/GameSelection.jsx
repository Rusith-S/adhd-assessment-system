import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import game1 from "./../../assets/games/game1.png";
import game2 from "./../../assets/games/game2.png";
import game3 from "./../../assets/games/game3.png";
import background from "./../../assets/public/background.png";

const GameSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const gameOptions = [
    { id: "game1", name: "Story 1: Benji the Curious Bunny", image: game1 },
    { id: "game2", name: "Story 2: Luna and the Secret Garden", image: game2 },
    { id: "game3", name: "Story 3: Max and the Magic Compass", image: game3 },
  ];

  // Only "7 Days" is allowed.
  const planOptions = ["7 Days", "14 Days", "21 Days"];

  const handleSubmit = async () => {
    if (!selectedGame || !selectedPlan) {
      Swal.fire({
        icon: "error",
        title: "Selection Required",
        text: "Please select both a game and a plan type!",
      });
      return;
    }

    // Validate: Only "7 Days" is allowed.
    if (selectedPlan !== "7 Days") {
      Swal.fire({
        icon: "error",
        title: "Invalid Plan",
        text: "Only 7 Days plan is allowed!",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}game/${id}`,
        { gameName: selectedGame, planType: selectedPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Game Session Updated",
        text: "Your game session has been successfully updated!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/game-map/${id}`);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update the game session. Please try again.",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 p-10"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white bg-opacity-50 backdrop-blur-lg max-w-4xl mx-auto p-6 shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Select Your Game & Plan
        </h2>

        {/* Game Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gameOptions.map((game) => (
            <label
              key={game.id}
              className="cursor-pointer flex flex-col items-center p-4 border rounded-lg hover:shadow-lg transition"
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                type="radio"
                name="game"
                value={game.name}
                checked={selectedGame === game.name}
                onChange={() => setSelectedGame(game.name)}
                className="mt-2"
              />
              <span className="mt-2 text-sm font-medium">{game.name}</span>
            </label>
          ))}
        </div>

        {/* Plan Selection */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Choose Your Plan:</h3>
          <div className="flex gap-2">
            {planOptions.map((plan) => (
              <label
                key={plan}
                className="cursor-pointer flex items-center gap-2 p-2 border rounded-lg hover:shadow-md transition w-full justify-center"
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan}
                  checked={selectedPlan === plan}
                  onChange={() => setSelectedPlan(plan)}
                  disabled={plan !== "7 Days"} // Disable 14 Days & 21 Days
                />
                <span>{plan}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameSelection;
