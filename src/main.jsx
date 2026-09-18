import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft, ArrowRight, BookOpen, BookMarked, CalendarDays, Check, ChevronRight,
  CircleAlert, Clock3, Filter, LayoutDashboard, Library, Menu, Plus, RotateCcw,
  Search, Settings2, Tag, UserRound, Users, X, LogIn, LogOut, Trash2, Star
} from 'lucide-react'
import './styles.css'

const seedBooks = [
  { id: 1, title: 'Torto Arado', author: 'Itamar Vieira Junior', category: 'Literatura brasileira', year: 2019, pages: 264, available: 3, total: 4, color: 'terracotta', description: 'Em uma fazenda no sertão da Bahia, duas irmãs encontram na terra, na memória e na palavra a força para transformar suas vidas.' },
  { id: 2, title: 'Pequeno Manual Antirracista', author: 'Djamila Ribeiro', category: 'Sociedade', year: 2019, pages: 136, available: 2, total: 3, color: 'gold', description: 'Um guia direto e necessário para refletir sobre racismo estrutural e construir práticas antirracistas no cotidiano.' },
  { id: 3, title: 'O Avesso da Pele', author: 'Jeferson Tenório', category: 'Literatura brasileira', year: 2020, pages: 192, available: 0, total: 2, color: 'blue', description: 'Pedro revisita a trajetória do pai e as marcas de uma vida atravessada pelo racismo e pela violência.' },
  { id: 4, title: 'Ideias para Adiar o Fim do Mundo', author: 'Ailton Krenak', category: 'Ensaios', year: 2019, pages: 64, available: 4, total: 4, color: 'green', description: 'Reflexões sobre humanidade, natureza e os caminhos possíveis para imaginar outros futuros.' },
  { id: 5, title: 'A Hora da Estrela', author: 'Clarice Lispector', category: 'Clássicos', year: 1977, pages: 88, available: 1, total: 2, color: 'purple', description: 'A história de Macabéa, uma jovem nordestina que vive no Rio de Janeiro e quase passa despercebida pelo mundo.' },
  { id: 6, title: 'Quarto de Despejo', author: 'Carolina Maria de Jesus', category: 'Memórias', year: 1960, pages: 200, available: 2, total: 2, color: 'orange', description: 'Diário visceral de uma mulher, mãe e escritora que narra a vida na favela do Canindé.' }
]
const seedUsers = [
  { id: 1, name: 'Marina Costa', ra: '2024001', email: 'marina.costa@email.com', phone: '(11) 98877-1122', joined: '2024-02-14', active: true },
  { id: 2, name: 'Rafael Nascimento', ra: '2024002', email: 'rafael.n@email.com', phone: '(21) 97761-2233', joined: '2024-04-08', active: true },
  { id: 3, name: 'Beatriz Lima', ra: '2024003', email: 'bia.lima@email.com', phone: '(31) 99812-4500', joined: '2024-06-22', active: true },
  { id: 4, name: 'Lucas Andrade', ra: '2024004', email: 'lucas.andrade@email.com', phone: '(41) 99123-8877', joined: '2024-08-30', active: true }
]
const today = new Date()
const dateIn = days => new Date(today.getTime() + days * 86400000).toISOString().slice(0, 10)
const seedLoans = [
  { id: 1, bookId: 1, userId: 1, loanDate: '2024-09-04', dueDate: dateIn(5), returnedAt: null },
  { id: 2, bookId: 2, userId: 2, loanDate: '2024-09-02', dueDate: dateIn(-2), returnedAt: null },
  { id: 3, bookId: 5, userId: 3, loanDate: '2024-08-28', dueDate: '2024-09-10', returnedAt: null },
  { id: 4, bookId: 4, userId: 4, loanDate: '2024-08-10', dueDate: '2024-08-24', returnedAt: '2024-08-23' }
]
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }
const fmt = value => new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T12:00:00`))

function App() {
  const [librarian, setLibrarian] = useState(() => load('bv-librarian-session', null))
  const [page, setPage] = useState('Visão geral')
  const [books, setBooks] = useState(() => load('bv-books', seedBooks))
  const [users, setUsers] = useState(() => load('bv-users', seedUsers))
  const [loans, setLoans] = useState(() => load('bv-loans', seedLoans))
  const [libraryContent, setLibraryContent] = useState(() => load('bv-library-content', { tip: 'Você pode usar a busca no acervo para encontrar livros por título ou autor.', featuredStudent: 'Nenhum aluno destaque cadastrado ainda.', featuredReason: '' }))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))
  const notify = message => { setToast(message); setTimeout(() => setToast(''), 2800) }
  if (!librarian) return <Login onLogin={user => { setLibrarian(user); save('bv-librarian-session', user) }} />
  const activeLoans = loans.filter(l => !l.returnedAt)
  const overdue = activeLoans.filter(l => l.dueDate < dateIn(0))
  const categories = ['Todas', ...new Set(books.map(book => book.category))]
  const filteredBooks = useMemo(() => books.filter(book => {
    const matchesQuery = `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (category === 'Todas' || book.category === category)
  }), [books, query, category])

  const addUser = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const ra = String(form.get('ra')).trim()
    if (users.some(item => item.ra === ra)) { notify('Já existe um aluno com este RA'); return }
    const user = { id: Date.now(), name: form.get('name'), ra, email: form.get('email'), phone: form.get('phone'), joined: dateIn(0), active: true }
    const next = [...users, user]; setUsers(next); save('bv-users', next); setModal(null); notify('Leitor cadastrado com sucesso')
  }
  const addBook = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const total = Number(form.get('total'))
    const book = { id: Date.now(), title: form.get('title'), author: form.get('author'), category: form.get('category'), year: Number(form.get('year')), pages: 0, available: total, total, color: 'teal', description: 'Livro adicionado ao acervo pela equipe da biblioteca.' }
    const next = [...books, book]; setBooks(next); save('bv-books', next); setModal(null); notify('Livro adicionado ao acervo')
  }
  const deleteBook = book => {
    if (loans.some(loan => loan.bookId === book.id && !loan.returnedAt)) {
      notify('Não é possível excluir um livro com empréstimo ativo'); return
    }
    if (!window.confirm(`Excluir "${book.title}" do acervo?`)) return
    const next = books.filter(item => item.id !== book.id)
    setBooks(next); save('bv-books', next); setSelected(null); notify('Livro excluído do acervo')
  }
  const updateLibraryContent = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const next = { tip: String(form.get('tip')).trim(), featuredStudent: String(form.get('featuredStudent')).trim(), featuredReason: String(form.get('featuredReason')).trim() }
    setLibraryContent(next); save('bv-library-content', next); setModal(null); notify('Destaque e dica atualizados')
  }
  const deleteUser = user => {
    if (loans.some(loan => loan.userId === user.id && !loan.returnedAt)) {
      notify('Não é possível excluir um aluno com empréstimo ativo'); return
    }
    if (!window.confirm(`Excluir o aluno "${user.name}"?`)) return
    const next = users.filter(item => item.id !== user.id)
    setUsers(next); save('bv-users', next); notify('Aluno excluído')
  }
  const createLoan = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const loan = { id: Date.now(), bookId: Number(form.get('bookId')), userId: Number(form.get('userId')), loanDate: dateIn(0), dueDate: form.get('dueDate'), returnedAt: null }
    const next = [...loans, loan]
    const nextBooks = books.map(book => book.id === loan.bookId ? { ...book, available: Math.max(0, book.available - 1) } : book)
    setLoans(next); save('bv-loans', next); setBooks(nextBooks); save('bv-books', nextBooks); setModal(null); notify('Empréstimo registrado')
  }
  const returnBook = loan => {
    const next = loans.map(item => item.id === loan.id ? { ...item, returnedAt: dateIn(0) } : item)
    const nextBooks = books.map(book => book.id === loan.bookId ? { ...book, available: Math.min(book.total, book.available + 1) } : book)
    setLoans(next); save('bv-loans', next); setBooks(nextBooks); save('bv-books', nextBooks); notify('Livro devolvido e acervo atualizado')
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Library size={21} /></span><span>PEI Dr Gaspar Ricardo Junior</span></div>
      <div className="library-chip"><span className="status-dot" /> Unidade Centro <ChevronRight size={15} /></div>
      <nav aria-label="Navegação principal">
        {[
          [LayoutDashboard, 'Visão geral'], [BookOpen, 'Acervo'], [Users, 'Leitores'], [BookMarked, 'Empréstimos']
        ].map(([Icon, label]) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => { setPage(label); setSelected(null) }}><Icon size={18} /> {label}</button>)}
      </nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18} /> Configurações</button><div className="profile"><div className="avatar">AS</div><div><strong>{librarian.name}</strong><small>Bibliotecário</small></div><button className="logout-button" onClick={() => { localStorage.removeItem('bv-librarian-session'); setLibrarian(null) }} aria-label="Sair"><LogOut size={15} /></button></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="mobile-menu" aria-label="Abrir menu"><Menu /></button><div className="breadcrumb">PEI Dr Gaspar Ricardo Junior <ChevronRight size={15} /> <strong>{page}</strong></div><div className="top-actions"><span className="today">{fmt(dateIn(0))}</span><div className="avatar avatar-small">AS</div></div></header>
      {page === 'Visão geral' && <Dashboard loans={activeLoans} overdue={overdue} returnedToday={loans.filter(loan => loan.returnedAt === dateIn(0)).length} books={books} users={users} onNavigate={setPage} content={libraryContent} onEditContent={() => setModal('content')} />}
      {page === 'Acervo' && <Catalog books={filteredBooks} query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={categories} onSelect={setSelected} onLoan={() => setModal('loan')} onAddBook={() => setModal('book')} onDelete={deleteBook} />}
      {page === 'Leitores' && <Readers users={users} loans={loans} onAdd={() => setModal('user')} onDelete={deleteUser} />}
      {page === 'Empréstimos' && <Loans books={books} users={users} loans={loans} onReturn={returnBook} onAdd={() => setModal('loan')} />}
    </main>
    {selected && <BookDetail book={selected} onClose={() => setSelected(null)} onLoan={() => { setSelected(null); setModal('loan') }} onDelete={() => deleteBook(selected)} />}
    {modal === 'user' && <Modal title="Cadastrar aluno" onClose={() => setModal(null)}><form onSubmit={addUser}><label>Nome completo<input name="name" required placeholder="Ex.: Ana Souza" /></label><label>RA (registro do aluno)<input name="ra" required placeholder="Ex.: 20250123" /></label><label>Telefone<input name="phone" required placeholder="(00) 00000-0000" /></label><label>E-mail (opcional)<input name="email" type="email" placeholder="ana@email.com" /></label><button className="primary full" type="submit">Cadastrar aluno</button></form></Modal>}
    {modal === 'loan' && <Modal title="Novo empréstimo" onClose={() => setModal(null)}><form onSubmit={createLoan}><label>Livro<select name="bookId" required>{books.filter(b => b.available > 0).map(b => <option key={b.id} value={b.id}>{b.title}</option>)}</select></label><label>Leitor<select name="userId" required>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label><label>Data de devolução<input name="dueDate" type="date" required defaultValue={dateIn(14)} /></label><button className="primary full" type="submit">Registrar empréstimo</button></form></Modal>}
    {modal === 'book' && <Modal title="Adicionar livro ao acervo" onClose={() => setModal(null)}><form onSubmit={addBook}><label>Título<input name="title" required placeholder="Ex.: Dom Casmurro" /></label><label>Autor<input name="author" required placeholder="Nome do autor" /></label><label>Categoria<input name="category" required placeholder="Ex.: Literatura brasileira" /></label><div className="form-row"><label>Ano<input name="year" type="number" min="1000" max="2100" required defaultValue={new Date().getFullYear()} /></label><label>Exemplares<input name="total" type="number" min="1" required defaultValue="1" /></label></div><button className="primary full" type="submit">Adicionar ao acervo</button></form></Modal>}
    {modal === 'content' && <Modal title="Conteúdo para os alunos" onClose={() => setModal(null)}><form onSubmit={updateLibraryContent}><label>Dica de livro<textarea name="tip" required defaultValue={libraryContent.tip} placeholder="Escreva uma dica de leitura..." /></label><label>Aluno destaque do mês<input name="featuredStudent" required defaultValue={libraryContent.featuredStudent} placeholder="Nome do aluno" /></label><label>Por que ele merece o destaque?<textarea name="featuredReason" defaultValue={libraryContent.featuredReason} placeholder="Ex.: participação e incentivo à leitura" /></label><button className="primary full" type="submit">Publicar para os alunos</button></form></Modal>}
    {toast && <div className="toast"><Check size={17} /> {toast}</div>}
  </div>
}

function Dashboard({ loans, overdue, returnedToday, books, users, onNavigate, content, onEditContent }) {
  return <section className="content"><div className="page-heading"><div><p className="eyebrow">QUARTA-FEIRA, 16 DE SETEMBRO</p><h1>Bom dia, Admin <span>👋</span></h1><p className="muted">Acompanhe o movimento da sua biblioteca hoje.</p></div><button className="primary" onClick={() => onNavigate('Empréstimos')}><Plus size={18} /> Novo empréstimo</button></div>
    <div className="stats-grid"><Stat icon={BookOpen} label="Livros no acervo" value={books.reduce((sum, b) => sum + b.total, 0)} detail="+12 este mês" tone="teal" /><Stat icon={BookMarked} label="Em circulação" value={loans.length} detail={`${overdue.length} em atraso`} tone="gold" /><Stat icon={Users} label="Leitores ativos" value={users.length} detail="+3 este mês" tone="purple" /><Stat icon={Clock3} label="Devoluções hoje" value={returnedToday} detail={returnedToday ? 'Registradas hoje' : 'Nenhuma registrada'} tone="blue" /></div>
    <div className="dashboard-grid"><div className="panel"><div className="panel-title"><div><h2>Empréstimos recentes</h2><p className="muted">Acompanhe os últimos movimentos</p></div><button className="text-button" onClick={() => onNavigate('Empréstimos')}>Ver todos <ArrowRight size={16} /></button></div><LoanTable compact loans={loans.slice(0, 4)} books={books} users={users} /></div><div className="panel quick-panel"><div className="panel-title"><div><h2>Ações rápidas</h2><p className="muted">Atalhos para sua rotina</p></div></div><button onClick={() => onNavigate('Acervo')}><span className="quick-icon teal-bg"><Search size={18} /></span><span><strong>Buscar no acervo</strong><small>Encontre um livro rapidamente</small></span><ArrowRight size={16} /></button><button onClick={() => onNavigate('Leitores')}><span className="quick-icon purple-bg"><UserRound size={18} /></span><span><strong>Gerenciar leitores</strong><small>Cadastre ou consulte leitores</small></span><ArrowRight size={16} /></button></div></div>
    <div className="dashboard-notices"><div className="panel tip"><div className="tip-icon"><CircleAlert size={20} /></div><div><strong>Dica de leitura</strong><p>{content.tip}</p></div><button className="text-button" onClick={() => onNavigate('Acervo')}>Explorar acervo <ArrowRight size={16} /></button></div><div className="panel student-highlight"><div className="tip-icon"><Star size={19} /></div><div><strong>Aluno destaque do mês</strong><h3>{content.featuredStudent}</h3><p>{content.featuredReason || 'Continue participando das atividades de leitura!'}</p></div><button className="secondary" onClick={onEditContent}>Editar conteúdo</button></div></div>
  </section>
}
function Stat({ icon: Icon, label, value, detail, tone }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div><p>{label}</p><strong>{value}</strong><small className={detail.includes('atraso') ? 'danger-text' : ''}>{detail}</small></div></div> }
function Login({ onLogin }) {
  const defaultAccount = { id: 1, name: 'Admin Silva', email: 'bibliotecario@bibliotecaviva.com', password: 'biblioteca123', cpf: '00000000000' }
  const [mode, setMode] = useState('login')
  const [accounts, setAccounts] = useState(() => load('bv-librarians', [defaultAccount]))
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const saveAccounts = next => { setAccounts(next); localStorage.setItem('bv-librarians', JSON.stringify(next)) }
  const validPassword = password => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)
  const cleanCpf = value => String(value).replace(/\D/g, '')
  const submitLogin = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const account = accounts.find(item => item.email === email && item.password === password)
    if (!account) { setError('E-mail ou senha incorretos.'); return }
    onLogin({ name: account.name, email: account.email })
  }
  const submitRegister = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const email = String(form.get('email')).trim().toLowerCase()
    const cpf = cleanCpf(form.get('cpf'))
    const password = String(form.get('password'))
    const confirm = String(form.get('confirm'))
    if (accounts.some(item => item.email === email)) { setError('Este e-mail já está cadastrado.'); return }
    if (cpf.length !== 11) { setError('Informe um CPF válido com 11 números.'); return }
    if (accounts.some(item => item.cpf === cpf)) { setError('Este CPF já está cadastrado.'); return }
    if (!validPassword(password)) { setError('A senha deve ter pelo menos 8 caracteres, com letras e números.'); return }
    if (password !== confirm) { setError('A confirmação da senha não confere.'); return }
    const next = [...accounts, { id: Date.now(), name, email, cpf, password }]
    saveAccounts(next); setMessage('Usuário cadastrado. Agora você já pode entrar.'); setMode('login'); setError('')
  }
  const submitReset = event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const confirm = String(form.get('confirm'))
    const account = accounts.find(item => item.email === email)
    if (!account) { setError('Não encontramos um usuário com este e-mail.'); return }
    if (!validPassword(password)) { setError('A senha deve ter pelo menos 8 caracteres, com letras e números.'); return }
    if (password !== confirm) { setError('A confirmação da senha não confere.'); return }
    saveAccounts(accounts.map(item => item.id === account.id ? { ...item, password } : item))
    setMessage('Senha redefinida com sucesso. Entre com a nova senha.'); setMode('login'); setError('')
  }
  const changeMode = next => { setMode(next); setError(''); setMessage('') }
  return <main className="login-page"><div className="login-card"><div className="login-brand"><span className="brand-mark"><Library size={22} /></span><span>PEI Dr Gaspar Ricardo Junior</span></div>{mode === 'login' && <><p className="eyebrow">ÁREA RESTRITA</p><h1>Login do bibliotecário</h1><p className="muted">Entre para gerenciar o acervo, alunos e empréstimos.</p><form onSubmit={submitLogin}><label>E-mail<input name="email" type="email" required placeholder="bibliotecario@bibliotecaviva.com" /></label><label>Senha<input name="password" type="password" required placeholder="Digite sua senha" /></label>{error && <p className="login-error">{error}</p>}{message && <p className="login-success">{message}</p>}<button className="primary full" type="submit"><LogIn size={17} /> Entrar</button></form><div className="login-links"><button onClick={() => changeMode('forgot')}>Esqueci a senha</button><button onClick={() => changeMode('register')}>Cadastrar novo usuário</button></div><p className="login-hint">Acesso de demonstração: <strong>bibliotecario@bibliotecaviva.com</strong> · <strong>biblioteca123</strong></p></>}
  {mode === 'register' && <><p className="eyebrow">NOVO ACESSO</p><h1>Cadastrar bibliotecário</h1><p className="muted">Crie um acesso para a equipe da biblioteca.</p><form onSubmit={submitRegister}><label>Nome completo<input name="name" required placeholder="Ex.: Ana Souza" /></label><label>E-mail<input name="email" type="email" required placeholder="ana@biblioteca.com" /></label><label>CPF<input name="cpf" inputMode="numeric" pattern="[0-9.\- ]{11,14}" required placeholder="000.000.000-00" /></label><label>Senha<input name="password" type="password" minLength="8" required placeholder="Mínimo de 8 caracteres, letras e números" /></label><label>Confirmar senha<input name="confirm" type="password" minLength="8" required placeholder="Digite a senha novamente" /></label>{error && <p className="login-error">{error}</p>}<button className="primary full" type="submit">Cadastrar usuário</button></form><button className="back-login" onClick={() => changeMode('login')}>Voltar para o login</button></>}
  {mode === 'forgot' && <><p className="eyebrow">RECUPERAÇÃO DE ACESSO</p><h1>Redefinir senha</h1><p className="muted">Informe seu e-mail e escolha uma nova senha.</p><form onSubmit={submitReset}><label>E-mail cadastrado<input name="email" type="email" required placeholder="bibliotecario@bibliotecaviva.com" /></label><label>Nova senha<input name="password" type="password" minLength="8" required placeholder="Mínimo de 8 caracteres, letras e números" /></label><label>Confirmar nova senha<input name="confirm" type="password" minLength="8" required placeholder="Digite a senha novamente" /></label>{error && <p className="login-error">{error}</p>}<button className="primary full" type="submit">Redefinir senha</button></form><button className="back-login" onClick={() => changeMode('login')}>Voltar para o login</button></>}</div></main>
}
function Catalog({ books, query, setQuery, category, setCategory, categories, onSelect, onLoan, onAddBook, onDelete }) { return <section className="content"><div className="page-heading"><div><p className="eyebrow">COLEÇÃO DA ESCOLA</p><h1>Acervo</h1><p className="muted">Explore os livros da PEI Dr Gaspar Ricardo Junior.</p></div><div className="heading-actions"><button className="secondary" onClick={onAddBook}><Plus size={18} /> Adicionar livro</button><button className="primary" onClick={onLoan}><Plus size={18} /> Novo empréstimo</button></div></div><div className="filters"><div className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por título ou autor..." aria-label="Buscar livros" />{query && <button onClick={() => setQuery('')} aria-label="Limpar busca"><X size={15} /></button>}</div><div className="filter-select"><Filter size={16} /><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filtrar por categoria">{categories.map(c => <option key={c}>{c}</option>)}</select></div></div><p className="result-count">{books.length} {books.length === 1 ? 'livro encontrado' : 'livros encontrados'}</p><div className="book-grid">{books.map(book => <BookCard key={book.id} book={book} onClick={() => onSelect(book)} onDelete={() => onDelete(book)} />)}</div>{!books.length && <div className="empty"><BookOpen size={35} /><h2>Nenhum livro encontrado</h2><p>Tente buscar por outro termo ou categoria.</p></div>}</section> }
function BookCard({ book, onClick, onDelete }) { return <article className="book-card"><button className="book-card-main" onClick={onClick}><div className={`book-cover ${book.color}`}><span className="cover-label">BV</span><strong>{book.title}</strong><small>{book.author}</small></div><div className="book-info"><div><h3>{book.title}</h3><p>{book.author}</p></div><span className={`availability ${book.available ? '' : 'unavailable'}`}><span />{book.available ? `${book.available} disponíveis` : 'Indisponível'}</span></div><div className="book-meta"><span><Tag size={13} /> {book.category}</span><span>{book.year}</span></div></button><button className="delete-book" onClick={onDelete} aria-label={`Excluir ${book.title}`}><Trash2 size={14} /> Excluir livro</button></article> }
function Readers({ users, loans, onAdd, onDelete }) { return <section className="content"><div className="page-heading"><div><p className="eyebrow">COMUNIDADE</p><h1>Alunos</h1><p className="muted">Cadastre alunos por RA para liberar empréstimos.</p></div><button className="primary" onClick={onAdd}><Plus size={18} /> Cadastrar aluno</button></div><div className="reader-grid">{users.map(user => <div className="reader-card" key={user.id}><div className="reader-top"><div className="avatar avatar-large">{user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div><span className="active-badge">Ativo</span></div><h3>{user.name}</h3><p><strong>RA:</strong> {user.ra || 'Não informado'}</p><p>{user.phone}</p><p>{user.email || 'E-mail não informado'}</p><div className="reader-foot"><span>Aluno desde {fmt(user.joined)}</span><strong>{loans.filter(l => l.userId === user.id && !l.returnedAt).length} em andamento</strong></div><button className="delete-user" onClick={() => onDelete(user)}><Trash2 size={14} /> Excluir aluno</button></div>)}</div></section> }
function Loans({ books, users, loans, onReturn, onAdd }) { return <section className="content"><div className="page-heading"><div><p className="eyebrow">CONTROLE DE CIRCULAÇÃO</p><h1>Empréstimos</h1><p className="muted">Acompanhe retiradas, devoluções e prazos.</p></div><button className="primary" onClick={onAdd}><Plus size={18} /> Novo empréstimo</button></div><div className="loan-summary"><div><span className="summary-label">Ativos</span><strong>{loans.filter(l => !l.returnedAt).length}</strong></div><div><span className="summary-label">Em atraso</span><strong className="danger-text">{loans.filter(l => !l.returnedAt && l.dueDate < dateIn(0)).length}</strong></div><div><span className="summary-label">Devolvidos</span><strong>{loans.filter(l => l.returnedAt).length}</strong></div></div><div className="panel"><LoanTable loans={loans} books={books} users={users} onReturn={onReturn} /></div></section> }
function LoanTable({ loans, books, users, onReturn, compact }) { return <div className="table-wrap"><table><thead><tr><th>Livro</th><th>Leitor</th><th>Retirada</th><th>Devolução</th><th>Status</th>{!compact && <th></th>}</tr></thead><tbody>{loans.map(loan => { const book = books.find(b => b.id === loan.bookId); const user = users.find(u => u.id === loan.userId); const isOverdue = !loan.returnedAt && loan.dueDate < dateIn(0); return <tr key={loan.id}><td><div className="table-book"><span className={`mini-cover ${book?.color}`} /> <strong>{book?.title}</strong></div></td><td>{user?.name}</td><td>{fmt(loan.loanDate)}</td><td>{fmt(loan.returnedAt || loan.dueDate)}</td><td><span className={`status-pill ${loan.returnedAt ? 'returned' : isOverdue ? 'late' : 'active'}`}><span />{loan.returnedAt ? 'Devolvido' : isOverdue ? 'Em atraso' : 'Em andamento'}</span></td>{!compact && <td>{!loan.returnedAt && <button className="return-button" onClick={() => onReturn(loan)}><RotateCcw size={14} /> Devolver</button>}</td>}</tr> })}</tbody></table></div> }
function BookDetail({ book, onClose, onLoan, onDelete }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={e => e.stopPropagation()}><button className="close-button" onClick={onClose} aria-label="Fechar"><X /></button><div className={`detail-cover book-cover ${book.color}`}><span className="cover-label">BV</span><strong>{book.title}</strong><small>{book.author}</small></div><p className="eyebrow">DETALHES DO LIVRO</p><h2>{book.title}</h2><p className="detail-author">{book.author}</p><p className="detail-description">{book.description}</p><div className="detail-data"><span><small>Categoria</small><strong>{book.category}</strong></span><span><small>Ano</small><strong>{book.year}</strong></span><span><small>Páginas</small><strong>{book.pages}</strong></span></div><div className="detail-availability"><span className={`availability ${book.available ? '' : 'unavailable'}`}><span />{book.available ? `${book.available} exemplares disponíveis` : 'Todos emprestados'}</span><button className="primary full" disabled={!book.available} onClick={onLoan}>Registrar empréstimo</button><button className="delete-book full" onClick={onDelete}><Trash2 size={15} /> Excluir livro</button></div></aside></div> }
function Modal({ title, onClose, children }) { return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={onClose} aria-label="Fechar"><X /></button></div>{children}</div></div> }

createRoot(document.getElementById('root')).render(<App />)
