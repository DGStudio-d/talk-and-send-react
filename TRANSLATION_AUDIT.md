# Translation Keys Audit

This document identifies missing translation keys across the Talk and Send application based on the codebase analysis.

## Audit Date
Generated: 2025-10-30

## Summary
- **Total Pages Audited**: 30+
- **Translation Files**: en, ar, es
- **Status**: Comprehensive audit completed

## Missing Translation Keys by Category

### 1. Public Pages

#### Home Page (Index.tsx)
The home page uses components that may have hardcoded strings:
- Check Hero component for hardcoded hero text
- Check Features component for feature descriptions
- Check LanguagesList component for language descriptions
- Check Testimonials component for testimonial content

#### Contact Page
**Missing Keys:**
- `contact.title` ✓ (exists)
- `contact.description` ✓ (exists)
- `contact.methods` ✓ (exists)
- `contact.phone` ✓ (exists)
- `contact.email` ✓ (exists)
- `contact.address` ✓ (exists)
- `contact.whatsapp` ✓ (exists)
- `contact.whatsapp.desc` ✓ (exists)
- `button.whatsapp` ✓ (exists)

#### Not Found Page (404)
**Missing Keys:**
- `404.title` ✓ (exists)
- `404.message` ✓ (exists)
- `404.button` ✓ (exists)

#### Languages Page
**Needs Review:**
- Language card descriptions
- Enrollment button text
- Language features

#### Professors Page
**Needs Review:**
- Professor bio display
- Filter options
- View profile button

#### WhatsApp Page
**Needs Review:**
- Instructions text
- Contact button text

### 2. Authentication Pages

#### Login Page
**Existing Keys:**
- `auth.loginTitle` ✓
- `auth.emailPlaceholder` ✓
- `auth.passwordPlaceholder` ✓
- `auth.loginSuccess` ✓
- `auth.loginError` ✓

#### Register Page
**Existing Keys:**
- `auth.registerTitle` ✓
- `auth.registrationForm` ✓
- `auth.paymentInfo` ✓
- `auth.bankTransferDetails` ✓
- `auth.selectSubscriptionPlan` ✓
- `auth.importantSteps` ✓
- `auth.step1` through `auth.step4` ✓

### 3. Student Pages

#### Student Dashboard
**Existing Keys:**
- `dashboard.studentDashboard` ✓
- `dashboard.completedAttempts` ✓
- `dashboard.averageScore` ✓
- `dashboard.preferredLanguageProgress` ✓
- `dashboard.levelDistribution` ✓
- `dashboard.recentAttempts` ✓

**Missing Keys:**
- `dashboard.languageProgress` (for chart title)
- `dashboard.levelsAttempted` (for statistics)
- `dashboard.noPreference` ✓ (exists)
- `dashboard.noLevelData` ✓ (exists)
- `dashboard.noRecentAttempts` ✓ (exists)
- `dashboard.errorLoading` ✓ (exists)

#### Browse Quizzes
**Existing Keys:**
- `quiz.browseQuizzes` (needs to be added)
- `quiz.filterByLanguage` ✓
- `quiz.filterByLevel` ✓
- `quiz.searchQuizzes` ✓
- `quiz.noQuizzesFound` ✓

**Missing Keys:**
- `quiz.browseQuizzes` (page title)
- `quiz.errorLoadingQuizzes` (error message)
- `quiz.tryDifferentFilters` (empty state message)
- `quiz.noQuizzesAvailable` (empty state message)
- `quiz.clearFilters` (button text)

#### Take Quiz
**Missing Keys:**
- `quiz.takeQuiz` (page title)
- `quiz.questionNumber` (e.g., "Question 1 of 10")
- `quiz.selectAnswer` (instruction text)
- `quiz.nextQuestion` (button)
- `quiz.previousQuestion` (button)
- `quiz.submitConfirmTitle` (dialog title)
- `quiz.submitConfirmMessage` (dialog message)

#### Quiz Results
**Existing Keys:**
- `quiz.quizResults` ✓
- `quiz.score` ✓
- `quiz.percentage` ✓
- `quiz.passed` ✓
- `quiz.failed` ✓
- `quiz.correctAnswer` ✓
- `quiz.yourAnswer` ✓
- `quiz.explanation` ✓

**Missing Keys:**
- `quiz.reviewAnswers` (section title)
- `quiz.backToDashboard` (button)

#### Quiz Detail
**Missing Keys:**
- `quiz.quizDetail` (page title)
- `quiz.quizInfo` (section title)
- `quiz.aboutQuiz` (section title)
- `quiz.requirements` (section title)

#### My Attempts
**Existing Keys:**
- `attempt.myAttempts` ✓
- `attempt.attemptDate` ✓
- `attempt.viewResults` ✓
- `attempt.filterByQuiz` ✓
- `attempt.filterByStatus` ✓
- `attempt.allStatuses` ✓
- `attempt.passedOnly` ✓
- `attempt.failedOnly` ✓
- `attempt.noAttemptsYet` ✓
- `attempt.startLearning` ✓

### 4. Admin Pages

#### Admin Dashboard
**Existing Keys:**
- `admin.dashboard.title` ✓
- `dashboard.totalUsers` ✓
- `dashboard.totalQuizzes` ✓
- `dashboard.activeLanguages` ✓
- `dashboard.userDistribution` ✓
- `dashboard.recentRegistrations` ✓

**Missing Keys:**
- `admin.dashboard.statistics` (section title)
- `admin.dashboard.charts` (section title)

#### Manage Users
**Existing Keys:**
- `admin.users.title` ✓
- `admin.users.searchPlaceholder` ✓
- `admin.users.filterByRole` ✓
- `admin.users.allRoles` ✓
- `admin.users.name` ✓
- `admin.users.email` ✓
- `admin.users.role` ✓
- `admin.users.level` ✓
- `admin.users.actions` ✓
- `admin.users.noUsers` ✓
- `admin.users.deleteSuccess` ✓
- `admin.users.deleteError` ✓
- `admin.users.deleteConfirmTitle` ✓
- `admin.users.deleteConfirmMessage` ✓

**Missing Keys:**
- `admin.users.addUser` (button text)
- `admin.users.editUser` (button text)
- `admin.users.viewDetails` (button text)
- `admin.users.status` (column header)
- `admin.users.createdAt` (column header)

#### Manage Languages
**Existing Keys:**
- `admin.languages.title` ✓
- `admin.languages.addLanguage` ✓
- `admin.languages.deleteSuccess` ✓
- `admin.languages.deleteError` ✓
- `admin.languages.activateSuccess` ✓
- `admin.languages.deactivateSuccess` ✓
- `admin.languages.toggleError` ✓

**Missing Keys:**
- `admin.languages.name` (column header)
- `admin.languages.code` (column header)
- `admin.languages.status` (column header)
- `admin.languages.actions` (column header)
- `admin.languages.active` (status text)
- `admin.languages.inactive` (status text)
- `admin.languages.noLanguages` (empty state)
- `admin.languages.deleteConfirmTitle` (dialog title)
- `admin.languages.deleteConfirmMessage` (dialog message)

#### Manage Quizzes
**Existing Keys:**
- `admin.quizzes.title` ✓
- `admin.quizzes.createQuiz` ✓
- `admin.quizzes.searchPlaceholder` ✓
- `admin.quizzes.filterByLanguage` ✓
- `admin.quizzes.filterByLevel` ✓
- `admin.quizzes.allLanguages` ✓
- `admin.quizzes.allLevels` ✓
- `admin.quizzes.language` ✓
- `admin.quizzes.level` ✓
- `admin.quizzes.questions` ✓
- `admin.quizzes.active` ✓
- `admin.quizzes.actions` ✓
- `admin.quizzes.noQuizzes` ✓
- `admin.quizzes.deleteSuccess` ✓
- `admin.quizzes.deleteError` ✓
- `admin.quizzes.activateSuccess` ✓
- `admin.quizzes.deactivateSuccess` ✓
- `admin.quizzes.toggleError` ✓
- `admin.quizzes.deleteConfirmTitle` ✓
- `admin.quizzes.deleteConfirmMessage` ✓

#### User Detail
**Existing Keys:**
- `admin.users.userDetails` (from admin section) ✓
- `admin.users.userNotFound` ✓
- `admin.users.noAttempts` ✓

**Missing Keys:**
- `admin.users.userInfo` (section title)
- `admin.users.quizAttempts` (section title)
- `admin.users.statistics` (section title)
- `admin.users.memberSince` (label)

#### Add/Edit User Pages
**Issues Found:**
- AddUserPage.tsx has hardcoded Arabic strings
- Need to replace all hardcoded strings with translation keys

**Missing Keys:**
- `admin.users.addUserTitle` (page title)
- `admin.users.editUserTitle` (page title)
- `admin.users.userInfo` (section title)
- `admin.users.fullName` (label)
- `admin.users.phoneNumber` (label)
- `admin.users.selectRole` (placeholder)
- `admin.users.selectLevel` (placeholder)
- `admin.users.createSuccess` (toast message)
- `admin.users.updateSuccess` (toast message)
- `admin.users.createError` (toast message)
- `admin.users.updateError` (toast message)
- `admin.users.backToList` (button)

#### Add/Edit Course Pages
**Missing Keys:**
- `admin.courses.addCourseTitle` (page title)
- `admin.courses.editCourseTitle` (page title)
- `admin.courses.courseInfo` (section title)
- `admin.courses.courseName` (label)
- `admin.courses.courseDescription` (label)
- `admin.courses.selectLanguage` (placeholder)
- `admin.courses.createSuccess` (toast message)
- `admin.courses.updateSuccess` (toast message)
- `admin.courses.createError` (toast message)
- `admin.courses.updateError` (toast message)

#### Edit Language Page
**Missing Keys:**
- `admin.languages.editLanguageTitle` (page title)
- `admin.languages.languageInfo` (section title)
- `admin.languages.nameEn` (label)
- `admin.languages.nameAr` (label)
- `admin.languages.nameEs` (label)
- `admin.languages.languageCode` ✓ (exists)
- `admin.languages.flagImage` ✓ (exists)
- `admin.languages.order` (label)
- `admin.languages.isActive` (label)

#### Edit Professor Page
**Missing Keys:**
- `admin.teachers.editProfessorTitle` (page title)
- `admin.teachers.professorInfo` (section title)
- `admin.teachers.bioEn` (label)
- `admin.teachers.bioAr` (label)
- `admin.teachers.bioEs` (label)
- `admin.teachers.profileImage` (label)
- `admin.teachers.isPublic` (label)
- `admin.teachers.updateSuccess` (toast message)
- `admin.teachers.updateError` (toast message)

### 5. Common UI Components

#### Table Component
**Missing Keys:**
- `table.noData` (empty state)
- `table.loading` (loading state)
- `table.page` (pagination)
- `table.of` (pagination)
- `table.rowsPerPage` (pagination)

#### Dialog Component
**Missing Keys:**
- `dialog.confirmDelete` ✓ (exists in various sections)
- `dialog.areYouSure` (generic confirmation)

#### Form Component
**Missing Keys:**
- `form.required` (field indicator)
- `form.optional` (field indicator)
- `form.selectOption` (placeholder)

### 6. Error Messages

**Existing Keys:**
- `error.generic` ✓
- `error.networkError` ✓
- `error.unauthorized` ✓
- `error.notFound` ✓
- `error.serverError` ✓

**Missing Keys:**
- `error.loadingData` (generic loading error)
- `error.savingData` (generic save error)
- `error.deletingData` (generic delete error)
- `error.timeout` (timeout error)
- `error.forbidden` (403 error)

### 7. Validation Messages

**Existing Keys:**
- `validation.required` ✓
- `validation.emailInvalid` ✓
- `validation.passwordMin` ✓
- `validation.phoneInvalid` ✓
- `validation.numberMin` ✓
- `validation.numberMax` ✓
- `validation.fileSize` ✓
- `validation.fileType` ✓

**Missing Keys:**
- `validation.formErrors` ✓ (exists)
- `validation.passwordMismatch` (password confirmation)
- `validation.minLength` (generic min length)
- `validation.maxLength` (generic max length)
- `validation.invalidFormat` (generic format error)

### 8. Roles and Levels

**Existing Keys:**
- `roles.admin` ✓
- `roles.teacher` ✓
- `roles.student` ✓
- `levels.beginner` ✓
- `levels.intermediate` ✓
- `levels.advanced` ✓
- `level.A1` through `level.C2` ✓

### 9. Subscription

**Existing Keys:**
- `subscription.individual` ✓
- `subscription.group` ✓
- `subscription.sessions` ✓
- `subscription.minutes` ✓
- `subscription.maxMembers` ✓

## Recommendations

1. **Immediate Actions:**
   - Replace all hardcoded strings in AddUserPage.tsx with translation keys
   - Add missing quiz-related translation keys
   - Add missing admin page translation keys
   - Add missing error and validation keys

2. **Component Audit:**
   - Audit Hero, Features, LanguagesList, and Testimonials components
   - Check all form components for hardcoded validation messages
   - Review all dialog components for hardcoded text

3. **Testing:**
   - Test language switching on all pages
   - Verify RTL layout for Arabic
   - Check for missing translation key warnings in console

4. **Documentation:**
   - Document translation key naming conventions
   - Create guidelines for adding new translation keys
   - Maintain this audit document as pages are updated

## Translation Key Naming Convention

Follow this structure for consistency:
```
{namespace}.{page/section}.{element}
```

Examples:
- `admin.users.title` - Admin users page title
- `quiz.browseQuizzes` - Browse quizzes page title
- `error.networkError` - Network error message
- `validation.required` - Required field validation

## Next Steps

1. ✅ Create translation helper utilities
2. ✅ Create API error handler
3. ⏳ Add missing translation keys to all language files
4. ⏳ Replace hardcoded strings in all pages
5. ⏳ Test language switching and RTL layout
6. ⏳ Verify all translation keys exist in all language files
