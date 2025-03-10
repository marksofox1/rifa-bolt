import { createClient } from '@supabase/supabase-js'

// Normalmente, essas variáveis viriam de variáveis de ambiente
// Para este exemplo, estamos colocando diretamente no código
// Em um ambiente de produção, você deve usar variáveis de ambiente
const supabaseUrl = 'https://dutspxgststbjrgoscpu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dHNweGdzdHN0YmpyZ29zY3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0ODQ0ODUsImV4cCI6MjA1NzA2MDQ4NX0.AVAiTxLUbeFVP3YI7NwrRn40vAhbxZEg51Oo3iD1OQY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
