# IA Reforço Universitário

Projeto acadêmico da disciplina Engenharia de Inteligência Artificial.

## Tema
IA especializada em reforço universitário para alunos de Engenharia de Software.

## Tecnologias utilizadas
- Backend: Python com Flask
- IA: API da OpenRouter
- Frontend: HTML, CSS e JavaScript
- Comunicação: JSON
- Requisição: HTTP POST

## Como executar

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Crie um arquivo `.env` na raiz do projeto:
```env
OPENROUTER_API_KEY=sua_chave_da_openrouter
```

3. Execute o servidor:
```bash
python app.py
```

4. Acesse no navegador:
```text
http://127.0.0.1:5000
```

## Como funciona
O usuário digita uma pergunta no campo de mensagem. O JavaScript envia essa pergunta para o backend usando `fetch`, JSON e uma requisição HTTP do tipo POST. O backend em Python recebe a mensagem, envia para a API da OpenRouter junto com um prompt de especialização e retorna a resposta da IA para a interface web.
