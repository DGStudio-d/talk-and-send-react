# Accessibility Implementation Guide

This document outlines the accessibility features implemented in the Talk and Send React application to ensure WCAG 2.1 AA compliance.

## Overview

The application has been designed with accessibility as a core principle, ensuring that all users, including those with disabilities, can effectively use the platform.

## Key Accessibility Features

### 1. Keyboard Navigation

All interactive elements are fully keyboard accessible:

- **Tab Navigation**: All buttons, links, forms, and interactive elements can be accessed via Tab key
- **Enter/Space Activation**: Interactive cards and custom controls respond to Enter and Space keys
- **Focus Indicators**: Visible focus rings (2px primary-500 color) on all focusable elements
- **Logical Tab Order**: Elements follow a natural reading order

#### Implementation Details

```css
/* Global focus styles in src/styles/accessibility.css */
*:focus-visible {
  outline: none;
  ring: 2px solid primary-500;
  ring-offset: 2px;
}
```

### 2. ARIA Labels and Landmarks

Proper ARIA attributes enhance screen reader experience:

- **aria-label**: Descriptive labels for icon-only buttons and complex interactions
- **aria-labelledby**: Associates form sections with their headings
- **aria-describedby**: Links form inputs with error messages
- **aria-invalid**: Indicates form validation errors
- **aria-live**: Announces dynamic content changes (e.g., timer warnings)
- **role attributes**: Proper semantic roles for custom components

#### Examples

```tsx
// Quiz Card with keyboard support
<Card
  role="button"
  tabIndex={0}
  aria-label={`View quiz: ${title}, Level: ${level}`}
  onKeyDown={handleKeyDown}
>
  {/* content */}
</Card>

// Form input with error
<Input
  id="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert">
    {errors.email.message}
  </p>
)}
```

### 3. Form Accessibility

All forms follow best practices:

- **Associated Labels**: Every input has a properly associated `<Label>` using `htmlFor`
- **Error Announcements**: Validation errors are announced to screen readers via `role="alert"`
- **Required Fields**: Marked with `aria-required` where applicable
- **Field Descriptions**: Error messages linked via `aria-describedby`
- **Loading States**: Submit buttons indicate loading with `aria-busy`

### 4. Color Contrast

All text meets WCAG AA contrast requirements:

- **Primary Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clear visual distinction beyond color alone

#### Non-Color Indicators

Status information is conveyed through multiple means:

- **Pass/Fail Status**: Icons (✓ checkmark, ✗ cross) accompany color coding
- **Quiz Results**: Text labels + icons + color
- **Form Validation**: Border styling + icons + error text

```tsx
// Pass/Fail with icon and color
{attempt.is_passed ? (
  <Badge className="bg-green-500">
    <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
    Passed
  </Badge>
) : (
  <Badge variant="destructive">
    <XCircle className="w-3 h-3 mr-1" aria-hidden="true" />
    Failed
  </Badge>
)}
```

### 5. Image Accessibility

All images have descriptive alt text:

- **Decorative Images**: `aria-hidden="true"` for icons
- **Informative Images**: Descriptive alt text (e.g., language flags)
- **Profile Images**: Alt text includes person's name

```tsx
<img
  src={language.flag_url}
  alt={`${language.name} flag`}
  role="img"
/>
```

### 6. Screen Reader Support

Content is optimized for screen readers:

- **Skip Links**: "Skip to main content" link for keyboard users
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **Landmark Regions**: `<nav>`, `<main>`, `<aside>` for page structure
- **Hidden Content**: `.sr-only` class for screen-reader-only text
- **Live Regions**: Timer warnings announced via `aria-live="polite"`

```tsx
// Screen reader only content
<span className="sr-only" role="alert">
  {t('quiz.lowTimeWarning', { time: formatTime(secondsRemaining) })}
</span>
```

### 7. Mobile Accessibility

Touch targets meet minimum size requirements:

- **Minimum Size**: 44x44px for all interactive elements on mobile
- **Spacing**: Adequate spacing between touch targets
- **Responsive Focus**: Focus indicators scale appropriately

```css
/* Touch target sizing in src/styles/accessibility.css */
@media (pointer: coarse) {
  button,
  a,
  input[type="checkbox"],
  input[type="radio"],
  select {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### 8. Motion and Animation

Respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9. High Contrast Mode

Supports high contrast preferences:

```css
@media (prefers-contrast: high) {
  * {
    border-width: 2px !important;
  }
  
  button,
  a {
    text-decoration: underline;
  }
}
```

## Component-Specific Accessibility

### Quiz Components

#### QuizCard
- Keyboard navigable with Enter/Space
- Descriptive aria-label with quiz details
- Focus indicator on hover/focus

#### QuizQuestionDisplay
- Radio group semantics for options
- Correct/incorrect answers indicated by icon + color + text
- Explanation region properly labeled

#### QuizTimer
- Live region announces time updates
- Warning state for low time
- Screen reader announcement for critical time

#### QuizFilters
- Search landmark with proper role
- All selects have associated labels
- Clear filter state announcements

### Form Components

#### Login/Register
- Form sections labeled with aria-labelledby
- Error messages linked via aria-describedby
- Loading states announced with aria-busy

#### EditUserModal
- All inputs properly labeled
- Validation errors announced immediately
- Modal focus trap implemented

### Dashboard Components

#### StatsCard
- Semantic article role
- Value associated with label
- Icon marked as decorative

## Testing Recommendations

### Manual Testing

1. **Keyboard Navigation**
   - Tab through entire application
   - Verify all interactive elements are reachable
   - Check focus indicators are visible

2. **Screen Reader Testing**
   - Test with NVDA (Windows) or VoiceOver (Mac)
   - Verify all content is announced correctly
   - Check form validation announcements

3. **Color Contrast**
   - Use browser DevTools contrast checker
   - Verify all text meets 4.5:1 ratio
   - Test in high contrast mode

4. **Mobile Testing**
   - Verify touch targets are adequate size
   - Test with screen reader on mobile
   - Check responsive focus indicators

### Automated Testing Tools

- **axe DevTools**: Browser extension for accessibility auditing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Chrome DevTools accessibility audit
- **Pa11y**: Command-line accessibility testing

## RTL (Right-to-Left) Support

The application fully supports RTL languages (Arabic):

- Direction automatically switches based on locale
- All layouts adapt to RTL flow
- Focus order follows reading direction
- Icons and visual elements mirror appropriately

## Future Improvements

- [ ] Add skip navigation links to all pages
- [ ] Implement focus management for route changes
- [ ] Add keyboard shortcuts documentation
- [ ] Enhance error recovery guidance
- [ ] Add more descriptive page titles
- [ ] Implement breadcrumb navigation

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Inclusive Components](https://inclusive-components.design/)

## Contact

For accessibility concerns or suggestions, please contact the development team.
