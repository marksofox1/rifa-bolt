# Configuração do Supabase

Para configurar corretamente o Supabase para este projeto, siga estas etapas:

## 1. Acesse o Dashboard do Supabase

1. Vá para [https://app.supabase.io/](https://app.supabase.io/) e faça login na sua conta
2. Acesse o projeto que você criou para esta aplicação

## 2. Execute o SQL para criar as tabelas

1. No menu lateral, clique em "SQL Editor"
2. Crie um novo script SQL
3. Cole o conteúdo do arquivo `supabase/schema.sql` no editor
4. Execute o script clicando em "Run"

## 3. Verifique as tabelas criadas

Após executar o script, verifique se as seguintes tabelas foram criadas:
- `profiles`
- `raffles`
- `tickets`

Você pode verificar isso na seção "Table Editor" no menu lateral.

## 4. Configure as políticas de segurança (RLS)

O script SQL já inclui as políticas de segurança necessárias, mas verifique se elas foram aplicadas corretamente:

1. No menu lateral, clique em "Authentication" e depois em "Policies"
2. Verifique se existem políticas para as tabelas `profiles`, `raffles` e `tickets`

## 5. Teste o registro de usuário

Após configurar as tabelas e políticas, tente registrar um usuário novamente na aplicação.
