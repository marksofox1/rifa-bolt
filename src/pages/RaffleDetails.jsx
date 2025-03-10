import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

function RaffleDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [raffle, setRaffle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [selectedTickets, setSelectedTickets] = useState([])
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  
  useEffect(() => {
    fetchRaffleDetails()
  }, [id])
  
  async function fetchRaffleDetails() {
    try {
      setLoading(true)
      
      // Buscar detalhes da rifa
      const { data: raffleData, error: raffleError } = await supabase
        .from('raffles')
        .select('*')
        .eq('id', id)
        .single()
      
      if (raffleError) throw raffleError
      
      if (!raffleData) {
        navigate('/not-found')
        return
      }
      
      setRaffle(raffleData)
      
      // Buscar bilhetes da rifa
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .eq('raffle_id', id)
        .order('number', { ascending: true })
      
      if (ticketsError) throw ticketsError
      
      setTickets(ticketsData || [])
    } catch (error) {
      console.error('Erro ao buscar detalhes da rifa:', error.message)
      toast.error('Erro ao carregar detalhes da rifa')
    } finally {
      setLoading(false)
    }
  }
  
  const handleTicketSelection = (ticketNumber) => {
    if (selectedTickets.includes(ticketNumber)) {
      setSelectedTickets(selectedTickets.filter(num => num !== ticketNumber))
    } else {
      setSelectedTickets([...selectedTickets, ticketNumber])
    }
  }
  
  const handlePurchaseTickets = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para comprar bilhetes')
      navigate('/login')
      return
    }
    
    if (selectedTickets.length === 0) {
      toast.error('Selecione pelo menos um bilhete')
      return
    }
    
    try {
      setPurchaseLoading(true)
      
      // Verificar se os bilhetes ainda estão disponíveis
      const { data: availableTickets, error: checkError } = await supabase
        .from('tickets')
        .select('number')
        .eq('raffle_id', id)
        .is('user_id', null)
        .in('number', selectedTickets)
      
      if (checkError) throw checkError
      
      if (!availableTickets || availableTickets.length !== selectedTickets.length) {
        toast.error('Alguns bilhetes selecionados já foram comprados. Atualizando...')
        fetchRaffleDetails()
        return
      }
      
      // Comprar bilhetes
      const { error: purchaseError } = await supabase
        .from('tickets')
        .update({ user_id: user.id, purchased_at: new Date().toISOString() })
        .eq('raffle_id', id)
        .is('user_id', null)
        .in('number', selectedTickets)
      
      if (purchaseError) throw purchaseError
      
      // Atualizar contador de bilhetes vendidos
      const { error: updateRaffleError } = await supabase
        .from('raffles')
        .update({ 
          sold_tickets: raffle.sold_tickets + selectedTickets.length 
        })
        .eq('id', id)
      
      if (updateRaffleError) throw updateRaffleError
      
      toast.success('Bilhetes comprados com sucesso!')
      setSelectedTickets([])
      fetchRaffleDetails()
    } catch (error) {
      console.error('Erro ao comprar bilhetes:', error.message)
      toast.error('Erro ao comprar bilhetes. Tente novamente.')
    } finally {
      setPurchaseLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!raffle) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-gray-500 mb-2">Rifa não encontrada</h3>
      </div>
    )
  }
  
  // Calcular porcentagem de bilhetes vendidos
  const soldPercentage = (raffle.sold_tickets / raffle.total_tickets) * 100
  
  // Formatar data do sorteio
  const formattedDate = new Date(raffle.draw_date).toLocaleDateString('pt-BR')
  
  // Formatar preço
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(raffle.price)
  
  // Calcular valor total dos bilhetes selecionados
  const totalPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(selectedTickets.length * raffle.price)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg overflow-hidden mb-4">
            <img 
              src={raffle.image_url || 'https://via.placeholder.com/600x400?text=Rifa'} 
              alt={raffle.title}
              className="w-full h-auto"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>{raffle.sold_tickets} / {raffle.total_tickets} bilhetes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${soldPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{raffle.title}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card">
              <p className="text-sm text-gray-500">Valor do bilhete</p>
              <p className="text-xl font-bold text-blue-600">{formattedPrice}</p>
            </div>
            
            <div className="card">
              <p className="text-sm text-gray-500">Data do sorteio</p>
              <p className="text-xl font-bold">{formattedDate}</p>
            </div>
          </div>
          
          <div className="card mb-6">
            <h3 className="text-lg font-bold mb-2">Descrição</h3>
            <p className="whitespace-pre-line">{raffle.description}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Regras do sorteio</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>O sorteio será realizado na data indicada</li>
              <li>O resultado será divulgado nesta página e por email</li>
              <li>O ganhador será contatado para receber o prêmio</li>
              <li>O prêmio será entregue em até 30 dias após o sorteio</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Escolha seus bilhetes</h2>
        
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: raffle.total_tickets }, (_, i) => i + 1).map(number => {
              const ticket = tickets.find(t => t.number === number)
              const isAvailable = !ticket || ticket.user_id === null
              const isSelected = selectedTickets.includes(number)
              
              return (
                <button
                  key={number}
                  onClick={() => isAvailable && handleTicketSelection(number)}
                  disabled={!isAvailable}
                  className={`
                    w-12 h-12 rounded-md flex items-center justify-center font-medium transition-colors
                    ${isAvailable 
                      ? isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-300 hover:border-blue-500' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  {number}
                </button>
              )
            })}
          </div>
        </div>
        
        {selectedTickets.length > 0 && (
          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Bilhetes selecionados: {selectedTickets.length}</h3>
                <p className="text-sm">Total: {totalPrice}</p>
              </div>
              
              <button
                onClick={handlePurchaseTickets}
                disabled={purchaseLoading}
                className="btn btn-primary"
              >
                {purchaseLoading ? 'Processando...' : 'Comprar Bilhetes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RaffleDetails
