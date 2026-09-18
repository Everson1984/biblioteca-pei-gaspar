import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Clock3, GraduationCap, Plus, Target } from 'lucide-react'
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
        <div className="agenda-sidebar-footer">Primeiro protótipo<br /><strong>Unidade Centro</strong></div>
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
    </div>
  )
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
