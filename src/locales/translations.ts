export type SupportedLanguage = "ar" | "en" | "es";

export type Translations = {
  [key: string]: {
    [key in SupportedLanguage]: string;
  };
};

export const translations: Translations = {
  // Navigation
  "nav.home": {
    ar: "الرئيسية",
    en: "Home",
    es: "Inicio",
  },
  "nav.professors": {
    ar: "المدرسين",
    en: "Professors",
    es: "Profesores",
  },
  "nav.languages": {
    ar: "اللغات",
    en: "Languages",
    es: "Idiomas",
  },
  "nav.quizzes": {
    ar: "الاختبارات",
    en: "Quizzes",
    es: "Cuestionarios",
  },
  "nav.dashboard": {
    ar: "لوحة التحكم",
    en: "Dashboard",
    es: "Panel de Control",
  },
  "nav.profile": {
    ar: "الملف الشخصي",
    en: "Profile",
    es: "Perfil",
  },
  "nav.settings": {
    ar: "الإعدادات",
    en: "Settings",
    es: "Configuración",
  },
  "nav.register": {
    ar: "التسجيل",
    en: "Register",
    es: "Registro",
  },
  "nav.contact": {
    ar: "اتصل بنا",
    en: "Contact Us",
    es: "Contacto",
  },
  "nav.login": {
    ar: "تسجيل الدخول",
    en: "Login",
    es: "Iniciar Sesión",
  },
  "nav.logout": {
    ar: "تسجيل الخروج",
    en: "Logout",
    es: "Cerrar Sesión",
  },

  "contact.name": {
    ar: "الاسم",
    en: "Name",
    es: "Nombre",
  },
  "contact.email": {
    ar: "البريد الإلكتروني",
    en: "Email",
    es: "Correo electrónico",
  },

  // Admin Navigation
  "admin.nav.overview": {
    ar: "نظرة عامة",
    en: "Overview",
    es: "Resumen",
  },
  "admin.nav.users": {
    ar: "المستخدمين",
    en: "Users",
    es: "Usuarios",
  },
  "admin.nav.teachers": {
    ar: "المدرسين",
    en: "Teachers",
    es: "Profesores",
  },
  "admin.nav.languages": {
    ar: "اللغات",
    en: "Languages",
    es: "Idiomas",
  },
  "admin.nav.courses": {
    ar: "الدورات",
    en: "Courses",
    es: "Cursos",
  },
  "admin.nav.quizzes": {
    ar: "الاختبارات",
    en: "Quizzes",
    es: "Cuestionarios",
  },
  "admin.nav.quizImport": {
    ar: "استيراد الاختبارات",
    en: "Quiz Import",
    es: "Importar Cuestionarios",
  },
  "admin.nav.analytics": {
    ar: "التحليلات",
    en: "Analytics",
    es: "Análisis",
  },
  "admin.nav.settings": {
    ar: "الإعدادات",
    en: "Settings",
    es: "Configuración",
  },

  // Admin Dashboard
  "admin.dashboard.title": {
    ar: "لوحة التحكم الإدارية",
    en: "Admin Dashboard",
    es: "Panel de Administración",
  },
  "admin.dashboard.manageSystemDesc": {
    ar: "إدارة النظام والمحتوى",
    en: "Manage system and content",
    es: "Gestionar sistema y contenido",
  },
  "admin.stats.activeLanguages": {
    ar: "اللغات النشطة",
    en: "Active Languages",
    es: "Idiomas Activos",
  },
  "admin.status.online": {
    ar: "متصل",
    en: "Online",
    es: "En línea",
  },
  "admin.recentActivity.title": {
    ar: "النشاط الأخير",
    en: "Recent Activity",
    es: "Actividad Reciente",
  },
  "admin.quickActions.title": {
    ar: "إجراءات سريعة",
    en: "Quick Actions",
    es: "Acciones Rápidas",
  },
  "admin.quickActions.addUser": {
    ar: "إضافة مستخدم",
    en: "Add User",
    es: "Agregar Usuario",
  },
  "admin.quickActions.addQuiz": {
    ar: "إضافة اختبار",
    en: "Add Quiz",
    es: "Agregar Cuestionario",
  },
  "admin.quickActions.addTeacher": {
    ar: "إضافة مدرس",
    en: "Add Teacher",
    es: "Agregar Profesor",
  },
  "admin.quickActions.addLanguage": {
    ar: "إضافة لغة",
    en: "Add Language",
    es: "Agregar Idioma",
  },
  "admin.systemStatus.title": {
    ar: "حالة النظام",
    en: "System Status",
    es: "Estado del Sistema",
  },
  "admin.systemStatus.uptime": {
    ar: "وقت التشغيل",
    en: "Uptime",
    es: "Tiempo de Actividad",
  },
  "admin.systemStatus.responseTime": {
    ar: "وقت الاستجابة",
    en: "Response Time",
    es: "Tiempo de Respuesta",
  },
  "admin.systemStatus.storage": {
    ar: "التخزين المستخدم",
    en: "Storage Used",
    es: "Almacenamiento Usado",
  },

  // Admin Users Management
  "admin.users.description": {
    ar: "إدارة جميع المستخدمين في النظام",
    en: "Manage all users in the system",
    es: "Gestionar todos los usuarios en el sistema",
  },
  "admin.users.subtitle": {
    ar: "إدارة حسابات المستخدمين والصلاحيات",
    en: "Manage user accounts and permissions",
    es: "Gestionar cuentas de usuario y permisos",
  },
  "admin.users.addUser": {
    ar: "إضافة مستخدم",
    en: "Add User",
    es: "Agregar Usuario",
  },
  "admin.users.searchPlaceholder": {
    ar: "البحث عن المستخدمين...",
    en: "Search users...",
    es: "Buscar usuarios...",
  },
  "admin.users.filters": {
    ar: "المرشحات",
    en: "Filters",
    es: "Filtros",
  },
  "admin.users.allUsers": {
    ar: "جميع المستخدمين",
    en: "All Users",
    es: "Todos los Usuarios",
  },
  "admin.users.status.active": {
    ar: "نشط",
    en: "Active",
    es: "Activo",
  },
  "admin.users.status.inactive": {
    ar: "غير نشط",
    en: "Inactive",
    es: "Inactivo",
  },
  "admin.users.role.admin": {
    ar: "مدير",
    en: "Admin",
    es: "Administrador",
  },
  "admin.users.role.teacher": {
    ar: "مدرس",
    en: "Teacher",
    es: "Profesor",
  },
  "admin.users.role.student": {
    ar: "طالب",
    en: "Student",
    es: "Estudiante",
  },
  "admin.users.table.user": {
    ar: "المستخدم",
    en: "User",
    es: "Usuario",
  },
  "admin.users.table.role": {
    ar: "الدور",
    en: "Role",
    es: "Rol",
  },
  "admin.users.table.status": {
    ar: "الحالة",
    en: "Status",
    es: "Estado",
  },
  "admin.users.table.joinDate": {
    ar: "تاريخ الانضمام",
    en: "Join Date",
    es: "Fecha de Registro",
  },
  "admin.users.table.actions": {
    ar: "الإجراءات",
    en: "Actions",
    es: "Acciones",
  },
  "admin.users.actions.edit": {
    ar: "تعديل",
    en: "Edit",
    es: "Editar",
  },
  "admin.users.actions.delete": {
    ar: "حذف",
    en: "Delete",
    es: "Eliminar",
  },
  "admin.users.refresh": {
    ar: "تحديث",
    en: "Refresh",
    es: "Actualizar",
  },
  "admin.users.loading": {
    ar: "جاري التحميل...",
    en: "Loading...",
    es: "Cargando...",
  },
  "admin.users.retry": {
    ar: "إعادة المحاولة",
    en: "Retry",
    es: "Reintentar",
  },
  "admin.users.noUsers": {
    ar: "لا يوجد مستخدمون",
    en: "No users found",
    es: "No se encontraron usuarios",
  },
  "admin.users.addFirstUser": {
    ar: "إضافة أول مستخدم",
    en: "Add First User",
    es: "Agregar Primer Usuario",
  },
  "admin.users.actions.activate": {
    ar: "تفعيل",
    en: "Activate",
    es: "Activar",
  },
  "admin.users.actions.deactivate": {
    ar: "إلغاء التفعيل",
    en: "Deactivate",
    es: "Desactivar",
  },

  // Admin Teachers Management
  "admin.teachers.title": {
    ar: "إدارة المدرسين",
    en: "Teachers Management",
    es: "Gestión de Profesores",
  },
  "admin.teachers.subtitle": {
    ar: "إدارة المدرسين والمحاضرين",
    en: "Manage teachers and instructors",
    es: "Gestionar profesores e instructores",
  },
  "admin.teachers.addTeacher": {
    ar: "إضافة مدرس",
    en: "Add Teacher",
    es: "Agregar Profesor",
  },
  "admin.teachers.searchPlaceholder": {
    ar: "البحث عن المدرسين...",
    en: "Search teachers...",
    es: "Buscar profesores...",
  },
  "admin.teachers.filters": {
    ar: "المرشحات",
    en: "Filters",
    es: "Filtros",
  },
  "admin.teachers.allTeachers": {
    ar: "جميع المدرسين",
    en: "All Teachers",
    es: "Todos los Profesores",
  },
  "admin.teachers.status.active": {
    ar: "نشط",
    en: "Active",
    es: "Activo",
  },
  "admin.teachers.status.inactive": {
    ar: "غير نشط",
    en: "Inactive",
    es: "Inactivo",
  },
  "admin.teachers.stats.total": {
    ar: "المجموع",
    en: "Total",
    es: "Total",
  },
  "admin.teachers.stats.active": {
    ar: "النشطين",
    en: "Active",
    es: "Activos",
  },
  "admin.teachers.stats.totalStudents": {
    ar: "إجمالي الطلاب",
    en: "Total Students",
    es: "Total de Estudiantes",
  },
  "admin.teachers.stats.avgRating": {
    ar: "متوسط التقييم",
    en: "Avg Rating",
    es: "Calificación Promedio",
  },
  "admin.teachers.table.teacher": {
    ar: "المدرس",
    en: "Teacher",
    es: "Profesor",
  },
  "admin.teachers.table.specialization": {
    ar: "التخصص",
    en: "Specialization",
    es: "Especialización",
  },
  "admin.teachers.table.languages": {
    ar: "اللغات",
    en: "Languages",
    es: "Idiomas",
  },
  "admin.teachers.table.rating": {
    ar: "التقييم",
    en: "Rating",
    es: "Calificación",
  },
  "admin.teachers.table.students": {
    ar: "الطلاب",
    en: "Students",
    es: "Estudiantes",
  },
  "admin.teachers.table.status": {
    ar: "الحالة",
    en: "Status",
    es: "Estado",
  },
  "admin.teachers.table.actions": {
    ar: "الإجراءات",
    en: "Actions",
    es: "Acciones",
  },
  "admin.teachers.courses": {
    ar: "دورات",
    en: "courses",
    es: "cursos",
  },
  "admin.teachers.actions.edit": {
    ar: "تعديل",
    en: "Edit",
    es: "Editar",
  },
  "admin.teachers.actions.schedule": {
    ar: "الجدول",
    en: "Schedule",
    es: "Horario",
  },
  "admin.teachers.actions.delete": {
    ar: "حذف",
    en: "Delete",
    es: "Eliminar",
  },

  // Admin Languages Management
  "admin.languages.title": {
    ar: "إدارة اللغات",
    en: "Languages Management",
    es: "Gestión de Idiomas",
  },
  "admin.languages.description": {
    ar: "إدارة جميع اللغات في النظام",
    en: "Manage all languages in the system",
    es: "Gestionar todos los idiomas en el sistema",
  },
  "admin.languages.addLanguage": {
    ar: "إضافة لغة",
    en: "Add Language",
    es: "Agregar Idioma",
  },
  "admin.languages.searchPlaceholder": {
    ar: "البحث عن اللغات...",
    en: "Search languages...",
    es: "Buscar idiomas...",
  },
  "admin.languages.filters": {
    ar: "المرشحات",
    en: "Filters",
    es: "Filtros",
  },
  "admin.languages.status.active": {
    ar: "نشطة",
    en: "Active",
    es: "Activo",
  },
  "admin.languages.status.inactive": {
    ar: "غير نشطة",
    en: "Inactive",
    es: "Inactivo",
  },
  "admin.languages.code": {
    ar: "الرمز",
    en: "Code",
    es: "Código",
  },
  "admin.languages.quizzes": {
    ar: "الاختبارات",
    en: "Quizzes",
    es: "Cuestionarios",
  },
  "admin.languages.students": {
    ar: "الطلاب",
    en: "Students",
    es: "Estudiantes",
  },
  "admin.languages.actions.edit": {
    ar: "تعديل",
    en: "Edit",
    es: "Editar",
  },
  "admin.languages.actions.activate": {
    ar: "تفعيل",
    en: "Activate",
    es: "Activar",
  },
  "admin.languages.actions.deactivate": {
    ar: "إلغاء التفعيل",
    en: "Deactivate",
    es: "Desactivar",
  },
  "admin.languages.actions.delete": {
    ar: "حذف",
    en: "Delete",
    es: "Eliminar",
  },
  "admin.languages.stats.totalQuizzes": {
    ar: "إجمالي الاختبارات",
    en: "Total Quizzes",
    es: "Total de Cuestionarios",
  },
  "admin.languages.stats.totalStudents": {
    ar: "إجمالي الطلاب",
    en: "Total Students",
    es: "Total de Estudiantes",
  },

  // Admin Settings
  "admin.settings.description": {
    ar: "إعدادات النظام والتكوين",
    en: "System settings and configuration",
    es: "Configuración y ajustes del sistema",
  },
  "admin.settings.subtitle": {
    ar: "إدارة إعدادات النظام العامة",
    en: "Manage general system settings",
    es: "Gestionar configuración general del sistema",
  },
  "admin.settings.saveChanges": {
    ar: "حفظ التغييرات",
    en: "Save Changes",
    es: "Guardar Cambios",
  },
  "admin.settings.tabs.general": {
    ar: "عام",
    en: "General",
    es: "General",
  },
  "admin.settings.tabs.notifications": {
    ar: "الإشعارات",
    en: "Notifications",
    es: "Notificaciones",
  },
  "admin.settings.tabs.security": {
    ar: "الأمان",
    en: "Security",
    es: "Seguridad",
  },
  "admin.settings.tabs.system": {
    ar: "النظام",
    en: "System",
    es: "Sistema",
  },

  // Common buttons
  "button.register": {
    ar: "سجل الآن",
    en: "Register Now",
    es: "Regístrate Ahora",
  },
  "button.submit": {
    ar: "إرسال",
    en: "Submit",
    es: "Enviar",
  },
  "button.cancel": {
    ar: "إلغاء",
    en: "Cancel",
    es: "Cancelar",
  },
  "button.save": {
    ar: "حفظ",
    en: "Save",
    es: "Guardar",
  },
  "button.edit": {
    ar: "تعديل",
    en: "Edit",
    es: "Editar",
  },
  "button.delete": {
    ar: "حذف",
    en: "Delete",
    es: "Eliminar",
  },
  "button.back": {
    ar: "رجوع",
    en: "Back",
    es: "Volver",
  },
  "button.next": {
    ar: "التالي",
    en: "Next",
    es: "Siguiente",
  },
  "button.previous": {
    ar: "السابق",
    en: "Previous",
    es: "Anterior",
  },
  "button.start": {
    ar: "ابدأ",
    en: "Start",
    es: "Comenzar",
  },
  "button.finish": {
    ar: "إنهاء",
    en: "Finish",
    es: "Terminar",
  },
  "button.retry": {
    ar: "إعادة المحاولة",
    en: "Try Again",
    es: "Intentar de Nuevo",
  },
  "button.loading": {
    ar: "جاري التحميل...",
    en: "Loading...",
    es: "Cargando...",
  },

  // Quiz Section
  "quiz.title": {
    ar: "اختبر مهاراتك اللغوية",
    en: "Test Your Language Skills",
    es: "Prueba tus Habilidades Lingüísticas",
  },
  "quiz.description": {
    ar: "تحدى نفسك مع اختباراتنا التفاعلية المصممة لتحسين كفاءتك اللغوية",
    en: "Challenge yourself with our interactive quizzes designed to improve your language proficiency",
    es: "Desafíate con nuestros cuestionarios interactivos diseñados para mejorar tu competencia lingüística",
  },
  "quiz.featuredTitle": {
    ar: "الاختبارات المميزة",
    en: "Featured Quizzes",
    es: "Cuestionarios Destacados",
  },
  "quiz.featuredDescription": {
    ar: "جرب اختباراتنا اللغوية الأكثر شعبية",
    en: "Try our most popular language quizzes",
    es: "Prueba nuestros cuestionarios de idiomas más populares",
  },
  "quiz.popularTitle": {
    ar: "الاختبارات الشائعة",
    en: "Popular Quizzes",
    es: "Cuestionarios Populares",
  },
  "quiz.recentTitle": {
    ar: "الاختبارات الحديثة",
    en: "Recent Quizzes",
    es: "Cuestionarios Recientes",
  },
  "quiz.allTitle": {
    ar: "جميع الاختبارات",
    en: "All Quizzes",
    es: "Todos los Cuestionarios",
  },
  "quiz.startQuiz": {
    ar: "ابدأ الاختبار",
    en: "Start Quiz",
    es: "Comenzar Cuestionario",
  },
  "quiz.browseAll": {
    ar: "تصفح جميع الاختبارات",
    en: "Browse All Quizzes",
    es: "Explorar Todos los Cuestionarios",
  },
  "quiz.viewDashboard": {
    ar: "عرض لوحة التحكم",
    en: "View Dashboard",
    es: "Ver Panel de Control",
  },
  "quiz.readyToStart": {
    ar: "مستعد للبدء في التعلم؟",
    en: "Ready to Start Learning?",
    es: "¿Listo para Empezar a Aprender?",
  },
  "quiz.joinThousands": {
    ar: "انضم إلى آلاف المتعلمين الذين يحسنون مهاراتهم اللغوية كل يوم",
    en: "Join thousands of learners improving their language skills every day",
    es: "Únete a miles de estudiantes que mejoran sus habilidades lingüísticas todos los días",
  },

  // Quiz Statistics
  "quiz.stats.totalQuizzes": {
    ar: "إجمالي الاختبارات",
    en: "Total Quizzes",
    es: "Total de Cuestionarios",
  },
  "quiz.stats.languages": {
    ar: "اللغات",
    en: "Languages",
    es: "Idiomas",
  },
  "quiz.stats.students": {
    ar: "الطلاب",
    en: "Students",
    es: "Estudiantes",
  },
  "quiz.stats.successRate": {
    ar: "معدل النجاح",
    en: "Success Rate",
    es: "Tasa de Éxito",
  },
  "quiz.stats.questions": {
    ar: "أسئلة",
    en: "questions",
    es: "preguntas",
  },
  "quiz.stats.attempts": {
    ar: "محاولات",
    en: "attempts",
    es: "intentos",
  },
  "quiz.stats.minutes": {
    ar: "دقيقة",
    en: "minutes",
    es: "minutos",
  },

  // Quiz List Page
  "quizList.title": {
    ar: "اختبارات اللغة",
    en: "Language Quizzes",
    es: "Cuestionarios de Idiomas",
  },
  "quizList.description": {
    ar: "اختبر مهاراتك اللغوية مع اختباراتنا التفاعلية",
    en: "Test your language skills with our interactive quizzes",
    es: "Prueba tus habilidades lingüísticas con nuestros cuestionarios interactivos",
  },
  "quizList.search": {
    ar: "البحث في الاختبارات...",
    en: "Search quizzes...",
    es: "Buscar cuestionarios...",
  },
  "quizList.filterLevel": {
    ar: "جميع المستويات",
    en: "All Levels",
    es: "Todos los Niveles",
  },
  "quizList.filterLanguage": {
    ar: "جميع اللغات",
    en: "All Languages",
    es: "Todos los Idiomas",
  },
  "quizList.clearFilters": {
    ar: "مسح المرشحات",
    en: "Clear Filters",
    es: "Limpiar Filtros",
  },
  "quizList.noQuizzes": {
    ar: "لم يتم العثور على اختبارات",
    en: "No quizzes found",
    es: "No se encontraron cuestionarios",
  },
  "quizList.noQuizzesDescription": {
    ar: "جرب تعديل معايير البحث أو تحقق لاحقاً من الاختبارات الجديدة",
    en: "Try adjusting your search criteria or check back later for new quizzes",
    es: "Intenta ajustar tus criterios de búsqueda o vuelve más tarde para nuevos cuestionarios",
  },
  "quizList.readyToTest": {
    ar: "مستعد لاختبار مهاراتك؟",
    en: "Ready to test your skills?",
    es: "¿Listo para probar tus habilidades?",
  },
  "quizList.chooseQuiz": {
    ar: "اختر اختباراً يناسب مستواك وابدأ التعلم اليوم!",
    en: "Choose a quiz that matches your level and start learning today!",
    es: "¡Elige un cuestionario que coincida con tu nivel y comienza a aprender hoy!",
  },
  "quizList.answered": {
    ar: "تم الإجابة",
    en: "answered",
    es: "respondidas",
  },

  // Quiz Taking Page
  "quizTake.exitQuiz": {
    ar: "الخروج من الاختبار",
    en: "Exit Quiz",
    es: "Salir del Cuestionario",
  },
  "quizTake.questionOf": {
    ar: "السؤال {current} من {total}",
    en: "Question {current} of {total}",
    es: "Pregunta {current} de {total}",
  },
  "quizTake.questionsOverview": {
    ar: "نظرة عامة على الأسئلة",
    en: "Questions Overview",
    es: "Resumen de Preguntas",
  },
  "quizTake.answered": {
    ar: "تم الإجابة",
    en: "Answered",
    es: "Respondida",
  },
  "quizTake.notAnswered": {
    ar: "لم يتم الإجابة",
    en: "Not answered",
    es: "No respondida",
  },
  "quizTake.readingText": {
    ar: "نص القراءة:",
    en: "Reading Text:",
    es: "Texto de Lectura:",
  },
  "quizTake.enterAnswer": {
    ar: "أدخل إجابتك...",
    en: "Enter your answer...",
    es: "Ingresa tu respuesta...",
  },
  "quizTake.writeEssay": {
    ar: "اكتب إجابة المقال...",
    en: "Write your essay answer...",
    es: "Escribe tu respuesta de ensayo...",
  },
  "quizTake.submitQuiz": {
    ar: "إرسال الاختبار",
    en: "Submit Quiz",
    es: "Enviar Cuestionario",
  },
  "quizTake.submitting": {
    ar: "جاري الإرسال...",
    en: "Submitting...",
    es: "Enviando...",
  },
  "quizTake.submitConfirm": {
    ar: "إرسال الاختبار؟",
    en: "Submit Quiz?",
    es: "¿Enviar Cuestionario?",
  },
  "quizTake.unansweredQuestions": {
    ar: "لديك {count} أسئلة غير مجابة. هل تريد الإرسال على أي حال؟",
    en: "You have {count} unanswered questions. Do you want to submit anyway?",
    es: "Tienes {count} preguntas sin responder. ¿Quieres enviar de todos modos?",
  },
  "quizTake.continueQuiz": {
    ar: "متابعة الاختبار",
    en: "Continue Quiz",
    es: "Continuar Cuestionario",
  },
  "quizTake.submitAnyway": {
    ar: "إرسال على أي حال",
    en: "Submit Anyway",
    es: "Enviar de Todos Modos",
  },
  "quizTake.loadingQuiz": {
    ar: "جاري تحميل الاختبار...",
    en: "Loading quiz...",
    es: "Cargando cuestionario...",
  },
  "quizTake.title": {
    ar: "ابدأ الاختبار",
    en: "Start Quiz",
    es: "Comenzar Cuestionario",
  },
  "quizTake.question": {
    ar: "السؤال",
    en: "Question",
    es: "Pregunta",
  },
  "quizTake.unsupportedQuestion": {
    ar: "نوع السؤال غير مدعوم حالياً",
    en: "This question type is not supported yet",
    es: "Este tipo de pregunta no está soportado todavía",
  },
  "quizTake.noQuestions": {
    ar: "لا توجد أسئلة متاحة لهذا الاختبار",
    en: "No questions available for this quiz",
    es: "No hay preguntas disponibles para este cuestionario",
  },
  "quizTake.backToHome": {
    ar: "العودة إلى الرئيسية",
    en: "Back to Home",
    es: "Volver al Inicio",
  },

  // Quiz Results Page
  "quizResults.title": {
    ar: "نتائج الاختبار",
    en: "Quiz Results",
    es: "Resultados del Cuestionario",
  },
  "quizResults.congratulations": {
    ar: "تهانينا!",
    en: "Congratulations!",
    es: "¡Felicitaciones!",
  },
  "quizResults.keepPracticing": {
    ar: "استمر في التدريب!",
    en: "Keep Practicing!",
    es: "¡Sigue Practicando!",
  },
  "quizResults.correct": {
    ar: "صحيح",
    en: "Correct",
    es: "Correcto",
  },
  "quizResults.total": {
    ar: "المجموع",
    en: "Total",
    es: "Total",
  },
  "quizResults.wrong": {
    ar: "خطأ",
    en: "Wrong",
    es: "Incorrecto",
  },
  "quizResults.quizInfo": {
    ar: "معلومات الاختبار",
    en: "Quiz Information",
    es: "Información del Cuestionario",
  },
  "quizResults.performance": {
    ar: "تحليل الأداء",
    en: "Performance Breakdown",
    es: "Desglose del Rendimiento",
  },
  "quizResults.quiz": {
    ar: "الاختبار",
    en: "Quiz",
    es: "Cuestionario",
  },
  "quizResults.level": {
    ar: "المستوى",
    en: "Level",
    es: "Nivel",
  },
  "quizResults.language": {
    ar: "اللغة",
    en: "Language",
    es: "Idioma",
  },
  "quizResults.timeTaken": {
    ar: "الوقت المستغرق",
    en: "Time Taken",
    es: "Tiempo Empleado",
  },
  "quizResults.completed": {
    ar: "مكتمل",
    en: "Completed",
    es: "Completado",
  },
  "quizResults.passingScore": {
    ar: "درجة النجاح",
    en: "Passing Score",
    es: "Puntuación de Aprobación",
  },
  "quizResults.passed": {
    ar: "نجح",
    en: "PASSED",
    es: "APROBADO",
  },
  "quizResults.failed": {
    ar: "رسب",
    en: "FAILED",
    es: "REPROBADO",
  },
  "quizResults.accuracy": {
    ar: "الدقة",
    en: "Accuracy",
    es: "Precisión",
  },
  "quizResults.correctAnswers": {
    ar: "الإجابات الصحيحة",
    en: "Correct Answers",
    es: "Respuestas Correctas",
  },
  "quizResults.incorrectAnswers": {
    ar: "الإجابات الخاطئة",
    en: "Incorrect Answers",
    es: "Respuestas Incorrectas",
  },
  "quizResults.tryAgain": {
    ar: "حاول مرة أخرى",
    en: "Try Again",
    es: "Intentar de Nuevo",
  },
  "quizResults.successMessage": {
    ar: "عمل رائع! لقد أكملت هذا الاختبار بنجاح. استمر في العمل الممتاز!",
    en: "Great job! You've successfully completed this quiz. Keep up the excellent work!",
    es: "¡Excelente trabajo! Has completado exitosamente este cuestionario. ¡Sigue con el excelente trabajo!",
  },
  "quizResults.encouragementMessage": {
    ar: "لا تستسلم! التعلم رحلة. راجع المواد وحاول مرة أخرى عندما تكون مستعداً.",
    en: "Don't give up! Learning is a journey. Review the material and try again when you're ready.",
    es: "¡No te rindas! Aprender es un viaje. Revisa el material e inténtalo de nuevo cuando estés listo.",
  },
  "quizResults.notFound": {
    ar: "لم يتم العثور على نتائج الاختبار",
    en: "Quiz results not found",
    es: "Resultados del cuestionario no encontrados",
  },

  "common.noResults": {
    ar: "لا توجد نتائج",
    en: "No results",
    es: "Sin resultados",
  },

  // Error Messages
  "error.loading": {
    ar: "خطأ في التحميل",
    en: "Loading Error",
    es: "Error de Carga",
  },
  "error.network": {
    ar: "خطأ في الشبكة",
    en: "Network Error",
    es: "Error de Red",
  },
  "error.tryAgain": {
    ar: "يرجى المحاولة مرة أخرى",
    en: "Please try again",
    es: "Por favor, inténtalo de nuevo",
  },
  "error.somethingWrong": {
    ar: "حدث خطأ ما",
    en: "Something went wrong",
    es: "Algo salió mal",
  },

  // Loading States
  "loading.quizzes": {
    ar: "جاري تحميل الاختبارات...",
    en: "Loading quizzes...",
    es: "Cargando cuestionarios...",
  },
  "loading.questions": {
    ar: "جاري تحميل الأسئلة...",
    en: "Loading questions...",
    es: "Cargando preguntas...",
  },
  "loading.results": {
    ar: "جاري تحميل النتائج...",
    en: "Loading results...",
    es: "Cargando resultados...",
  },

  // Levels
  "level.A1": {
    ar: "مبتدئ",
    en: "Beginner",
    es: "Principiante",
  },
  "level.A2": {
    ar: "أساسي",
    en: "Elementary",
    es: "Elemental",
  },
  "level.B1": {
    ar: "متوسط",
    en: "Intermediate",
    es: "Intermedio",
  },
  "level.B2": {
    ar: "متوسط عالي",
    en: "Upper Intermediate",
    es: "Intermedio Alto",
  },
  "level.C1": {
    ar: "متقدم",
    en: "Advanced",
    es: "Avanzado",
  },
  "level.C2": {
    ar: "إتقان",
    en: "Proficiency",
    es: "Competencia",
  },

  // Question Types
  "questionType.multiple_choice": {
    ar: "اختيار متعدد",
    en: "Multiple Choice",
    es: "Opción Múltiple",
  },
  "questionType.true_false": {
    ar: "صح أم خطأ",
    en: "True or False",
    es: "Verdadero o Falso",
  },
  "questionType.fill_blank": {
    ar: "املأ الفراغ",
    en: "Fill in the Blank",
    es: "Llenar el Espacio",
  },
  "questionType.essay": {
    ar: "مقال",
    en: "Essay",
    es: "Ensayo",
  },
  "questionType.listening": {
    ar: "استماع",
    en: "Listening",
    es: "Escucha",
  },
  "questionType.reading": {
    ar: "قراءة",
    en: "Reading",
    es: "Lectura",
  },

  // True/False Options
  "option.true": {
    ar: "صحيح",
    en: "True",
    es: "Verdadero",
  },
  "option.false": {
    ar: "خطأ",
    en: "False",
    es: "Falso",
  },

  // Time Format
  "time.hours": {
    ar: "ساعة",
    en: "h",
    es: "h",
  },
  "time.minutes": {
    ar: "دقيقة",
    en: "m",
    es: "m",
  },
  "time.seconds": {
    ar: "ثانية",
    en: "s",
    es: "s",
  },

  // Language names
  "language.english": {
    ar: "الإنجليزية",
    en: "English",
    es: "Inglés",
  },
  "language.arabic": {
    ar: "العربية",
    en: "Arabic",
    es: "Árabe",
  },
  "language.spanish": {
    ar: "الإسبانية",
    en: "Spanish",
    es: "Español",
  },
  "language.french": {
    ar: "الفرنسية",
    en: "French",
    es: "Francés",
  },
  "language.german": {
    ar: "الألمانية",
    en: "German",
    es: "Alemán",
  },
  "language.italian": {
    ar: "الإيطالية",
    en: "Italian",
    es: "Italiano",
  },
  "language.portuguese": {
    ar: "البرتغالية",
    en: "Portuguese",
    es: "Portugués",
  },
  "language.chinese": {
    ar: "الصينية",
    en: "Chinese",
    es: "Chino",
  },
  "language.japanese": {
    ar: "اليابانية",
    en: "Japanese",
    es: "Japonés",
  },
  "language.korean": {
    ar: "الكورية",
    en: "Korean",
    es: "Coreano",
  },
  "language.russian": {
    ar: "الروسية",
    en: "Russian",
    es: "Ruso",
  },
  "language.turkish": {
    ar: "التركية",
    en: "Turkish",
    es: "Turco",
  },

  // Dashboard
  "dashboard.welcome": {
    ar: "مرحباً",
    en: "Welcome",
    es: "Bienvenido",
  },
  "dashboard.learningLanguage": {
    ar: "تتعلم اللغة",
    en: "Learning Language",
    es: "Aprendiendo Idioma",
  },
  "dashboard.noActiveSubscription": {
    ar: "ليس لديك اشتراك نشط. يرجى الاشتراك في خطة لبدء التعلم.",
    en: "You don't have an active subscription. Please subscribe to a plan to start learning.",
    es: "No tienes una suscripción activa. Por favor suscríbete a un plan para comenzar a aprender.",
  },
  "dashboard.viewPlans": {
    ar: "عرض الخطط",
    en: "View Plans",
    es: "Ver Planes",
  },
  "dashboard.overview": {
    ar: "نظرة عامة",
    en: "Overview",
    es: "Resumen",
  },
  "dashboard.quizzes": {
    ar: "الاختبارات",
    en: "Quizzes",
    es: "Cuestionarios",
  },
  "dashboard.progress": {
    ar: "التقدم",
    en: "Progress",
    es: "Progreso",
  },
  "dashboard.activity": {
    ar: "النشاط",
    en: "Activity",
    es: "Actividad",
  },
  "dashboard.totalQuizzes": {
    ar: "إجمالي الاختبارات",
    en: "Total Quizzes",
    es: "Total de Cuestionarios",
  },
  "dashboard.availableQuizzes": {
    ar: "الاختبارات المتاحة",
    en: "Available quizzes",
    es: "Cuestionarios disponibles",
  },
  "dashboard.completed": {
    ar: "مكتمل",
    en: "Completed",
    es: "Completado",
  },
  "dashboard.complete": {
    ar: "مكتمل",
    en: "complete",
    es: "completo",
  },
  "dashboard.averageScore": {
    ar: "المتوسط",
    en: "Average Score",
    es: "Puntuación Promedio",
  },
  "dashboard.overallPerformance": {
    ar: "الأداء العام",
    en: "Overall performance",
    es: "Rendimiento general",
  },
  "dashboard.totalAttempts": {
    ar: "إجمالي المحاولات",
    en: "Total Attempts",
    es: "Total de Intentos",
  },
  "dashboard.quizzesTaken": {
    ar: "الاختبارات المأخوذة",
    en: "Quizzes taken",
    es: "Cuestionarios realizados",
  },
  "dashboard.learningProgress": {
    ar: "تقدم التعلم",
    en: "Learning Progress",
    es: "Progreso de Aprendizaje",
  },
  "dashboard.overallProgress": {
    ar: "التقدم العام",
    en: "Overall Progress",
    es: "Progreso General",
  },
  "dashboard.remaining": {
    ar: "متبقي",
    en: "Remaining",
    es: "Restante",
  },
  "dashboard.quickActions": {
    ar: "إجراءات سريعة",
    en: "Quick Actions",
    es: "Acciones Rápidas",
  },
  "dashboard.takeQuiz": {
    ar: "خذ اختبار",
    en: "Take Quiz",
    es: "Tomar Cuestionario",
  },
  "dashboard.viewProgress": {
    ar: "عرض التقدم",
    en: "View Progress",
    es: "Ver Progreso",
  },
  "dashboard.profile": {
    ar: "الملف الشخصي",
    en: "Profile",
    es: "Perfil",
  },
  "dashboard.noQuizzes": {
    ar: "لا توجد اختبارات متاحة لهذه اللغة",
    en: "No quizzes available for this language",
    es: "No hay cuestionarios disponibles para este idioma",
  },
  "dashboard.attempts": {
    ar: "محاولات",
    en: "attempts",
    es: "intentos",
  },
  "dashboard.bestScore": {
    ar: "أفضل نتيجة",
    en: "Best score",
    es: "Mejor puntuación",
  },
  "dashboard.retake": {
    ar: "إعادة المحاولة",
    en: "Retake",
    es: "Repetir",
  },
  "dashboard.start": {
    ar: "ابدأ",
    en: "Start",
    es: "Comenzar",
  },
  "dashboard.performanceOverview": {
    ar: "نظرة عامة على الأداء",
    en: "Performance Overview",
    es: "Resumen de Rendimiento",
  },
  "dashboard.quizCompletion": {
    ar: "إكمال الاختبارات",
    en: "Quiz Completion",
    es: "Finalización de Cuestionarios",
  },
  "dashboard.levelDistribution": {
    ar: "توزيع المستويات",
    en: "Level Distribution",
    es: "Distribución de Niveles",
  },
  "dashboard.level": {
    ar: "مستوى",
    en: "Level",
    es: "Nivel",
  },
  "dashboard.recentActivity": {
    ar: "النشاط الأخير",
    en: "Recent Activity",
    es: "Actividad Reciente",
  },
  "dashboard.noActivity": {
    ar: "لا يوجد نشاط حديث",
    en: "No recent activity",
    es: "No hay actividad reciente",
  },
  "dashboard.unknownQuiz": {
    ar: "اختبار غير معروف",
    en: "Unknown Quiz",
    es: "Cuestionario Desconocido",
  },

  // Subscription
  "subscription.individual": {
    ar: "فردي",
    en: "Individual",
    es: "Individual",
  },
  "subscription.group": {
    ar: "جماعي",
    en: "Group",
    es: "Grupo",
  },
  "subscription.plan": {
    ar: "خطة",
    en: "Plan",
    es: "Plan",
  },
  "subscription.sessionsRemaining": {
    ar: "جلسات متبقية",
    en: "sessions remaining",
    es: "sesiones restantes",
  },
  "subscription.perMonth": {
    ar: "في الشهر",
    en: "per month",
    es: "por mes",
  },
  "subscription.validUntil": {
    ar: "صالح حتى",
    en: "Valid until",
    es: "Válido hasta",
  },
  "subscription.status.pending": {
    ar: "في الانتظار",
    en: "Pending",
    es: "Pendiente",
  },
  "subscription.status.active": {
    ar: "نشط",
    en: "Active",
    es: "Activo",
  },
  "subscription.status.cancelled": {
    ar: "ملغي",
    en: "Cancelled",
    es: "Cancelado",
  },
  "subscription.status.expired": {
    ar: "منتهي الصلاحية",
    en: "Expired",
    es: "Expirado",
  },

  // Profile
  "profile.title": {
    ar: "الملف الشخصي",
    en: "Profile",
    es: "Perfil",
  },
  "profile.personalInfo": {
    ar: "المعلومات الشخصية",
    en: "Personal Information",
    es: "Información Personal",
  },
  "profile.activity": {
    ar: "النشاط",
    en: "Activity",
    es: "Actividad",
  },
  "profile.settings": {
    ar: "الإعدادات",
    en: "Settings",
    es: "Configuración",
  },
  "profile.student": {
    ar: "طالب",
    en: "Student",
    es: "Estudiante",
  },
  "profile.quizzesCompleted": {
    ar: "الاختبارات المكتملة",
    en: "Quizzes Completed",
    es: "Cuestionarios Completados",
  },
  "profile.coursesEnrolled": {
    ar: "الدورات المسجلة",
    en: "Courses Enrolled",
    es: "Cursos Inscritos",
  },
  "profile.studyTime": {
    ar: "وقت الدراسة",
    en: "Study Time",
    es: "Tiempo de Estudio",
  },
  "profile.dateOfBirth": {
    ar: "تاريخ الميلاد",
    en: "Date of Birth",
    es: "Fecha de Nacimiento",
  },
  "profile.location": {
    ar: "الموقع",
    en: "Location",
    es: "Ubicación",
  },
  "profile.recentActivity": {
    ar: "النشاط الأخير",
    en: "Recent Activity",
    es: "Actividad Reciente",
  },
  "profile.notifications": {
    ar: "الإشعارات",
    en: "Notifications",
    es: "Notificaciones",
  },
  "profile.notificationsDesc": {
    ar: "إدارة تفضيلات الإشعارات",
    en: "Manage notification preferences",
    es: "Gestionar preferencias de notificaciones",
  },
  "profile.privacy": {
    ar: "الخصوصية",
    en: "Privacy",
    es: "Privacidad",
  },
  "profile.privacyDesc": {
    ar: "إدارة إعدادات الخصوصية",
    en: "Manage privacy settings",
    es: "Gestionar configuración de privacidad",
  },
  "profile.deleteAccount": {
    ar: "حذف الحساب",
    en: "Delete Account",
    es: "Eliminar Cuenta",
  },
  "profile.deleteAccountDesc": {
    ar: "حذف حسابك نهائياً",
    en: "Permanently delete your account",
    es: "Eliminar permanentemente tu cuenta",
  },

  // Settings
  "settings.title": {
    ar: "الإعدادات",
    en: "Settings",
    es: "Configuración",
  },
  "settings.general": {
    ar: "عام",
    en: "General",
    es: "General",
  },
  "settings.notifications": {
    ar: "الإشعارات",
    en: "Notifications",
    es: "Notificaciones",
  },
  "settings.privacy": {
    ar: "الخصوصية",
    en: "Privacy",
    es: "Privacidad",
  },
  "settings.account": {
    ar: "الحساب",
    en: "Account",
    es: "Cuenta",
  },
  "settings.language": {
    ar: "اللغة",
    en: "Language",
    es: "Idioma",
  },
  "settings.interfaceLanguage": {
    ar: "لغة الواجهة",
    en: "Interface Language",
    es: "Idioma de la Interfaz",
  },
  "settings.interfaceLanguageDesc": {
    ar: "اختر لغة واجهة التطبيق",
    en: "Choose the app interface language",
    es: "Elige el idioma de la interfaz de la aplicación",
  },
  "settings.appearance": {
    ar: "المظهر",
    en: "Appearance",
    es: "Apariencia",
  },
  "settings.theme": {
    ar: "السمة",
    en: "Theme",
    es: "Tema",
  },
  "settings.themeDesc": {
    ar: "اختر سمة التطبيق",
    en: "Choose app theme",
    es: "Elige el tema de la aplicación",
  },
  "settings.light": {
    ar: "فاتح",
    en: "Light",
    es: "Claro",
  },
  "settings.dark": {
    ar: "داكن",
    en: "Dark",
    es: "Oscuro",
  },
  "settings.system": {
    ar: "النظام",
    en: "System",
    es: "Sistema",
  },
  "settings.audio": {
    ar: "الصوت",
    en: "Audio",
    es: "Audio",
  },
  "settings.autoPlay": {
    ar: "التشغيل التلقائي",
    en: "Auto Play",
    es: "Reproducción Automática",
  },
  "settings.autoPlayDesc": {
    ar: "تشغيل الصوت تلقائياً في الاختبارات",
    en: "Automatically play audio in quizzes",
    es: "Reproducir automáticamente el audio en los cuestionarios",
  },
  "settings.soundEffects": {
    ar: "المؤثرات الصوتية",
    en: "Sound Effects",
    es: "Efectos de Sonido",
  },
  "settings.soundEffectsDesc": {
    ar: "تشغيل المؤثرات الصوتية",
    en: "Play sound effects",
    es: "Reproducir efectos de sonido",
  },
  "settings.notificationPreferences": {
    ar: "تفضيلات الإشعارات",
    en: "Notification Preferences",
    es: "Preferencias de Notificaciones",
  },
  "settings.emailNotifications": {
    ar: "إشعارات البريد الإلكتروني",
    en: "Email Notifications",
    es: "Notificaciones por Correo",
  },
  "settings.emailNotificationsDesc": {
    ar: "تلقي إشعارات عبر البريد الإلكتروني",
    en: "Receive notifications via email",
    es: "Recibir notificaciones por correo electrónico",
  },
  "settings.pushNotifications": {
    ar: "الإشعارات المنبثقة",
    en: "Push Notifications",
    es: "Notificaciones Push",
  },
  "settings.pushNotificationsDesc": {
    ar: "تلقي إشعارات منبثقة",
    en: "Receive push notifications",
    es: "Recibir notificaciones push",
  },
  "settings.quizReminders": {
    ar: "تذكيرات الاختبارات",
    en: "Quiz Reminders",
    es: "Recordatorios de Cuestionarios",
  },
  "settings.quizRemindersDesc": {
    ar: "تذكيرات لإكمال الاختبارات",
    en: "Reminders to complete quizzes",
    es: "Recordatorios para completar cuestionarios",
  },
  "settings.courseUpdates": {
    ar: "تحديثات الدورات",
    en: "Course Updates",
    es: "Actualizaciones de Cursos",
  },
  "settings.courseUpdatesDesc": {
    ar: "إشعارات حول تحديثات الدورات",
    en: "Notifications about course updates",
    es: "Notificaciones sobre actualizaciones de cursos",
  },
  "settings.marketingEmails": {
    ar: "رسائل تسويقية",
    en: "Marketing Emails",
    es: "Correos de Marketing",
  },
  "settings.marketingEmailsDesc": {
    ar: "تلقي رسائل تسويقية وعروض",
    en: "Receive marketing emails and offers",
    es: "Recibir correos de marketing y ofertas",
  },
  "settings.privacyControls": {
    ar: "ضوابط الخصوصية",
    en: "Privacy Controls",
    es: "Controles de Privacidad",
  },
  "settings.profileVisibility": {
    ar: "رؤية الملف الشخصي",
    en: "Profile Visibility",
    es: "Visibilidad del Perfil",
  },
  "settings.profileVisibilityDesc": {
    ar: "السماح للآخرين برؤية ملفك الشخصي",
    en: "Allow others to see your profile",
    es: "Permitir que otros vean tu perfil",
  },
  "settings.showProgress": {
    ar: "إظهار التقدم",
    en: "Show Progress",
    es: "Mostrar Progreso",
  },
  "settings.showProgressDesc": {
    ar: "إظهار تقدمك للآخرين",
    en: "Show your progress to others",
    es: "Mostrar tu progreso a otros",
  },
  "settings.allowMessages": {
    ar: "السماح بالرسائل",
    en: "Allow Messages",
    es: "Permitir Mensajes",
  },
  "settings.allowMessagesDesc": {
    ar: "السماح للآخرين بإرسال رسائل لك",
    en: "Allow others to send you messages",
    es: "Permitir que otros te envíen mensajes",
  },
  "settings.dataManagement": {
    ar: "إدارة البيانات",
    en: "Data Management",
    es: "Gestión de Datos",
  },
  "settings.exportData": {
    ar: "تصدير البيانات",
    en: "Export Data",
    es: "Exportar Datos",
  },
  "settings.exportDataDesc": {
    ar: "تحميل نسخة من بياناتك",
    en: "Download a copy of your data",
    es: "Descargar una copia de tus datos",
  },
  "settings.export": {
    ar: "تصدير",
    en: "Export",
    es: "Exportar",
  },
  "settings.dangerZone": {
    ar: "منطقة الخطر",
    en: "Danger Zone",
    es: "Zona de Peligro",
  },
  "settings.deleteAccount": {
    ar: "حذف الحساب",
    en: "Delete Account",
    es: "Eliminar Cuenta",
  },
  "settings.deleteAccountDesc": {
    ar: "حذف حسابك وجميع بياناتك نهائياً",
    en: "Permanently delete your account and all data",
    es: "Eliminar permanentemente tu cuenta y todos los datos",
  },
  "settings.delete": {
    ar: "حذف",
    en: "Delete",
    es: "Eliminar",
  },

  // Teacher Dashboard
  "teacher.dashboard": {
    ar: "لوحة تحكم المدرس",
    en: "Teacher Dashboard",
    es: "Panel del Profesor",
  },
  "teacher.welcomeBack": {
    ar: "مرحباً بعودتك، {name}",
    en: "Welcome back, {name}",
    es: "Bienvenido de vuelta, {name}",
  },
  "teacher.totalStudents": {
    ar: "إجمالي الطلاب",
    en: "Total Students",
    es: "Total de Estudiantes",
  },
  "teacher.activeSubscriptions": {
    ar: "الاشتراكات النشطة",
    en: "Active Subscriptions",
    es: "Suscripciones Activas",
  },
  "teacher.totalQuizzes": {
    ar: "إجمالي الاختبارات",
    en: "Total Quizzes",
    es: "Total de Cuestionarios",
  },
  "teacher.monthlyRevenue": {
    ar: "الإيرادات الشهرية",
    en: "Monthly Revenue",
    es: "Ingresos Mensuales",
  },
  "teacher.createQuiz": {
    ar: "إنشاء اختبار",
    en: "Create Quiz",
    es: "Crear Cuestionario",
  },
  "teacher.manageSchedule": {
    ar: "إدارة الجدول",
    en: "Manage Schedule",
    es: "Gestionar Horario",
  },
  "teacher.pendingSubscriptionsAlert": {
    ar: "لديك {count} اشتراكات في انتظار المراجعة",
    en: "You have {count} pending subscriptions to review",
    es: "Tienes {count} suscripciones pendientes de revisar",
  },
  "teacher.reviewNow": {
    ar: "مراجعة الآن",
    en: "Review now",
    es: "Revisar ahora",
  },
  "teacher.overview": {
    ar: "نظرة عامة",
    en: "Overview",
    es: "Resumen",
  },
  "teacher.students": {
    ar: "الطلاب",
    en: "Students",
    es: "Estudiantes",
  },
  "teacher.quizzes": {
    ar: "الاختبارات",
    en: "Quizzes",
    es: "Cuestionarios",
  },
  "teacher.analytics": {
    ar: "التحليلات",
    en: "Analytics",
    es: "Análisis",
  },
  "teacher.upcomingSessions": {
    ar: "الجلسات القادمة",
    en: "Upcoming Sessions",
    es: "Sesiones Próximas",
  },
  "teacher.noUpcomingSessions": {
    ar: "لا توجد جلسات قادمة",
    en: "No upcoming sessions",
    es: "No hay sesiones próximas",
  },
  "teacher.startSession": {
    ar: "بدء الجلسة",
    en: "Start Session",
    es: "Iniciar Sesión",
  },
  "teacher.group": {
    ar: "جماعي",
    en: "Group",
    es: "Grupo",
  },
  "teacher.individual": {
    ar: "فردي",
    en: "Individual",
    es: "Individual",
  },
  "teacher.recentActivity": {
    ar: "النشاط الأخير",
    en: "Recent Activity",
    es: "Actividad Reciente",
  },
  "teacher.myStudents": {
    ar: "طلابي",
    en: "My Students",
    es: "Mis Estudiantes",
  },
  "teacher.inviteStudent": {
    ar: "دعوة طالب",
    en: "Invite Student",
    es: "Invitar Estudiante",
  },
  "teacher.noStudents": {
    ar: "لا يوجد طلاب بعد",
    en: "No students yet",
    es: "Aún no hay estudiantes",
  },
  "teacher.noStudentsDescription": {
    ar: "ابدأ بدعوة طلابك للانضمام إلى دوراتك",
    en: "Start by inviting students to join your courses",
    es: "Comienza invitando estudiantes a unirse a tus cursos",
  },
  "teacher.inviteFirstStudent": {
    ar: "دعوة أول طالب",
    en: "Invite First Student",
    es: "Invitar Primer Estudiante",
  },
  "teacher.sessionsCompleted": {
    ar: "الجلسات المكتملة",
    en: "Sessions Completed",
    es: "Sesiones Completadas",
  },
  "teacher.sessionsRemaining": {
    ar: "الجلسات المتبقية",
    en: "Sessions Remaining",
    es: "Sesiones Restantes",
  },
  "teacher.message": {
    ar: "رسالة",
    en: "Message",
    es: "Mensaje",
  },
  "teacher.schedule": {
    ar: "جدولة",
    en: "Schedule",
    es: "Programar",
  },
  "teacher.myQuizzes": {
    ar: "اختباراتي",
    en: "My Quizzes",
    es: "Mis Cuestionarios",
  },
  "teacher.noQuizzes": {
    ar: "لا توجد اختبارات بعد",
    en: "No quizzes yet",
    es: "Aún no hay cuestionarios",
  },
  "teacher.noQuizzesDescription": {
    ar: "ابدأ بإنشاء اختبارات لطلابك",
    en: "Start by creating quizzes for your students",
    es: "Comienza creando cuestionarios para tus estudiantes",
  },
  "teacher.createFirstQuiz": {
    ar: "إنشاء أول اختبار",
    en: "Create First Quiz",
    es: "Crear Primer Cuestionario",
  },
  "teacher.performanceAnalytics": {
    ar: "تحليلات الأداء",
    en: "Performance Analytics",
    es: "Análisis de Rendimiento",
  },
  "teacher.analyticsComingSoon": {
    ar: "التحليلات قادمة قريباً",
    en: "Analytics coming soon",
    es: "Análisis próximamente",
  },
  "teacher.rating": {
    ar: "التقييم",
    en: "Rating",
    es: "Calificación",
  },
  "teacher.basedOnReviews": {
    ar: "بناءً على {count} مراجعة",
    en: "Based on {count} reviews",
    es: "Basado en {count} reseñas",
  },
  "teacher.quickActions": {
    ar: "إجراءات سريعة",
    en: "Quick Actions",
    es: "Acciones Rápidas",
  },
  "teacher.scheduleSession": {
    ar: "جدولة جلسة",
    en: "Schedule Session",
    es: "Programar Sesión",
  },
  "teacher.messageStudents": {
    ar: "مراسلة الطلاب",
    en: "Message Students",
    es: "Enviar Mensaje a Estudiantes",
  },
  "teacher.viewReports": {
    ar: "عرض التقارير",
    en: "View Reports",
    es: "Ver Informes",
  },
  "teacher.thisMonth": {
    ar: "هذا الشهر",
    en: "This Month",
    es: "Este Mes",
  },
  "teacher.newStudents": {
    ar: "طلاب جدد",
    en: "New Students",
    es: "Estudiantes Nuevos",
  },
  "teacher.quizzesCreated": {
    ar: "اختبارات منشأة",
    en: "Quizzes Created",
    es: "Cuestionarios Creados",
  },
  "teacher.revenue": {
    ar: "الإيرادات",
    en: "Revenue",
    es: "Ingresos",
  },

  // Loading states
  "loading.dashboard": {
    ar: "جاري تحميل لوحة التحكم...",
    en: "Loading dashboard...",
    es: "Cargando panel...",
  },

  // Session Management
  "session.management": {
    ar: "إدارة الجلسات",
    en: "Session Management",
    es: "Gestión de Sesiones",
  },
  "session.managementDescription": {
    ar: "جدولة وإدارة جلسات التدريس مع طلابك",
    en: "Schedule and manage teaching sessions with your students",
    es: "Programar y gestionar sesiones de enseñanza con tus estudiantes",
  },
  "session.scheduleNew": {
    ar: "جدولة جلسة جديدة",
    en: "Schedule New Session",
    es: "Programar Nueva Sesión",
  },
  "session.schedule": {
    ar: "جدولة",
    en: "Schedule",
    es: "Programar",
  },
  "session.title": {
    ar: "عنوان الجلسة",
    en: "Session Title",
    es: "Título de la Sesión",
  },
  "session.titlePlaceholder": {
    ar: "أدخل عنوان الجلسة",
    en: "Enter session title",
    es: "Ingresa el título de la sesión",
  },
  "session.description": {
    ar: "وصف الجلسة",
    en: "Session Description",
    es: "Descripción de la Sesión",
  },
  "session.descriptionPlaceholder": {
    ar: "أدخل وصف الجلسة (اختياري)",
    en: "Enter session description (optional)",
    es: "Ingresa la descripción de la sesión (opcional)",
  },
  "session.dateTime": {
    ar: "التاريخ والوقت",
    en: "Date & Time",
    es: "Fecha y Hora",
  },
  "session.duration": {
    ar: "المدة",
    en: "Duration",
    es: "Duración",
  },
  "session.type": {
    ar: "نوع الجلسة",
    en: "Session Type",
    es: "Tipo de Sesión",
  },
  "session.students": {
    ar: "الطلاب",
    en: "Students",
    es: "Estudiantes",
  },
  "session.meetingLink": {
    ar: "رابط الاجتماع",
    en: "Meeting Link",
    es: "Enlace de Reunión",
  },
  "session.status.scheduled": {
    ar: "مجدولة",
    en: "Scheduled",
    es: "Programada",
  },
  "session.status.completed": {
    ar: "مكتملة",
    en: "Completed",
    es: "Completada",
  },
  "session.status.cancelled": {
    ar: "ملغية",
    en: "Cancelled",
    es: "Cancelada",
  },
  "session.joinMeeting": {
    ar: "انضم للاجتماع",
    en: "Join Meeting",
    es: "Unirse a la Reunión",
  },
  "session.markComplete": {
    ar: "تحديد كمكتملة",
    en: "Mark Complete",
    es: "Marcar como Completada",
  },
  "session.cancel": {
    ar: "إلغاء",
    en: "Cancel",
    es: "Cancelar",
  },
  "session.addNotes": {
    ar: "إضافة ملاحظات",
    en: "Add Notes",
    es: "Agregar Notas",
  },
  "session.calendar": {
    ar: "التقويم",
    en: "Calendar",
    es: "Calendario",
  },
  "session.allSessions": {
    ar: "جميع الجلسات",
    en: "All Sessions",
    es: "Todas las Sesiones",
  },
  "session.scheduled": {
    ar: "مجدولة",
    en: "Scheduled",
    es: "Programadas",
  },
  "session.completed": {
    ar: "مكتملة",
    en: "Completed",
    es: "Completadas",
  },
  "session.noSessions": {
    ar: "لا توجد جلسات",
    en: "No sessions",
    es: "No hay sesiones",
  },
  "session.noSessionsDescription": {
    ar: "ابدأ بجدولة جلسات مع طلابك",
    en: "Start by scheduling sessions with your students",
    es: "Comienza programando sesiones con tus estudiantes",
  },
  "session.scheduleFirst": {
    ar: "جدولة أول جلسة",
    en: "Schedule First Session",
    es: "Programar Primera Sesión",
  },
  "session.editSession": {
    ar: "تعديل الجلسة",
    en: "Edit Session",
    es: "Editar Sesión",
  },
  "session.noStudentsAlert": {
    ar: "لا يوجد طلاب نشطون. تحتاج إلى طلاب مشتركين لجدولة الجلسات.",
    en: "No active students. You need subscribed students to schedule sessions.",
    es: "No hay estudiantes activos. Necesitas estudiantes suscritos para programar sesiones.",
  },

  "button.configure": {
    ar: "تكوين",
    en: "Configure",
    es: "Configurar",
  },
  "button.manage": {
    ar: "إدارة",
    en: "Manage",
    es: "Gestionar",
  },
  "common.loading": {
    ar: "جاري التحميل...",
    en: "Loading...",
    es: "Cargando...",
  },
  "common.error": {
    ar: "خطأ",
    en: "Error",
    es: "Error",
  },
  "common.success": {
    ar: "نجح",
    en: "Success",
    es: "Éxito",
  },
  "common.warning": {
    ar: "تحذير",
    en: "Warning",
    es: "Advertencia",
  },
  "common.info": {
    ar: "معلومات",
    en: "Information",
    es: "Información",
  },
  "common.confirm": {
    ar: "تأكيد",
    en: "Confirm",
    es: "Confirmar",
  },
  "common.yes": {
    ar: "نعم",
    en: "Yes",
    es: "Sí",
  },
  "common.no": {
    ar: "لا",
    en: "No",
    es: "No",
  },
  "common.ok": {
    ar: "موافق",
    en: "OK",
    es: "OK",
  },
  "common.close": {
    ar: "إغلاق",
    en: "Close",
    es: "Cerrar",
  },
  "common.open": {
    ar: "فتح",
    en: "Open",
    es: "Abrir",
  },
  "common.search": {
    ar: "بحث",
    en: "Search",
    es: "Buscar",
  },
  "common.filter": {
    ar: "تصفية",
    en: "Filter",
    es: "Filtrar",
  },
  "common.sort": {
    ar: "ترتيب",
    en: "Sort",
    es: "Ordenar",
  },
  "common.view": {
    ar: "عرض",
    en: "View",
    es: "Ver",
  },
  "common.download": {
    ar: "تحميل",
    en: "Download",
    es: "Descargar",
  },
  "common.upload": {
    ar: "رفع",
    en: "Upload",
    es: "Subir",
  },
  "common.share": {
    ar: "مشاركة",
    en: "Share",
    es: "Compartir",
  },
  "common.copy": {
    ar: "نسخ",
    en: "Copy",
    es: "Copiar",
  },
  "common.paste": {
    ar: "لصق",
    en: "Paste",
    es: "Pegar",
  },
  "common.cut": {
    ar: "قص",
    en: "Cut",
    es: "Cortar",
  },
  "common.undo": {
    ar: "تراجع",
    en: "Undo",
    es: "Deshacer",
  },
  "common.redo": {
    ar: "إعادة",
    en: "Redo",
    es: "Rehacer",
  },
  "common.refresh": {
    ar: "تحديث",
    en: "Refresh",
    es: "Actualizar",
  },
  "common.reset": {
    ar: "إعادة تعيين",
    en: "Reset",
    es: "Restablecer",
  },
  "common.clear": {
    ar: "مسح",
    en: "Clear",
    es: "Limpiar",
  },
  "common.select": {
    ar: "اختيار",
    en: "Select",
    es: "Seleccionar",
  },
  "common.deselect": {
    ar: "إلغاء الاختيار",
    en: "Deselect",
    es: "Deseleccionar",
  },
  "common.all": {
    ar: "الكل",
    en: "All",
    es: "Todo",
  },
  "common.none": {
    ar: "لا شيء",
    en: "None",
    es: "Ninguno",
  },
  "common.more": {
    ar: "المزيد",
    en: "More",
    es: "Más",
  },
  "common.less": {
    ar: "أقل",
    en: "Less",
    es: "Menos",
  },
  "common.show": {
    ar: "إظهار",
    en: "Show",
    es: "Mostrar",
  },
  "common.hide": {
    ar: "إخفاء",
    en: "Hide",
    es: "Ocultar",
  },
  "common.expand": {
    ar: "توسيع",
    en: "Expand",
    es: "Expandir",
  },
  "common.collapse": {
    ar: "طي",
    en: "Collapse",
    es: "Contraer",
  },
  "common.maximize": {
    ar: "تكبير",
    en: "Maximize",
    es: "Maximizar",
  },
  "common.minimize": {
    ar: "تصغير",
    en: "Minimize",
    es: "Minimizar",
  },

  // Registration
  "register.title": {
    ar: "إنشاء حساب",
    en: "Create Account",
    es: "Crear Cuenta",
  },
  "register.tabs.registration": {
    ar: "التسجيل",
    en: "Registration",
    es: "Registro",
  },
  "register.tabs.payment": {
    ar: "الدفع",
    en: "Payment",
    es: "Pago",
  },
  "register.form.name": {
    ar: "الاسم الكامل",
    en: "Full Name",
    es: "Nombre Completo",
  },
  "register.form.namePlaceholder": {
    ar: "أدخل اسمك الكامل",
    en: "Enter your full name",
    es: "Ingresa tu nombre completo",
  },
  "register.form.email": {
    ar: "البريد الإلكتروني",
    en: "Email Address",
    es: "Correo Electrónico",
  },
  "register.form.emailPlaceholder": {
    ar: "أدخل بريدك الإلكتروني",
    en: "Enter your email address",
    es: "Ingresa tu correo electrónico",
  },
  "register.form.phone": {
    ar: "رقم الهاتف",
    en: "Phone Number",
    es: "Número de Teléfono",
  },
  "register.form.phonePlaceholder": {
    ar: "أدخل رقم هاتفك",
    en: "Enter your phone number",
    es: "Ingresa tu número de teléfono",
  },
  "register.form.password": {
    ar: "كلمة المرور",
    en: "Password",
    es: "Contraseña",
  },
  "register.form.passwordPlaceholder": {
    ar: "أدخل كلمة المرور",
    en: "Enter your password",
    es: "Ingresa tu contraseña",
  },
  "register.form.confirmPassword": {
    ar: "تأكيد كلمة المرور",
    en: "Confirm Password",
    es: "Confirmar Contraseña",
  },
  "register.form.confirmPasswordPlaceholder": {
    ar: "أعد إدخال كلمة المرور",
    en: "Re-enter your password",
    es: "Vuelve a ingresar tu contraseña",
  },
  "register.form.language": {
    ar: "اللغة المفضلة",
    en: "Preferred Language",
    es: "Idioma Preferido",
  },
  "register.form.languagePlaceholder": {
    ar: "اختر لغتك المفضلة",
    en: "Choose your preferred language",
    es: "Elige tu idioma preferido",
  },
  "register.form.level": {
    ar: "المستوى",
    en: "Level",
    es: "Nivel",
  },
  "register.form.levelPlaceholder": {
    ar: "اختر مستواك",
    en: "Choose your level",
    es: "Elige tu nivel",
  },
  "register.form.subscriptionPlan": {
    ar: "خطة الاشتراك",
    en: "Subscription Plan",
    es: "Plan de Suscripción",
  },
  "register.form.noPlans": {
    ar: "لا توجد خطط متاحة لهذه اللغة",
    en: "No plans available for this language",
    es: "No hay planes disponibles para este idioma",
  },
  "register.form.sessionsPerMonth": {
    ar: "جلسات في الشهر",
    en: "sessions per month",
    es: "sesiones por mes",
  },
  "register.form.acceptTerms": {
    ar: "أوافق على الشروط والأحكام",
    en: "I agree to the Terms and Conditions",
    es: "Acepto los Términos y Condiciones",
  },
  "register.form.register": {
    ar: "تسجيل",
    en: "Register",
    es: "Registrarse",
  },
  "register.form.registering": {
    ar: "جاري التسجيل...",
    en: "Registering...",
    es: "Registrando...",
  },
  "register.form.haveAccount": {
    ar: "لديك حساب بالفعل؟",
    en: "Already have an account?",
    es: "¿Ya tienes una cuenta?",
  },
  "register.form.signIn": {
    ar: "تسجيل الدخول",
    en: "Sign in",
    es: "Iniciar Sesión",
  },
  "register.success.title": {
    ar: "تم التسجيل بنجاح!",
    en: "Registration Successful!",
    es: "¡Registro Exitoso!",
  },
  "register.success.message": {
    ar: "سيتم تفعيل حسابك بعد تأكيد الدفع. يرجى تحويل الرسوم والتأكيد عبر واتساب.",
    en: "Your account will be activated after payment confirmation. Please transfer the fee and confirm via WhatsApp.",
    es: "Tu cuenta será activada después de la confirmación del pago. Por favor transfiere la tarifa y confirma vía WhatsApp.",
  },
  "register.errors.validation": {
    ar: "يرجى تصحيح الأخطاء في النموذج",
    en: "Please correct the errors in the form",
    es: "Por favor corrige los errores en el formulario",
  },
  "register.errors.general": {
    ar: "فشل في التسجيل. يرجى المحاولة مرة أخرى.",
    en: "Registration failed. Please try again.",
    es: "El registro falló. Por favor intenta de nuevo.",
  },
  "register.errors.loadPlans": {
    ar: "فشل في تحميل خطط الاشتراك",
    en: "Failed to load subscription plans",
    es: "Error al cargar los planes de suscripción",
  },

  // Payment
  "register.payment.title": {
    ar: "تفاصيل التحويل البنكي",
    en: "Bank Transfer Details",
    es: "Detalles de Transferencia Bancaria",
  },
  "register.payment.attijariwafa": {
    ar: "بنك التجاري وفا بنك",
    en: "Attijariwafa Bank",
    es: "Banco Attijariwafa",
  },
  "register.payment.baridBank": {
    ar: "بريد بنك",
    en: "Barid Bank",
    es: "Banco Barid",
  },
  "register.payment.cihBank": {
    ar: "بنك CIH",
    en: "CIH Bank",
    es: "Banco CIH",
  },
  "register.payment.accountNumber": {
    ar: "رقم الحساب",
    en: "Account Number",
    es: "Número de Cuenta",
  },
  "register.payment.accountHolder": {
    ar: "صاحب الحساب",
    en: "Account Holder",
    es: "Titular de la Cuenta",
  },
  "register.payment.swiftCode": {
    ar: "رمز SWIFT",
    en: "SWIFT Code",
    es: "Código SWIFT",
  },
  "register.payment.whatsappConfirmation": {
    ar: "تأكيد واتساب",
    en: "WhatsApp Confirmation",
    es: "Confirmación WhatsApp",
  },
  "register.payment.copied": {
    ar: "تم النسخ!",
    en: "Copied!",
    es: "¡Copiado!",
  },
  "register.payment.copiedToClipboard": {
    ar: "تم نسخه إلى الحافظة",
    en: "copied to clipboard",
    es: "copiado al portapapeles",
  },
  "register.payment.selectedPlan": {
    ar: "الخطة المختارة",
    en: "Selected Plan",
    es: "Plan Seleccionado",
  },
  "register.payment.instructions": {
    ar: "تعليمات الدفع",
    en: "Payment Instructions",
    es: "Instrucciones de Pago",
  },
  "register.payment.step1": {
    ar: "قم بتحويل المبلغ إلى أحد الحسابات المصرفية أعلاه",
    en: "Transfer the amount to one of the bank accounts above",
    es: "Transfiere el monto a una de las cuentas bancarias de arriba",
  },
  "register.payment.step2": {
    ar: "احتفظ بإيصال التحويل",
    en: "Keep the transfer receipt",
    es: "Guarda el recibo de transferencia",
  },
  "register.payment.step3": {
    ar: "تواصل معنا عبر واتساب لتأكيد الدفع",
    en: "Contact us via WhatsApp to confirm payment",
    es: "Contáctanos vía WhatsApp para confirmar el pago",
  },

  // Login
  "login.title": {
    ar: "تسجيل الدخول",
    en: "Sign In",
    es: "Iniciar Sesión",
  },
  "login.subtitle": {
    ar: "مرحباً بعودتك! يرجى تسجيل الدخول إلى حسابك",
    en: "Welcome back! Please sign in to your account",
    es: "¡Bienvenido de vuelta! Por favor inicia sesión en tu cuenta",
  },
  "login.form.title": {
    ar: "تسجيل الدخول",
    en: "Sign In",
    es: "Iniciar Sesión",
  },
  "login.form.email": {
    ar: "البريد الإلكتروني",
    en: "Email Address",
    es: "Correo Electrónico",
  },
  "login.form.emailPlaceholder": {
    ar: "أدخل بريدك الإلكتروني",
    en: "Enter your email address",
    es: "Ingresa tu correo electrónico",
  },
  "login.form.password": {
    ar: "كلمة المرور",
    en: "Password",
    es: "Contraseña",
  },
  "login.form.passwordPlaceholder": {
    ar: "أدخل كلمة المرور",
    en: "Enter your password",
    es: "Ingresa tu contraseña",
  },
  "login.form.rememberMe": {
    ar: "تذكرني",
    en: "Remember me",
    es: "Recordarme",
  },
  "login.form.forgotPassword": {
    ar: "نسيت كلمة المرور؟",
    en: "Forgot password?",
    es: "¿Olvidaste tu contraseña?",
  },
  "login.form.signIn": {
    ar: "تسجيل الدخول",
    en: "Sign In",
    es: "Iniciar Sesión",
  },
  "login.form.signingIn": {
    ar: "جاري تسجيل الدخول...",
    en: "Signing in...",
    es: "Iniciando sesión...",
  },
  "login.form.noAccount": {
    ar: "ليس لديك حساب؟",
    en: "Don't have an account?",
    es: "¿No tienes una cuenta?",
  },
  "login.form.createAccount": {
    ar: "إنشاء حساب",
    en: "Create account",
    es: "Crear cuenta",
  },
  "login.success.title": {
    ar: "تم تسجيل الدخول بنجاح!",
    en: "Login Successful!",
    es: "¡Inicio de Sesión Exitoso!",
  },
  "login.success.message": {
    ar: "مرحباً بك مرة أخرى",
    en: "Welcome back",
    es: "Bienvenido de vuelta",
  },
  "login.errors.invalidCredentials": {
    ar: "بريد إلكتروني أو كلمة مرور غير صحيحة",
    en: "Invalid email or password",
    es: "Correo electrónico o contraseña inválidos",
  },
  "login.errors.general": {
    ar: "فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.",
    en: "Login failed. Please try again.",
    es: "Error al iniciar sesión. Por favor intenta de nuevo.",
  },

  "admin.dashboard.overview": {
    ar: "نظرة عامة",
    en: "Overview",
    es: "Resumen",
  },
  "admin.dashboard.users": {
    ar: "المستخدمين",
    en: "Users",
    es: "Usuarios",
  },
  "admin.dashboard.quizzes": {
    ar: "الاختبارات",
    en: "Quizzes",
    es: "Cuestionarios",
  },
  "admin.dashboard.languages": {
    ar: "اللغات",
    en: "Languages",
    es: "Idiomas",
  },
  "admin.dashboard.subscriptions": {
    ar: "الاشتراكات",
    en: "Subscriptions",
    es: "Suscripciones",
  },
  "admin.dashboard.settings": {
    ar: "الإعدادات",
    en: "Settings",
    es: "Configuración",
  },
  "admin.dashboard.quickActions": {
    ar: "إجراءات سريعة",
    en: "Quick Actions",
    es: "Acciones Rápidas",
  },
  "admin.dashboard.recentActivity": {
    ar: "النشاط الأخير",
    en: "Recent Activity",
    es: "Actividad Reciente",
  },

  "admin.stats.activeQuizzes": {
    ar: "الاختبارات النشطة",
    en: "Active Quizzes",
    es: "Cuestionarios Activos",
  },
  "admin.stats.languages": {
    ar: "اللغات",
    en: "Languages",
    es: "Idiomas",
  },
  "admin.stats.subscriptions": {
    ar: "الاشتراكات",
    en: "Subscriptions",
    es: "Suscripciones",
  },

  // Admin Actions
  "admin.actions.manageUsers": {
    ar: "إدارة المستخدمين",
    en: "Manage Users",
    es: "Gestionar Usuarios",
  },
  "admin.actions.manageUsersDesc": {
    ar: "إضافة وتعديل وإدارة حسابات المستخدمين",
    en: "Add, edit, and manage user accounts",
    es: "Agregar, editar y gestionar cuentas de usuario",
  },
  "admin.actions.createQuiz": {
    ar: "إنشاء اختبار",
    en: "Create Quiz",
    es: "Crear Cuestionario",
  },
  "admin.actions.createQuizDesc": {
    ar: "إضافة اختبارات وأسئلة جديدة",
    en: "Add new quizzes and questions",
    es: "Agregar nuevos cuestionarios y preguntas",
  },
  "admin.actions.addLanguage": {
    ar: "إضافة لغة",
    en: "Add Language",
    es: "Agregar Idioma",
  },
  "admin.actions.addLanguageDesc": {
    ar: "إضافة لغات جديدة إلى المنصة",
    en: "Add new languages to the platform",
    es: "Agregar nuevos idiomas a la plataforma",
  },
  "admin.actions.subscriptionPlans": {
    ar: "خطط الاشتراك",
    en: "Subscription Plans",
    es: "Planes de Suscripción",
  },
  "admin.actions.subscriptionPlansDesc": {
    ar: "إدارة خطط الاشتراك والأسعار",
    en: "Manage subscription plans and pricing",
    es: "Gestionar planes de suscripción y precios",
  },

  // Admin Activity
  "admin.activity.newUser": {
    ar: "مستخدم جديد مسجل: أحمد محمد",
    en: "New user registered: John Doe",
    es: "Nuevo usuario registrado: Juan Pérez",
  },
  "admin.activity.quizUpdated": {
    ar: 'تم تحديث اختبار "أساسيات الإسبانية"',
    en: 'Quiz "Spanish Basics" was updated',
    es: 'Se actualizó el cuestionario "Básicos de Español"',
  },
  "admin.activity.newSubscription": {
    ar: "اشتراك جديد: الخطة المميزة",
    en: "New subscription: Premium Plan",
    es: "Nueva suscripción: Plan Premium",
  },
  "admin.activity.languageActivated": {
    ar: 'تم تفعيل اللغة "الفرنسية"',
    en: 'Language "French" was activated',
    es: 'Se activó el idioma "Francés"',
  },
  "admin.activity.time.minutes": {
    ar: "منذ {count} دقيقة",
    en: "{count} minutes ago",
    es: "hace {count} minutos",
  },
  "admin.activity.time.hours": {
    ar: "منذ {count} ساعة",
    en: "{count} hour ago",
    es: "hace {count} hora",
  },

  // Admin Sections
  "admin.users.comingSoon": {
    ar: "قريباً - إدارة المستخدمين",
    en: "Coming Soon - User Management",
    es: "Próximamente - Gestión de Usuarios",
  },
  "admin.quizzes.title": {
    ar: "إدارة الاختبارات",
    en: "Quiz Management",
    es: "Gestión de Cuestionarios",
  },
  "admin.quizzes.comingSoon": {
    ar: "قريباً - إدارة الاختبارات",
    en: "Coming Soon - Quiz Management",
    es: "Próximamente - Gestión de Cuestionarios",
  },
  "admin.languages.comingSoon": {
    ar: "قريباً - إدارة اللغات",
    en: "Coming Soon - Language Management",
    es: "Próximamente - Gestión de Idiomas",
  },
  "admin.subscriptions.title": {
    ar: "إدارة الاشتراكات",
    en: "Subscription Management",
    es: "Gestión de Suscripciones",
  },
  "admin.subscriptions.comingSoon": {
    ar: "قريباً - إدارة الاشتراكات",
    en: "Coming Soon - Subscription Management",
    es: "Próximamente - Gestión de Suscripciones",
  },
  "admin.settings.comingSoon": {
    ar: "قريباً - إعدادات النظام",
    en: "Coming Soon - System Settings",
    es: "Próximamente - Configuración del Sistema",
  },

  // Quiz Import/Export
  "quiz.importExport.title": {
    ar: "استيراد وتصدير الاختبارات",
    en: "Quiz Import & Export",
    es: "Importar y Exportar Cuestionarios",
  },
  "quiz.importExport.description": {
    ar: "استيراد الاختبارات من ملفات CSV أو Excel وتصدير الاختبارات الموجودة",
    en: "Import quizzes from CSV or Excel files and export existing quizzes",
    es: "Importar cuestionarios desde archivos CSV o Excel y exportar cuestionarios existentes",
  },
  "quiz.import.title": {
    ar: "استيراد الاختبارات",
    en: "Import Quizzes",
    es: "Importar Cuestionarios",
  },
  "quiz.import.description": {
    ar: "اختر ملف CSV أو Excel يحتوي على أسئلة الاختبار. يجب أن يتبع الملف التنسيق المحسن الذي يدعم جميع أنواع الأسئلة.",
    en: "Select a CSV or Excel file containing quiz questions. The file should follow the enhanced format supporting all question types.",
    es: "Selecciona un archivo CSV o Excel que contenga preguntas del cuestionario. El archivo debe seguir el formato mejorado que admite todos los tipos de preguntas.",
  },
  "quiz.import.button": {
    ar: "استيراد الملف",
    en: "Import File",
    es: "Importar Archivo",
  },
  "quiz.import.importing": {
    ar: "جاري الاستيراد...",
    en: "Importing...",
    es: "Importando...",
  },
  "quiz.import.success": {
    ar: "تم الاستيراد بنجاح!",
    en: "Import Successful!",
    es: "¡Importación Exitosa!",
  },
  "quiz.import.successMessage": {
    ar: "تم إنشاء {quizzes} اختبار و {questions} سؤال",
    en: "Created {quizzes} quizzes and {questions} questions",
    es: "Se crearon {quizzes} cuestionarios y {questions} preguntas",
  },
  "quiz.import.error": {
    ar: "خطأ في الاستيراد",
    en: "Import Error",
    es: "Error de Importación",
  },
  "quiz.import.errorMessage": {
    ar: "فشل في استيراد الاختبارات. يرجى المحاولة مرة أخرى.",
    en: "Failed to import quizzes. Please try again.",
    es: "Error al importar cuestionarios. Por favor intenta de nuevo.",
  },
  "quiz.import.noFileSelected": {
    ar: "يرجى اختيار ملف للاستيراد",
    en: "Please select a file to import",
    es: "Por favor selecciona un archivo para importar",
  },
  "quiz.import.resultTitle": {
    ar: "نتيجة الاستيراد",
    en: "Import Results",
    es: "Resultados de Importación",
  },
  "quiz.import.totalRows": {
    ar: "إجمالي الصفوف",
    en: "Total Rows",
    es: "Total de Filas",
  },
  "quiz.import.createdQuizzes": {
    ar: "الاختبارات المنشأة",
    en: "Created Quizzes",
    es: "Cuestionarios Creados",
  },
  "quiz.import.createdQuestions": {
    ar: "الأسئلة المنشأة",
    en: "Created Questions",
    es: "Preguntas Creadas",
  },
  "quiz.import.skippedRows": {
    ar: "الصفوف المتجاهلة",
    en: "Skipped Rows",
    es: "Filas Omitidas",
  },
  "quiz.import.errors": {
    ar: "الأخطاء",
    en: "Errors",
    es: "Errores",
  },
  "quiz.import.viewQuizzes": {
    ar: "عرض الاختبارات",
    en: "View Quizzes",
    es: "Ver Cuestionarios",
  },

  // Quiz Export
  "quiz.export.title": {
    ar: "تصدير الاختبارات",
    en: "Export Quizzes",
    es: "Exportar Cuestionarios",
  },
  "quiz.export.description": {
    ar: "تصدير جميع الاختبارات إلى ملف CSV للنسخ الاحتياطي أو المشاركة",
    en: "Export all quizzes to a CSV file for backup or sharing",
    es: "Exportar todos los cuestionarios a un archivo CSV para respaldo o compartir",
  },
  "quiz.export.button": {
    ar: "تصدير إلى CSV",
    en: "Export to CSV",
    es: "Exportar a CSV",
  },
  "quiz.export.exporting": {
    ar: "جاري التصدير...",
    en: "Exporting...",
    es: "Exportando...",
  },
  "quiz.export.success": {
    ar: "تم التصدير بنجاح!",
    en: "Export Successful!",
    es: "¡Exportación Exitosa!",
  },
  "quiz.export.successMessage": {
    ar: "تم تحميل ملف الاختبارات بنجاح",
    en: "Quiz file downloaded successfully",
    es: "Archivo de cuestionarios descargado exitosamente",
  },
  "quiz.export.error": {
    ar: "خطأ في التصدير",
    en: "Export Error",
    es: "Error de Exportación",
  },
  "quiz.export.errorMessage": {
    ar: "فشل في تصدير الاختبارات. يرجى المحاولة مرة أخرى.",
    en: "Failed to export quizzes. Please try again.",
    es: "Error al exportar cuestionarios. Por favor intenta de nuevo.",
  },

  // Template
  "quiz.template.download": {
    ar: "تحميل القالب",
    en: "Download Template",
    es: "Descargar Plantilla",
  },
  "quiz.template.downloaded": {
    ar: "تم تحميل القالب!",
    en: "Template Downloaded!",
    es: "¡Plantilla Descargada!",
  },
  "quiz.template.downloadedMessage": {
    ar: "تم تحميل قالب الاستيراد بنجاح",
    en: "Import template downloaded successfully",
    es: "Plantilla de importación descargada exitosamente",
  },
  "quiz.template.errorMessage": {
    ar: "فشل في تحميل القالب",
    en: "Failed to download template",
    es: "Error al descargar la plantilla",
  },

  // Question Types
  "quiz.questionTypes.title": {
    ar: "أنواع الأسئلة المدعومة",
    en: "Supported Question Types",
    es: "Tipos de Preguntas Admitidos",
  },

  // Format Guide
  "quiz.format.title": {
    ar: "دليل تنسيق CSV",
    en: "CSV Format Guide",
    es: "Guía de Formato CSV",
  },
  "quiz.format.requiredColumns": {
    ar: "الأعمدة المطلوبة (بالترتيب):",
    en: "Required columns (in order):",
    es: "Columnas requeridas (en orden):",
  },
  "quiz.format.languageCode": {
    ar: "رمز اللغة (مثل: en, es, ar)",
    en: "Language code (e.g., en, es, ar)",
    es: "Código de idioma (ej: en, es, ar)",
  },
  "quiz.format.level": {
    ar: "مستوى الصعوبة (مثل: A1, B1, C1)",
    en: "Difficulty level (e.g., A1, B1, C1)",
    es: "Nivel de dificultad (ej: A1, B1, C1)",
  },
  "quiz.format.quizTitle": {
    ar: "عنوان الاختبار",
    en: "Quiz title",
    es: "Título del cuestionario",
  },
  "quiz.format.questionType": {
    ar: "نوع السؤال (multiple_choice, true_false, إلخ)",
    en: "Type of question (multiple_choice, true_false, etc.)",
    es: "Tipo de pregunta (multiple_choice, true_false, etc.)",
  },
  "quiz.format.questionText": {
    ar: "نص السؤال",
    en: "The question text",
    es: "El texto de la pregunta",
  },
  "quiz.format.optionA": {
    ar: "الخيار الأول (للاختيار المتعدد)",
    en: "First option (for multiple choice)",
    es: "Primera opción (para opción múltiple)",
  },
  "quiz.format.optionB": {
    ar: "الخيار الثاني (للاختيار المتعدد)",
    en: "Second option (for multiple choice)",
    es: "Segunda opción (para opción múltiple)",
  },
  "quiz.format.optionC": {
    ar: "الخيار الثالث (للاختيار المتعدد)",
    en: "Third option (for multiple choice)",
    es: "Tercera opción (para opción múltiple)",
  },
  "quiz.format.optionD": {
    ar: "الخيار الرابع (للاختيار المتعدد)",
    en: "Fourth option (for multiple choice)",
    es: "Cuarta opción (para opción múltiple)",
  },
  "quiz.format.additionalOptions": {
    ar: "خيارات إضافية (حتى الخيار H)",
    en: "Additional options (up to option H)",
    es: "Opciones adicionales (hasta la opción H)",
  },
  "quiz.format.correctAnswer": {
    ar: "الإجابة الصحيحة (A, B, C, true/false, أو نص)",
    en: "Correct answer (A, B, C, true/false, or text)",
    es: "Respuesta correcta (A, B, C, true/false, o texto)",
  },
  "quiz.format.explanation": {
    ar: "شرح اختياري",
    en: "Optional explanation",
    es: "Explicación opcional",
  },
  "quiz.format.mediaUrl": {
    ar: "رابط الوسائط الاختياري (للأسئلة المبنية على الوسائط)",
    en: "Optional media URL (for media-based questions)",
    es: "URL de medios opcional (para preguntas basadas en medios)",
  },
  "quiz.format.seeTemplate": {
    ar: "راجع القالب للحصول على مثال كامل",
    en: "See template for complete example",
    es: "Ver plantilla para ejemplo completo",
  },

  // Help Dialog
  "quiz.help.title": {
    ar: "مساعدة الاستيراد",
    en: "Import Help",
    es: "Ayuda de Importación",
  },
  "quiz.help.description": {
    ar: "دليل شامل لاستيراد الاختبارات",
    en: "Comprehensive guide for importing quizzes",
    es: "Guía completa para importar cuestionarios",
  },
  "quiz.help.fileFormat": {
    ar: "تنسيق الملف:",
    en: "File Format:",
    es: "Formato de Archivo:",
  },
  "quiz.help.supportedFormats": {
    ar: "التنسيقات المدعومة: CSV, Excel (.xlsx, .xls)",
    en: "Supported formats: CSV, Excel (.xlsx, .xls)",
    es: "Formatos admitidos: CSV, Excel (.xlsx, .xls)",
  },
  "quiz.help.firstRowHeaders": {
    ar: "الصف الأول يجب أن يحتوي على العناوين",
    en: "First row should contain headers",
    es: "La primera fila debe contener encabezados",
  },
  "quiz.help.eachRowQuestion": {
    ar: "كل صف يمثل سؤال واحد",
    en: "Each row represents one question",
    es: "Cada fila representa una pregunta",
  },
  "quiz.help.tips": {
    ar: "نصائح:",
    en: "Tips:",
    es: "Consejos:",
  },
  "quiz.help.separateAnswers": {
    ar: "استخدم | لفصل الإجابات الصحيحة المتعددة",
    en: "Use | to separate multiple correct answers",
    es: "Usa | para separar múltiples respuestas correctas",
  },
  "quiz.help.mediaUrls": {
    ar: "روابط الوسائط يجب أن تكون متاحة للعامة",
    en: "Media URLs should be publicly accessible",
    es: "Las URLs de medios deben ser públicamente accesibles",
  },
  "quiz.help.emptyCells": {
    ar: "الخلايا الفارغة سيتم تجاهلها",
    en: "Empty cells will be ignored",
    es: "Las celdas vacías serán ignoradas",
  },
  "quiz.help.groupedQuestions": {
    ar: "الأسئلة مجمعة حسب اللغة والمستوى والعنوان",
    en: "Questions are grouped by language, level, and title",
    es: "Las preguntas se agrupan por idioma, nivel y título",
  },

  // Quiz Management
  "quiz.management.title": {
    ar: "إدارة الاختبارات",
    en: "Quiz Management",
    es: "Gestión de Cuestionarios",
  },
  "quiz.management.description": {
    ar: "إنشاء وتعديل وإدارة الاختبارات والأسئلة",
    en: "Create, edit, and manage quizzes and questions",
    es: "Crear, editar y gestionar cuestionarios y preguntas",
  },
  "quiz.management.createQuiz": {
    ar: "إنشاء اختبار",
    en: "Create Quiz",
    es: "Crear Cuestionario",
  },
  "quiz.management.searchPlaceholder": {
    ar: "البحث في الاختبارات...",
    en: "Search quizzes...",
    es: "Buscar cuestionarios...",
  },
  "quiz.management.allLanguages": {
    ar: "جميع اللغات",
    en: "All Languages",
    es: "Todos los Idiomas",
  },
  "quiz.management.allLevels": {
    ar: "جميع المستويات",
    en: "All Levels",
    es: "Todos los Niveles",
  },
  "quiz.management.clearFilters": {
    ar: "مسح المرشحات",
    en: "Clear Filters",
    es: "Limpiar Filtros",
  },
  "quiz.management.noQuizzes": {
    ar: "لا توجد اختبارات بعد",
    en: "No quizzes yet",
    es: "Aún no hay cuestionarios",
  },
  "quiz.management.noQuizzesFound": {
    ar: "لم يتم العثور على اختبارات",
    en: "No quizzes found",
    es: "No se encontraron cuestionarios",
  },
  "quiz.management.tryDifferentFilters": {
    ar: "جرب مرشحات مختلفة أو امسح المرشحات الحالية",
    en: "Try different filters or clear current filters",
    es: "Prueba filtros diferentes o limpia los filtros actuales",
  },
  "quiz.management.createFirstQuiz": {
    ar: "ابدأ بإنشاء أول اختبار لك",
    en: "Start by creating your first quiz",
    es: "Comienza creando tu primer cuestionario",
  },
  "quiz.management.viewQuestions": {
    ar: "عرض الأسئلة",
    en: "View Questions",
    es: "Ver Preguntas",
  },
  "quiz.management.activate": {
    ar: "تفعيل",
    en: "Activate",
    es: "Activar",
  },
  "quiz.management.deactivate": {
    ar: "إلغاء التفعيل",
    en: "Deactivate",
    es: "Desactivar",
  },
  "quiz.management.questions": {
    ar: "أسئلة",
    en: "questions",
    es: "preguntas",
  },
  "quiz.management.deleteSuccess": {
    ar: "تم حذف الاختبار!",
    en: "Quiz Deleted!",
    es: "¡Cuestionario Eliminado!",
  },
  "quiz.management.deleteSuccessMessage": {
    ar: "تم حذف الاختبار بنجاح",
    en: "Quiz has been deleted successfully",
    es: "El cuestionario ha sido eliminado exitosamente",
  },
  "quiz.management.deleteError": {
    ar: "خطأ في الحذف",
    en: "Delete Error",
    es: "Error al Eliminar",
  },
  "quiz.management.deleteErrorMessage": {
    ar: "فشل في حذف الاختبار",
    en: "Failed to delete quiz",
    es: "Error al eliminar el cuestionario",
  },
  "quiz.management.updateSuccess": {
    ar: "تم التحديث!",
    en: "Updated!",
    es: "¡Actualizado!",
  },
  "quiz.management.activatedMessage": {
    ar: "تم تفعيل الاختبار",
    en: "Quiz has been activated",
    es: "El cuestionario ha sido activado",
  },
  "quiz.management.deactivatedMessage": {
    ar: "تم إلغاء تفعيل الاختبار",
    en: "Quiz has been deactivated",
    es: "El cuestionario ha sido desactivado",
  },
  "quiz.management.updateError": {
    ar: "خطأ في التحديث",
    en: "Update Error",
    es: "Error de Actualización",
  },
  "quiz.management.updateErrorMessage": {
    ar: "فشل في تحديث الاختبار",
    en: "Failed to update quiz",
    es: "Error al actualizar el cuestionario",
  },
  "quiz.management.errorTitle": {
    ar: "خطأ في تحميل الاختبارات",
    en: "Error Loading Quizzes",
    es: "Error al Cargar Cuestionarios",
  },
  "quiz.management.deleteConfirmTitle": {
    ar: "تأكيد الحذف",
    en: "Confirm Delete",
    es: "Confirmar Eliminación",
  },
  "quiz.management.deleteConfirmMessage": {
    ar: "هل أنت متأكد من أنك تريد حذف هذا الاختبار؟ لا يمكن التراجع عن هذا الإجراء.",
    en: "Are you sure you want to delete this quiz? This action cannot be undone.",
    es: "¿Estás seguro de que quieres eliminar este cuestionario? Esta acción no se puede deshacer.",
  },

  // Quiz Form
  "quiz.form.createTitle": {
    ar: "إنشاء اختبار جديد",
    en: "Create New Quiz",
    es: "Crear Nuevo Cuestionario",
  },
  "quiz.form.editTitle": {
    ar: "تعديل الاختبار",
    en: "Edit Quiz",
    es: "Editar Cuestionario",
  },
  "quiz.form.createDescription": {
    ar: "أنشئ اختبار جديد بتفاصيله الأساسية",
    en: "Create a new quiz with its basic details",
    es: "Crea un nuevo cuestionario con sus detalles básicos",
  },
  "quiz.form.editDescription": {
    ar: "عدل تفاصيل الاختبار",
    en: "Edit quiz details",
    es: "Editar detalles del cuestionario",
  },
  "quiz.form.titleSection": {
    ar: "العناوين",
    en: "Titles",
    es: "Títulos",
  },
  "quiz.form.titleEn": {
    ar: "العنوان بالإنجليزية",
    en: "Title (English)",
    es: "Título (Inglés)",
  },
  "quiz.form.titleEnPlaceholder": {
    ar: "أدخل عنوان الاختبار بالإنجليزية",
    en: "Enter quiz title in English",
    es: "Ingresa el título del cuestionario en inglés",
  },
  "quiz.form.titleAr": {
    ar: "العنوان بالعربية",
    en: "Title (Arabic)",
    es: "Título (Árabe)",
  },
  "quiz.form.titleArPlaceholder": {
    ar: "أدخل عنوان الاختبار بالعربية",
    en: "Enter quiz title in Arabic",
    es: "Ingresa el título del cuestionario en árabe",
  },
  "quiz.form.titleEs": {
    ar: "العنوان بالإسبانية",
    en: "Title (Spanish)",
    es: "Título (Español)",
  },
  "quiz.form.titleEsPlaceholder": {
    ar: "أدخل عنوان الاختبار بالإسبانية",
    en: "Enter quiz title in Spanish",
    es: "Ingresa el título del cuestionario en español",
  },
  "quiz.form.descriptionSection": {
    ar: "الأوصاف",
    en: "Descriptions",
    es: "Descripciones",
  },
  "quiz.form.descriptionEn": {
    ar: "الوصف بالإنجليزية",
    en: "Description (English)",
    es: "Descripción (Inglés)",
  },
  "quiz.form.descriptionEnPlaceholder": {
    ar: "أدخل وصف الاختبار بالإنجليزية",
    en: "Enter quiz description in English",
    es: "Ingresa la descripción del cuestionario en inglés",
  },
  "quiz.form.descriptionAr": {
    ar: "الوصف بالعربية",
    en: "Description (Arabic)",
    es: "Descripción (Árabe)",
  },
  "quiz.form.descriptionArPlaceholder": {
    ar: "أدخل وصف الاختبار بالعربية",
    en: "Enter quiz description in Arabic",
    es: "Ingresa la descripción del cuestionario en árabe",
  },
  "quiz.form.descriptionEs": {
    ar: "الوصف بالإسبانية",
    en: "Description (Spanish)",
    es: "Descripción (Español)",
  },
  "quiz.form.descriptionEsPlaceholder": {
    ar: "أدخل وصف الاختبار بالإسبانية",
    en: "Enter quiz description in Spanish",
    es: "Ingresa la descripción del cuestionario en español",
  },
  "quiz.form.language": {
    ar: "اللغة",
    en: "Language",
    es: "Idioma",
  },
  "quiz.form.selectLanguage": {
    ar: "اختر اللغة",
    en: "Select language",
    es: "Seleccionar idioma",
  },
  "quiz.form.level": {
    ar: "المستوى",
    en: "Level",
    es: "Nivel",
  },
  "quiz.form.selectLevel": {
    ar: "اختر المستوى",
    en: "Select level",
    es: "Seleccionar nivel",
  },
  "quiz.form.activeStatus": {
    ar: "حالة النشاط",
    en: "Active Status",
    es: "Estado Activo",
  },
  "quiz.form.activeStatusDescription": {
    ar: "تحديد ما إذا كان الاختبار نشطاً ومتاحاً للطلاب",
    en: "Determine if the quiz is active and available to students",
    es: "Determinar si el cuestionario está activo y disponible para los estudiantes",
  },
  "quiz.form.createButton": {
    ar: "إنشاء الاختبار",
    en: "Create Quiz",
    es: "Crear Cuestionario",
  },
  "quiz.form.updateButton": {
    ar: "تحديث الاختبار",
    en: "Update Quiz",
    es: "Actualizar Cuestionario",
  },
  "quiz.form.creating": {
    ar: "جاري الإنشاء...",
    en: "Creating...",
    es: "Creando...",
  },
  "quiz.form.updating": {
    ar: "جاري التحديث...",
    en: "Updating...",
    es: "Actualizando...",
  },
  "quiz.form.createSuccess": {
    ar: "تم إنشاء الاختبار!",
    en: "Quiz Created!",
    es: "¡Cuestionario Creado!",
  },
  "quiz.form.createSuccessMessage": {
    ar: "تم إنشاء الاختبار بنجاح",
    en: "Quiz has been created successfully",
    es: "El cuestionario ha sido creado exitosamente",
  },
  "quiz.form.updateSuccess": {
    ar: "تم تحديث الاختبار!",
    en: "Quiz Updated!",
    es: "¡Cuestionario Actualizado!",
  },
  "quiz.form.updateSuccessMessage": {
    ar: "تم تحديث الاختبار بنجاح",
    en: "Quiz has been updated successfully",
    es: "El cuestionario ha sido actualizado exitosamente",
  },
  "quiz.form.createError": {
    ar: "فشل في إنشاء الاختبار",
    en: "Failed to create quiz",
    es: "Error al crear el cuestionario",
  },
  "quiz.form.updateError": {
    ar: "فشل في تحديث الاختبار",
    en: "Failed to update quiz",
    es: "Error al actualizar el cuestionario",
  },

  // Common
  "common.active": {
    ar: "نشط",
    en: "Active",
    es: "Activo",
  },
  "common.inactive": {
    ar: "غير نشط",
    en: "Inactive",
    es: "Inactivo",
  },
  "common.retry": {
    ar: "إعادة المحاولة",
    en: "Retry",
    es: "Reintentar",
  },
  "common.deleting": {
    ar: "جاري الحذف...",
    en: "Deleting...",
    es: "Eliminando...",
  },

  // Additional Admin Dashboard Keys
  "admin.dashboard.welcome": {
    ar: "مرحباً",
    en: "Welcome",
    es: "Bienvenido",
  },
  "admin.dashboard.exportData": {
    ar: "تصدير البيانات",
    en: "Export Data",
    es: "Exportar Datos",
  },
  "admin.dashboard.refresh": {
    ar: "تحديث",
    en: "Refresh",
    es: "Actualizar",
  },
  "admin.dashboard.content": {
    ar: "المحتوى",
    en: "Content",
    es: "Contenido",
  },
  "admin.dashboard.analytics": {
    ar: "التحليلات",
    en: "Analytics",
    es: "Analíticas",
  },
  "admin.dashboard.totalUsers": {
    ar: "إجمالي المستخدمين",
    en: "Total Users",
    es: "Total de Usuarios",
  },
  "admin.dashboard.teachers": {
    ar: "المعلمين",
    en: "Teachers",
    es: "Profesores",
  },
  "admin.dashboard.totalQuizzes": {
    ar: "إجمالي الاختبارات",
    en: "Total Quizzes",
    es: "Total de Cuestionarios",
  },
  "admin.dashboard.supportedLanguages": {
    ar: "اللغات المدعومة",
    en: "Supported Languages",
    es: "Idiomas Soportados",
  },
  "admin.dashboard.active": {
    ar: "نشط",
    en: "Active",
    es: "Activo",
  },
  "admin.dashboard.thisWeek": {
    ar: "هذا الأسبوع",
    en: "This Week",
    es: "Esta Semana",
  },
  "admin.dashboard.registeredTeachers": {
    ar: "المعلمين المسجلين",
    en: "Registered Teachers",
    es: "Profesores Registrados",
  },
  "admin.dashboard.addUser": {
    ar: "إضافة مستخدم",
    en: "Add User",
    es: "Agregar Usuario",
  },
  "admin.dashboard.createNewUser": {
    ar: "إنشاء مستخدم جديد",
    en: "Create New User",
    es: "Crear Nuevo Usuario",
  },
  "admin.dashboard.createQuiz": {
    ar: "إنشاء اختبار",
    en: "Create Quiz",
    es: "Crear Cuestionario",
  },
  "admin.dashboard.addNewQuiz": {
    ar: "إضافة اختبار جديد",
    en: "Add New Quiz",
    es: "Agregar Nuevo Cuestionario",
  },
  "admin.dashboard.manageTeachers": {
    ar: "إدارة المعلمين",
    en: "Manage Teachers",
    es: "Gestionar Profesores",
  },
  "admin.dashboard.viewTeacherProfiles": {
    ar: "عرض ملفات المعلمين",
    en: "View Teacher Profiles",
    es: "Ver Perfiles de Profesores",
  },
  "admin.dashboard.addLanguage": {
    ar: "إضافة لغة",
    en: "Add Language",
    es: "Agregar Idioma",
  },
  "admin.dashboard.supportNewLanguage": {
    ar: "دعم لغة جديدة",
    en: "Support New Language",
    es: "Soportar Nuevo Idioma",
  },
  "admin.dashboard.importData": {
    ar: "استيراد البيانات",
    en: "Import Data",
    es: "Importar Datos",
  },
  "admin.dashboard.bulkImportQuizzes": {
    ar: "استيراد الاختبارات بالجملة",
    en: "Bulk Import Quizzes",
    es: "Importar Cuestionarios en Lote",
  },
  "admin.dashboard.systemSettings": {
    ar: "إعدادات النظام",
    en: "System Settings",
    es: "Configuración del Sistema",
  },
  "admin.dashboard.configureSystem": {
    ar: "تكوين النظام",
    en: "Configure System",
    es: "Configurar Sistema",
  },
  "admin.dashboard.recentUsers": {
    ar: "المستخدمين الجدد",
    en: "Recent Users",
    es: "Usuarios Recientes",
  },
  "admin.dashboard.recentQuizzes": {
    ar: "الاختبارات الحديثة",
    en: "Recent Quizzes",
    es: "Cuestionarios Recientes",
  },
  "admin.verified": {
    ar: "مُتحقق",
    en: "Verified",
    es: "Verificado",
  },
  "admin.pending": {
    ar: "في الانتظار",
    en: "Pending",
    es: "Pendiente",
  },
  "admin.questions": {
    ar: "أسئلة",
    en: "Questions",
    es: "Preguntas",
  },
  "admin.dashboard.activeUsers": {
    ar: "المستخدمين النشطين",
    en: "Active Users",
    es: "Usuarios Activos",
  },
  "admin.dashboard.newSignups": {
    ar: "التسجيلات الجديدة",
    en: "New Signups",
    es: "Nuevos Registros",
  },
  "admin.dashboard.userManagement": {
    ar: "إدارة المستخدمين",
    en: "User Management",
    es: "Gestión de Usuarios",
  },
  "admin.dashboard.manageAllUsers": {
    ar: "إدارة جميع المستخدمين",
    en: "Manage All Users",
    es: "Gestionar Todos los Usuarios",
  },
  "admin.dashboard.viewAllUsers": {
    ar: "عرض جميع المستخدمين",
    en: "View All Users",
    es: "Ver Todos los Usuarios",
  },
  "admin.dashboard.contentManagement": {
    ar: "إدارة المحتوى",
    en: "Content Management",
    es: "Gestión de Contenido",
  },
  "admin.dashboard.manageQuizzes": {
    ar: "إدارة الاختبارات",
    en: "Manage Quizzes",
    es: "Gestionar Cuestionarios",
  },
  "admin.dashboard.manageLanguages": {
    ar: "إدارة اللغات",
    en: "Manage Languages",
    es: "Gestionar Idiomas",
  },
  "admin.dashboard.systemHealth": {
    ar: "صحة النظام",
    en: "System Health",
    es: "Salud del Sistema",
  },
  "admin.dashboard.databaseStatus": {
    ar: "حالة قاعدة البيانات",
    en: "Database Status",
    es: "Estado de la Base de Datos",
  },
  "admin.dashboard.healthy": {
    ar: "سليم",
    en: "Healthy",
    es: "Saludable",
  },
  "admin.dashboard.apiStatus": {
    ar: "حالة API",
    en: "API Status",
    es: "Estado de API",
  },
  "admin.dashboard.operational": {
    ar: "يعمل",
    en: "Operational",
    es: "Operacional",
  },
  "admin.dashboard.storageStatus": {
    ar: "حالة التخزين",
    en: "Storage Status",
    es: "Estado de Almacenamiento",
  },
  "admin.dashboard.monitoring": {
    ar: "مراقبة",
    en: "Monitoring",
    es: "Monitoreando",
  },
  "admin.dashboard.userGrowth": {
    ar: "نمو المستخدمين",
    en: "User Growth",
    es: "Crecimiento de Usuarios",
  },
  "admin.dashboard.quizDistribution": {
    ar: "توزيع الاختبارات",
    en: "Quiz Distribution",
    es: "Distribución de Cuestionarios",
  },
  "admin.dashboard.chartPlaceholder": {
    ar: "الرسم البياني سيظهر هنا",
    en: "Chart will appear here",
    es: "El gráfico aparecerá aquí",
  },
  "admin.dashboard.performanceMetrics": {
    ar: "مقاييس الأداء",
    en: "Performance Metrics",
    es: "Métricas de Rendimiento",
  },
  "admin.dashboard.completedQuizzes": {
    ar: "الاختبارات المكتملة",
    en: "Completed Quizzes",
    es: "Cuestionarios Completados",
  },
  "admin.dashboard.averageScore": {
    ar: "متوسط النتيجة",
    en: "Average Score",
    es: "Puntuación Promedio",
  },
  "admin.dashboard.dailyActiveUsers": {
    ar: "المستخدمين النشطين يومياً",
    en: "Daily Active Users",
    es: "Usuarios Activos Diarios",
  },
  "admin.dashboard.weeklySignups": {
    ar: "التسجيلات الأسبوعية",
    en: "Weekly Signups",
    es: "Registros Semanales",
  },
};

// Helper function to get localized content from API responses
export const getLocalizedContent = (
  content: { en: string; ar?: string; es?: string } | string | undefined,
  language: SupportedLanguage
): string => {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    return content;
  }

  return content[language] || content.en || "";
};

// Helper function to format time
export const formatTime = (
  seconds: number,
  language: SupportedLanguage
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const t = (key: string) => translations[key]?.[language] || key;

  if (hours > 0) {
    return `${hours}${t("time.hours")} ${minutes}${t(
      "time.minutes"
    )} ${secs}${t("time.seconds")}`;
  }
  return `${minutes}${t("time.minutes")} ${secs}${t("time.seconds")}`;
};

// Helper function to format numbers with localization
export const formatNumber = (
  num: number,
  language: SupportedLanguage
): string => {
  const locale =
    language === "ar" ? "ar-SA" : language === "es" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(locale).format(num);
};

// Helper function to format dates with localization
export const formatDate = (
  date: Date | string,
  language: SupportedLanguage
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale =
    language === "ar" ? "ar-SA" : language === "es" ? "es-ES" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// Helper function to get language direction
export const getLanguageDirection = (
  language: SupportedLanguage
): "rtl" | "ltr" => {
  return language === "ar" ? "rtl" : "ltr";
};

// Helper function to interpolate variables in translations
export const interpolate = (
  text: string,
  variables: Record<string, string | number>
): string => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key]?.toString() || match;
  });
};
