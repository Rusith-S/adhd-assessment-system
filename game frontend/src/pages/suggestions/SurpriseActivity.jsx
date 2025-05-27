import { useState } from "react";
import ActivityCard from "../../components/suggestion/ActivityCard";
import PopupModel from "../../components/suggestion/PopupModel";

// Sample data for the activities
const activities = [
  {
    title: "Bubble Breathing",
    duration: "5–10 mins",
    description:
      "Blow soap bubbles slowly to regulate breathing and calm down.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg?t=st=1741843230~exp=1741846830~hmac=64f1a4bb40accb3a4224ada5fb77ad8bd5724083351d3dc474e93ac8e9ba1716&w=900",
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
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg?t=st=1741843230~exp=1741846830~hmac=64f1a4bb40accb3a4224ada5fb77ad8bd5724083351d3dc474e93ac8e9ba1716&w=900",
    instructions:
      "1. Give them a squeezable stress ball or soft toy.\n" +
      "2. Ask them to squeeze hard for five seconds, then release.\n" +
      "3. Repeat five times to release frustration.",
  },
  {
    title: "Walk in Place",
    duration: "1–2 mins",
    description: "Engage in gentle movement to release energy.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg?t=st=1741843230~exp=1741846830~hmac=64f1a4bb40accb3a4224ada5fb77ad8bd5724083351d3dc474e93ac8e9ba1716&w=900",
    instructions:
      "1. Ask the child to stand up and walk in place.\n" +
      "2. Guide them to increase and decrease the speed gradually.\n" +
      "3. Continue for 1–2 minutes to help release energy.",
  },
  {
    title: "Water Play",
    duration: "5 mins",
    description: "Soothing water movement can provide relaxation.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg?t=st=1741843230~exp=1741846830~hmac=64f1a4bb40accb3a4224ada5fb77ad8bd5724083351d3dc474e93ac8e9ba1716&w=900",
    instructions:
      "1. Provide a small bowl of lukewarm water.\n" +
      "2. Let them swirl their hands inside the water.\n" +
      "3. Ask them to focus on the movement and sound.",
  },
  {
    title: "Count to 10 Slowly",
    duration: "2–3 mins",
    description: "Slow counting helps calm the mind and body.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg?t=st=1741843230~exp=1741846830~hmac=64f1a4bb40accb3a4224ada5fb77ad8bd5724083351d3dc474e93ac8e9ba1716&w=900",
    instructions:
      "1. Sit with the child and hold their hands gently.\n" +
      '2. Count slowly together, stretching each number ("Oooone… Twwwwo…").\n' +
      "3. Encourage them to close their eyes while counting.",
  },
  {
    title: "Color a Mandala",
    duration: "5–10 mins",
    description: "Encourage mindfulness and creativity through coloring.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg?t=st=1741843230~exp=1741846830~hmac=64f1a4bb40accb3a4224ada5fb77ad8bd5724083351d3dc474e93ac8e9ba1716&w=900",
    instructions:
      "1. Give them a simple circular mandala coloring page.\n" +
      "2. Offer soft-colored crayons or markers.\n" +
      "3. Encourage slow, smooth coloring instead of scribbling.",
  },
  {
    title: "Holding a Familiar Object",
    duration: "5 mins",
    description: "Holding a favorite toy or blanket can provide comfort.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg",
    instructions:
      "1. Give them their favorite stuffed toy, blanket, or small pillow.\n" +
      "2. Encourage them to hug or hold it tightly.",
  },
  {
    title: "Soft Music or Lullaby",
    duration: "5 mins",
    description: "Calming music helps soothe emotions.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg",
    instructions:
      "1. Play or hum a slow, relaxing tune (e.g., lullaby).\n" +
      "2. Keep the volume low and sing softly if needed.",
  },
  {
    title: "Talk in a Soft Voice",
    duration: "2–3 mins",
    description: "A gentle voice provides reassurance.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg",
    instructions:
      "1. Use a slow, reassuring tone.\n" +
      "2. Say, 'You are safe. I am here. Everything is okay.'",
  },
  {
    title: "Safe Space Time",
    duration: "5–10 mins",
    description: "A cozy, quiet corner helps children feel secure.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg",
    instructions:
      "1. Guide them to a quiet, cozy corner (e.g., pillow fort).\n" +
      "2. Stay nearby and let them relax in their space.",
  },
  {
    title: "Slow Movements",
    duration: "2–3 mins",
    description: "Gentle, slow motions help regulate emotions.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg",
    instructions:
      "1. Ask them to slowly lift their arms, then lower them.\n" +
      "2. Move gently to show them slow is safe.",
  },
  {
    title: "Breathing with Counting",
    duration: "5 mins",
    description: "A structured breathing exercise to calm the mind.",
    image:
      "https://img.freepik.com/free-vector/breathing-exercise-concept-illustration_114360-8920.jpg",
    instructions:
      "1. Teach the 4-4-4 rule: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds.\n" +
      "2. Repeat 5–6 times.",
  },
];

// Main page component
const SurpriseActivity = () => {
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
            Emotion: Surprise (Overwhelmed, Shocked, Distracted)
          </h1>
          <p className="text-lg text-gray-600 mt-6">
            Goal: Stabilize attention and provide a sense of security
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

export default SurpriseActivity;
