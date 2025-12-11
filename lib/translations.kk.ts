// Qoraqalpoq tilidagi tarjimalar / Qaraqalpaq tilindegi tarjımalar
// Translations for Karakalpak language

export const translations = {
  // Umumiy/Jálpı
  common: {
    loading: 'Júklenbekte...',
    error: 'Qátelik',
    save: 'Saqlaw',
    cancel: 'Biykarlaw',
    delete: 'Óshiriw',
    edit: 'Ózgertiw',
    back: 'Artqa',
    next: 'Keyingi',
    previous: 'Aldınǵı',
    submit: 'Jiberiw',
    close: 'Jabıw',
    yes: 'Áwa',
    no: 'Yaq',
    logout: 'Shıǵıw',
    home: 'Bas bet',
  },

  // Bas bet
  home: {
    title: 'Mektep Test Tizimi',
    subtitle: 'Onlayn test tapsırıw platforması',
    takeQuiz: 'Test tapsırıw',
    forTeachers: 'Mugalimler ushın',
    footer: 'Mobil-ústinde | Tez hám jeńil',
  },

  // Testler betı
  quizList: {
    title: 'Testler',
    currentTime: 'Házirgi waqıt',
    availableQuizzes: 'Bar bolǵan testler',
    upcomingQuizzes: 'Kútilip atırǵan testler',
    closedQuizzes: 'Biytkeri testler',
    noQuizzes: 'Házirge shekem testler joq',
    comeBackLater: 'Keyinrek qaytıp keliń',
    startTest: 'Baslaw',
    waiting: 'Kútilmekte...',
    closed: 'Biytkeri',
    testAvailable: 'Test házir bar!',
    testStartsAt: 'Test búgin saǵat {time} da baslanadı',
    testClosed: 'Test bitedi',
    startedAt: '{time} da baslandı',
    timeRemaining: '{time} minuttan keyin',
    questions: 'Sorawlar sanı',
    timeLimit: 'Waqıt',
    minutes: 'minut',
    author: 'Avtor',
  },

  // Test tapsırıw betı
  quizTaking: {
    testNotFound: 'Test tabılmadı',
    timeUntilStart: 'Test baslanıwına qaldı:',
    allStudentsStartTogether: 'Barlıq oqıwshılar bir waqıtta baslaydı',
    testWillAutoStart: 'Test avtomatik baslanadı...',
    testHasStarted: 'Test baslandı! Tez kiriń!',
    testTimeClosed: 'Test waqtı bitedi!',
    testClosedDescription: 'Test {time} dan {minutes} minut dawam ettı hám jabıldı.',
    enterNameLabel: 'Atıńız hám familiyańız *',
    enterNamePlaceholder: 'Mısal: Allanov Allan',
    selectClassLabel: 'Klasıńız *',
    classNumber: '{number}-klas',
    startTest: 'Testı baslaw',
    readyToWait: 'Tayar, kútemen',
    testClosedButton: 'Test biytkeri',
    alreadyTaken: 'Siz aldın bul testı tapsırǵansız!\n\nÁr bir oqıwshı tek bir ret tapsırıw múmkin.',
    enterYourName: 'Atıńız hám familiyańızdı kirgiziń',
    testWindowClosed: 'Test waqtı bitedi. Bul testke endi qatnasa almaysız.',
    questionNumber: 'Soraw {current} / {total}',
    answerAllQuestions: 'Barlıq sorawlarǵa juwap beriń',
    finishTest: 'Testı tamamlaw',
    saving: 'Saqlanmaqta...',
    errorOccurred: 'Qátelik júz berdi. Qaytadan urınıp kóriń.',
    hello: 'Sálem, {name}!',
  },

  // Test nátiyjeleri betı
  quizResult: {
    testCompleted: 'Test tamamlandı!',
    resultNotFound: 'Nátiyje tabılmadı',
    excellent: 'Ajayyıp! Siz tańǵajayıp nátiyje kórsettiǵiz!',
    good: 'Jaqsı! Zor nátiyje!',
    notBad: 'Jaqsı urinistiń! Jáne mashq etiń!',
    needImprovement: 'Kóbirek úyreniń hám keyingi testte jaqsıraq nátiyje kórsetiń!',
    correctAnswers: 'Durıs juwaplar:',
    incorrectAnswers: 'Durıs emes juwaplar:',
    timeTaken: 'Sarplanǵan waqıt:',
    otherTests: 'Basqa testler',
    yourAnswers: 'Siziń juwaplarıńız',
    correctAnswer: 'Durıs juwap',
    yourAnswer: 'Siziń juwabıńız',
    testFinished: 'Test tamamlandı. Nátiyje kórildi.',
    closeTab: 'Endi sayt betın jabıwıńız múmkin.',
    cannotGoBack: 'Siz artqa qaytıp bılmaysız. Nátiyje kórildi.',
  },

  // Waqıt formatlawı
  time: {
    minutes: 'minut',
    seconds: 'sekund',
    hours: 'saǵat',
  },

  // Admin kiriw betı
  adminLogin: {
    title: 'Mugalimler kiriw',
    subtitle: 'Muǵállimler jańa maǵlıwmatlar menen kiriw kerek',
    usernameLabel: 'Paydalanıwshı atı',
    passwordLabel: 'Parol',
    loginButton: 'Kiriw',
    accounts: 'Bar bolǵan akkountlar:',
    superAdmin: 'Super Admin',
    teacher: 'Mugalim',
    loginError: 'Login yamasa parol qáte',
    loginSuccess: 'Sátti kirildi!',
  },

  // Mugalim paneli
  teacherDashboard: {
    title: 'Mugalim paneli',
    subtitle: 'Siziń testleriǵiz',
    createNewTest: 'Jańa test jaratıw',
    myTests: 'Meniń testlerim',
    noTests: 'Jáne test jaratılmaǵan',
    createFirstTest: 'Birinshi testiǵizdi jaratiń',
    edit: 'Ózgertiw',
    delete: 'Óshiriw',
    copyLink: 'Linkti kóshiriw',
    confirmDelete: 'Bul testı óshiriwdi qáleysizbe?',
    linkCopied: 'Link kóshirildi! Gruppaǵa jaylastırıń:\n\n{link}',
    statistics: 'Statistika',
  },

  // Super Admin paneli
  superAdminDashboard: {
    title: 'Super Admin Paneli',
    subtitle: 'Barlıq testler hám mugalimlerdı basqarıw',
    totalTests: 'Jalpı testler',
    teachers: 'Mugalimler',
    subjects: 'Pánler',
    viewStats: 'Kóriw',
    allTests: 'Barshası',
    allQuizzes: 'Barlıq testler',
    filter: 'Filter',
  },

  // Test jaratıw betı
  createQuiz: {
    title: 'Jańa test jaratıw',
    testInfoSection: 'Test maǵlıwmatları',
    testTitleLabel: 'Test atı *',
    testTitlePlaceholder: 'Mısal: Matematika - 1-bap',
    descriptionLabel: 'Sıpatlama',
    descriptionPlaceholder: 'Test haqqında qısqasha maǵlıwmat',
    subjectLabel: 'Pán *',
    selectSubject: 'Pándi tańlań',
    timeLimitLabel: 'Waqıt (minut) *',
    scheduledTimeLabel: 'Baslanıw waqtı *',
    scheduledTimeHelper: 'Test qaysi waqıtta baslanıwın kirgiziń (HH:MM)',
    authorNameLabel: 'Avtor atı *',
    questionsSection: 'Sorawlar',
    addQuestion: 'Soraw qosıw',
    questionLabel: 'Soraw {number}',
    questionTextPlaceholder: 'Soraw tekstin kirgiziń',
    optionLabel: 'Variant {letter}',
    optionPlaceholder: 'Variant tekstin kirgiziń',
    correctAnswerLabel: 'Durıs juwap',
    removeQuestion: 'Sorawdı óshiriw',
    createTest: 'Test jaratıw',
    creating: 'Jaratılmaqta...',
    fillAllFields: 'Barlıq maydonlardı toltırıń',
    addAtLeastOneQuestion: 'Keminde bitta soraw qosıń',
    questionMustHave4Options: 'Ár bir sorawda 4 ta variant bolıwı kerek',
    maxQuestionsReached: 'Maksimal 20 ta soraw qosıw múmkin',
    testCreated: 'Test sátti jaratıldı!',
    errorCreating: 'Test jaratıwda qátelik júz berdi',
  },

  // Statistika betı
  statistics: {
    title: 'Statistika',
    subtitle: 'Test nátiyjeleri hám analiz',
    exportCSV: 'CSV eksport',
    selectQuiz: 'Test tańlań:',
    attempts: 'ta urınıs',
    totalAttempts: 'Jálpı urınıslar',
    averageScore: 'Ortasha ball',
    averageTime: 'Ortasha waqıt',
    scoreDistribution: 'Ball bólistiriliwi',
    lastTestTimes: 'Sońǵı 10 ta test waqtı (minut)',
    recentResults: 'Sońǵı nátiyeler',
    name: 'Atı',
    class: 'Klas',
    score: 'Ball',
    percentage: 'Payız',
    time: 'Waqıt',
    date: 'Sene',
    noData: 'Maǵlıwmat joq',
    noStatsYet: 'Jáne statistika maǵlıwmat emes',
  },

  // Pánler
  subjects: {
    matematika: 'Matematika',
    biologiya: 'Biologiya',
    ingliz_tili: 'Ingliz tili',
    umumiy_fanlar: 'Jálpı pánler',
    zakovat: 'Zakovat hám logika',
  },

  // Hápte kúnleri
  days: {
    yakshanba: 'Yekshenbi',
    dushanba: 'dúyshembi',
    seshanba: 'seyshembi',
    chorshanba: 'sárshembi',
    payshanba: 'piyshembi',
    juma: 'juma',
    shanba: 'shembi',
  },

  // Tekseriwi xabarlari
  validation: {
    required: 'Bul maydon májbúriy',
    invalidEmail: 'Email durıs emes',
    minLength: 'Keminde {min} ta belgi bolıwı kerek',
    maxLength: 'Maksimal {max} ta belgi',
  },

  // Qátelik xabarlari
  errors: {
    networkError: 'Tarmoq qáteligi',
    serverError: 'Server qáteligi',
    notFound: 'Tabılmadı',
    unauthorized: 'Ruxsat berilmegen',
    tryAgain: 'Qaytadan urınıp kóriń',
  },
};

// Tarjima túrleri
export type TranslationKeys = typeof translations;

// Ishki tarjimani alıw funksiyası
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }

  if (typeof value !== 'string') return key;

  // {name}, {time} kabi parametrlerdı almashtırıw
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

export default translations;
