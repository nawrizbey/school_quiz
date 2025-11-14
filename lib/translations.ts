// Translations for the Quiz App
// Currently in Uzbek (Latin), can be translated to Karakalpak or other languages

export const translations = {
  // Common/General
  common: {
    loading: 'Yuklanmoqda...',
    error: 'Xatolik',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    delete: 'O\'chirish',
    edit: 'Tahrirlash',
    back: 'Orqaga',
    next: 'Keyingi',
    previous: 'Oldingi',
    submit: 'Yuborish',
    close: 'Yopish',
    yes: 'Ha',
    no: 'Yo\'q',
    logout: 'Chiqish',
    home: 'Bosh sahifa',
  },

  // Home Page
  home: {
    title: 'Quiz App',
    subtitle: 'Test topshiring va natijalarni ko\'ring',
    takeQuiz: 'Test topshirish',
    forTeachers: 'O\'qituvchilar uchun',
    footer: 'Mobile-friendly | Tez va oson',
  },

  // Quiz List Page
  quizList: {
    title: 'Testlar',
    currentTime: 'Hozirgi vaqt',
    availableQuizzes: 'Mavjud testlar',
    upcomingQuizzes: 'Kutilayotgan testlar',
    closedQuizzes: 'Tugagan testlar',
    noQuizzes: 'Hozircha testlar mavjud emas',
    comeBackLater: 'Keyinroq qaytib keling',
    startTest: 'Boshlash',
    waiting: 'Kutilmoqda...',
    closed: 'Tugagan',
    testAvailable: 'Test hozir mavjud!',
    testStartsAt: 'Test bugun soat {time} da boshlanadi',
    testClosed: 'Test tugadi',
    startedAt: '{time} da boshlangan',
    timeRemaining: '{time} daqiqadan keyin',
    questions: 'Savollar soni',
    timeLimit: 'Vaqt',
    minutes: 'daqiqa',
    author: 'Muallif',
  },

  // Quiz Taking Page
  quizTaking: {
    testNotFound: 'Test topilmadi',
    timeUntilStart: 'Test boshlanishiga qoldi:',
    allStudentsStartTogether: 'Hamma talabalar bir vaqtda boshlay di',
    testWillAutoStart: 'Test avtomatik boshlanadi...',
    testHasStarted: 'Test boshlangan! Tezroq kirish kerak.',
    testTimeClosed: 'Test vaqti tugagan!',
    testClosedDescription: 'Test {time} dan {minutes} daqiqa davom etdi va yopildi.',
    enterNameLabel: 'Ism va familiyangiz *',
    enterNamePlaceholder: 'Masalan: Baburov Mansur',
    selectClassLabel: 'Sinfingiz *',
    classNumber: '{number}-sinf',
    startTest: 'Testni boshlash',
    readyToWait: 'Tayyor, kutaman',
    testClosedButton: 'Test tugagan',
    alreadyTaken: 'Siz allaqachon bu testni topshirgansiz!\n\nHar bir o\'quvchi faqat bir marta topshirishi mumkin.',
    enterYourName: 'Ism va familiyangizni kiriting',
    testWindowClosed: 'Test vaqti tugagan. Ushbu testga endi qatnasha olmaysiz.',
    questionNumber: 'Savol {current} / {total}',
    answerAllQuestions: 'Barcha savollarga javob bering',
    finishTest: 'Testni yakunlash',
    saving: 'Saqlanmoqda...',
    errorOccurred: 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.',
    hello: 'Salom, {name}!',
  },

  // Quiz Result Page
  quizResult: {
    testCompleted: 'Test yakunlandi!',
    resultNotFound: 'Natija topilmadi',
    excellent: 'A\'lo! Siz ajoyib natija ko\'rsatdingiz!',
    good: 'Yaxshi! Zo\'r natija!',
    notBad: 'Yaxshi harakat! Yana mashq qiling!',
    needImprovement: 'Ko\'proq o\'rganing va keyingi testda yaxshiroq natija ko\'rsating!',
    correctAnswers: 'To\'g\'ri javoblar:',
    incorrectAnswers: 'Noto\'g\'ri javoblar:',
    timeTaken: 'Sarflangan vaqt:',
    otherTests: 'Boshqa testlar',
    yourAnswers: 'Sizning javoblaringiz',
    correctAnswer: 'To\'g\'ri javob',
    yourAnswer: 'Sizning javobingiz',
  },

  // Time formatting
  time: {
    minutes: 'daqiqa',
    seconds: 'soniya',
    hours: 'soat',
  },

  // Admin Login Page
  adminLogin: {
    title: 'O\'qituvchilar kirish',
    subtitle: 'Test yaratish va natijalarni ko\'rish uchun tizimga kiring',
    usernameLabel: 'Foydalanuvchi nomi',
    passwordLabel: 'Parol',
    loginButton: 'Kirish',
    accounts: 'Mavjud hisoblar:',
    superAdmin: 'Super Admin',
    teacher: 'O\'qituvchi',
    loginError: 'Login yoki parol xato',
    loginSuccess: 'Muvaffaqiyatli kirildi!',
  },

  // Teacher Dashboard
  teacherDashboard: {
    title: 'O\'qituvchi paneli',
    subtitle: 'Sizning testlaringiz',
    createNewTest: 'Yangi test yaratish',
    myTests: 'Mening testlarim',
    noTests: 'Hali test yaratilmagan',
    createFirstTest: 'Birinchi testingizni yarating',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    copyLink: 'Link nusxalash',
    confirmDelete: 'Ushbu testni o\'chirmoqchimisiz?',
    linkCopied: 'Link nusxalandi! Guruhga joylashtiring:\n\n{link}',
    statistics: 'Statistika',
  },

  // Super Admin Dashboard
  superAdminDashboard: {
    title: 'Super Admin Dashboard',
    subtitle: 'Barcha testlar va o\'qituvchilarni boshqarish',
    totalTests: 'Jami testlar',
    teachers: 'O\'qituvchilar',
    subjects: 'Fanlar',
    viewStats: 'Ko\'rish',
    allTests: 'Barchasi',
    allQuizzes: 'Barcha testlar',
    filter: 'Filter',
  },

  // Create Quiz Page
  createQuiz: {
    title: 'Yangi test yaratish',
    testInfoSection: 'Test ma\'lumotlari',
    testTitleLabel: 'Test nomi *',
    testTitlePlaceholder: 'Masalan: Matematika - 1-bob',
    descriptionLabel: 'Tavsif',
    descriptionPlaceholder: 'Test haqida qisqacha ma\'lumot',
    subjectLabel: 'Fan *',
    selectSubject: 'Fanni tanlang',
    timeLimitLabel: 'Vaqt (daqiqa) *',
    scheduledTimeLabel: 'Boshlanish vaqti *',
    scheduledTimeHelper: 'Test qaysi vaqtda boshlanishini kiriting (HH:MM)',
    authorNameLabel: 'Muallif nomi *',
    questionsSection: 'Savollar',
    addQuestion: 'Savol qo\'shish',
    questionLabel: 'Savol {number}',
    questionTextPlaceholder: 'Savol matnini kiriting',
    optionLabel: 'Variant {letter}',
    optionPlaceholder: 'Variant matnini kiriting',
    correctAnswerLabel: 'To\'g\'ri javob',
    removeQuestion: 'Savolni o\'chirish',
    createTest: 'Test yaratish',
    creating: 'Yaratilmoqda...',
    fillAllFields: 'Barcha maydonlarni to\'ldiring',
    addAtLeastOneQuestion: 'Kamida bitta savol qo\'shing',
    questionMustHave4Options: 'Har bir savolda 4 ta variant bo\'lishi kerak',
    testCreated: 'Test muvaffaqiyatli yaratildi!',
    errorCreating: 'Test yaratishda xatolik yuz berdi',
  },

  // Statistics Page
  statistics: {
    title: 'Statistika',
    subtitle: 'Test natijalari va tahlil',
    exportCSV: 'CSV export',
    selectQuiz: 'Test tanlang:',
    attempts: 'ta urinish',
    totalAttempts: 'Jami urinishlar',
    averageScore: 'O\'rtacha ball',
    averageTime: 'O\'rtacha vaqt',
    scoreDistribution: 'Ball taqsimoti',
    lastTestTimes: 'So\'nggi 10 ta test vaqti (daqiqa)',
    recentResults: 'So\'nggi natijalar',
    name: 'Ism',
    class: 'Sinf',
    score: 'Ball',
    percentage: 'Foiz',
    time: 'Vaqt',
    date: 'Sana',
    noData: 'Ma\'lumot yo\'q',
    noStatsYet: 'Hali statistika mavjud emas',
  },

  // Subjects
  subjects: {
    matematika: 'Matematika',
    biologiya: 'Biologiya',
    ingliz_tili: 'Ingliz tili',
    umumiy_fanlar: 'Umumiy fanlar',
    zakovat: 'Zakovat va logika',
  },

  // Days of week
  days: {
    yakshanba: 'Yakshanba',
    dushanba: 'Dushanba',
    seshanba: 'Seshanba',
    chorshanba: 'Chorshanba',
    payshanba: 'Payshanba',
    juma: 'Juma',
    shanba: 'Shanba',
  },

  // Validation messages
  validation: {
    required: 'Bu maydon majburiy',
    invalidEmail: 'Email noto\'g\'ri',
    minLength: 'Kamida {min} ta belgi bo\'lishi kerak',
    maxLength: 'Maksimal {max} ta belgi',
  },

  // Error messages
  errors: {
    networkError: 'Tarmoq xatosi',
    serverError: 'Server xatosi',
    notFound: 'Topilmadi',
    unauthorized: 'Ruxsat berilmagan',
    tryAgain: 'Qaytadan urinib ko\'ring',
  },
};

// Type for translations
export type TranslationKeys = typeof translations;

// Helper function to get nested translation
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }

  if (typeof value !== 'string') return key;

  // Replace params like {name}, {time}, etc.
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

export default translations;
