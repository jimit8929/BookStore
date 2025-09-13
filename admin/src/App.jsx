import Sidebar from './Components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddBook from './Components/AddBook'
import ListBooks from './Components/ListBooks'

const App = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path='/' element={<AddBook/>}/>
          <Route path="/list-books" element={<ListBooks/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App