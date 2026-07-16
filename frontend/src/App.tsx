import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MemoramaMenu from './modules/memorama/pages/MemoramaMenu';
import DeckCreate from './modules/memorama/pages/DeckCreate';
import DeckDetail from './modules/memorama/pages/DeckDetail';
import DeckPlay from './modules/memorama/pages/DeckPlay';
import DeckEdit from './modules/memorama/pages/DeckEdit';
import DeckStats from './modules/memorama/pages/DeckStats';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memorama" element={<MemoramaMenu />} />
          <Route path="/memorama/crear" element={<DeckCreate />} />
          <Route path="/memorama/:deckId" element={<DeckDetail />} />
          <Route path="/memorama/:deckId/play" element={<DeckPlay />} />
          <Route path="/memorama/:deckId/edit" element={<DeckEdit />} />
          <Route path="/memorama/:deckId/stats" element={<DeckStats />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;