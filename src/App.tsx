
import { useState, type DragEvent } from 'react'
import './App.css'

type Student = {
  id: number
  name: string
  className: string
  phone: string
  parentPhone: string
}

type TaskStatus = 'Bekliyor' | 'Tamamlandı' | 'Eksik' | 'Ertelendi'

type StudyTask = {
  id: number
  studentId: string
  day: string
  subject: string
  unit: string
  topic: string
  source: string
  test: string
  questions: number
  duration: number
  startTime: string
  status: TaskStatus
}

const days = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

const subjectsByProgram: Record<string, string[]> = {
  LGS: [
    'Türkçe',
    'Matematik',
    'Fen Bilimleri',
    'T.C. İnkılap Tarihi',
    'Din Kültürü',
    'İngilizce',
  ],
  TYT: [
    'Türkçe',
    'Matematik',
    'Geometri',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Tarih',
    'Coğrafya',
    'Felsefe',
    'Din Kültürü',
  ],
  AYT: [
    'AYT Matematik',
    'Geometri',
    'Fizik',
    'Kimya',
    'Biyoloji',
    'Edebiyat',
    'Tarih',
    'Coğrafya',
    'Felsefe',
  ],
}

const units: Record<string, string[]> = {
  Türkçe: [
    'Sözcükte Anlam',
    'Cümlede Anlam',
    'Paragraf',
    'Dil Bilgisi',
    'Yazım ve Noktalama',
  ],
  Matematik: [
    'Sayılar',
    'Çarpanlar ve Katlar',
    'Üslü İfadeler',
    'Köklü İfadeler',
    'Denklemler',
    'Problemler',
  ],
  'Fen Bilimleri': [
    'Mevsimlerin Oluşumu ve İklim',
    'DNA ve Genetik Kod',
    'Basınç',
    'Madde ve Endüstri',
  ],
  'T.C. İnkılap Tarihi': [
    'Bir Kahraman Doğuyor',
    'Milli Uyanış',
    'Milli Bir Destan',
    'Atatürkçülük',
  ],
  'Din Kültürü': [
    'Kader ve Kaza',
    'Zekât ve Sadaka',
    'Din ve Hayat',
  ],
  İngilizce: [
    'Friendship',
    'Teen Life',
    'In the Kitchen',
    'On the Phone',
  ],
  Geometri: [
    'Üçgenler',
    'Dörtgenler',
    'Çokgenler',
    'Çember ve Daire',
  ],
  Fizik: [
    'Kuvvet ve Hareket',
    'Enerji',
    'Elektrik',
    'Dalgalar',
  ],
  Kimya: [
    'Atom ve Periyodik Sistem',
    'Kimyasal Türler',
    'Maddenin Halleri',
    'Karışımlar',
  ],
  Biyoloji: [
    'Hücre',
    'Canlıların Yapısı',
    'Kalıtım',
    'Ekosistem',
  ],
  Tarih: [
    'İlk Türk Devletleri',
    'Osmanlı Devleti',
    'Milli Mücadele',
    'Atatürk Dönemi',
  ],
  Coğrafya: [
    'Doğal Sistemler',
    'Beşeri Sistemler',
    'Türkiye Coğrafyası',
  ],
  Felsefe: [
    'Felsefeye Giriş',
    'Bilgi Felsefesi',
    'Varlık Felsefesi',
  ],
  'AYT Matematik': [
    'Fonksiyonlar',
    'Polinomlar',
    'İkinci Dereceden Denklemler',
    'Trigonometri',
    'Logaritma',
    'Limit',
    'Türev',
    'İntegral',
  ],
  Edebiyat: [
    'Şiir Bilgisi',
    'Edebî Akımlar',
    'Cumhuriyet Dönemi',
    'Halk Edebiyatı',
    'Divan Edebiyatı',
  ],
}

const topics: Record<string, string[]> = {
  Paragraf: [
    'Paragrafta Ana Düşünce',
    'Paragrafta Yardımcı Düşünce',
    'Paragrafın Yapısı',
    'Paragraf Tamamlama',
  ],
  'Çarpanlar ve Katlar': [
    'Asal Sayılar',
    'Asal Çarpanlara Ayırma',
    'EBOB',
    'EKOK',
    'Aralarında Asal Sayılar',
  ],
  Problemler: [
    'Sayı Problemleri',
    'Yaş Problemleri',
    'Hız Problemleri',
    'Yüzde Problemleri',
  ],
  Basınç: [
    'Katı Basıncı',
    'Sıvı Basıncı',
    'Gaz Basıncı',
  ],
  'Mevsimlerin Oluşumu ve İklim': [
    'Mevsimlerin Oluşumu',
    'İklim ve Hava Olayları',
    'Hava Hareketleri',
  ],
  'DNA ve Genetik Kod': [
    'DNA Yapısı',
    'Genetik Kod',
    'Kalıtım',
  ],
  Fonksiyonlar: [
    'Fonksiyon Kavramı',
    'Fonksiyon Çeşitleri',
    'Bileşke Fonksiyon',
  ],
  Türev: [
    'Türev Tanımı',
    'Türev Alma Kuralları',
    'Türev Uygulamaları',
  ],
  İntegral: [
    'Belirsiz İntegral',
    'Belirli İntegral',
    'İntegral Uygulamaları',
  ],
  Üçgenler: [
    'Üçgende Açılar',
    'Özel Üçgenler',
    'Üçgende Alan',
  ],
}

const sources = [
  '345 Yayınları',
  'Bilgi Sarmal',
  '3D Yayınları',
  'Karekök',
  'Hız Yayınları',
  'Limit Yayınları',
  'Palme',
  'MEB Kaynak',
  'Orijinal Yayınları',
  'Apotemi',
  'Endemik',
  'Paraf Yayınları',
  'Diğer',
]

function App() {
  const [activeMenu, setActiveMenu] = useState('Genel Bakış')

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Örnek Öğrenci',
      className: '8. Sınıf',
      phone: '0555 111 22 33',
      parentPhone: '0555 444 55 66',
    },
  ])

  const [search, setSearch] = useState('')
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const [selectedStudent, setSelectedStudent] = useState('1')
  const [programType, setProgramType] = useState('LGS')
  const [pageOrientation, setPageOrientation] = useState<'landscape' | 'portrait'>('landscape')

  const [selectedSubject, setSelectedSubject] = useState('Matematik')
  const [selectedUnit, setSelectedUnit] = useState('Çarpanlar ve Katlar')
  const [selectedTopic, setSelectedTopic] = useState('Asal Sayılar')
  const [selectedSource, setSelectedSource] = useState('345 Yayınları')
  const [test, setTest] = useState('Test 1')
  const [questions, setQuestions] = useState(20)
  const [duration, setDuration] = useState(40)
  const [startTime, setStartTime] = useState('16:00')
  const [selectedDay, setSelectedDay] = useState('Pazartesi')

  const [tasks, setTasks] = useState<StudyTask[]>([
    {
      id: 1,
      studentId: '1',
      day: 'Pazartesi',
      subject: 'Matematik',
      unit: 'Çarpanlar ve Katlar',
      topic: 'EBOB',
      source: '345 Yayınları',
      test: 'Test 7',
      questions: 20,
      duration: 45,
      startTime: '16:00',
      status: 'Bekliyor',
    },
    {
      id: 2,
      studentId: '1',
      day: 'Pazartesi',
      subject: 'Türkçe',
      unit: 'Paragraf',
      topic: 'Paragrafta Ana Düşünce',
      source: 'Bilgi Sarmal',
      test: 'Test 3',
      questions: 20,
      duration: 30,
      startTime: '17:00',
      status: 'Bekliyor',
    },
    {
      id: 3,
      studentId: '1',
      day: 'Salı',
      subject: 'Fen Bilimleri',
      unit: 'Basınç',
      topic: 'Sıvı Basıncı',
      source: 'Hız Yayınları',
      test: 'Test 4',
      questions: 25,
      duration: 40,
      startTime: '16:30',
      status: 'Bekliyor',
    },
  ])

  const [newStudent, setNewStudent] = useState({
    name: '',
    className: '',
    phone: '',
    parentPhone: '',
  })

  const availableSubjects = subjectsByProgram[programType] || []
  const availableUnits = units[selectedSubject] || []
  const availableTopics = topics[selectedUnit] || []

  const selectedStudentInfo = students.find(
    (student) => String(student.id) === selectedStudent,
  )

  const studentTasks = tasks.filter(
    (task) => task.studentId === selectedStudent,
  )

  const completedCount = studentTasks.filter(
    (task) => task.status === 'Tamamlandı',
  ).length

  const totalQuestions = studentTasks.reduce(
    (sum, task) => sum + task.questions,
    0,
  )

  const totalMinutes = studentTasks.reduce(
    (sum, task) => sum + task.duration,
    0,
  )

  const completionRate = studentTasks.length
    ? Math.round((completedCount / studentTasks.length) * 100)
    : 0

  function changeProgramType(type: string) {
    setProgramType(type)

    const firstSubject = subjectsByProgram[type][0]
    const firstUnit = units[firstSubject]?.[0] || ''

    setSelectedSubject(firstSubject)
    setSelectedUnit(firstUnit)
    setSelectedTopic(topics[firstUnit]?.[0] || '')
  }

  function addStudent() {
    if (!newStudent.name.trim()) {
      alert('Lütfen öğrenci adını yazın.')
      return
    }

    const student: Student = {
      id: Date.now(),
      ...newStudent,
    }

    setStudents((current) => [...current, student])
    setNewStudent({
      name: '',
      className: '',
      phone: '',
      parentPhone: '',
    })
  }

  function deleteStudent(id: number) {
    setStudents((current) =>
      current.filter((student) => student.id !== id),
    )

    setTasks((current) =>
      current.filter((task) => task.studentId !== String(id)),
    )

    if (selectedStudent === String(id)) setSelectedStudent('')
  }

  function saveStudent() {
    if (!editingStudent) return

    setStudents((current) =>
      current.map((student) =>
        student.id === editingStudent.id ? editingStudent : student,
      ),
    )

    setEditingStudent(null)
  }

  function downloadWeeklyProgram() {
    if (!selectedStudentInfo) {
      alert('Lütfen önce öğrenci seçin.')
      return
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }
        return entities[character]
      })

    const dayColumns = days.map((day) => {
      const dayTasks = studentTasks.filter((task) => task.day === day)

      return `
        <section class="day">
          <h2>${day}</h2>
          ${
            dayTasks.length
              ? dayTasks.map((task) => `
                <article class="task">
                  <div class="task-heading">
                    <strong>${escapeHtml(task.subject)}</strong>
                    <span>${escapeHtml(task.startTime)}</span>
                  </div>
                  <div class="topic">${escapeHtml(task.topic)}</div>
                  <div class="detail">${escapeHtml(task.unit)}</div>
                  <div class="detail">Kaynak: ${escapeHtml(task.source)}</div>
                  <div class="detail">${escapeHtml(task.test)}</div>
                  <div class="target">
                    <span>☐ ${task.questions} soru</span>
                    <span>${task.duration} dk</span>
                  </div>
                  <div class="status">
                    <input type="checkbox" ${task.status === 'Tamamlandı' ? 'checked' : ''} />
                    <span>Tamamlandı</span>
                  </div>
                </article>
              `).join('')
              : '<p class="empty">Planlanmış çalışma yok.</p>'
          }
        </section>
      `
    }).join('')

    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('PDF ekranı açılamadı. Lütfen tarayıcınızda açılır pencerelere izin verin.')
      return
    }

    const gridColumns = pageOrientation === 'portrait'
      ? 'repeat(2, minmax(0, 1fr))'
      : 'repeat(7, minmax(0, 1fr))'

    const gridRows = pageOrientation === 'portrait'
      ? 'repeat(4, minmax(0, 1fr))'
      : 'minmax(0, 1fr)'

    const gridHeight = pageOrientation === 'portrait' ? '210mm' : '145mm'

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <title>Kuantum Plus - Haftalık Çalışma Programı</title>
        <style>
          @page {
            size: A4 ${pageOrientation};
            margin: 7mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #1b2d4c;
            background: white;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            color: white;
            background: #173d7a;
            border-radius: 8px;
          }

          .brand {
            font-size: 18px;
            font-weight: 800;
          }

          .subtitle {
            margin-top: 4px;
            color: #d8e6ff;
            font-size: 9px;
          }

          .week {
            text-align: right;
            font-size: 10px;
            line-height: 1.6;
          }

          .student-info {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin: 9px 0;
            padding: 8px 10px;
            border: 1px solid #dce5f3;
            border-radius: 7px;
            font-size: 10px;
          }

          .student-info strong {
            color: #173d7a;
          }

          .days {
            display: grid;
            grid-template-columns: ${gridColumns};
            grid-template-rows: ${gridRows};
            gap: 5px;
            height: ${gridHeight};
            align-items: stretch;
          }

          .day {
            min-width: 0;
            min-height: 0;
            overflow: hidden;
            padding: 5px;
            border: 1px solid #dce5f3;
            border-radius: 7px;
            background: #f8faff;
            break-inside: avoid;
          }

          .day h2 {
            margin: -5px -5px 5px;
            padding: 7px 2px;
            border-radius: 6px 6px 0 0;
            background: #e8f0ff;
            color: #17458f;
            text-align: center;
            font-size: 9px;
          }

          .task {
            margin-bottom: 5px;
            padding: 6px;
            border: 1px solid #dce6f5;
            border-left: 3px solid #3478e8;
            border-radius: 5px;
            background: white;
            break-inside: avoid;
          }

          .task-heading {
            display: flex;
            justify-content: space-between;
            gap: 4px;
            color: #2458a6;
            font-size: 8px;
          }

          .topic {
            margin: 5px 0 4px;
            font-size: 8px;
            font-weight: 700;
            line-height: 1.3;
            overflow-wrap: anywhere;
          }

          .detail {
            margin: 2px 0;
            color: #64748b;
            font-size: 7px;
            line-height: 1.25;
            overflow-wrap: anywhere;
          }

          .target {
            display: flex;
            justify-content: space-between;
            gap: 3px;
            margin-top: 5px;
            padding-top: 4px;
            border-top: 1px solid #edf1f7;
            color: #244d8b;
            font-size: 7px;
            font-weight: 700;
          }

          .status {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-top: 5px;
            color: #64748b;
            font-size: 7px;
          }

          .status input {
            width: 10px;
            height: 10px;
            margin: 0;
          }

          .empty {
            padding: 8px 2px;
            color: #94a3b8;
            text-align: center;
            font-size: 7px;
            line-height: 1.4;
          }

          .motivation {
            margin-top: 8px;
            padding: 7px;
            border: 1px solid #d9e6fb;
            border-radius: 7px;
            background: #f0f5ff;
            color: #21477f;
            text-align: center;
            font-size: 9px;
            font-weight: 700;
          }

          .motivation small {
            display: block;
            margin-top: 3px;
            color: #7184a3;
            font-size: 7px;
            font-weight: 400;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 6px;
            color: #8793a7;
            font-size: 7px;
          }

          @media print {
            html, body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <header class="header">
          <div>
            <div class="brand">✦ KUANTUM PLUS</div>
            <div class="subtitle">HAFTALIK ÇALIŞMA PROGRAMI</div>
          </div>
          <div class="week">
            <strong>${programType} HAZIRLIK PROGRAMI</strong><br />
            23 – 29 Kasım 2026
          </div>
        </header>

        <div class="student-info">
          <span>ÖĞRENCİ: <strong>${escapeHtml(selectedStudentInfo.name)}</strong></span>
          <span>SINIF: <strong>${escapeHtml(selectedStudentInfo.className)}</strong></span>
          <span>TOPLAM SORU HEDEFİ: <strong>${totalQuestions}</strong></span>
          <span>PLANLANAN SÜRE: <strong>${Math.floor(totalMinutes / 60)} sa ${totalMinutes % 60} dk</strong></span>
        </div>

        <main class="days">
          ${dayColumns}
        </main>

        <div class="motivation">
          “Başarı, her gün atılan küçük ama kararlı adımların sonucudur.”
          <small>Bugün elinden geleni yap, yarın kendinin daha iyi bir hâli ol.</small>
        </div>

        <div class="footer">
          <span>Kuantum Plus Eğitim Yönetim Sistemi</span>
          <span>Planını uygula • İlerlemeni takip et • Hedefine yaklaş</span>
        </div>
      </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  function addTask() {
    if (!selectedStudent) {
      alert('Lütfen önce öğrenci seçin.')
      return
    }

    if (!selectedTopic.trim()) {
      alert('Lütfen bir konu seçin.')
      return
    }

    const newTask: StudyTask = {
      id: Date.now(),
      studentId: selectedStudent,
      day: selectedDay,
      subject: selectedSubject,
      unit: selectedUnit,
      topic: selectedTopic,
      source: selectedSource,
      test,
      questions: Number(questions),
      duration: Number(duration),
      startTime,
      status: 'Bekliyor',
    }

    setTasks((current) => [...current, newTask])
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  function updateTaskStatus(id: number, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status } : task,
      ),
    )
  }

  function handleSubjectChange(subject: string) {
    setSelectedSubject(subject)
    const firstUnit = units[subject]?.[0] || ''
    setSelectedUnit(firstUnit)
    setSelectedTopic(topics[firstUnit]?.[0] || '')
  }

  function handleUnitChange(unit: string) {
    setSelectedUnit(unit)
    setSelectedTopic(topics[unit]?.[0] || '')
  }

  function handleDrop(day: string, e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const taskId = Number(e.dataTransfer.getData('taskId'))
    if (!taskId) return

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, day } : task,
      ),
    )
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.className.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <strong>Kuantum Plus</strong>
            <span>Eğitim Yönetim Sistemi</span>
          </div>
        </div>

        <div className="menu-title">YÖNETİM</div>

        <nav>
          {[
            'Genel Bakış',
            'Öğrenci Yönetimi',
            'Öğretmen Yönetimi',
            'Veli Yönetimi',
            'Akademik Takip',
            'Kaynak Kütüphanesi',
            'Haftalık Programlar',
            'Deneme Sınavları',
            'Rehberlik Görüşmeleri',
            'Raporlar',
            'Ayarlar',
          ].map((menu) => (
            <button
              key={menu}
              className={activeMenu === menu ? 'menu-item active' : 'menu-item'}
              onClick={() => setActiveMenu(menu)}
            >
              <span className="menu-icon">◆</span>
              {menu}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-card">
            <div className="avatar">T</div>
            <div>
              <strong>Rehberlik</strong>
              <span>Yönetici</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Kuantum Plus / {activeMenu}</div>
            <h1>{activeMenu}</h1>
          </div>
          <div className="top-actions">
            <div className="notification">🔔</div>
            <div className="top-profile">T</div>
          </div>
        </header>

        {activeMenu === 'Genel Bakış' && (
          <section className="dashboard">
            <div className="welcome-card">
              <div>
                <span className="eyebrow">KUANTUM PLUS</span>
                <h2>Hoş geldiniz.</h2>
                <p>Öğrencilerin akademik ve rehberlik süreçlerini tek merkezden yönetin.</p>
              </div>
              <div className="welcome-icon">✦</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>ÖĞRENCİLER</span>
                <strong>{students.length}</strong>
                <small>Aktif öğrenci</small>
              </div>
              <div className="stat-card">
                <span>ÖĞRETMENLER</span>
                <strong>0</strong>
                <small>Tanımlı öğretmen</small>
              </div>
              <div className="stat-card">
                <span>ÇALIŞMA GÖREVLERİ</span>
                <strong>{tasks.length}</strong>
                <small>Tanımlı görev</small>
              </div>
              <div className="stat-card">
                <span>TAMAMLANAN</span>
                <strong>{tasks.filter((task) => task.status === 'Tamamlandı').length}</strong>
                <small>Çalışma görevi</small>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="panel">
                <div className="panel-title">
                  <div>
                    <span className="eyebrow">HIZLI İŞLEMLER</span>
                    <h3>Bugün ne yapmak istiyorsunuz?</h3>
                  </div>
                </div>
                <div className="quick-actions">
                  <button onClick={() => setActiveMenu('Öğrenci Yönetimi')}>+ Öğrenci Ekle</button>
                  <button onClick={() => setActiveMenu('Haftalık Programlar')}>+ Haftalık Program</button>
                  <button onClick={() => setActiveMenu('Deneme Sınavları')}>+ Deneme Ekle</button>
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">
                  <div>
                    <span className="eyebrow">SİSTEM</span>
                    <h3>Genel durum</h3>
                  </div>
                </div>
                <div className="system-list">
                  <div><span>Öğrenci sistemi</span><strong>Aktif</strong></div>
                  <div><span>Program oluşturucu</span><strong>Aktif</strong></div>
                  <div><span>Kaynak kütüphanesi</span><strong>Geliştiriliyor</strong></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeMenu === 'Öğrenci Yönetimi' && (
          <section className="students-page">
            <div className="page-intro">
              <div>
                <span className="eyebrow">ÖĞRENCİ YÖNETİMİ</span>
                <h2>Öğrenciler</h2>
                <p>Öğrenci bilgilerini ekleyin, düzenleyin ve takip edin.</p>
              </div>
            </div>

            <div className="student-form panel">
              <div className="form-grid">
                <input
                  placeholder="Öğrenci adı soyadı"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
                <input
                  placeholder="Sınıf (Örn. 8. Sınıf)"
                  value={newStudent.className}
                  onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                />
                <input
                  placeholder="Öğrenci telefonu"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
                <input
                  placeholder="Veli telefonu"
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                />
                <button onClick={addStudent}>+ Öğrenci Ekle</button>
              </div>
            </div>

            <div className="panel">
              <div className="table-toolbar">
                <div>
                  <span className="eyebrow">KAYITLI ÖĞRENCİLER</span>
                  <h3>{students.length} öğrenci</h3>
                </div>
                <input
                  className="search-input"
                  placeholder="Öğrenci ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="student-table">
                <div className="table-head">
                  <span>ÖĞRENCİ</span><span>SINIF</span><span>TELEFON</span><span>VELİ TELEFONU</span><span>İŞLEM</span>
                </div>
                {filteredStudents.map((student) => (
                  <div className="table-row" key={student.id}>
                    <span className="student-name">{student.name}</span>
                    <span>{student.className}</span>
                    <span>{student.phone}</span>
                    <span>{student.parentPhone}</span>
                    <span className="table-actions">
                      <button onClick={() => setEditingStudent(student)}>Düzenle</button>
                      <button className="danger" onClick={() => deleteStudent(student.id)}>Sil</button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeMenu === 'Haftalık Programlar' && (
          <section className="program-page">
            <div className="program-hero">
              <div>
                <span className="eyebrow light">KUANTUM PLUS • ÇALIŞMA PLANLAMA</span>
                <h2>Akıllı haftalık program oluşturucu</h2>
                <p>LGS ve YKS öğrencileri için konu, kaynak, saat ve çalışma takibi.</p>
              </div>
              <div className="program-hero-icon">✦</div>
            </div>

            <div className="program-toolbar">
              <div className="program-student">
                <label>ÖĞRENCİ</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">Öğrenci seçin</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} — {student.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="program-student">
                <label>PROGRAM TÜRÜ</label>
                <select
                  value={programType}
                  onChange={(e) => changeProgramType(e.target.value)}
                >
                  <option value="LGS">8. Sınıf • LGS</option>
                  <option value="TYT">12. Sınıf • TYT</option>
                  <option value="AYT">12. Sınıf • AYT</option>
                </select>
              </div>

              <div className="program-student">
                <label>A4 SAYFA YÖNÜ</label>
                <select
                  value={pageOrientation}
                  onChange={(e) => setPageOrientation(e.target.value as 'landscape' | 'portrait')}
                >
                  <option value="landscape">A4 Yatay</option>
                  <option value="portrait">A4 Dikey</option>
                </select>
              </div>

              <div className="program-week">
                <span>PROGRAM HAFTASI</span>
                <strong>23 – 29 Kasım 2026</strong>
              </div>
            </div>

            <div className="stats-grid program-stats">
              <div className="stat-card">
                <span>TOPLAM GÖREV</span>
                <strong>{studentTasks.length}</strong>
                <small>Bu öğrencinin programı</small>
              </div>
              <div className="stat-card">
                <span>TAMAMLANAN</span>
                <strong>{completedCount}</strong>
                <small>Görev</small>
              </div>
              <div className="stat-card">
                <span>HEDEFLENEN SORU</span>
                <strong>{totalQuestions}</strong>
                <small>Toplam soru</small>
              </div>
              <div className="stat-card">
                <span>PLANLANAN SÜRE</span>
                <strong>{Math.floor(totalMinutes / 60)} sa {totalMinutes % 60} dk</strong>
                <small>Toplam çalışma</small>
              </div>
            </div>

            <div className="panel program-progress-panel">
              <div className="table-toolbar">
                <div>
                  <span className="eyebrow">HAFTALIK İLERLEME</span>
                  <h3>Program tamamlama oranı</h3>
                </div>
                <strong>{completionRate}%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <div className="program-builder">
              <div className="program-library">
                <div className="library-header">
                  <span className="eyebrow">ÇALIŞMA HAVUZU</span>
                  <h3>Yeni çalışma ekle</h3>
                  <p>Ders, konu, kaynak ve çalışma saatini belirleyin.</p>
                </div>

                <div className="program-field">
                  <label>DERS</label>
                  <select value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
                    {availableSubjects.map((subject) => <option key={subject}>{subject}</option>)}
                  </select>
                </div>

                <div className="program-field">
                  <label>ÜNİTE / KONU ALANI</label>
                  <select value={selectedUnit} onChange={(e) => handleUnitChange(e.target.value)}>
                    {availableUnits.map((unit) => <option key={unit}>{unit}</option>)}
                  </select>
                </div>

                <div className="program-field">
                  <label>KONU</label>
                  {availableTopics.length > 0 ? (
                    <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                      {availableTopics.map((topic) => <option key={topic}>{topic}</option>)}
                    </select>
                  ) : (
                    <input
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      placeholder="Konu adını yazın"
                    />
                  )}
                </div>

                <div className="program-field">
                  <label>KAYNAK / KİTAP</label>
                  <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
                    {sources.map((source) => <option key={source}>{source}</option>)}
                  </select>
                </div>

                <div className="program-row">
                  <div className="program-field">
                    <label>TEST</label>
                    <input value={test} onChange={(e) => setTest(e.target.value)} placeholder="Test 1" />
                  </div>
                  <div className="program-field">
                    <label>SORU HEDEFİ</label>
                    <input type="number" min="1" value={questions} onChange={(e) => setQuestions(Number(e.target.value))} />
                  </div>
                </div>

                <div className="program-row">
                  <div className="program-field">
                    <label>BAŞLANGIÇ SAATİ</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  </div>
                  <div className="program-field">
                    <label>SÜRE (DAKİKA)</label>
                    <input type="number" min="5" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                  </div>
                </div>

                <div className="program-field">
                  <label>ÇALIŞMA GÜNÜ</label>
                  <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                    {days.map((day) => <option key={day}>{day}</option>)}
                  </select>
                </div>

                <button className="program-add-button" onClick={addTask}>
                  + Programa Ekle
                </button>

                <div className="drag-info">
                  <span>↔</span>
                  <div>
                    <strong>Sürükle & bırak</strong>
                    <p>Çalışmaları haftanın farklı günlerine taşıyabilirsiniz.</p>
                  </div>
                </div>
              </div>

              <div className="weekly-board">
                <div className="board-header">
                  <div>
                    <span className="eyebrow">HAFTALIK PROGRAM</span>
                    <h3>{selectedStudentInfo?.name || 'Öğrenci seçilmedi'}</h3>
                    <p>{programType} çalışma planı</p>
                  </div>
                  <div className="board-actions">
                    <button>← Önceki Hafta</button>
                    <button>Bu Hafta</button>
                    <button>Sonraki Hafta →</button>
                    <button onClick={downloadWeeklyProgram}>
                      ⬇ PDF / Yazdır
                    </button>
                  </div>
                </div>

                <div className="week-grid">
                  {days.map((day) => {
                    const dayTasks = studentTasks.filter((task) => task.day === day)

                    return (
                      <div
                        className="day-column"
                        key={day}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(day, e)}
                      >
                        <div className="day-header">
                          <strong>{day}</strong>
                          <span>{dayTasks.length}</span>
                        </div>

                        <div className="day-content">
                          {dayTasks.length === 0 && (
                            <div className="drop-zone">
                              <span>+</span>
                              <p>Çalışmayı buraya sürükleyin</p>
                            </div>
                          )}

                          {dayTasks.map((task) => (
                            <div
                              className="study-card"
                              key={task.id}
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData('taskId', String(task.id))}
                            >
                              <div className="study-card-top">
                                <span className="subject-badge">{task.subject}</span>
                                <button className="card-delete" onClick={() => deleteTask(task.id)}>×</button>
                              </div>

                              <strong className="study-topic">{task.topic}</strong>
                              <div className="study-source">{task.unit} · {task.source}</div>

                              <div className="study-details">
                                <span>{task.startTime}</span>
                                <span>{task.duration} dk</span>
                                <span>{task.questions} soru</span>
                              </div>

                              <div className="study-source">{task.test}</div>

                              <select
                                className={`task-status ${task.status.toLowerCase().replace('ı', 'i')}`}
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                              >
                                <option>Bekliyor</option>
                                <option>Tamamlandı</option>
                                <option>Eksik</option>
                                <option>Ertelendi</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {![
          'Genel Bakış',
          'Öğrenci Yönetimi',
          'Haftalık Programlar',
        ].includes(activeMenu) && (
          <section className="empty-page">
            <div className="empty-card">
              <div>✦</div>
              <h2>{activeMenu}</h2>
              <p>Bu modül bir sonraki geliştirme aşamasında hazırlanacak.</p>
            </div>
          </section>
        )}
      </main>

      {editingStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <span className="eyebrow">ÖĞRENCİ DÜZENLE</span>
                <h2>Öğrenci bilgileri</h2>
              </div>
              <button onClick={() => setEditingStudent(null)}>×</button>
            </div>

            <div className="modal-form">
              <input
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                placeholder="Ad Soyad"
              />
              <input
                value={editingStudent.className}
                onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
                placeholder="Sınıf"
              />
              <input
                value={editingStudent.phone}
                onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                placeholder="Öğrenci telefonu"
              />
              <input
                value={editingStudent.parentPhone}
                onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                placeholder="Veli telefonu"
              />
              <button onClick={saveStudent}>Değişiklikleri Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
