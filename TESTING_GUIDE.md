# Testing Guide - Talk and Send Language Learning Platform

This document provides comprehensive testing procedures for the language learning platform migration. Follow these test cases to ensure all functionality works as expected.

## Prerequisites

Before testing, ensure:
- Backend API is running and accessible
- Database is seeded with test data
- Environment variables are properly configured
- Browser developer tools are open for debugging

## Test Environment Setup

```bash
# Start the development server
cd talk-and-send-react
npm run dev
```

---

## 20.1 Authentication Flow Testing

### Test Case 1.1: Login with Valid Credentials

**Steps:**
1. Navigate to `/login` or `/admin/login`
2. Enter valid email: `test@example.com`
3. Enter valid password: `password123`
4. Click "Login" button

**Expected Results:**
- Loading state appears on button
- User is redirected to appropriate dashboard based on role
- Auth token is stored in localStorage
- User information is displayed in navigation header
- No error messages appear

**Verification:**
```javascript
// Check localStorage
localStorage.getItem('auth_token') // Should return token
```

### Test Case 1.2: Login with Invalid Credentials

**Steps:**
1. Navigate to `/login`
2. Enter email: `invalid@example.com`
3. Enter password: `wrongpassword`
4. Click "Login" button

**Expected Results:**
- Error toast notification appears
- User remains on login page
- No token is stored in localStorage
- Form fields remain populated (email only)

### Test Case 1.3: Registration with Valid Data

**Steps:**
1. Navigate to `/register`
2. Fill in all required fields:
   - Name: "Test User"
   - Email: "newuser@example.com"
   - Phone: "+1234567890"
   - Password: "SecurePass123!"
   - Preferred Language: Select from dropdown
   - Level: Select from dropdown
3. Click "Register" button

**Expected Results:**
- Loading state appears
- User is automatically logged in
- Redirected to student dashboard
- Auth token is stored
- Success toast appears

### Test Case 1.4: Registration Validation

**Steps:**
1. Navigate to `/register`
2. Try submitting with:
   - Empty fields
   - Invalid email format
   - Weak password
   - Missing required fields

**Expected Results:**
- Field-specific validation errors appear
- Form submission is prevented
- Error messages are localized
- Submit button remains disabled until valid

### Test Case 1.5: Logout Functionality

**Steps:**
1. Login as any user
2. Click logout button in navigation
3. Confirm logout if prompted

**Expected Results:**
- User is redirected to login page
- Auth token is removed from localStorage
- User state is cleared
- Protected routes are no longer accessible

### Test Case 1.6: Protected Route Access

**Steps:**
1. Without logging in, try to access:
   - `/student/dashboard`
   - `/teacher/dashboard`
   - `/admin/dashboard`
2. Try accessing routes with wrong role

**Expected Results:**
- Unauthenticated users redirected to `/login`
- Users with wrong role see access denied or redirect
- URL changes to login page
- Original destination is preserved for redirect after login

### Test Case 1.7: Token Expiration Handling

**Steps:**
1. Login successfully
2. Manually expire or remove token from localStorage
3. Try to make an API request
4. Or wait for token to expire naturally

**Expected Results:**
- 401 error is caught by interceptor
- User is automatically logged out
- Redirected to login page
- Error message explains session expired

### Test Case 1.8: User Information Display

**Steps:**
1. Login as different user roles
2. Check navigation header

**Expected Results:**
- User name is displayed correctly
- User role is visible (if applicable)
- Role-specific menu items appear
- Avatar or initials shown

---

## 20.2 Quiz Taking Flow Testing

### Test Case 2.1: Browse and Filter Quizzes

**Steps:**
1. Login as student
2. Navigate to `/quizzes` or Browse Quizzes
3. View all available quizzes
4. Apply language filter
5. Apply level filter (A1-C2)
6. Use search to find specific quiz

**Expected Results:**
- All active quizzes display in grid
- Quiz cards show: title, language flag, level badge, duration, passing score
- Filters work independently and combined
- Search filters by title
- Empty state shows when no matches
- Skeleton loaders appear while loading

### Test Case 2.2: Quiz Detail View

**Steps:**
1. Click on a quiz card
2. View quiz details page

**Expected Results:**
- Quiz title, description displayed in current locale
- Language, level, duration, passing score shown
- Question count displayed
- Teacher name and profile image visible
- Previous attempts listed (if any)
- "Start Quiz" button is prominent
- Inactive quizzes show unavailable message

### Test Case 2.3: Start Quiz

**Steps:**
1. From quiz detail page, click "Start Quiz"
2. Confirm if prompted

**Expected Results:**
- New quiz attempt is created
- Redirected to quiz taking interface
- First question is displayed
- Timer starts (if quiz has duration)
- Progress indicator shows question 1 of N

### Test Case 2.4: Answer Questions and Navigate

**Steps:**
1. In quiz taking interface:
2. Select an answer option
3. Click "Next" button
4. Click "Previous" button
5. Navigate through all questions

**Expected Results:**
- Selected option is highlighted with green border
- "Next" button moves to next question
- "Previous" button moves to previous question
- Selected answers are preserved when navigating
- Last question shows "Submit Quiz" instead of "Next"
- Question number updates correctly

### Test Case 2.5: Quiz Timer Functionality

**Steps:**
1. Start a quiz with duration
2. Observe timer countdown
3. Let timer reach last 2 minutes
4. Let timer reach zero (or wait)

**Expected Results:**
- Timer displays in MM:SS format
- Updates every second
- Shows warning style when < 2 minutes remain
- Auto-submits quiz when timer reaches 00:00
- Warning appears before auto-submit

### Test Case 2.6: Quiz Submission

**Steps:**
1. Answer all questions (or some)
2. Click "Submit Quiz" on last question
3. Confirm submission in dialog

**Expected Results:**
- Confirmation dialog appears
- Shows warning about finalizing answers
- On confirm, all answers submitted to API
- Loading state during submission
- Redirected to results page
- Cannot return to quiz after submission

### Test Case 2.7: View Quiz Results

**Steps:**
1. After submitting quiz, view results page
2. Review all sections

**Expected Results:**
- Score and percentage displayed prominently
- Pass/fail status shown with visual indicator (green checkmark/red X)
- Duration taken is displayed
- Each question shown with:
  - Question text
  - Selected answer (highlighted)
  - Correct answer (highlighted in green)
  - Incorrect answers (highlighted in red if selected)
  - Explanation (if available)
- "Retake Quiz" button available
- "Back to Quizzes" button available

### Test Case 2.8: Retake Quiz

**Steps:**
1. From results page, click "Retake Quiz"
2. Confirm if prompted

**Expected Results:**
- New attempt is created
- Redirected to quiz taking interface
- Previous answers are not pre-filled
- Timer resets
- Can complete quiz again

---

## 20.3 Multilingual Functionality Testing

### Test Case 3.1: Language Switching

**Steps:**
1. Open application
2. Locate language switcher in navigation
3. Click to open language dropdown
4. Select different language (English, Arabic, Spanish)
5. Observe UI changes

**Expected Results:**
- Language dropdown shows all 3 languages with flags
- Current language is highlighted
- All UI text updates immediately
- Language preference saved to localStorage
- Page does not reload
- Selected language persists on page refresh

### Test Case 3.2: RTL Layout for Arabic

**Steps:**
1. Switch to Arabic language
2. Navigate through different pages
3. Observe layout changes

**Expected Results:**
- Entire layout flips to RTL
- Text alignment changes to right
- Navigation menu items flip
- Form fields align right
- Icons and buttons flip appropriately
- Scrollbars appear on left
- document.documentElement.dir = "rtl"
- document.documentElement.lang = "ar"

### Test Case 3.3: Content Translation

**Steps:**
1. Switch between languages
2. Check various content types:
   - Navigation menu items
   - Button labels
   - Form labels and placeholders
   - Error messages
   - Toast notifications
   - Quiz content (titles, descriptions)
   - Dashboard labels

**Expected Results:**
- All static content translates
- Dynamic content (from API) shows in selected locale
- Multilingual fields display correct language version
- Fallback to English if translation missing
- No untranslated keys visible (no "common.button.submit")

### Test Case 3.4: API Accept-Language Header

**Steps:**
1. Open browser developer tools
2. Go to Network tab
3. Switch language
4. Make API requests (browse quizzes, view profile, etc.)
5. Inspect request headers

**Expected Results:**
- All API requests include `Accept-Language` header
- Header value matches selected locale (en, ar, es)
- Server returns content in requested language
- Multilingual fields return correct language version

### Test Case 3.5: Language Persistence

**Steps:**
1. Select a language
2. Navigate through pages
3. Refresh browser
4. Close and reopen browser
5. Check localStorage

**Expected Results:**
- Language persists across page navigation
- Language persists after browser refresh
- localStorage contains 'locale' key with value
- Language loads from localStorage on app init

---

## 20.4 Responsive Design Testing

### Test Case 4.1: Mobile Viewport (320px - 767px)

**Steps:**
1. Open browser developer tools
2. Set viewport to mobile size (e.g., iPhone SE: 375x667)
3. Navigate through all pages

**Expected Results:**
- Layout adapts to single column
- Navigation collapses to hamburger menu
- Quiz cards stack vertically
- Forms are full width
- Buttons are appropriately sized for touch
- Text is readable without zooming
- No horizontal scrolling
- Images scale appropriately

### Test Case 4.2: Tablet Viewport (768px - 1023px)

**Steps:**
1. Set viewport to tablet size (e.g., iPad: 768x1024)
2. Test both portrait and landscape
3. Navigate through pages

**Expected Results:**
- Layout uses 2-column grid where appropriate
- Navigation may show full or collapsed
- Quiz cards display in 2 columns
- Forms use optimal width
- Touch targets are adequate
- Spacing is appropriate

### Test Case 4.3: Desktop Viewport (1024px+)

**Steps:**
1. Set viewport to desktop size (1920x1080)
2. Test various desktop sizes
3. Navigate through pages

**Expected Results:**
- Full navigation menu visible
- Multi-column layouts utilized
- Quiz cards in 3-4 column grid
- Forms use constrained width
- Hover states work on interactive elements
- Content is centered with max-width
- No wasted space

### Test Case 4.4: Mobile Menu Functionality

**Steps:**
1. On mobile viewport
2. Click hamburger menu icon
3. Navigate through menu items
4. Close menu

**Expected Results:**
- Hamburger icon visible and accessible
- Menu slides in/overlays content
- All navigation items accessible
- Active item highlighted
- Menu closes on item click
- Menu closes on outside click
- Close button/icon visible

### Test Case 4.5: Touch Interactions

**Steps:**
1. On mobile device or touch simulator
2. Test touch interactions:
   - Tap buttons
   - Swipe (if applicable)
   - Scroll
   - Form inputs

**Expected Results:**
- Touch targets minimum 44x44px
- No accidental clicks
- Smooth scrolling
- Form inputs focus properly
- Keyboard appears for text inputs
- No hover-only interactions

---

## 20.5 Error Handling Testing

### Test Case 5.1: API Error Responses

**Steps:**
1. Simulate API errors:
   - 400 Bad Request
   - 404 Not Found
   - 500 Internal Server Error
2. Trigger various API calls

**Expected Results:**
- Error toast notifications appear
- Error messages are user-friendly
- Error messages are localized
- User can retry action
- Application doesn't crash
- Console shows detailed error (dev mode)

### Test Case 5.2: Network Errors

**Steps:**
1. Disconnect internet
2. Try to:
   - Login
   - Load quizzes
   - Submit quiz
   - Load dashboard
3. Reconnect internet

**Expected Results:**
- "No internet connection" message appears
- Loading states handle gracefully
- Retry mechanism available
- Cached data shown if available
- Application recovers when connection restored

### Test Case 5.3: Validation Errors

**Steps:**
1. Submit forms with invalid data:
   - Empty required fields
   - Invalid email format
   - Password too short
   - Invalid phone number
2. Check error display

**Expected Results:**
- Field-specific errors appear below/near field
- Errors are clear and actionable
- Errors are localized
- Form submission prevented
- Errors clear when field corrected
- Multiple errors can show simultaneously

### Test Case 5.4: Loading States

**Steps:**
1. Observe loading states for:
   - Page loads
   - Data fetching
   - Form submissions
   - Image loading
2. Test slow network (throttle in dev tools)

**Expected Results:**
- Skeleton loaders for content
- Spinner/loading indicator for actions
- Button shows loading state during submission
- Loading states are accessible (aria-busy)
- Timeout handling for long requests
- User can cancel long operations

### Test Case 5.5: 404 and Error Pages

**Steps:**
1. Navigate to non-existent route: `/nonexistent`
2. Try to access deleted resource
3. Trigger application error

**Expected Results:**
- Custom 404 page displays
- Error message is friendly
- Link to return home
- Navigation still works
- Error boundary catches React errors
- Error details logged (dev mode)

---

## Additional Test Scenarios

### Cross-Browser Testing
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility Testing
- Keyboard navigation works
- Screen reader announces content
- Focus indicators visible
- Color contrast meets WCAG AA
- Alt text on images
- Form labels associated

### Performance Testing
- Initial page load < 3 seconds
- Time to interactive < 5 seconds
- Smooth animations (60fps)
- No memory leaks
- Efficient re-renders

### Security Testing
- XSS prevention
- CSRF tokens (if applicable)
- Secure token storage
- No sensitive data in URLs
- HTTPS only in production

---

## Test Data Requirements

### Users
- Admin user: admin@example.com / admin123
- Teacher user: teacher@example.com / teacher123
- Student user: student@example.com / student123

### Quizzes
- At least 3 quizzes per language
- Quizzes at different levels (A1-C2)
- Quizzes with and without duration
- Active and inactive quizzes

### Languages
- English, Arabic, Spanish configured
- Flag images available
- Translations complete

---

## Reporting Issues

When reporting bugs, include:
1. Test case number
2. Steps to reproduce
3. Expected vs actual result
4. Screenshots/videos
5. Browser and version
6. Console errors
7. Network tab info (if API related)

---

## Test Completion Checklist

- [ ] All authentication flows tested
- [ ] Quiz taking flow complete
- [ ] All languages tested (en, ar, es)
- [ ] RTL layout verified
- [ ] Mobile responsive verified
- [ ] Tablet responsive verified
- [ ] Desktop responsive verified
- [ ] Error handling verified
- [ ] Loading states verified
- [ ] Cross-browser tested
- [ ] Accessibility checked
- [ ] Performance acceptable

---

## Notes

- Some tests require backend API to be running
- Test with realistic data volumes
- Test edge cases (empty states, max values)
- Test concurrent users if possible
- Document any workarounds or known issues
