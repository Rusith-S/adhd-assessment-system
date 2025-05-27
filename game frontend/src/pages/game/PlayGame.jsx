import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Puzzle components now receive an additional `audio` prop
import Puzzle_3 from "../../components/puzzles/Puzzle_3";
import Puzzle_4 from "../../components/puzzles/Puzzle_4";
import Puzzle_5 from "../../components/puzzles/Puzzle_5";
import background from "./../../assets/public/background.png";

// ----- Story 1 assets -----
// Images for Story 1
import story1day1 from "./../../assets/story/story1/day1.png";
import story1day2 from "./../../assets/story/story1/day2.png";
import story1day3 from "./../../assets/story/story1/day3.png";
import story1day4 from "./../../assets/story/story1/day4.png";
import story1day5 from "./../../assets/story/story1/day5.png";
import story1day6 from "./../../assets/story/story1/day6.png";
import story1day7 from "./../../assets/story/story1/day7.png";
// Audio files for Story 1 (day-specific)
import story1AudioDay1 from "./../../assets/story/story1/audio1.mp3";
import story1AudioDay2 from "./../../assets/story/story1/audio2.mp3";
import story1AudioDay3 from "./../../assets/story/story1/audio3.mp3";
import story1AudioDay4 from "./../../assets/story/story1/audio4.mp3";
import story1AudioDay5 from "./../../assets/story/story1/audio5.mp3";
import story1AudioDay6 from "./../../assets/story/story1/audio6.mp3";
import story1AudioDay7 from "./../../assets/story/story1/audio7.mp3";

// ----- Story 2 assets -----
// Images for Story 2
import story2day1 from "./../../assets/story/story2/day1.png";
import story2day2 from "./../../assets/story/story2/day2.png";
import story2day3 from "./../../assets/story/story2/day3.png";
import story2day4 from "./../../assets/story/story2/day4.png";
import story2day5 from "./../../assets/story/story2/day5.png";
import story2day6 from "./../../assets/story/story2/day6.png";
import story2day7 from "./../../assets/story/story2/day7.png";

// ----- Story 3 assets -----
// Images for Story 3
import story3day1 from "./../../assets/story/story3/day1.png";
import story3day2 from "./../../assets/story/story3/day2.png";
import story3day3 from "./../../assets/story/story3/day3.png";
import story3day4 from "./../../assets/story/story3/day4.png";
import story3day5 from "./../../assets/story/story3/day5.png";
import story3day6 from "./../../assets/story/story3/day6.png";
import story3day7 from "./../../assets/story/story3/day7.png";

// Unified mapping for each story with images, texts, and audio
const gameDataMapping = {
  story1: {
    images: [
      story1day1,
      story1day2,
      story1day3,
      story1day4,
      story1day5,
      story1day6,
      story1day7,
    ],
    texts: [
      "One sunny morning, little Benji the bunny peeked out of his cozy burrow. As he hopped outside, his nose twitched—something colorful was hiding in the grass! It was a big, shiny egg! ‘Wow!’ Benji exclaimed. ‘Where did this come from?’ He looked around, but there was no sign of anyone. Curious and excited, Benji gently touched the egg. ‘I must find out who this belongs to!’ And so, his adventure began…",
      "Benji hopped through the forest, carrying the shiny egg carefully in his paws. ‘Maybe someone here knows where it came from!’ he thought. Just then, he spotted a wise old owl sitting on a tree branch. ‘Hello, Mr. Owl! Do you know whose egg this is?’ Benji asked eagerly. The owl adjusted his tiny glasses and hooted, ‘That is a very special egg, young bunny. But you must be patient! Sometimes, the best surprises take time!’ Benji tilted his head. What could be inside the egg? He had to find out!",
      "Benji decided to take the egg to a safe place, but—uh-oh!—as he hopped down the hill, the egg started rolling away! ‘Oh no! Come back!’ Benji cried, chasing after it. The egg bounced over the grass, past the flowers, and—splash!—it stopped right near the riverbank. Benji panted and giggled. ‘Phew! That was close!’ He carefully picked up the egg again. ‘I better be extra careful!",
      "Benji paused at the river to rest. As he looked into the water, he saw his reflection…and the egg floating nearby! ‘Huh? It looks even shinier in the water!’ Benji smiled. Just then, a gentle breeze blew across the river. ‘I wonder if this egg belongs to a bird,’ he thought. ‘Birds lay eggs, right?’ But before he could think more, he noticed something—the egg was moving! Was something inside?",
      "Benji knew he had to get the egg back to safety. He spotted some stepping stones in the river. ‘Alright, here we go!’ he said bravely. Hop! Step! Jump! He carefully carried the egg, balancing on each stone. ‘Almost there…’ But—whoops!—his foot slipped, and he wobbled! ‘Whoa!’ Luckily, he landed safely on the other side, hugging the egg tight. ‘That was close! But don’t worry, little egg, I’ll keep you safe!’",
      "After a long day, Benji found a cozy spot under a big oak tree. The sky turned orange and pink as the sun began to set. Benji yawned and snuggled close to the egg. ‘I wonder if you’ll hatch soon…’ he whispered sleepily. The egg glowed softly in the fading sunlight. ‘Goodnight, little egg,’ Benji said with a smile. And with that, he drifted off to sleep, dreaming of what might happen next…",
      "As the first rays of sunshine touched the meadow, Benji woke up and stretched. He looked over at the egg—and gasped! The egg was shaking! ‘It’s hatching!’ he cried. Crack… crack… pop! Out came a tiny, glowing bird with golden feathers! ‘Oh wow!’ Benji said in awe. The little bird chirped happily. ‘You’re so beautiful!’ The wise owl swooped down and smiled. ‘I told you to be patient, young bunny! This is a magical sunrise bird. And now, you two are friends forever.’ Benji beamed. What a wonderful adventure this had been!",
    ],
    audios: [
      story1AudioDay1,
      story1AudioDay2,
      story1AudioDay3,
      story1AudioDay4,
      story1AudioDay5,
      story1AudioDay6,
      story1AudioDay7,
    ],
  },
  story2: {
    images: [
      story2day1,
      story2day2,
      story2day3,
      story2day4,
      story2day5,
      story2day6,
      story2day7,
    ],
    texts: [
      `Milo Finds the Magical Paintbrush
"One bright morning, Milo, a little fox, was exploring the forest when he stumbled upon an old paintbrush. It shimmered in the sunlight! ‘Wow! What’s this?’ Milo said excitedly, his tail wagging. He picked it up and gave it a little swish in the air. To his surprise, a rainbow appeared! ‘This is no ordinary paintbrush… it’s magical!’ Milo laughed with joy, ready to discover its powers."`,
      `Milo’s First Magical Painting
"Milo wanted to test his magical paintbrush. He dipped it into the air and painted a big blue cloud. Suddenly, the cloud became real and floated into the sky! ‘Whoa! This is amazing!’ Milo giggled. Then he painted a juicy red apple, and POOF—it appeared in front of him! ‘I can paint anything I want!’ Milo cheered, his voice full of excitement."`,
      `Milo got too excited and waved his brush wildly. SPLAT! A big puddle of green paint landed on his fur. ‘Oh no!’ he huffed, stomping his paws. ‘This is a mess!’ He tried to shake it off, but the paint wouldn’t come off. ‘Grrr! This brush is tricky!’ he grumbled, frustrated. But then he took a deep breath. ‘Okay, maybe I just need to be more careful.’`,
      `The next day, Milo woke up to dark clouds and rain. ‘Oh no, I can’t paint outside today…’ he sighed, feeling sad. He sat by his window, watching the raindrops fall. ‘Maybe magic can’t fix everything,’ he whispered, his ears drooping. He held the brush but didn’t feel like painting. It was the first time he felt unsure about his powers.`,
      `Milo suddenly had an idea! ‘Wait a minute… I can paint the sun!’ His voice lifted with excitement. He grabbed his brush and painted a big yellow sun in the sky. POOF! The clouds faded, and warm sunlight shone through. ‘I did it!’ he cheered. The birds started singing again, and Milo felt happy once more. ‘Magic can bring light to even the darkest days!’ he laughed.`,
      `Milo thought about all the magical things he had painted. ‘Maybe I shouldn’t keep this all to myself,’ he said softly. He walked to the village and showed his friends the paintbrush. ‘Let’s make something together!’ he smiled. His friends cheered as Milo painted a beautiful garden filled with colorful flowers. ‘This is the best magic of all—sharing it with friends,’ he said warmly.`,
      `On the last day, Milo decided to paint one last thing—a beautiful rainbow across the sky. ‘This is my biggest painting yet!’ he shouted with joy. Swish! Swirl! The colors danced in the air until a huge, glowing rainbow appeared. His friends clapped and cheered. ‘Wow, Milo! You made the world more magical!’ they said. Milo’s heart filled with happiness. He had discovered the true magic—spreading joy through creativity!`,
    ],
    audio: null,
  },
  story3: {
    images: [
      story3day1,
      story3day2,
      story3day3,
      story3day4,
      story3day5,
      story3day6,
      story3day7,
    ],
    texts: [
      `Benny, a tiny squirrel, dreamed of climbing the tallest tree in the forest. "One day, I’ll see the whole world from up there!" he chirped. His friends giggled, "That tree is too big for you, Benny!" But Benny just smiled. "I’ll try my best!""I’ll try my best!"`,
      `Benny took his first jump onto the lowest branch. "Wheee!" he cheered. But—oops!—he slipped and landed in a pile of leaves. His friend Mia, the rabbit, laughed. "That was a good try, Benny!" He grinned. "I’ll get better!"`,
      `The next day was windy. Benny tried again, but the strong wind made him wobble. "Oh no!" he squeaked, hugging the branch tightly. His heart pounded. "Maybe today isn’t the day…" He climbed back down, feeling a little unsure.`,
      `Mia and Toby the turtle wanted to help. "We believe in you, Benny!" Mia cheered. They built a tiny ladder from twigs. "Wow! Thank you!" Benny beamed. With his friends’ help, he climbed higher than ever before.`,
      `That night, a big storm hit the forest. Benny saw the big tree swaying in the wind. "Oh no, what if it falls?" he whispered, feeling worried. He couldn’t sleep, thinking about his big dream.`,
      `In the morning, Benny ran to the tree. A big branch had broken! "Nooo!" he squeaked. "Now I’ll never climb to the top!" He stomped his tiny paws. But Mia patted his back. "Don’t give up, Benny!"`,
      `Benny took a deep breath. "I won’t give up!" He climbed and climbed… until—whoosh!—he reached the very top! "I DID IT!" he shouted, looking at the beautiful sunrise. His friends cheered from below. Benny had followed his dream, and it felt amazing!`,
    ],
    audio: null,
  },
};

export default function PlayGame() {
  const { id } = useParams(); // game id from the route
  // storyKey will be "story1", "story2", or "story3"
  const [storyKey, setStoryKey] = useState("story1");
  const [loading, setLoading] = useState(true);
  const [puzzleRecords, setPuzzleRecords] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentText, setCurrentText] = useState("Default Puzzle Description");
  const [currentAudio, setCurrentAudio] = useState(null);

  // Fetch game info and puzzle records from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGameInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}game/puzzle-records/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const gameName = response.data.gameName || "";
        const records = response.data.puzzleRecords || [];
        setPuzzleRecords(records);

        if (response.data.puzzleText) {
          setCurrentText(response.data.puzzleText);
        } else {
          setCurrentText(`Puzzle Level: ${records.length + 1}`);
        }

        if (gameName.toLowerCase().includes("story 1")) {
          setStoryKey("story1");
        } else if (gameName.toLowerCase().includes("story 2")) {
          setStoryKey("story2");
        } else if (gameName.toLowerCase().includes("story 3")) {
          setStoryKey("story3");
        } else {
          setStoryKey("story1");
        }
      } catch (error) {
        console.error("Error fetching game info:", error);
        setStoryKey("story1");
      } finally {
        setLoading(false);
      }
    };

    fetchGameInfo();
  }, [id]);

  // Determine the assets to use based on the current day (puzzleRecords length)
  useEffect(() => {
    if (!loading) {
      const dayIndex = puzzleRecords.length;
      const storyData = gameDataMapping[storyKey];

      const selectedImage =
        storyData.images && storyData.images[dayIndex]
          ? storyData.images[dayIndex]
          : storyData.images[storyData.images.length - 1];
      const selectedText =
        storyData.texts && storyData.texts[dayIndex]
          ? storyData.texts[dayIndex]
          : storyData.texts[storyData.texts.length - 1];

      // For Story 1, use day-specific audio if available. Otherwise, fallback to a constant audio.
      let selectedAudio = null;
      if (storyData.audios) {
        selectedAudio =
          storyData.audios[dayIndex] ||
          storyData.audios[storyData.audios.length - 1];
      } else {
        selectedAudio = storyData.audio;
      }

      console.log("PlayGame: selectedImage =", selectedImage);
      setCurrentImage(selectedImage);
      setCurrentText(selectedText);
      setCurrentAudio(selectedAudio);
    }
  }, [loading, puzzleRecords, storyKey]);

  // Function to determine the correct puzzle component
  const renderPuzzleComponent = () => {
    if (puzzleRecords.length > 4) {
      return (
        <Puzzle_5
          imageOptions={currentImage}
          text={currentText}
          audio={currentAudio}
        />
      );
    } else if (puzzleRecords.length > 2) {
      return (
        <Puzzle_4
          imageOptions={currentImage}
          text={currentText}
          audio={currentAudio}
        />
      );
    } else {
      return (
        <Puzzle_3
          imageOptions={currentImage}
          text={currentText}
          audio={currentAudio}
        />
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 p-10"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
    >
      {loading ? <p>Loading game info...</p> : <>{renderPuzzleComponent()}</>}
    </div>
  );
}
