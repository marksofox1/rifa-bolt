import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import RaffleCard from '../components/RaffleCard'

function Home() {
  const [raffles, setRaffles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRaffles() {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('raffles')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setRaffles(data || [])
      } catch (error) {
        console.error('Erro ao buscar rifas:', error.message)
        setError('Não foi possível carregar as rifas. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRaffles()
  }, [])

  return (
    <div>
      <section className="mb-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Bem-vindo à RifasOnline
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A melhor plataforma para criar e participar de rifas online. 
            Crie sua própria rifa ou concorra a prêmios incríveis!
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link 
            to="/create-raffle" 
            className="btn btn-primary mr-4"
          >
            Criar Rifa
          </Link>
          <a 
            href="#rifas" 
            className="btn btn-secondary"
          >
            Ver Rifas Disponíveis
          </a>
        </div>
      </section>
      
      <section id="rifas" className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Rifas Disponíveis</h2>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2">Carregando rifas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : raffles.length === 0 ? (
          <div className="text-center py-10 bg-gray-100 rounded-lg">
            <p className="text-lg">Nenhuma rifa disponível no momento.</p>
            <p className="mt-2">
              <Link to="/create-raffle" className="text-blue-600 hover:underline">
                Seja o primeiro a criar uma rifa!
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </div>
        )}
      </section>
      
      <section className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Como Funciona</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-blue-600 text-2xl font-bold mb-2">1</div>
            <h3 className="text-lg font-semibold mb-2">Crie sua Rifa</h3>
            <p className="text-gray-600">
              Defina o prêmio, preço dos bilhetes, quantidade de números e data do sorteio.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-blue-600 text-2xl font-bold mb-2">2</div>
            <h3 className="text-lg font-semibold mb-2">Compartilhe</h3>
            <p className="text-gray-600">
              Divulgue sua rifa para amigos e familiares para vender mais bilhetes.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-blue-600 text-2xl font-bold mb-2">3</div>
            <h3 className="text-lg font-semibold mb-2">Sorteio</h3>
            <p className="text-gray-600">
              Na data marcada, o sistema sorteia automaticamente o ganhador entre os participantes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
