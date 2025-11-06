'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Question {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio'
  options?: string[]
  required: boolean
}

interface Answer {
  questionId: string
  value: string | string[]
}

export default function Home() {
  const [step, setStep] = useState<'initial' | 'questions' | 'result'>('initial')
  const [promptType, setPromptType] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const promptTypes = [
    { id: 'creative-writing', name: 'Escrita Criativa', icon: '✍️' },
    { id: 'code-generation', name: 'Geração de Código', icon: '💻' },
    { id: 'data-analysis', name: 'Análise de Dados', icon: '📊' },
    { id: 'content-creation', name: 'Criação de Conteúdo', icon: '📝' },
    { id: 'problem-solving', name: 'Resolução de Problemas', icon: '🧩' },
    { id: 'translation', name: 'Tradução', icon: '🌐' },
    { id: 'summarization', name: 'Resumo de Texto', icon: '📋' },
    { id: 'chatbot', name: 'Assistente Virtual', icon: '🤖' },
    { id: 'custom', name: 'Personalizado', icon: '⚙️' }
  ]

  const generateQuestions = (type: string): Question[] => {
    const questionSets: Record<string, Question[]> = {
      'creative-writing': [
        {
          id: 'genre',
          question: 'Qual gênero literário você deseja?',
          type: 'select',
          options: ['Ficção Científica', 'Romance', 'Fantasia', 'Terror', 'Drama', 'Comédia', 'Mistério'],
          required: true
        },
        {
          id: 'tone',
          question: 'Qual tom você prefere?',
          type: 'select',
          options: ['Formal', 'Casual', 'Humorístico', 'Sério', 'Inspirador', 'Sombrio'],
          required: true
        },
        {
          id: 'length',
          question: 'Qual o tamanho desejado do texto?',
          type: 'radio',
          options: ['Curto (1-2 parágrafos)', 'Médio (3-5 parágrafos)', 'Longo (6+ parágrafos)', 'História completa'],
          required: true
        },
        {
          id: 'topic',
          question: 'Qual é o tema ou enredo principal?',
          type: 'textarea',
          required: true
        },
        {
          id: 'characters',
          question: 'Descreva os personagens principais (opcional):',
          type: 'textarea',
          required: false
        },
        {
          id: 'style',
          question: 'Há algum estilo específico de autor que deseja emular? (opcional)',
          type: 'text',
          required: false
        }
      ],
      'code-generation': [
        {
          id: 'language',
          question: 'Qual linguagem de programação?',
          type: 'select',
          options: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'],
          required: true
        },
        {
          id: 'framework',
          question: 'Usa algum framework específico?',
          type: 'text',
          required: false
        },
        {
          id: 'functionality',
          question: 'Descreva a funcionalidade que precisa implementar:',
          type: 'textarea',
          required: true
        },
        {
          id: 'complexity',
          question: 'Nível de complexidade desejado:',
          type: 'radio',
          options: ['Básico', 'Intermediário', 'Avançado'],
          required: true
        },
        {
          id: 'requirements',
          question: 'Requisitos específicos (performance, segurança, etc.):',
          type: 'textarea',
          required: false
        },
        {
          id: 'documentation',
          question: 'Precisa de documentação no código?',
          type: 'radio',
          options: ['Sim, comentários detalhados', 'Sim, comentários básicos', 'Não'],
          required: true
        }
      ],
      'data-analysis': [
        {
          id: 'data-type',
          question: 'Qual tipo de dados você está analisando?',
          type: 'select',
          options: ['Numéricos', 'Textuais', 'Categóricos', 'Séries temporais', 'Imagens', 'Mistos'],
          required: true
        },
        {
          id: 'analysis-goal',
          question: 'Qual o objetivo da análise?',
          type: 'textarea',
          required: true
        },
        {
          id: 'visualization',
          question: 'Precisa de visualizações?',
          type: 'multiselect',
          options: ['Gráficos', 'Tabelas', 'Dashboards', 'Mapas', 'Não preciso'],
          required: true
        },
        {
          id: 'statistical-methods',
          question: 'Métodos estatísticos específicos? (opcional)',
          type: 'text',
          required: false
        }
      ],
      'content-creation': [
        {
          id: 'content-type',
          question: 'Que tipo de conteúdo você precisa?',
          type: 'select',
          options: ['Post de Blog', 'Email Marketing', 'Copy de Vendas', 'Post para Redes Sociais', 'Artigo Técnico', 'Descrição de Produto'],
          required: true
        },
        {
          id: 'audience',
          question: 'Quem é o público-alvo?',
          type: 'text',
          required: true
        },
        {
          id: 'goal',
          question: 'Qual o objetivo do conteúdo?',
          type: 'textarea',
          required: true
        },
        {
          id: 'keywords',
          question: 'Palavras-chave importantes (separadas por vírgula):',
          type: 'text',
          required: false
        },
        {
          id: 'tone-voice',
          question: 'Tom de voz desejado:',
          type: 'select',
          options: ['Profissional', 'Amigável', 'Persuasivo', 'Educativo', 'Inspirador', 'Divertido'],
          required: true
        }
      ],
      'problem-solving': [
        {
          id: 'problem-description',
          question: 'Descreva o problema em detalhes:',
          type: 'textarea',
          required: true
        },
        {
          id: 'context',
          question: 'Contexto adicional:',
          type: 'textarea',
          required: false
        },
        {
          id: 'constraints',
          question: 'Há restrições ou limitações?',
          type: 'textarea',
          required: false
        },
        {
          id: 'solution-type',
          question: 'Que tipo de solução você procura?',
          type: 'multiselect',
          options: ['Passo a passo', 'Estratégia geral', 'Múltiplas alternativas', 'Análise detalhada'],
          required: true
        }
      ],
      'translation': [
        {
          id: 'source-language',
          question: 'Idioma de origem:',
          type: 'select',
          options: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Japonês', 'Chinês', 'Outro'],
          required: true
        },
        {
          id: 'target-language',
          question: 'Idioma de destino:',
          type: 'select',
          options: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Japonês', 'Chinês', 'Outro'],
          required: true
        },
        {
          id: 'formality',
          question: 'Nível de formalidade:',
          type: 'radio',
          options: ['Formal', 'Neutro', 'Informal'],
          required: true
        },
        {
          id: 'context-translation',
          question: 'Contexto do texto (técnico, literário, comercial, etc.):',
          type: 'text',
          required: true
        }
      ],
      'summarization': [
        {
          id: 'summary-length',
          question: 'Tamanho do resumo desejado:',
          type: 'radio',
          options: ['Muito curto (2-3 frases)', 'Curto (1 parágrafo)', 'Médio (2-3 parágrafos)', 'Detalhado'],
          required: true
        },
        {
          id: 'focus',
          question: 'Foco do resumo:',
          type: 'multiselect',
          options: ['Principais ideias', 'Conclusões', 'Dados e estatísticas', 'Argumentos', 'Tudo'],
          required: true
        },
        {
          id: 'format',
          question: 'Formato preferido:',
          type: 'radio',
          options: ['Parágrafo corrido', 'Bullet points', 'Misto'],
          required: true
        }
      ],
      'chatbot': [
        {
          id: 'bot-purpose',
          question: 'Qual a função do assistente virtual?',
          type: 'textarea',
          required: true
        },
        {
          id: 'personality',
          question: 'Personalidade desejada:',
          type: 'select',
          options: ['Profissional', 'Amigável', 'Divertido', 'Empático', 'Direto ao ponto', 'Educativo'],
          required: true
        },
        {
          id: 'knowledge-area',
          question: 'Área de conhecimento especializado:',
          type: 'text',
          required: true
        },
        {
          id: 'interaction-style',
          question: 'Estilo de interação:',
          type: 'multiselect',
          options: ['Fazer perguntas de esclarecimento', 'Dar exemplos', 'Fornecer explicações detalhadas', 'Ser conciso', 'Usar analogias'],
          required: true
        }
      ],
      'custom': [
        {
          id: 'custom-purpose',
          question: 'Descreva o propósito do prompt:',
          type: 'textarea',
          required: true
        },
        {
          id: 'custom-requirements',
          question: 'Requisitos específicos:',
          type: 'textarea',
          required: true
        },
        {
          id: 'custom-constraints',
          question: 'Restrições ou limitações:',
          type: 'textarea',
          required: false
        },
        {
          id: 'custom-format',
          question: 'Formato de saída esperado:',
          type: 'text',
          required: false
        },
        {
          id: 'custom-examples',
          question: 'Exemplos do que você espera (opcional):',
          type: 'textarea',
          required: false
        }
      ]
    }

    return questionSets[type] || []
  }

  const handleTypeSelection = (type: string) => {
    setPromptType(type)
    const qs = generateQuestions(type)
    setQuestions(qs)
    setStep('questions')
    setCurrentQuestionIndex(0)
    setAnswers([])
  }

  const handleAnswer = (questionId: string, value: string | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== questionId)
    newAnswers.push({ questionId, value })
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      generatePrompt()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const canProceed = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion.required) return true

    const answer = answers.find(a => a.questionId === currentQuestion.id)
    if (!answer) return false

    if (Array.isArray(answer.value)) {
      return answer.value.length > 0
    }
    return answer.value.trim() !== ''
  }

  const generatePrompt = () => {
    const promptTypeName = promptTypes.find(t => t.id === promptType)?.name || ''

    let prompt = `# Prompt para ${promptTypeName}\n\n`

    const answerMap = new Map(answers.map(a => [a.questionId, a.value]))

    questions.forEach(q => {
      const answer = answerMap.get(q.id)
      if (answer) {
        prompt += `**${q.question}**\n`
        if (Array.isArray(answer)) {
          prompt += answer.join(', ') + '\n\n'
        } else {
          prompt += answer + '\n\n'
        }
      }
    })

    prompt += `\n---\n\n## Prompt Completo:\n\n`

    // Build detailed prompt based on type
    switch (promptType) {
      case 'creative-writing':
        prompt += buildCreativeWritingPrompt(answerMap)
        break
      case 'code-generation':
        prompt += buildCodeGenerationPrompt(answerMap)
        break
      case 'data-analysis':
        prompt += buildDataAnalysisPrompt(answerMap)
        break
      case 'content-creation':
        prompt += buildContentCreationPrompt(answerMap)
        break
      case 'problem-solving':
        prompt += buildProblemSolvingPrompt(answerMap)
        break
      case 'translation':
        prompt += buildTranslationPrompt(answerMap)
        break
      case 'summarization':
        prompt += buildSummarizationPrompt(answerMap)
        break
      case 'chatbot':
        prompt += buildChatbotPrompt(answerMap)
        break
      case 'custom':
        prompt += buildCustomPrompt(answerMap)
        break
    }

    setGeneratedPrompt(prompt)
    setStep('result')
  }

  const buildCreativeWritingPrompt = (answers: Map<string, string | string[]>) => {
    return `Por favor, escreva um texto no gênero ${answers.get('genre')} com as seguintes especificações:

Tom: ${answers.get('tone')}
Tamanho: ${answers.get('length')}

Tema/Enredo: ${answers.get('topic')}

${answers.get('characters') ? `Personagens: ${answers.get('characters')}\n` : ''}
${answers.get('style') ? `Estilo inspirado em: ${answers.get('style')}\n` : ''}

Desenvolva a narrativa de forma envolvente, mantendo coerência e criatividade ao longo do texto.`
  }

  const buildCodeGenerationPrompt = (answers: Map<string, string | string[]>) => {
    return `Preciso que você desenvolva código na linguagem ${answers.get('language')} com os seguintes requisitos:

${answers.get('framework') ? `Framework: ${answers.get('framework')}\n` : ''}
Funcionalidade: ${answers.get('functionality')}

Nível de complexidade: ${answers.get('complexity')}

${answers.get('requirements') ? `Requisitos específicos: ${answers.get('requirements')}\n` : ''}

Documentação: ${answers.get('documentation')}

Por favor, forneça código limpo, bem estruturado e seguindo as melhores práticas da linguagem.`
  }

  const buildDataAnalysisPrompt = (answers: Map<string, string | string[]>) => {
    const viz = Array.isArray(answers.get('visualization'))
      ? (answers.get('visualization') as string[]).join(', ')
      : answers.get('visualization')

    return `Preciso de uma análise de dados com as seguintes características:

Tipo de dados: ${answers.get('data-type')}
Objetivo: ${answers.get('analysis-goal')}

Visualizações necessárias: ${viz}

${answers.get('statistical-methods') ? `Métodos estatísticos: ${answers.get('statistical-methods')}\n` : ''}

Por favor, forneça uma análise completa, incluindo insights e recomendações baseadas nos dados.`
  }

  const buildContentCreationPrompt = (answers: Map<string, string | string[]>) => {
    return `Crie um(a) ${answers.get('content-type')} com as seguintes especificações:

Público-alvo: ${answers.get('audience')}
Objetivo: ${answers.get('goal')}
Tom de voz: ${answers.get('tone-voice')}

${answers.get('keywords') ? `Palavras-chave a incluir: ${answers.get('keywords')}\n` : ''}

O conteúdo deve ser envolvente, relevante para o público e atingir o objetivo proposto.`
  }

  const buildProblemSolvingPrompt = (answers: Map<string, string | string[]>) => {
    const solutionTypes = Array.isArray(answers.get('solution-type'))
      ? (answers.get('solution-type') as string[]).join(', ')
      : answers.get('solution-type')

    return `Preciso de ajuda para resolver o seguinte problema:

${answers.get('problem-description')}

${answers.get('context') ? `Contexto: ${answers.get('context')}\n` : ''}
${answers.get('constraints') ? `Restrições: ${answers.get('constraints')}\n` : ''}

Tipo de solução desejada: ${solutionTypes}

Por favor, forneça uma análise completa e soluções práticas e aplicáveis.`
  }

  const buildTranslationPrompt = (answers: Map<string, string | string[]>) => {
    return `Por favor, traduza o seguinte texto de ${answers.get('source-language')} para ${answers.get('target-language')}:

[INSIRA SEU TEXTO AQUI]

Especificações:
- Nível de formalidade: ${answers.get('formality')}
- Contexto: ${answers.get('context-translation')}

Mantenha o significado e a intenção original do texto, adaptando expressões idiomáticas quando necessário.`
  }

  const buildSummarizationPrompt = (answers: Map<string, string | string[]>) => {
    const focus = Array.isArray(answers.get('focus'))
      ? (answers.get('focus') as string[]).join(', ')
      : answers.get('focus')

    return `Por favor, resuma o seguinte texto:

[INSIRA SEU TEXTO AQUI]

Especificações do resumo:
- Tamanho: ${answers.get('summary-length')}
- Foco: ${focus}
- Formato: ${answers.get('format')}

Mantenha os pontos mais importantes e relevantes do texto original.`
  }

  const buildChatbotPrompt = (answers: Map<string, string | string[]>) => {
    const interactionStyle = Array.isArray(answers.get('interaction-style'))
      ? (answers.get('interaction-style') as string[]).join(', ')
      : answers.get('interaction-style')

    return `Você é um assistente virtual com as seguintes características:

Função: ${answers.get('bot-purpose')}
Personalidade: ${answers.get('personality')}
Área de especialização: ${answers.get('knowledge-area')}
Estilo de interação: ${interactionStyle}

Sempre responda de acordo com sua função e personalidade, mantendo-se no contexto da sua área de especialização. Seja útil, claro e engajante em suas interações.`
  }

  const buildCustomPrompt = (answers: Map<string, string | string[]>) => {
    return `${answers.get('custom-purpose')}

Requisitos:
${answers.get('custom-requirements')}

${answers.get('custom-constraints') ? `Restrições: ${answers.get('custom-constraints')}\n` : ''}
${answers.get('custom-format') ? `Formato esperado: ${answers.get('custom-format')}\n` : ''}
${answers.get('custom-examples') ? `Exemplos: ${answers.get('custom-examples')}` : ''}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const restart = () => {
    setStep('initial')
    setPromptType('')
    setCurrentQuestionIndex(0)
    setAnswers([])
    setQuestions([])
    setGeneratedPrompt('')
  }

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex]
    const currentAnswer = answers.find(a => a.questionId === question.id)

    return (
      <div className={styles.questionContainer}>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className={styles.questionNumber}>
          Pergunta {currentQuestionIndex + 1} de {questions.length}
        </div>

        <h2 className={styles.question}>
          {question.question}
          {!question.required && <span className={styles.optional}> (opcional)</span>}
        </h2>

        <div className={styles.answerInput}>
          {question.type === 'text' && (
            <input
              type="text"
              value={(currentAnswer?.value as string) || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className={styles.textInput}
              placeholder="Digite sua resposta..."
            />
          )}

          {question.type === 'textarea' && (
            <textarea
              value={(currentAnswer?.value as string) || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className={styles.textarea}
              placeholder="Digite sua resposta..."
              rows={6}
            />
          )}

          {question.type === 'select' && (
            <select
              value={(currentAnswer?.value as string) || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className={styles.select}
            >
              <option value="">Selecione uma opção...</option>
              {question.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}

          {question.type === 'radio' && (
            <div className={styles.radioGroup}>
              {question.options?.map(option => (
                <label key={option} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={(currentAnswer?.value as string) === option}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className={styles.radio}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'multiselect' && (
            <div className={styles.checkboxGroup}>
              {question.options?.map(option => {
                const values = (currentAnswer?.value as string[]) || []
                return (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={values.includes(option)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...values, option]
                          : values.filter(v => v !== option)
                        handleAnswer(question.id, newValues)
                      }}
                      className={styles.checkbox}
                    />
                    <span>{option}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.navigationButtons}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={styles.secondaryButton}
          >
            ← Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={styles.primaryButton}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Gerar Prompt ✨' : 'Próxima →'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>🎯 Assistente Construtor de Prompts</h1>
          <p className={styles.subtitle}>
            Crie prompts complexos e eficazes respondendo perguntas interativas
          </p>
        </header>

        {step === 'initial' && (
          <div className={styles.typeSelection}>
            <h2 className={styles.sectionTitle}>Escolha o tipo de prompt que deseja criar:</h2>
            <div className={styles.grid}>
              {promptTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelection(type.id)}
                  className={styles.typeCard}
                >
                  <span className={styles.typeIcon}>{type.icon}</span>
                  <span className={styles.typeName}>{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'questions' && renderQuestion()}

        {step === 'result' && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>✅ Prompt Gerado com Sucesso!</h2>

            <div className={styles.promptBox}>
              <pre className={styles.promptText}>{generatedPrompt}</pre>
            </div>

            <div className={styles.resultButtons}>
              <button onClick={copyToClipboard} className={styles.primaryButton}>
                {copied ? '✓ Copiado!' : '📋 Copiar Prompt'}
              </button>
              <button onClick={restart} className={styles.secondaryButton}>
                🔄 Criar Novo Prompt
              </button>
            </div>

            <div className={styles.tip}>
              💡 <strong>Dica:</strong> Copie o prompt e cole em sua IA favorita para obter os melhores resultados!
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
