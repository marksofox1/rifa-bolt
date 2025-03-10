import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

function CreateRaffle() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [totalTickets, setTotalTickets] = useState('')
  const [drawDate, setDrawDate] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }
    
    setImageFile(file)
    
    // Criar preview da imagem
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title || !description || !price || !totalTickets || !drawDate) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }
    
    if (isNaN(price) || parseFloat(price) <= 0) {
      toast.error('O preço deve ser um valor positivo')
      return
    }
    
    if (isNaN(totalTickets) || parseInt(totalTickets) <= 0 || parseInt(totalTickets) > 1000) {
      toast.error('O número de bilhetes deve ser entre 1 e 1000')
      return
    }
    
    const selectedDate = new Date(drawDate)
    const today = new Date()
    
    if (selectedDate <= today) {
      toast.error('A data do sorteio deve ser no futuro')
      return
    }
    
    try {
      setLoading(true)
      
      let imageUrl = null
      
      // Fazer upload da imagem, se houver
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `raffles/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile)
        
        if (uploadError) throw uploadError
        
        // Obter URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)
        
        imageUrl = publicUrl
      }
      
      // Criar rifa
      const { data: raffle, error: raffleError } = await supabase
        .from('raffles')
        .insert([
          {
            title,
            description,
            price: parseFloat(price),
            total_tickets: parseInt(totalTickets),
            sold_tickets: 0,
            draw_date: drawDate,
            image_url: imageUrl,
            creator_id: user.id,
            status: 'active'
          }
        ])
        .select()
        .single()
      
      if (raffleError) throw raffleError
      
      // Criar bilhetes para a rifa
      const tickets = Array.from({ length: parseInt(totalTickets) }, (_, i) => ({
        raffle_id: raffle.id,
        number: i + 1,
        user_id: null,
        purchased_at: null
      }))
      
      const { error: ticketsError } = await supabase
        .from('tickets')
        .insert(tickets)
      
      if (ticketsError) throw ticketsError
      
      toast.success('Rifa criada com sucesso!')
      navigate(`/raffles/${raffle.id}`)
    } catch (error) {
      console.error('Erro ao criar rifa:', error.message)
      toast.error('Erro ao criar rifa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }
  
  // Calcular data mínima para o sorteio (amanhã)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Criar Nova Rifa</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium">
              Título da Rifa *
            </label>
            <input
              id="title"
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 font-medium">
              Descrição *
            </label>
            <textarea
              id="description"
              className="input min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block mb-2 font-medium">
                Preço do Bilhete (R$) *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="totalTickets" className="block mb-2 font-medium">
                Número de Bilhetes *
              </label>
              <input
                id="totalTickets"
                type="number"
                min="1"
                max="1000"
                className="input"
                value={totalTickets}
                onChange={(e) => setTotalTickets(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="drawDate" className="block mb-2 font-medium">
              Data do Sorteio *
            </label>
            <input
              id="drawDate"
              type="date"
              className="input"
              value={drawDate}
              onChange={(e) => setDrawDate(e.target.value)}
              min={minDate}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="image" className="block mb-2 font-medium">
              Imagem da Rifa
            </label>
            
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer btn btn-secondary">
                Escolher Imagem
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              
              <span className="text-sm text-gray-500">
                {imageFile ? imageFile.name : 'Nenhum arquivo selecionado'}
              </span>
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-md"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary mr-2"
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Rifa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRaffle
