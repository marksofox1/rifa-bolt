import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6">Página não encontrada</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link to="/" className="btn btn-primary">
        Voltar para a página inicial
      </Link>
    </div>
  )
}

export default NotFound
