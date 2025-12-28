export type SupportedLanguage = 'ar' | 'en' | 'es';

export type Translations = {
  [key: string]: {
    [key in SupportedLanguage]: string;
  };
};

export const translations: Translations = {
  // Navigation
  'nav.home': {
    ar: 'الرئيسية',
    en: 'Home',
    es: 'Inicio'
  },
  'nav.professors': {
    ar: 'المدرسين',
    en: 'Professors',
    es: 'Profesores'
  },
  'nav.languages': {
    ar: 'اللغات',
    en: 'Languages',
    es: 'Idiomas'
  },
  'nav.quizzes': {
    ar: 'الاختبارات',
    en: 'Quizzes',
    es: 'Cuestionarios'
  },
  'nav.dashboard': {
    ar: 'لوحة التحكم',
    en: 'Dashboard',
    es: 'Panel de Control'
  },
  'nav.register': {
    ar: 'التسجيل',
    en: 'Register',
    es: 'Registro'
  },
  'nav.contact': {
    ar: 'اتصل بنا',
    en: 'Contact Us',
    es: 'Contacto'
  },
  'nav.login': {
    ar: 'تسجيل الدخول',
    en: 'Login',
    es: 'Iniciar Sesión'
  },
  'nav.logout': {
    ar: 'تسجيل الخروج',
    en: 'Logout',
    es: 'Cerrar Sesión'
  },

  // Common buttons
  'button.register': {
    ar: 'سجل الآن',
    en: 'Register Now',
    es: 'Regístrate Ahora'
  },
  'button.submit': {
    ar: 'إرسال',
    en: 'Submit',
    es: 'Enviar'
  },
  'button.cancel': {
    ar: 'إلغاء',
    en: 'Cancel',
    es: 'Cancelar'
  },
  'button.save': {
    ar: 'حفظ',
    en: 'Save',
    es: 'Guardar'
  },
  'button.edit': {
    ar: 'تعديل',
    en: 'Edit',
    es: 'Editar'
  },
  'button.delete': {
    ar: 'حذف',
    en: 'Delete',
    es: 'Eliminar'
  },
  'button.back': {
    ar: 'رجوع',
    en: 'Back',
    es: 'Volver'
  },
  'button.next': {
    ar: 'التالي',
    en: 'Next',
    es: 'Siguiente'
  },
  'button.previous': {
    ar: 'السابق',
    en: 'Previous',
    es: 'Anterior'
  },
  'button.start': {
    ar: 'ابدأ',
    en: 'Start',
    es: 'Comenzar'
  },
  'button.finish': {
    ar: 'إنهاء',
    en: 'Finish',
    es: 'Terminar'
  },
  'button.retry': {
    ar: 'إعادة المحاولة',
    en: 'Try Again',
    es: 'Intentar de Nuevo'
  },
  'button.loading': {
    ar: 'جاري التحميل...',
    en: 'Loading...',
    es: 'Cargando...'
  },

  // Quiz Section
  'quiz.title': {
    ar: 'اختبر مهاراتك اللغوية',
    en: 'Test Your Language Skills',
    es: 'Prueba tus Habilidades Lingüísticas'
  },
  'quiz.description': {
    ar: 'تحدى نفسك مع اختباراتنا التفاعلية المصممة لتحسين كفاءتك اللغوية',
    en: 'Challenge yourself with our interactive quizzes designed to improve your language proficiency',
    es: 'Desafíate con nuestros cuestionarios interactivos diseñados para mejorar tu competencia lingüística'
  },
  'quiz.featuredTitle': {
    ar: 'الاختبارات المميزة',
    en: 'Featured Quizzes',
    es: 'Cuestionarios Destacados'
  },
  'quiz.featuredDescription': {
    ar: 'جرب اختباراتنا اللغوية الأكثر شعبية',
    en: 'Try our most popular language quizzes',
    es: 'Prueba nuestros cuestionarios de idiomas más populares'
  },
  'quiz.popularTitle': {
    ar: 'الاختبارات الشائعة',
    en: 'Popular Quizzes',
    es: 'Cuestionarios Populares'
  },
  'quiz.recentTitle': {
    ar: 'الاختبارات الحديثة',
    en: 'Recent Quizzes',
    es: 'Cuestionarios Recientes'
  },
  'quiz.allTitle': {
    ar: 'جميع الاختبارات',
    en: 'All Quizzes',
    es: 'Todos los Cuestionarios'
  },
  'quiz.startQuiz': {
    ar: 'ابدأ الاختبار',
    en: 'Start Quiz',
    es: 'Comenzar Cuestionario'
  },
  'quiz.browseAll': {
    ar: 'تصفح جميع الاختبارات',
    en: 'Browse All Quizzes',
    es: 'Explorar Todos los Cuestionarios'
  },
  'quiz.viewDashboard': {
    ar: 'عرض لوحة التحكم',
    en: 'View Dashboard',
    es: 'Ver Panel de Control'
  },
  'quiz.readyToStart': {
    ar: 'مستعد للبدء في التعلم؟',
    en: 'Ready to Start Learning?',
    es: '¿Listo para Empezar a Aprender?'
  },
  'quiz.joinThousands': {
    ar: 'انضم إلى آلاف المتعلمين الذين يحسنون مهاراتهم اللغوية كل يوم',
    en: 'Join thousands of learners improving their language skills every day',
    es: 'Únete a miles de estudiantes que mejoran sus habilidades lingüísticas todos los días'
  },

  // Quiz Statistics
  'quiz.stats.totalQuizzes': {
    ar: 'إجمالي الاختبارات',
    en: 'Total Quizzes',
    es: 'Total de Cuestionarios'
  },
  'quiz.stats.languages': {
    ar: 'اللغات',
    en: 'Languages',
    es: 'Idiomas'
  },
  'quiz.stats.students': {
    ar: 'الطلاب',
    en: 'Students',
    es: 'Estudiantes'
  },
  'quiz.stats.successRate': {
    ar: 'معدل النجاح',
    en: 'Success Rate',
    es: 'Tasa de Éxito'
  },
  'quiz.stats.questions': {
    ar: 'أسئلة',
    en: 'questions',
    es: 'preguntas'
  },
  'quiz.stats.attempts': {
    ar: 'محاولات',
    en: 'attempts',
    es: 'intentos'
  },
  'quiz.stats.minutes': {
    ar: 'دقيقة',
    en: 'minutes',
    es: 'minutos'
  },

  // Quiz List Page
  'quizList.title': {
    ar: 'اختبارات اللغة',
    en: 'Language Quizzes',
    es: 'Cuestionarios de Idiomas'
  },
  'quizList.description': {
    ar: 'اختبر مهاراتك اللغوية مع اختباراتنا التفاعلية',
    en: 'Test your language skills with our interactive quizzes',
    es: 'Prueba tus habilidades lingüísticas con nuestros cuestionarios interactivos'
  },
  'quizList.search': {
    ar: 'البحث في الاختبارات...',
    en: 'Search quizzes...',
    es: 'Buscar cuestionarios...'
  },
  'quizList.filterLevel': {
    ar: 'جميع المستويات',
    en: 'All Levels',
    es: 'Todos los Niveles'
  },
  'quizList.filterLanguage': {
    ar: 'جميع اللغات',
    en: 'All Languages',
    es: 'Todos los Idiomas'
  },
  'quizList.clearFilters': {
    ar: 'مسح المرشحات',
    en: 'Clear Filters',
    es: 'Limpiar Filtros'
  },
  'quizList.noQuizzes': {
    ar: 'لم يتم العثور على اختبارات',
    en: 'No quizzes found',
    es: 'No se encontraron cuestionarios'
  },
  'quizList.noQuizzesDescription': {
    ar: 'جرب تعديل معايير البحث أو تحقق لاحقاً من الاختبارات الجديدة',
    en: 'Try adjusting your search criteria or check back later for new quizzes',
    es: 'Intenta ajustar tus criterios de búsqueda o vuelve más tarde para nuevos cuestionarios'
  },
  'quizList.readyToTest': {
    ar: 'مستعد لاختبار مهاراتك؟',
    en: 'Ready to test your skills?',
    es: '¿Listo para probar tus habilidades?'
  },
  'quizList.chooseQuiz': {
    ar: 'اختر اختباراً يناسب مستواك وابدأ التعلم اليوم!',
    en: 'Choose a quiz that matches your level and start learning today!',
    es: '¡Elige un cuestionario que coincida con tu nivel y comienza a aprender hoy!'
  },
  'quizList.answered': {
    ar: 'تم الإجابة',
    en: 'answered',
    es: 'respondidas'
  },

  // Quiz Taking Page
  'quizTake.exitQuiz': {
    ar: 'الخروج من الاختبار',
    en: 'Exit Quiz',
    es: 'Salir del Cuestionario'
  },
  'quizTake.questionOf': {
    ar: 'السؤال {current} من {total}',
    en: 'Question {current} of {total}',
    es: 'Pregunta {current} de {total}'
  },
  'quizTake.questionsOverview': {
    ar: 'نظرة عامة على الأسئلة',
    en: 'Questions Overview',
    es: 'Resumen de Preguntas'
  },
  'quizTake.answered': {
    ar: 'تم الإجابة',
    en: 'Answered',
    es: 'Respondida'
  },
  'quizTake.notAnswered': {
    ar: 'لم يتم الإجابة',
    en: 'Not answered',
    es: 'No respondida'
  },
  'quizTake.readingText': {
    ar: 'نص القراءة:',
    en: 'Reading Text:',
    es: 'Texto de Lectura:'
  },
  'quizTake.enterAnswer': {
    ar: 'أدخل إجابتك...',
    en: 'Enter your answer...',
    es: 'Ingresa tu respuesta...'
  },
  'quizTake.writeEssay': {
    ar: 'اكتب إجابة المقال...',
    en: 'Write your essay answer...',
    es: 'Escribe tu respuesta de ensayo...'
  },
  'quizTake.submitQuiz': {
    ar: 'إرسال الاختبار',
    en: 'Submit Quiz',
    es: 'Enviar Cuestionario'
  },
  'quizTake.submitting': {
    ar: 'جاري الإرسال...',
    en: 'Submitting...',
    es: 'Enviando...'
  },
  'quizTake.submitConfirm': {
    ar: 'إرسال الاختبار؟',
    en: 'Submit Quiz?',
    es: '¿Enviar Cuestionario?'
  },
  'quizTake.unansweredQuestions': {
    ar: 'لديك {count} أسئلة غير مجابة. هل تريد الإرسال على أي حال؟',
    en: 'You have {count} unanswered questions. Do you want to submit anyway?',
    es: 'Tienes {count} preguntas sin responder. ¿Quieres enviar de todos modos?'
  },
  'quizTake.continueQuiz': {
    ar: 'متابعة الاختبار',
    en: 'Continue Quiz',
    es: 'Continuar Cuestionario'
  },
  'quizTake.submitAnyway': {
    ar: 'إرسال على أي حال',
    en: 'Submit Anyway',
    es: 'Enviar de Todos Modos'
  },
  'quizTake.loadingQuiz': {
    ar: 'جاري تحميل الاختبار...',
    en: 'Loading quiz...',
    es: 'Cargando cuestionario...'
  },
  'quizTake.noQuestions': {
    ar: 'لا توجد أسئلة متاحة لهذا الاختبار',
    en: 'No questions available for this quiz',
    es: 'No hay preguntas disponibles para este cuestionario'
  },
  'quizTake.backToHome': {
    ar: 'العودة إلى الرئيسية',
    en: 'Back to Home',
    es: 'Volver al Inicio'
  },

  // Quiz Results Page
  'quizResults.title': {
    ar: 'نتائج الاختبار',
    en: 'Quiz Results',
    es: 'Resultados del Cuestionario'
  },
  'quizResults.congratulations': {
    ar: 'تهانينا!',
    en: 'Congratulations!',
    es: '¡Felicitaciones!'
  },
  'quizResults.keepPracticing': {
    ar: 'استمر في التدريب!',
    en: 'Keep Practicing!',
    es: '¡Sigue Practicando!'
  },
  'quizResults.correct': {
    ar: 'صحيح',
    en: 'Correct',
    es: 'Correcto'
  },
  'quizResults.total': {
    ar: 'المجموع',
    en: 'Total',
    es: 'Total'
  },
  'quizResults.wrong': {
    ar: 'خطأ',
    en: 'Wrong',
    es: 'Incorrecto'
  },
  'quizResults.quizInfo': {
    ar: 'معلومات الاختبار',
    en: 'Quiz Information',
    es: 'Información del Cuestionario'
  },
  'quizResults.performance': {
    ar: 'تحليل الأداء',
    en: 'Performance Breakdown',
    es: 'Desglose del Rendimiento'
  },
  'quizResults.quiz': {
    ar: 'الاختبار',
    en: 'Quiz',
    es: 'Cuestionario'
  },
  'quizResults.level': {
    ar: 'المستوى',
    en: 'Level',
    es: 'Nivel'
  },
  'quizResults.language': {
    ar: 'اللغة',
    en: 'Language',
    es: 'Idioma'
  },
  'quizResults.timeTaken': {
    ar: 'الوقت المستغرق',
    en: 'Time Taken',
    es: 'Tiempo Empleado'
  },
  'quizResults.completed': {
    ar: 'مكتمل',
    en: 'Completed',
    es: 'Completado'
  },
  'quizResults.passingScore': {
    ar: 'درجة النجاح',
    en: 'Passing Score',
    es: 'Puntuación de Aprobación'
  },
  'quizResults.passed': {
    ar: 'نجح',
    en: 'PASSED',
    es: 'APROBADO'
  },
  'quizResults.failed': {
    ar: 'رسب',
    en: 'FAILED',
    es: 'REPROBADO'
  },
  'quizResults.accuracy': {
    ar: 'الدقة',
    en: 'Accuracy',
    es: 'Precisión'
  },
  'quizResults.correctAnswers': {
    ar: 'الإجابات الصحيحة',
    en: 'Correct Answers',
    es: 'Respuestas Correctas'
  },
  'quizResults.incorrectAnswers': {
    ar: 'الإجابات الخاطئة',
    en: 'Incorrect Answers',
    es: 'Respuestas Incorrectas'
  },
  'quizResults.tryAgain': {
    ar: 'حاول مرة أخرى',
    en: 'Try Again',
    es: 'Intentar de Nuevo'
  },
  'quizResults.successMessage': {
    ar: 'عمل رائع! لقد أكملت هذا الاختبار بنجاح. استمر في العمل الممتاز!',
    en: 'Great job! You\'ve successfully completed this quiz. Keep up the excellent work!',
    es: '¡Excelente trabajo! Has completado exitosamente este cuestionario. ¡Sigue con el excelente trabajo!'
  },
  'quizResults.encouragementMessage': {
    ar: 'لا تستسلم! التعلم رحلة. راجع المواد وحاول مرة أخرى عندما تكون مستعداً.',
    en: 'Don\'t give up! Learning is a journey. Review the material and try again when you\'re ready.',
    es: '¡No te rindas! Aprender es un viaje. Revisa el material e inténtalo de nuevo cuando estés listo.'
  },
  'quizResults.notFound': {
    ar: 'لم يتم العثور على نتائج الاختبار',
    en: 'Quiz results not found',
    es: 'Resultados del cuestionario no encontrados'
  },

  // Error Messages
  'error.loading': {
    ar: 'خطأ في التحميل',
    en: 'Loading Error',
    es: 'Error de Carga'
  },
  'error.network': {
    ar: 'خطأ في الشبكة',
    en: 'Network Error',
    es: 'Error de Red'
  },
  'error.tryAgain': {
    ar: 'يرجى المحاولة مرة أخرى',
    en: 'Please try again',
    es: 'Por favor, inténtalo de nuevo'
  },
  'error.somethingWrong': {
    ar: 'حدث خطأ ما',
    en: 'Something went wrong',
    es: 'Algo salió mal'
  },

  // Loading States
  'loading.quizzes': {
    ar: 'جاري تحميل الاختبارات...',
    en: 'Loading quizzes...',
    es: 'Cargando cuestionarios...'
  },
  'loading.questions': {
    ar: 'جاري تحميل الأسئلة...',
    en: 'Loading questions...',
    es: 'Cargando preguntas...'
  },
  'loading.results': {
    ar: 'جاري تحميل النتائج...',
    en: 'Loading results...',
    es: 'Cargando resultados...'
  },

  // Levels
  'level.A1': {
    ar: 'مبتدئ',
    en: 'Beginner',
    es: 'Principiante'
  },
  'level.A2': {
    ar: 'أساسي',
    en: 'Elementary',
    es: 'Elemental'
  },
  'level.B1': {
    ar: 'متوسط',
    en: 'Intermediate',
    es: 'Intermedio'
  },
  'level.B2': {
    ar: 'متوسط عالي',
    en: 'Upper Intermediate',
    es: 'Intermedio Alto'
  },
  'level.C1': {
    ar: 'متقدم',
    en: 'Advanced',
    es: 'Avanzado'
  },
  'level.C2': {
    ar: 'إتقان',
    en: 'Proficiency',
    es: 'Competencia'
  },

  // Question Types
  'questionType.multiple_choice': {
    ar: 'اختيار متعدد',
    en: 'Multiple Choice',
    es: 'Opción Múltiple'
  },
  'questionType.true_false': {
    ar: 'صح أم خطأ',
    en: 'True or False',
    es: 'Verdadero o Falso'
  },
  'questionType.fill_blank': {
    ar: 'املأ الفراغ',
    en: 'Fill in the Blank',
    es: 'Llenar el Espacio'
  },
  'questionType.essay': {
    ar: 'مقال',
    en: 'Essay',
    es: 'Ensayo'
  },
  'questionType.listening': {
    ar: 'استماع',
    en: 'Listening',
    es: 'Escucha'
  },
  'questionType.reading': {
    ar: 'قراءة',
    en: 'Reading',
    es: 'Lectura'
  },

  // True/False Options
  'option.true': {
    ar: 'صحيح',
    en: 'True',
    es: 'Verdadero'
  },
  'option.false': {
    ar: 'خطأ',
    en: 'False',
    es: 'Falso'
  },

  // Time Format
  'time.hours': {
    ar: 'ساعة',
    en: 'h',
    es: 'h'
  },
  'time.minutes': {
    ar: 'دقيقة',
    en: 'm',
    es: 'm'
  },
  'time.seconds': {
    ar: 'ثانية',
    en: 's',
    es: 's'
  },

  // Language names
  'language.english': {
    ar: 'الإنجليزية',
    en: 'English',
    es: 'Inglés'
  },
  'language.arabic': {
    ar: 'العربية',
    en: 'Arabic',
    es: 'Árabe'
  },
  'language.spanish': {
    ar: 'الإسبانية',
    en: 'Spanish',
    es: 'Español'
  },
  'language.french': {
    ar: 'الفرنسية',
    en: 'French',
    es: 'Francés'
  },
  'language.german': {
    ar: 'الألمانية',
    en: 'German',
    es: 'Alemán'
  },
  'language.italian': {
    ar: 'الإيطالية',
    en: 'Italian',
    es: 'Italiano'
  },
  'language.portuguese': {
    ar: 'البرتغالية',
    en: 'Portuguese',
    es: 'Portugués'
  },
  'language.chinese': {
    ar: 'الصينية',
    en: 'Chinese',
    es: 'Chino'
  },
  'language.japanese': {
    ar: 'اليابانية',
    en: 'Japanese',
    es: 'Japonés'
  },
  'language.korean': {
    ar: 'الكورية',
    en: 'Korean',
    es: 'Coreano'
  },
  'language.russian': {
    ar: 'الروسية',
    en: 'Russian',
    es: 'Ruso'
  },
  'language.turkish': {
    ar: 'التركية',
    en: 'Turkish',
    es: 'Turco'
  },

  // Common phrases
  'common.loading': {
    ar: 'جاري التحميل...',
    en: 'Loading...',
    es: 'Cargando...'
  },
  'common.error': {
    ar: 'خطأ',
    en: 'Error',
    es: 'Error'
  },
  'common.success': {
    ar: 'نجح',
    en: 'Success',
    es: 'Éxito'
  },
  'common.warning': {
    ar: 'تحذير',
    en: 'Warning',
    es: 'Advertencia'
  },
  'common.info': {
    ar: 'معلومات',
    en: 'Information',
    es: 'Información'
  },
  'common.confirm': {
    ar: 'تأكيد',
    en: 'Confirm',
    es: 'Confirmar'
  },
  'common.yes': {
    ar: 'نعم',
    en: 'Yes',
    es: 'Sí'
  },
  'common.no': {
    ar: 'لا',
    en: 'No',
    es: 'No'
  },
  'common.ok': {
    ar: 'موافق',
    en: 'OK',
    es: 'OK'
  },
  'common.close': {
    ar: 'إغلاق',
    en: 'Close',
    es: 'Cerrar'
  },
  'common.open': {
    ar: 'فتح',
    en: 'Open',
    es: 'Abrir'
  },
  'common.search': {
    ar: 'بحث',
    en: 'Search',
    es: 'Buscar'
  },
  'common.filter': {
    ar: 'تصفية',
    en: 'Filter',
    es: 'Filtrar'
  },
  'common.sort': {
    ar: 'ترتيب',
    en: 'Sort',
    es: 'Ordenar'
  },
  'common.view': {
    ar: 'عرض',
    en: 'View',
    es: 'Ver'
  },
  'common.download': {
    ar: 'تحميل',
    en: 'Download',
    es: 'Descargar'
  },
  'common.upload': {
    ar: 'رفع',
    en: 'Upload',
    es: 'Subir'
  },
  'common.share': {
    ar: 'مشاركة',
    en: 'Share',
    es: 'Compartir'
  },
  'common.copy': {
    ar: 'نسخ',
    en: 'Copy',
    es: 'Copiar'
  },
  'common.paste': {
    ar: 'لصق',
    en: 'Paste',
    es: 'Pegar'
  },
  'common.cut': {
    ar: 'قص',
    en: 'Cut',
    es: 'Cortar'
  },
  'common.undo': {
    ar: 'تراجع',
    en: 'Undo',
    es: 'Deshacer'
  },
  'common.redo': {
    ar: 'إعادة',
    en: 'Redo',
    es: 'Rehacer'
  },
  'common.refresh': {
    ar: 'تحديث',
    en: 'Refresh',
    es: 'Actualizar'
  },
  'common.reset': {
    ar: 'إعادة تعيين',
    en: 'Reset',
    es: 'Restablecer'
  },
  'common.clear': {
    ar: 'مسح',
    en: 'Clear',
    es: 'Limpiar'
  },
  'common.select': {
    ar: 'اختيار',
    en: 'Select',
    es: 'Seleccionar'
  },
  'common.deselect': {
    ar: 'إلغاء الاختيار',
    en: 'Deselect',
    es: 'Deseleccionar'
  },
  'common.all': {
    ar: 'الكل',
    en: 'All',
    es: 'Todo'
  },
  'common.none': {
    ar: 'لا شيء',
    en: 'None',
    es: 'Ninguno'
  },
  'common.more': {
    ar: 'المزيد',
    en: 'More',
    es: 'Más'
  },
  'common.less': {
    ar: 'أقل',
    en: 'Less',
    es: 'Menos'
  },
  'common.show': {
    ar: 'إظهار',
    en: 'Show',
    es: 'Mostrar'
  },
  'common.hide': {
    ar: 'إخفاء',
    en: 'Hide',
    es: 'Ocultar'
  },
  'common.expand': {
    ar: 'توسيع',
    en: 'Expand',
    es: 'Expandir'
  },
  'common.collapse': {
    ar: 'طي',
    en: 'Collapse',
    es: 'Contraer'
  },
  'common.maximize': {
    ar: 'تكبير',
    en: 'Maximize',
    es: 'Maximizar'
  },
  'common.minimize': {
    ar: 'تصغير',
    en: 'Minimize',
    es: 'Minimizar'
  }
};

// Helper function to get localized content from API responses
export const getLocalizedContent = (
  content: { en: string; ar?: string; es?: string } | string,
  language: SupportedLanguage
): string => {
  if (typeof content === 'string') {
    return content;
  }
  
  return content[language] || content.en || '';
};

// Helper function to format time
export const formatTime = (seconds: number, language: SupportedLanguage): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const t = (key: string) => translations[key]?.[language] || key;

  if (hours > 0) {
    return `${hours}${t('time.hours')} ${minutes}${t('time.minutes')} ${secs}${t('time.seconds')}`;
  }
  return `${minutes}${t('time.minutes')} ${secs}${t('time.seconds')}`;
};

// Helper function to format numbers with localization
export const formatNumber = (num: number, language: SupportedLanguage): string => {
  const locale = language === 'ar' ? 'ar-SA' : language === 'es' ? 'es-ES' : 'en-US';
  return new Intl.NumberFormat(locale).format(num);
};

// Helper function to format dates with localization
export const formatDate = (date: Date | string, language: SupportedLanguage): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'ar' ? 'ar-SA' : language === 'es' ? 'es-ES' : 'en-US';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

// Helper function to get language direction
export const getLanguageDirection = (language: SupportedLanguage): 'rtl' | 'ltr' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

// Helper function to interpolate variables in translations
export const interpolate = (text: string, variables: Record<string, string | number>): string => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key]?.toString() || match;
  });
};