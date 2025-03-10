import { Link } from 'react-router-dom'

function RaffleCard({ raffle }) {
  const { id, title, image_url, price, total_tickets, sold_tickets, draw_date } = raffle
  
  // Calcular porcentagem de bilhetes vendidos
  const soldPercentage = (sold_tickets / total_tickets) * 100
  
  // Formatar data do sorteio
  const formattedDate = new Date(draw_date).toLocaleDateString('pt-BR')
  
  // Formatar preço
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="relative pb-[60%] mb-4 overflow-hidden rounded-md">
        <img 
          src={image_url || 'https://via.placeholder.com/300x180?text=Rifa'} 
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-xl font-bold mb-2 truncate">{title}</h3>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progresso</span>
          <span>{sold_tickets} / {total_tickets} bilhetes</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${soldPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Valor do bilhete</p>
          <p className="text-lg font-bold text-blue-600">{formattedPrice}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Sorteio em</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
      </div>
      
      <Link 
        to={`/raffles/${id}`}
        className="btn btn-primary w-full block text-center"
      >
        Ver Detalhes
      </Link>
    </div>
  )
}

export default RaffleCard
