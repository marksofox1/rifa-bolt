import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

function MyTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (user) {
      fetchMyTickets()
    }
  }, [user])
  
  async function fetchMyTickets() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          raffles:raffle_id (
            id,
            title,
            image_url,
            price,
            draw_date,
            status,
            winner_ticket_id,
            winner_user_id
          )
        `)
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false })
      
      if (error) throw error
      
      setTickets(data || [])
    } catch (error) {
      console.error('Erro ao buscar meus bilhetes:', error.message)
      toast.error('Erro ao carregar seus bilhetes')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Agrupar bilhetes por rifa
  const ticketsByRaffle = tickets.reduce((acc, ticket) => {
    const raffleId = ticket.raffle_id
    
    if (!acc[raffleId]) {
      acc[raffleId] = {
        raffle: ticket.raffles,
        tickets: []
      }
    }
    
    acc[raffleId].tickets.push(ticket)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meus Bilhetes</h1>
      
      {tickets.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-xl font-bold text-gray-500 mb-4">Você ainda não comprou nenhum bilhete</h3>
          <p className="text-gray-500 mb-6">Participe de uma rifa e concorra a prêmios incríveis!</p>
          <Link to="/" className="btn btn-primary">
            Ver Rifas Disponíveis
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(ticketsByRaffle).map(({ raffle, tickets }) => {
            // Formatar data do sorteio
            const drawDate = new Date(raffle.draw_date)
            const formattedDate = drawDate.toLocaleDateString('pt-BR')
            
            // Verificar se o usuário ganhou esta rifa
            const userWon = raffle.status === 'completed' && raffle.winner_user_id === user.id
            
            // Verificar se o bilhete do usuário foi o vencedor
            const winningTicket = tickets.find(ticket => ticket.id === raffle.winner_ticket_id)

            return (
              <div key={raffle.id} className="card">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={raffle.image_url || 'https://via.placeholder.com/300x180?text=Rifa'} 
                        alt={raffle.title}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-3/4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{raffle.title}</h3>
                      
                      {userWon && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Você Ganhou!
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Data do Sorteio</p>
                        <p className="font-medium">{formattedDate}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">
                          {raffle.status === 'active' ? 'Ativa' : 
                           raffle.status === 'completed' ? 'Concluída' : 'Cancelada'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="font-medium mb-2">Seus Bilhetes:</p>
                      <div className="flex flex-wrap gap-2">
                        {tickets.map(ticket => (
                          <span 
                            key={ticket.id}
                            className={`
                              w-10 h-10 rounded-md flex items-center justify-center font-medium
                              ${ticket.id === raffle.winner_ticket_id 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-100'}
                            `}
                          >
                            {ticket.number}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/raffles/${raffle.id}`}
                      className="btn btn-primary"
                    >
                      Ver Detalhes da Rifa
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyTickets
