import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AlertTriangle, ArrowRight, Check, ChevronRight, ClipboardList, FileText, LogOut,
  GraduationCap, LayoutDashboard, MessageSquare, Plus, Search, Settings2,
  ShieldCheck, UserRound, Users, X
} from 'lucide-react'
import './styles.css'

const occurrenceOptions = ['Atraso recorrente', 'Conflito entre colegas', 'Uso indevido do celular', 'Baixo envolvimento nas atividades', 'Falta injustificada', 'Desrespeito às regras', 'Outro']
const seedStudents = [
  { id: 1, name: 'Ana Clara Souza', ra: '2024018', className: '8º A', guardian: 'Mariana Souza', phone: '(11) 98822-3410' },
  { id: 2, name: 'Miguel Santos', ra: '2024024', className: '9º B', guardian: 'Carlos Santos', phone: '(11) 99104-1822' },
  { id: 3, name: 'Beatriz Oliveira', ra: '2024031', className: '7º C', guardian: 'Renata Oliveira', phone: '(11) 98710-4415' },
  { id: 4, name: 'João Pedro Lima', ra: '2024047', className: '8º A', guardian: 'Paulo Lima', phone: '(11) 99221-8760' }
]
const seedTeachers = [
  { id: 1, name: 'Camila Mendes', subject: 'Língua Portuguesa', email: 'camila.mendes@pei.edu.br' },
  { id: 2, name: 'Rafael Nascimento', subject: 'Matemática', email: 'rafael.nascimento@pei.edu.br' },
  { id: 3, name: 'Juliana Castro', subject: 'Ciências', email: 'juliana.castro@pei.edu.br' }
]
const seedOccurrences = [
  { id: 1, studentId: 1, teacherId: 1, type: 'Conflito entre colegas', date: '2026-09-16', status: 'Em acompanhamento', description: 'Discussão durante a atividade em grupo. Realizada escuta individual.', feedback: 'Retomar combinados de convivência na próxima tutoria.', author: 'Camila Mendes' },
  { id: 2, studentId: 2, teacherId: 2, type: 'Uso indevido do celular', date: '2026-09-15', status: 'Aguardando retorno', description: 'Celular utilizado durante avaliação.', feedback: '', author: 'Rafael Nascimento' },
  { id: 3, studentId: 3, teacherId: 3, type: 'Baixo envolvimento nas atividades', date: '2026-09-12', status: 'Resolvida', description: 'Aluna apresentou baixa participação nas últimas aulas.', feedback: 'Família contatada e plano de estudos combinado.', author: 'Juliana Castro' }
]
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }
const formatDate = value => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`))
const roleOptions = ['Diretor', 'Vice-diretor', 'Coordenador', 'Professor']
const managementRoles = ['Diretor', 'Vice-diretor', 'Coordenador']

function App() {
  const [session, setSession] = useState(() => load('pei-session', null))
  const [page, setPage] = useState('Visão geral')
  const [students, setStudents] = useState(() => load('pei-students', seedStudents))
  const [teachers, setTeachers] = useState(() => load('pei-teachers', seedTeachers))
  const [occurrences, setOccurrences] = useState(() => load('pei-occurrences', seedOccurrences))
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  if (!session) return <Login onLogin={user => { setSession(user); persist('pei-session', user) }} />
  const persist = (key, value) => localStorage.setItem(key, JSON.stringify(value))
  const notify = text => { setToast(text); window.setTimeout(() => setToast(''), 2600) }
  const openOccurrences = occurrences.filter(item => item.status !== 'Resolvida')
  const stats = { open: openOccurrences.length, today: occurrences.filter(item => item.date === '2026-09-18').length, students: students.length, feedback: occurrences.filter(item => item.feedback).length }
  const addRecord = (event, kind) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (kind === 'student') {
      const next = [...students, { id: Date.now(), name: form.get('name'), ra: form.get('ra'), className: form.get('className'), guardian: form.get('guardian'), phone: form.get('phone') }]
      setStudents(next); persist('pei-students', next); notify('Aluno cadastrado com sucesso')
    } else if (kind === 'teacher') {
      if (!canManageTeachers) { notify('Somente diretor, vice-diretor e coordenador podem cadastrar professores'); return }
      const next = [...teachers, { id: Date.now(), name: form.get('name'), subject: form.get('subject'), email: form.get('email') }]
      setTeachers(next); persist('pei-teachers', next); notify('Professor cadastrado com sucesso')
    } else {
      const next = [...occurrences, { id: Date.now(), studentId: Number(form.get('studentId')), teacherId: Number(form.get('teacherId')), type: form.get('type'), date: form.get('date'), status: 'Aguardando retorno', description: form.get('description'), feedback: '', author: teachers.find(t => t.id === Number(form.get('teacherId')))?.name || 'Equipe pedagógica' }]
      setOccurrences(next); persist('pei-occurrences', next); notify('Ocorrência registrada e enviada para acompanhamento')
    }
    setModal(null)
  }
  const updateStatus = (item, status) => {
    const next = occurrences.map(row => row.id === item.id ? { ...row, status } : row)
    setOccurrences(next); persist('pei-occurrences', next); notify('Status atualizado')
  }
  const saveFeedback = (event, item) => {
    event.preventDefault()
    const feedback = new FormData(event.currentTarget).get('feedback')
    const next = occurrences.map(row => row.id === item.id ? { ...row, feedback, status: 'Em acompanhamento' } : row)
    setOccurrences(next); persist('pei-occurrences', next); setModal(null); notify('Feedback salvo no histórico')
  }
  const nav = label => { setPage(label); setQuery('') }
  const canManageTeachers = managementRoles.includes(session.role)
  const logout = () => { localStorage.removeItem('pei-session'); setSession(null) }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><ShieldCheck size={20} /></span><span><strong>PEI</strong><small>Gestão pedagógica</small></span></div>
      <div className="school-switch"><span className="status-dot" /> Unidade Centro <ChevronRight size={15} /></div>
      <p className="nav-label">MENU PRINCIPAL</p>
      <nav>{[[LayoutDashboard, 'Visão geral'], [ClipboardList, 'Ocorrências'], [GraduationCap, 'Alunos'], [Users, 'Professores'], [MessageSquare, 'Feedback']].map(([Icon, label]) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => nav(label)}><Icon size={18} />{label}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18} />Configurações</button><div className="profile"><div className="avatar">CS</div><div><strong>{session.name}</strong><small>{session.role}</small></div><button className="logout-button" onClick={logout} aria-label="Sair">Sair</button></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumb">PEI Dr. Gaspar Ricardo Junior <ChevronRight size={14} /><strong>{page}</strong></div><div className="top-actions"><span>18 de setembro de 2026</span><div className="avatar avatar-small">CS</div><button className="top-logout" onClick={logout}><LogOut size={15} />Sair</button></div></header>
      {page === 'Visão geral' && <Dashboard stats={stats} occurrences={occurrences} students={students} role={session.role} onNavigate={nav} onNew={() => setModal('occurrence')} />}
      {page === 'Ocorrências' && <Occurrences items={occurrences} students={students} query={query} setQuery={setQuery} onNew={() => setModal('occurrence')} onFeedback={item => setModal({ type: 'feedback', item })} onStatus={updateStatus} />}
      {page === 'Alunos' && <People title="Alunos cadastrados" subtitle="Consulte turmas e responsáveis" items={students} query={query} setQuery={setQuery} kind="student" onNew={() => setModal('student')} />}
      {page === 'Professores' && canManageTeachers && <People title="Professores cadastrados" subtitle="Equipe docente da unidade" items={teachers} query={query} setQuery={setQuery} kind="teacher" onNew={() => setModal('teacher')} />}
      {page === 'Feedback' && <Feedback items={occurrences.filter(item => item.feedback)} students={students} onOpen={item => setModal({ type: 'feedback', item })} />}
    </main>
    {modal === 'student' && <Modal title="Cadastrar aluno" onClose={() => setModal(null)}><form onSubmit={e => addRecord(e, 'student')}><label>Nome completo<input name="name" required placeholder="Ex.: Ana Souza" /></label><div className="form-row"><label>RA<input name="ra" required placeholder="2024000" /></label><label>Turma<input name="className" required placeholder="8º A" /></label></div><label>Responsável<input name="guardian" required placeholder="Nome do responsável" /></label><label>Telefone<input name="phone" required placeholder="(00) 00000-0000" /></label><button className="primary full">Cadastrar aluno</button></form></Modal>}
    {modal === 'teacher' && canManageTeachers && <Modal title="Cadastrar professor" onClose={() => setModal(null)}><form onSubmit={e => addRecord(e, 'teacher')}><label>Nome completo<input name="name" required placeholder="Ex.: Camila Mendes" /></label><label>Disciplina<input name="subject" required placeholder="Ex.: Matemática" /></label><label>E-mail institucional<input name="email" type="email" required placeholder="nome@pei.edu.br" /></label><button className="primary full">Cadastrar professor</button></form></Modal>}
    {modal === 'occurrence' && <Modal title="Nova ocorrência" onClose={() => setModal(null)}><div className="access-context"><ShieldCheck size={15} /><span>Registrando como {session.role}</span></div><form onSubmit={e => addRecord(e, 'occurrence')}><label>Aluno<select name="studentId" required>{students.map(s => <option key={s.id} value={s.id}>{s.name} · {s.className}</option>)}</select></label><div className="form-row"><label>Professor<select name="teacherId" required>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label>Data<input name="date" type="date" defaultValue="2026-09-18" required /></label></div><label>Tipo de ocorrência<select name="type" required>{occurrenceOptions.map(option => <option key={option}>{option}</option>)}</select></label><label>Relato da situação<textarea name="description" required placeholder="Descreva os fatos com objetividade..." /></label><button className="primary full">Registrar ocorrência</button></form></Modal>}
    {modal?.type === 'feedback' && <Modal title="Registrar feedback" onClose={() => setModal(null)}><div className="feedback-context"><strong>{students.find(s => s.id === modal.item.studentId)?.name}</strong><span>{modal.item.type} · {formatDate(modal.item.date)}</span></div><form onSubmit={e => saveFeedback(e, modal.item)}><label>Encaminhamento e feedback<textarea name="feedback" required defaultValue={modal.item.feedback} placeholder="Registre a conversa, acordo ou próximo passo..." /></label><button className="primary full">Salvar feedback</button></form></Modal>}
    {toast && <div className="toast"><Check size={17} />{toast}</div>}
  </div>
}

function Dashboard({ stats, occurrences, students, role, onNavigate, onNew }) {
  const recent = occurrences.slice().sort((a, b) => b.id - a.id).slice(0, 4)
  const greeting = role === 'Professor' ? 'professor' : role === 'Diretor' ? 'diretor' : role === 'Vice-diretor' ? 'vice-diretor' : 'coordenação'
  return <section className="content"><div className="page-heading"><div><p className="eyebrow">ACOMPANHAMENTO PEDAGÓGICO</p><h1>Bom dia, {greeting} <span>👋</span></h1><p className="muted">Uma visão clara para cuidar de cada situação.</p></div><button className="primary" onClick={onNew}><Plus size={18} />Nova ocorrência</button></div>
    <div className="stats-grid"><Stat icon={AlertTriangle} label="Casos em aberto" value={stats.open} detail="pedem acompanhamento" tone="coral" /><Stat icon={ClipboardList} label="Registradas hoje" value={stats.today} detail="na unidade" tone="gold" /><Stat icon={GraduationCap} label="Alunos cadastrados" value={stats.students} detail="em todas as turmas" tone="blue" /><Stat icon={MessageSquare} label="Feedbacks registrados" value={stats.feedback} detail="no histórico" tone="teal" /></div>
    <div className="dashboard-grid"><div className="panel"><div className="panel-title"><div><h2>Ocorrências recentes</h2><p className="muted">O que precisa da sua atenção</p></div><button className="text-button" onClick={() => onNavigate('Ocorrências')}>Ver todas <ArrowRight size={15} /></button></div><OccurrenceTable items={recent} students={students} /></div><div className="panel attention-panel"><div className="panel-title"><div><h2>Ações rápidas</h2><p className="muted">Atalhos para sua rotina</p></div></div><button onClick={onNew}><span className="quick-icon coral-bg"><Plus size={18} /></span><span><strong>Registrar ocorrência</strong><small>Documente uma nova situação</small></span><ArrowRight size={16} /></button><button onClick={() => onNavigate('Feedback')}><span className="quick-icon teal-bg"><MessageSquare size={18} /></span><span><strong>Dar feedback</strong><small>Atualize um encaminhamento</small></span><ArrowRight size={16} /></button></div></div>
    <div className="notice"><div className="notice-icon"><ShieldCheck size={19} /></div><div><strong>O acompanhamento é contínuo</strong><p>Registre fatos, combine próximos passos e mantenha a comunicação com a família no histórico.</p></div></div>
  </section>
}
function Stat({ icon: Icon, label, value, detail, tone }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></div> }
function Occurrences({ items, students, query, setQuery, onNew, onFeedback, onStatus }) {
  const filtered = items.filter(item => `${students.find(s => s.id === item.studentId)?.name} ${item.type}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="content"><PageHeading title="Ocorrências" subtitle="Registre e acompanhe situações pedagógicas" action="Nova ocorrência" onAction={onNew} /><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por aluno ou tipo..." /></div><span className="result-count">{filtered.length} registros</span></div><div className="panel table-panel"><OccurrenceTable items={filtered} students={students} detailed onFeedback={onFeedback} onStatus={onStatus} /></div></section>
}
function OccurrenceTable({ items, students, detailed, onFeedback, onStatus }) { return <div className="table-wrap"><table><thead><tr><th>Aluno</th><th>Ocorrência</th><th>Data</th><th>Status</th>{detailed && <th>Ação</th>}</tr></thead><tbody>{items.map(item => <tr key={item.id}><td><strong>{students.find(s => s.id === item.studentId)?.name || 'Aluno removido'}</strong><small className="cell-sub">{students.find(s => s.id === item.studentId)?.className}</small></td><td><span className="type-label"><span className="type-dot" />{item.type}</span></td><td>{formatDate(item.date)}</td><td><button className={`status-pill ${item.status === 'Resolvida' ? 'done' : item.status === 'Em acompanhamento' ? 'tracking' : ''}`} onClick={() => onStatus && onStatus(item, item.status === 'Resolvida' ? 'Aguardando retorno' : 'Resolvida')}><span />{item.status}</button></td>{detailed && <td><button className="row-action" onClick={() => onFeedback(item)}>{item.feedback ? 'Ver feedback' : 'Registrar feedback'} <ChevronRight size={14} /></button></td>}</tr>)}{items.length === 0 && <tr><td colSpan="5" className="empty">Nenhuma ocorrência encontrada.</td></tr>}</tbody></table></div> }
function People({ title, subtitle, items, query, setQuery, kind, onNew }) { const filtered = items.filter(item => `${item.name} ${item.subject || item.className}`.toLowerCase().includes(query.toLowerCase())); return <section className="content"><PageHeading title={title} subtitle={subtitle} action={kind === 'student' ? 'Cadastrar aluno' : 'Cadastrar professor'} onAction={onNew} /><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Buscar ${kind === 'student' ? 'aluno' : 'professor'}...`} /></div><span className="result-count">{filtered.length} cadastrados</span></div><div className="people-grid">{filtered.map(item => <div className="person-row" key={item.id}><div className={`person-avatar ${kind}`}>{item.name.split(' ').map(word => word[0]).slice(0, 2).join('')}</div><div className="person-info"><strong>{item.name}</strong><span>{kind === 'student' ? `${item.className} · RA ${item.ra}` : item.subject}</span></div><div className="person-extra">{kind === 'student' ? <><small>Responsável</small><strong>{item.guardian}</strong></> : <><small>E-mail institucional</small><strong>{item.email}</strong></>}</div><ChevronRight size={16} className="row-chevron" /></div>)}</div></section> }
function Feedback({ items, students, onOpen }) { return <section className="content"><PageHeading title="Espaço de feedback" subtitle="Registre conversas, acordos e próximos passos" /><div className="feedback-grid">{items.map(item => <button className="feedback-card" key={item.id} onClick={() => onOpen(item)}><div className="feedback-card-top"><span className="feedback-badge"><MessageSquare size={14} />Acompanhamento</span><span>{formatDate(item.date)}</span></div><h3>{students.find(s => s.id === item.studentId)?.name}</h3><p>{item.feedback}</p><footer><span>{item.type}</span><ArrowRight size={15} /></footer></button>)}</div></section> }
function PageHeading({ title, subtitle, action, onAction }) { return <div className="page-heading compact"><div><h1>{title}</h1><p className="muted">{subtitle}</p></div>{action && <button className="primary" onClick={onAction}><Plus size={18} />{action}</button>}</div> }
function Modal({ title, onClose, children }) { return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={onClose} aria-label="Fechar"><X size={18} /></button></div>{children}</div></div> }
function Login({ onLogin }) {
  const defaultAccounts = [
    { name: 'Direção Geral', role: 'Diretor', email: 'diretor@pei.edu.br', password: 'diretor123' },
    { name: 'Vice-direção', role: 'Vice-diretor', email: 'vice@pei.edu.br', password: 'vice123' },
    { name: 'Coordenação Pedagógica', role: 'Coordenador', email: 'coordenacao@pei.edu.br', password: 'coord123' },
    { name: 'Camila Mendes', role: 'Professor', email: 'camila.mendes@pei.edu.br', password: 'professor123' }
  ]
  const [accounts, setAccounts] = useState(() => load('pei-accounts', defaultAccounts))
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const submit = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const account = accounts.find(item => item.email === String(form.get('email')).trim().toLowerCase() && item.password === form.get('password'))
    if (!account) { setError('E-mail ou senha incorretos.'); return }
    onLogin({ name: account.name, role: account.role, email: account.email })
  }
  const submitRegister = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const role = String(form.get('role'))
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    if (accounts.some(item => item.email === email)) { setError('Este e-mail já está cadastrado.'); return }
    if (password.length < 8) { setError('A senha deve ter pelo menos 8 caracteres.'); return }
    if (password !== String(form.get('confirm'))) { setError('A confirmação da senha não confere.'); return }
    const next = [...accounts, { id: Date.now(), name, role, email, password }]
    setAccounts(next); localStorage.setItem('pei-accounts', JSON.stringify(next))
    setMessage('Cadastro criado. Entre com seu novo acesso.')
    setError('')
    setMode('login')
  }
  const changeMode = next => { setMode(next); setError(''); setMessage('') }
  return <main className="login-page"><div className="login-card"><div className="login-brand"><span className="brand-mark"><ShieldCheck size={22} /></span><span><strong>PEI</strong><small>Gestão pedagógica</small></span></div>{mode === 'login' ? <><p className="eyebrow">ÁREA RESTRITA</p><h1>Entrar no sistema</h1><p className="muted">Acesse com seu perfil para registrar e acompanhar ocorrências.</p><form onSubmit={submit}><label>E-mail institucional<input name="email" type="email" required placeholder="seu.email@pei.edu.br" /></label><label>Senha<input name="password" type="password" required placeholder="Digite sua senha" /></label>{error && <p className="login-error">{error}</p>}{message && <p className="login-success">{message}</p>}<button className="primary full">Entrar</button></form><div className="login-links"><span>Ainda não tem acesso?</span><button type="button" onClick={() => changeMode('register')}>Criar cadastro</button></div></> : <><p className="eyebrow">NOVO ACESSO</p><h1>Criar cadastro</h1><p className="muted">Cadastre diretor, vice-diretor, coordenador ou professor.</p><form onSubmit={submitRegister}><label>Nome completo<input name="name" required placeholder="Nome do profissional" /></label><label>Perfil de acesso<select name="role" defaultValue="Professor"><option>Diretor</option><option>Vice-diretor</option><option>Coordenador</option><option>Professor</option></select></label><label>E-mail institucional<input name="email" type="email" required placeholder="seu.email@pei.edu.br" /></label><div className="form-row"><label>Senha<input name="password" type="password" required placeholder="Mínimo 8 caracteres" /></label><label>Confirmar senha<input name="confirm" type="password" required placeholder="Repita a senha" /></label></div>{error && <p className="login-error">{error}</p>}<button className="primary full">Salvar cadastro</button></form><button className="back-login" type="button" onClick={() => changeMode('login')}>Voltar para o login</button></>}<div className="login-roles"><strong>Perfis disponíveis</strong><span>Diretor · Vice-diretor · Coordenador · Professor</span></div></div></main>
}

createRoot(document.getElementById('root')).render(<App />)
