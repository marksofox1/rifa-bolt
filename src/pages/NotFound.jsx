import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-center py-10">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Página não encontrada</h2>
      <p className="text-gray-600 mb-8">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link 
        to="/" 
        className="btn btn-primary"
      >
        Voltar para a página inicial
      </Link>
    </div>
  )
}

export default NotFound
