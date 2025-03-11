import { Link } from 'react-router-dom'

function RaffleCard({ raffle }) {
  const { id, title, description, price, total_tickets, sold_tickets, image_url, draw_date } = raffle
  
  // Formatar preço
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
  
  // Calcular progresso
  const progress = (sold_tickets / total_tickets) * 100
  
  // Formatar data
  const formattedDate = new Date(draw_date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image_url ? (
        <img 
          src={image_url} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Sem imagem</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 truncate">{title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>{sold_tickets} de {total_tickets} bilhetes vendidos</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Preço do bilhete</p>
            <p className="text-lg font-bold text-blue-600">{formattedPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Sorteio em</p>
            <p className="font-medium">{formattedDate}</p>
          </div>
        </div>
        
        <Link 
          to={`/raffle/${id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  )
}

export default RaffleCard
