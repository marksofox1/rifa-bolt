import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RaffleDetails from './pages/RaffleDetails'
import CreateRaffle from './pages/CreateRaffle'
import MyRaffles from './pages/MyRaffles'
import MyTickets from './pages/MyTickets'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="raffles/:id" element={<RaffleDetails />} />
        
        <Route path="create-raffle" element={
          <ProtectedRoute>
            <CreateRaffle />
          </ProtectedRoute>
        } />
        
        <Route path="my-raffles" element={
          <ProtectedRoute>
            <MyRaffles />
          </ProtectedRoute>
        } />
        
        <Route path="my-tickets" element={
          <ProtectedRoute>
            <MyTickets />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
