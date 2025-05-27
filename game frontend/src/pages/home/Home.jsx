import { useNavigate } from "react-router-dom";
import card1 from "../../assets/home/card1.png";
import card2 from "../../assets/home/card2.png";
import background from "./../../assets/public/background.png";

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Emotion Detection",
      image: card1,
      description:
        "Ensure your child's emotional state is optimal before engaging in the puzzle game. Explore emotion-specific activities that help regulate their mood.",
      navigateTo: "/emotion-starting-game",
    },
    {
      title: "Child Emotion History",
      image: card2,
      description:
        "View your child's past emotional records and gain insights into their emotional journey.",
      navigateTo: "/emotion-records",
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-28">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-50 backdrop-blur-lg shadow-lg rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
            onClick={() => navigate(card.navigateTo)}
          >
            <img
              src={card.image}
              alt={card.title}
              className="h-96 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{card.title}</h2>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
