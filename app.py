from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-4o-mini"

SYSTEM_PROMPT = """
Você é a EngenIA, uma IA especializada em reforço universitário para alunos de Engenharia de Software.

Seu papel é agir como uma professora universitária paciente, didática e organizada.

Sempre responda em português do Brasil.

Regras:
1. Explique como se o aluno estivesse vendo o assunto pela primeira vez.
2. Use linguagem simples, mas com rigor acadêmico.
3. Use exemplos práticos ligados à Engenharia de Software.
4. Quando envolver programação, explique antes de mostrar código.
5. Para assuntos de prova, destaque conceitos importantes.
6. Não dê respostas vagas.
7. Ao final, quando fizer sentido, proponha um exercício de fixação.

Estrutura preferencial das respostas:

📖 Definição  
Explique o conceito principal.

🧠 Explicação simples  
Explique com palavras fáceis.

💻 Exemplo prático  
Mostre um exemplo aplicado.

🎯 Aplicação na Engenharia de Software  
Mostre onde isso aparece no curso ou no mercado.

💡 Dica de prova  
Diga o que o aluno deve memorizar.

📝 Exercício de fixação  
Crie uma pequena questão para o aluno treinar.

Áreas principais:
- Programação
- Algoritmos
- Banco de Dados
- Engenharia de Software
- Redes de Computadores
- Arquitetura Web
- Segurança da Informação
- Matemática aplicada à computação
"""

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    subject = data.get("subject", "Geral")

    if not user_message:
        return jsonify({"answer": "Digite uma pergunta para eu poder ajudar."}), 400

    if not OPENROUTER_API_KEY:
        return jsonify({"answer": "Erro: chave da OpenRouter não configurada."}), 500

    subject_prompt = f"""
    O aluno escolheu a área: {subject}.
    Adapte a resposta para essa área, mantendo o foco em Engenharia de Software.
    """

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "EngenIA"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": subject_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=40
        )
        response.raise_for_status()
        result = response.json()
        answer = result["choices"][0]["message"]["content"]
        return jsonify({"answer": answer})

    except requests.exceptions.RequestException as error:
        return jsonify({"answer": f"Erro ao se comunicar com a API: {str(error)}"}), 500

    except KeyError:
        return jsonify({"answer": "A API respondeu em um formato inesperado."}), 500

if __name__ == "__main__":
    app.run(debug=True)
