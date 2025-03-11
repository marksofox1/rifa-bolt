import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import RaffleDetails from './pages/RaffleDetails'
import CreateRaffle from './pages/CreateRaffle'
import MyRaffles from './pages/MyRaffles'
import MyTickets from './pages/MyTickets'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="raffle/:id" element={<RaffleDetails />} />
        <Route path="create-raffle" element={<CreateRaffle />} />
        <Route path="my-raffles" element={<MyRaffles />} />
        <Route path="my-tickets" element={<MyTickets />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
