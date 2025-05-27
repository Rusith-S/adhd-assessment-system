import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/public/Header";
import Home from "./pages/home/Home";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import StartingGame from "./pages/emotiondetection/StartingGame";
import InitialEmotions from "./pages/emotionrecords/InitialEmotions";
import SadActivity from "./pages/suggestions/SadActivity";
import SurpriseActivity from "./pages/suggestions/SurpriseActivity";
import FearActivity from "./pages/suggestions/FearActivity";
import GameSelection from "./pages/game/GameSelection";
import GameMap from "./pages/game/GameMap";
import PlayGame from "./pages/game/PlayGame";
import AfterSuggestions from "./pages/emotiondetection/AfterSuggestions";
import ActivityEmotions from "./pages/emotionrecords/ActivityEmotions";
import FinalEmotion from "./pages/emotiondetection/FinalEmotion";
import FinalProgress from "./pages/progress/FinalProgress";
import DailyProgress from "./pages/progress/DailyProgress";

export default function App() {
  return (
    <BrowserRouter>
      {/* Component-based pattern: Using the Header component */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emotion-records" element={<InitialEmotions />} />
        <Route path="/records-after-suggestion/:id" element={<ActivityEmotions />} />
        <Route path="/game-selection/:id" element={<GameSelection />} />
        <Route path="/game-map/:id" element={<GameMap />} />
        <Route path="/play-game/:id" element={<PlayGame />} />
        <Route path="/suggestion-sad/:id" element={<SadActivity />} />
        <Route path="/suggestion-surprise/:id" element={<SurpriseActivity />} />
        <Route path="/suggestion-fear/:id" element={<FearActivity />} />
        <Route path="/emotion-starting-game" element={<StartingGame />} />
        <Route path="/emotion-after-suggestion/:id" element={<AfterSuggestions />} />
        <Route path="/emotion-final/:id" element={<FinalEmotion />} />
        <Route path="/final-progress/:id" element={<FinalProgress />} />
        <Route path="/daily-progress/:id" element={<DailyProgress />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}
