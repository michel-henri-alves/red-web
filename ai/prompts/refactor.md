# Refactor Code Prompt

You are refactoring code in the RED frontend application. Follow these guidelines:

## Refactoring Principles

### Code Quality
- Improve readability and maintainability
- Reduce duplication and simplify logic
- Keep components small and focused
- Keep hooks and utility functions reusable

### Performance
- Avoid unnecessary re-renders
- Memoize derived values and callbacks when appropriate
- Load data lazily where it makes sense
- Keep component trees shallow

### Accessibility
- Keep interactive elements keyboard-accessible
- Use semantic HTML and ARIA attributes when needed
- Ensure focus management for modals and dialogs
- Use visible labels for form fields and buttons

### UX
- Keep loading and error states clear
- Make form validation feedback visible and helpful
- Preserve route state during navigation
- Keep actions consistent across pages

## Refactoring Steps

### 1. Analyze Current Code
- Identify duplicate logic and similar patterns
- Review component responsibilities
- Check hook usage and state management
- Look for tight coupling between components

### 2. Plan Refactoring
- Define goals for the refactor
- Choose code to extract into shared UI or hooks
- Keep behavioral changes minimal during refactor
- Identify tests to update or add

### 3. Implement Changes

#### Extract Components
```jsx
// Before: large page with mixed UI and logic
function ProductPage() {
  // fetch logic
  // pagination logic
  // render table and filters
}

// After: smaller page with shared components
function ProductPage() {
  const { data, isLoading } = useProducts();

  return (
    <PageLayout>
      <ProductFilter />
      <ProductTable data={data} isLoading={isLoading} />
    </PageLayout>
  );
}
```

#### Improve Hook Separation
```javascript
function useProductSearch() {
  const [query, setQuery] = useState('');
  const { data } = useProducts({ query });

  return { query, setQuery, data };
}
```

#### Improve Error Handling
```javascript
try {
  await createSale(salePayload);
  toast.success('Sale completed');
} catch (error) {
  toast.error(error?.message || 'Unable to complete sale');
}
```

### 4. Add or Update Tests
- Verify that refactored components still render correctly
- Add tests for extracted hooks and utility functions
- Ensure route and page behavior remains stable

## Additional Notes
- Preserve existing behavior while improving structure.
- If a refactor requires a behavior change, document it and update specs.
- Use this prompt for vendor-agnostic AI assistants, such as GitHub Copilot, Codex, or Claude.
