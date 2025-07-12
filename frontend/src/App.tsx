import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PracticeQuestions from './components/PracticeQuestions';
import StudyGuides from './components/StudyGuides';
import Flashcards from './components/Flashcards';
import ExamSimulator from './components/ExamSimulator';
import Progress from './components/Progress';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/questions" element={<PracticeQuestions />} />
            <Route path="/study-guides" element={<StudyGuides />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/exam-simulator" element={<ExamSimulator />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
