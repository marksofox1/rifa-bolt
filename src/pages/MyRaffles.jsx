import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

function MyRaffles() {
  const { user } = useAuth()
  const [raffles, setRaffles] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (user) {
      fetchMyRaffles()
    }
  }, [user])
  
  async function fetchMyRaffles() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setRaffles(data || [])
    } catch (error) {
      console.error('Erro ao buscar minhas rifas:', error.message)
      toast.error('Erro ao carregar suas rifas')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDrawWinner = async (raffleId) => {
    try {
      // Buscar todos os bilhetes vendidos para esta rifa
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .eq('raffle_id', raffleId)
        .not('user_id', 'is', null)
      
      if (ticketsError) throw ticketsError
      
      if (!tickets || tickets.length === 0) {
        toast.error('Não há bilhetes vendidos para realizar o sorteio')
        return
      }
      
      // Selecionar um bilhete aleatoriamente
      const winnerTicket = tickets[Math.floor(Math.random() * tickets.length)]
      
      // Atualizar a rifa com o bilhete vencedor
      const { error: updateError } = await supabase
        .from('raffles')
        .update({ 
          winner_ticket_id: winnerTicket.id,
          winner_user_id: winnerTicket.user_id,
          status: 'completed'
        })
        .eq('id', raffleId)
      
      if (updateError) throw updateError
      
      toast.success('Sorteio realizado com sucesso!')
      fetchMyRaffles()
    } catch (error) {
      console.error('Erro ao realizar sorteio:', error.message)
      toast.error('Erro ao realizar sorteio')
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Rifas</h1>
        
        <Link to="/create-raffle" className="btn btn-primary">
          Criar Nova Rifa
        </Link>
      </div>
      
      {raffles.length === 0 ? (
        <div className="card text-center py-12">
          <h3 className="text-xl font-bold text-gray-500 mb-4">Você ainda não criou nenhuma rifa</h3>
          <p className="text-gray-500 mb-6">Crie sua primeira rifa e comece a vender bilhetes!</p>
          <Link to="/create-raffle" className="btn btn-primary">
            Criar Rifa
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {raffles.map(raffle => {
            // Calcular porcentagem de bilhetes vendidos
            const soldPercentage = (raffle.sold_tickets / raffle.total_tickets) * 100
            
            // Verificar se a data do sorteio já passou
            const drawDate = new Date(raffle.draw_date)
            const today = new Date()
            const drawPassed = drawDate < today
            
            // Formatar data do sorteio
            const formattedDate = drawDate.toLocaleDateString('pt-BR')
            
            // Formatar preço
            const formattedPrice = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(raffle.price)
            
            // Calcular valor total arrecadado
            const totalRaised = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(raffle.sold_tickets * raffle.price)

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
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        raffle.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : raffle.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {raffle.status === 'active' ? 'Ativa' : 
                         raffle.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Preço</p>
                        <p className="font-medium">{formattedPrice}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Data do Sorteio</p>
                        <p className="font-medium">{formattedDate}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Bilhetes Vendidos</p>
                        <p className="font-medium">{raffle.sold_tickets} / {raffle.total_tickets}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Valor Arrecadado</p>
                        <p className="font-medium">{totalRaised}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{soldPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${soldPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link 
                        to={`/raffles/${raffle.id}`}
                        className="btn btn-secondary"
                      >
                        Ver Detalhes
                      </Link>
                      
                      {raffle.status === 'active' && drawPassed && (
                        <button 
                          onClick={() => handleDrawWinner(raffle.id)}
                          className="btn btn-primary"
                        >
                          Realizar Sorteio
                        </button>
                      )}
                      
                      {raffle.status === 'completed' && (
                        <Link 
                          to={`/raffles/${raffle.id}`}
                          className="btn btn-primary"
                        >
                          Ver Resultado
                        </Link>
                      )}
                    </div>
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

export default MyRaffles
