import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Clock3, GraduationCap, LogOut, Plus, Target, UserPlus, X } from 'lucide-react'
import './styles.css'

const lessons = [
  {
    time: '07:00 – 07:50',
    className: '8º A',
    subject: 'Língua Portuguesa',
    skill: 'EF08LP04',
    theme: 'Gêneros textuais',
    objective: 'Reconhecer as características de uma notícia.',
    color: 'coral'
  },
  {
    time: '07:50 – 08:40',
    className: '8º A',
    subject: 'Matemática',
    skill: 'EF08MA04',
    theme: 'Porcentagem',
    objective: 'Resolver situações do cotidiano usando porcentagens.',
    color: 'blue'
  },
  {
    time: '09:00 – 09:50',
    className: '9º B',
    subject: 'Ciências',
    skill: 'EF09CI14',
    theme: 'Sistema Solar',
    objective: 'Relacionar os movimentos da Terra às estações do ano.',
    color: 'gold'
  },
  {
    time: '09:50 – 10:40',
    className: '9º B',
    subject: 'História',
    skill: 'EF09HI02',
    theme: 'Brasil República',
    objective: 'Identificar mudanças políticas no início da República.',
    color: 'teal'
  }
]

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('pei-user') || 'null'))
  const [teachers, setTeachers] = useState(() => JSON.parse(localStorage.getItem('pei-teachers') || '[]'))
  const [showTeacherForm, setShowTeacherForm] = useState(false)

  if (!user) {
    return <Login onLogin={account => {
      const loggedUser = { name: account.name, email: account.email }
      localStorage.setItem('pei-user', JSON.stringify(loggedUser))
      setUser(loggedUser)
    }} />
  }

  const addTeacher = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const teacher = {
      id: Date.now(),
      name: form.get('name'),
      subject: form.get('subject'),
      email: form.get('email')
    }
    const nextTeachers = [...teachers, teacher]
    localStorage.setItem('pei-teachers', JSON.stringify(nextTeachers))
    setTeachers(nextTeachers)
    setShowTeacherForm(false)
  }

  const logout = () => {
    localStorage.removeItem('pei-user')
    setUser(null)
  }

  // Guarda a data que está sendo exibida na agenda.
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 8, 18))

  // Altera a data em uma quantidade de dias.
  const changeDate = (amount) => {
    setSelectedDate(currentDate => {
      const nextDate = new Date(currentDate)
      nextDate.setDate(nextDate.getDate() + amount)
      return nextDate
    })
  }

  const dateText = selectedDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <div className="agenda-app">
      <aside className="agenda-sidebar">
        <div className="agenda-brand">
          <span className="brand-mark"><GraduationCap size={20} /></span>
          <span><strong>PEI Agenda</strong><small>Planejamento escolar</small></span>
        </div>
        <p className="nav-label">MENU</p>
        <button className="agenda-nav active"><CalendarDays size={18} />Agenda de aulas</button>
        <button className="agenda-nav"><BookOpen size={18} />Conteúdos</button>
        <button className="agenda-nav"><Target size={18} />Habilidades da BNCC</button>
        <button className="agenda-nav" onClick={() => setShowTeacherForm(true)}><UserPlus size={18} />Cadastrar professor</button>
        <div className="agenda-sidebar-footer">
          <strong>{user.name}</strong><br />{user.email}
          <button className="agenda-logout" onClick={logout}><LogOut size={14} />Sair</button>
        </div>
      </aside>

      <main className="agenda-main">
        <header className="agenda-topbar">
          <div><span className="agenda-kicker">PLANEJAMENTO PEDAGÓGICO</span><h1>Agenda de aulas</h1></div>
          <button className="primary" onClick={() => window.alert('O formulário de nova aula será criado no próximo passo.')}>
            <Plus size={17} />Nova aula
          </button>
        </header>

        <section className="agenda-content">
          <div className="agenda-week-heading">
            <div>
              <p className="muted">Semana de 14 a 18 de setembro de 2026</p>
              <div className="agenda-date-controls">
                <button aria-label="Dia anterior" onClick={() => changeDate(-1)}><ChevronLeft size={17} /></button>
                <strong>{dateText}</strong>
                <button aria-label="Próximo dia" onClick={() => changeDate(1)}><ChevronRight size={17} /></button>
              </div>
            </div>
            <button className="agenda-today" onClick={() => setSelectedDate(new Date(2026, 8, 18))}>Hoje</button>
          </div>

          <div className="agenda-notice">
            <CalendarDays size={19} />
            <span>Esta é uma visualização de exemplo. Em breve você poderá cadastrar suas próprias aulas.</span>
          </div>

          <div className="agenda-summary">
            <div><Clock3 size={19} /><span><strong>4 aulas</strong><small>planejadas hoje</small></span></div>
            <div><BookOpen size={19} /><span><strong>4 componentes</strong><small>curriculares</small></span></div>
            <div><Target size={19} /><span><strong>4 habilidades</strong><small>da BNCC trabalhadas</small></span></div>
          </div>

          <div className="agenda-list">
            {lessons.map(lesson => <LessonCard key={lesson.time} lesson={lesson} />)}
          </div>
        </section>
      </main>
      {showTeacherForm && <TeacherForm onClose={() => setShowTeacherForm(false)} onSubmit={addTeacher} />}
    </div>
  )
}

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [accounts, setAccounts] = useState(() => JSON.parse(localStorage.getItem('pei-accounts') || '[]'))
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const account = accounts.find(item => item.email === email && item.password === password)
    if (!account) {
      setError('E-mail ou senha incorretos.')
      return
    }
    onLogin(account)
  }

  const register = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const confirmation = String(form.get('confirmation'))
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres, com letras e números.')
      return
    }
    if (password !== confirmation) {
      setError('A confirmação da senha não confere.')
      return
    }
    if (accounts.some(account => account.email === email)) {
      setError('Este e-mail já está cadastrado.')
      return
    }
    const nextAccounts = [...accounts, { name, email, password }]
    localStorage.setItem('pei-accounts', JSON.stringify(nextAccounts))
    setAccounts(nextAccounts)
    setMode('login')
    setError('Cadastro realizado. Agora entre com seu e-mail e senha.')
  }

  return <main className="login-page">
    <section className="login-card">
      <div className="login-brand"><span className="brand-mark"><GraduationCap size={22} /></span><span><strong>PEI Agenda</strong><small>Planejamento escolar</small></span></div>
      <p className="agenda-kicker">{mode === 'login' ? 'ÁREA RESTRITA' : 'NOVO PROFESSOR'}</p>
      <h1>{mode === 'login' ? 'Entrar no sistema' : 'Criar cadastro'}</h1>
      <p className="muted">{mode === 'login' ? 'Acesse sua agenda de aulas.' : 'Crie seu acesso para registrar seus planejamentos.'}</p>
      {mode === 'login' ? <form onSubmit={submit}>
        <label>E-mail<input name="email" type="email" required placeholder="professor@pei.edu.br" /></label>
        <label>Senha<input name="password" type="password" required placeholder="Sua senha" /></label>
        {error && <p className="login-message">{error}</p>}
        <button className="primary full">Entrar</button>
        <button className="login-link" type="button" onClick={() => { setMode('register'); setError('') }}>Ainda não tenho cadastro</button>
      </form> : <form onSubmit={register}>
        <label>Nome completo<input name="name" required placeholder="Nome do professor" /></label>
        <label>E-mail<input name="email" type="email" required placeholder="professor@pei.edu.br" /></label>
        <label>Senha<input name="password" type="password" required placeholder="Letras e números, mínimo 8 caracteres" /></label>
        <label>Confirmar senha<input name="confirmation" type="password" required placeholder="Repita a senha" /></label>
        {error && <p className="login-message">{error}</p>}
        <button className="primary full">Criar cadastro</button>
        <button className="login-link" type="button" onClick={() => { setMode('login'); setError('') }}>Voltar para o login</button>
      </form>}
    </section>
  </main>
}

function TeacherForm({ onClose, onSubmit }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={event => event.stopPropagation()}>
    <div className="modal-head"><h2>Cadastrar professor</h2><button onClick={onClose} aria-label="Fechar"><X size={18} /></button></div>
    <form onSubmit={onSubmit}>
      <label>Nome completo<input name="name" required placeholder="Nome do professor" /></label>
      <label>Disciplina<input name="subject" required placeholder="Ex.: Matemática" /></label>
      <label>E-mail institucional<input name="email" type="email" required placeholder="professor@pei.edu.br" /></label>
      <button className="primary full">Salvar professor</button>
    </form>
  </section></div>
}

function LessonCard({ lesson }) {
  return (
    <article className={`lesson-card ${lesson.color}`}>
      <div className="lesson-time"><Clock3 size={15} />{lesson.time}</div>
      <div className="lesson-main">
        <div className="lesson-heading"><div><span className="lesson-class">{lesson.className}</span><h2>{lesson.subject}</h2></div><span className="bncc-code">{lesson.skill}</span></div>
        <div className="lesson-details">
          <div><span className="detail-label">Tema da aula</span><strong>{lesson.theme}</strong></div>
          <div><span className="detail-label">Objetivo da aula</span><strong>{lesson.objective}</strong></div>
        </div>
      </div>
    </article>
  )
}

createRoot(document.getElementById('root')).render(<App />)
