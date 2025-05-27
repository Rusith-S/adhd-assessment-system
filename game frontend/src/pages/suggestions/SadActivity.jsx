import { useState } from "react";
import ActivityCard from "../../components/suggestion/ActivityCard";
import PopupModel from "../../components/suggestion/PopupModel";
import gentleRocking from "./../../assets/activity/sad/gentleRocking.png";
import handmassage from "./../../assets/activity/sad/handmassage.png";
import listeningtonature from "./../../assets/activity/sad/listeningtonature.png";
import lookatphoto from "./../../assets/activity/sad/lookatphoto.png";
import namehappythings from "./../../assets/activity/sad/namehappythings.png";
import warmhug from "./../../assets/activity/sad/warmhug.png";

// Sample data for the activities
const activities = [
  {
    title: "Bubble Breathing",
    duration: "5–10 mins",
    description:
      "Blow soap bubbles slowly to regulate breathing and calm down.",
    image: gentleRocking,
    instructions:
      "1. Give the child a bottle of soap bubbles.\n" +
      "2. Ask them to blow slowly, making big, gentle bubbles.\n" +
      "3. Tell them to watch the bubbles float and pop.\n" +
      "4. Repeat until they feel calmer.",
  },
  {
    title: "Squeeze a Soft Toy",
    duration: "2–3 mins",
    description: "Help release frustration through controlled squeezing.",
    image: handmassage,
    instructions:
      "1. Give them a squeezable stress ball or soft toy.\n" +
      "2. Ask them to squeeze hard for five seconds, then release.\n" +
      "3. Repeat five times to release frustration.",
  },
  {
    title: "Walk in Place",
    duration: "1–2 mins",
    description: "Engage in gentle movement to release energy.",
    image: listeningtonature,
    instructions:
      "1. Ask the child to stand up and walk in place.\n" +
      "2. Guide them to increase and decrease the speed gradually.\n" +
      "3. Continue for 1–2 minutes to help release energy.",
  },
  {
    title: "Water Play",
    duration: "5 mins",
    description: "Soothing water movement can provide relaxation.",
    image: lookatphoto,
    instructions:
      "1. Provide a small bowl of lukewarm water.\n" +
      "2. Let them swirl their hands inside the water.\n" +
      "3. Ask them to focus on the movement and sound.",
  },
  {
    title: "Count to 10 Slowly",
    duration: "2–3 mins",
    description: "Slow counting helps calm the mind and body.",
    image: namehappythings,
    instructions:
      "1. Sit with the child and hold their hands gently.\n" +
      '2. Count slowly together, stretching each number ("Oooone… Twwwwo…").\n' +
      "3. Encourage them to close their eyes while counting.",
  },
  {
    title: "Color a Mandala",
    duration: "5–10 mins",
    description: "Encourage mindfulness and creativity through coloring.",
    image: warmhug,
    instructions:
      "1. Give them a simple circular mandala coloring page.\n" +
      "2. Offer soft-colored crayons or markers.\n" +
      "3. Encourage slow, smooth coloring instead of scribbling.",
  },
  {
    title: "Warm Hug",
    duration: "10+ secs",
    description: "A long, firm hug provides comfort and security.",
    image: warmhug,
    instructions:
      "1. Approach the child gently and ask if they want a hug.\n" +
      "2. If they agree, give them a long, firm hug (10+ seconds).\n" +
      '3. Use soft, reassuring words ("I’m here for you.").',
  },
  {
    title: "Listening to Nature Sounds",
    duration: "5 mins",
    description: "Nature sounds can create a peaceful environment.",
    image: listeningtonature,
    instructions:
      "1. Play soft bird chirping, rain sounds, or ocean waves.\n" +
      "2. Ask them to close their eyes and describe what they hear.",
  },
];

// Main page component
const SadActivity = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleShowInstructions = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold">
            Emotion: Sad (Low Energy, Unmotivated)
          </h1>
          <p className="text-lg text-gray-600 mt-6">
            Goal: Uplift the child mood before game engagement
          </p>
        </div>
        {/* Activities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity, index) => (
            <ActivityCard
              key={index}
              activity={activity}
              onShowInstructions={handleShowInstructions}
            />
          ))}
        </div>
      </div>
      {/* Modal for instructions */}
      {selectedActivity && (
        <PopupModel activity={selectedActivity} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SadActivity;
