import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

function Layout() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">RifasOnline</Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-blue-200">Início</Link>
              
              {user ? (
                <>
                  <Link to="/create-raffle" className="hover:text-blue-200">Criar Rifa</Link>
                  <Link to="/my-raffles" className="hover:text-blue-200">Minhas Rifas</Link>
                  <Link to="/my-tickets" className="hover:text-blue-200">Meus Bilhetes</Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-200">Entrar</Link>
                  <Link 
                    to="/register" 
                    className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3">
              <Link to="/" className="block hover:text-blue-200">Início</Link>
              
              {user ? (
                <>
                  <Link to="/create-raffle" className="block hover:text-blue-200">Criar Rifa</Link>
                  <Link to="/my-raffles" className="block hover:text-blue-200">Minhas Rifas</Link>
                  <Link to="/my-tickets" className="block hover:text-blue-200">Meus Bilhetes</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block hover:text-blue-200">Entrar</Link>
                  <Link 
                    to="/register" 
                    className="block bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">RifasOnline</h3>
              <p className="text-gray-400">A melhor plataforma de rifas online</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white">Contato</a>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} RifasOnline. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
