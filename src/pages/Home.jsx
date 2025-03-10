import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import RaffleCard from '../components/RaffleCard'

function Home() {
  const [raffles, setRaffles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'active', 'ending'

  useEffect(() => {
    fetchRaffles()
  }, [])

  async function fetchRaffles() {
    try {
      setLoading(true)
      
      // Buscar apenas rifas ativas (data de sorteio no futuro)
      let query = supabase
        .from('raffles')
        .select('*')
        .gt('draw_date', new Date().toISOString())
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      
      const { data, error } = await query
      
      if (error) throw error
      
      setRaffles(data || [])
    } catch (error) {
      console.error('Erro ao buscar rifas:', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar rifas com base na pesquisa e filtro selecionado
  const filteredRaffles = raffles.filter(raffle => {
    const matchesSearch = raffle.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    
    const now = new Date()
    const drawDate = new Date(raffle.draw_date)
    const daysUntilDraw = Math.ceil((drawDate - now) / (1000 * 60 * 60 * 24))
    
    if (filter === 'ending') {
      return matchesSearch && daysUntilDraw <= 3
    }
    
    if (filter === 'active') {
      const soldPercentage = (raffle.sold_tickets / raffle.total_tickets) * 100
      return matchesSearch && soldPercentage < 90
    }
    
    return matchesSearch
  })

  return (
    <div>
      <section className="bg-blue-600 -mx-4 px-4 py-12 mb-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao RifasOnline</h1>
          <p className="text-xl mb-8">
            Participe de rifas emocionantes e concorra a prêmios incríveis!
          </p>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar rifas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 absolute right-3 top-3 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Todas as Rifas
        </button>
        <button 
          onClick={() => setFilter('ending')}
          className={`btn ${filter === 'ending' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Terminando em Breve
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Com Bilhetes Disponíveis
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredRaffles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRaffles.map(raffle => (
            <RaffleCard key={raffle.id} raffle={raffle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold text-gray-500 mb-2">Nenhuma rifa encontrada</h3>
          <p className="text-gray-500">Tente ajustar sua pesquisa ou filtros</p>
        </div>
      )}
    </div>
  )
}

export default Home
