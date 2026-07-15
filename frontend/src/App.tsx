import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Proyecto 1</h1>
      <p>Menú principal</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;