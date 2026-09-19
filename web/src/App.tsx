import { BrowserRouter, Route, Routes } from 'react-router'
import { ChapterPage } from './pages/Chapter'
import { Home } from './pages/Home'
import { Practice } from './pages/Practice'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cap/:id" element={<ChapterPage />} />
        <Route path="/treino" element={<Practice />} />
      </Routes>
    </BrowserRouter>
  )
}
