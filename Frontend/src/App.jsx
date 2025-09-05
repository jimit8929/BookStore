import { Route, Routes } from 'react-router-dom'

//Pages
import HomePage from './Pages/HomePage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
    </Routes>
  )
}

export default App