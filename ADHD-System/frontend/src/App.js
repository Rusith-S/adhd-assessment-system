// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import ReactionTimeGame from './component/it21288326/ReactiontimeGame';
// import QuestionnaireForm from './component/it21288326/QuestionnaireForm';
// import SignIn from './component/it21288326/SignIn';
// import SignUp from './component/it21288326/SignUp';
// import Profile from './component/it21288326/Profile';
// import Home from './component/Home';

// function App() {
//   return (
//     <Router>
      
//       <div className="App">

//         {/* Navigation Links
//         <nav>
//           <ul>
//             <li><Link to="/reaction-time-game">Reaction Time Game</Link></li>
//             <li><Link to="/questionnaire-form">Questionnaire Form</Link></li>
//           </ul>
//         </nav> */}

//         {/* Route Definitions */}
//         <Routes>

//           <Route path="/" element={<SignIn/>} />
//           <Route path="/sign-up" element={<SignUp/>} />


//           <Route path="/profile" element={<Profile/>} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/reaction-time-game" element={<ReactionTimeGame />} />
//           <Route path="/questionnaire-form" element={<QuestionnaireForm />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactionTimeGame from './component/it21288326/ReactiontimeGame';
import QuestionnaireForm from './component/it21288326/QuestionnaireForm';
import SignIn from './component/it21288326/SignIn';
import SignUp from './component/it21288326/SignUp';
import Profile from './component/it21288326/Profile';
import Home from './component/Home';
import ProtectedRoute from './component/it21288326/ProtectedRoute'; // Import the ProtectedRoute component
import GameAnalyticsContainer from './component/it21288326/GameAnalyticsContainer';

import Dashboard from './component/it21379574/Dashboard';
import MultiStepForm  from './component/it21379574/MultiStepForm';
import ResultsPage from './component/it21379574/ResultsPage';
import TimetableHistory from './component/it21379574/TimetableHistory';

import DashboardPrediction from './component/it21380532/PredictionDashboard';
import FormPage from './component/it21380532/FormPage';
import ResultsPagePrediction from './component/it21380532/ResultPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reaction-time-game"
            element={
              <ProtectedRoute>
                <ReactionTimeGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questionnaire-form"
            element={
              <ProtectedRoute>
                <QuestionnaireForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics/:childId/:gameId"
            element={
              <ProtectedRoute>
                <GameAnalyticsContainer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/:childId"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/questionnaire/:childId"
            element={
              <ProtectedRoute>
                <MultiStepForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/timetablehistory/:childId"
            element={
              <ProtectedRoute>
                <TimetableHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/result"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/prediction/:childId"
            element={
              <ProtectedRoute>
                <DashboardPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/prediction/form/:childId"
            element={
              <ProtectedRoute>
                <FormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/prediction/result"
            element={
              <ProtectedRoute>
                <ResultsPagePrediction />
              </ProtectedRoute>
            }
          />


        </Routes>
      </div>
    </Router>
  );
}

export default App;

