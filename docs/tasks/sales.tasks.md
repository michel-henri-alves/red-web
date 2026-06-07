# Sales Domain Tasks (Frontend)

## Current Implementation Status

### ✅ Completed Features
- Sales listing page with date filtering
- Sales detail cards and row actions
- Backend pagination support via React Query
- Role-based access for sales page
- Payment flow supports mutually exclusive absolute or whole-percentage sale discounts

### 🔄 In Progress Features
- None currently

### 📋 Backlog Features

#### Sales UX
- [ ] Add advanced sales search by customer, code, and status
- [ ] Add summary cards for daily/monthly sales totals
- [ ] Add inline sale editing where allowed
- [ ] Add export/print sales receipts

#### Filtering and Reporting
- [ ] Add date range presets and quick filters
- [ ] Add export to CSV/XLSX for sales data
- [ ] Add charts for sales performance

#### Error and Load Handling
- [ ] Add skeleton loaders for sales list
- [ ] Add no-results state with guidance
- [ ] Add retry buttons for failed sales fetches

### Technical Debt

- [ ] Add tests for sales list filters and API handling
- [ ] Refactor sales list components for reuse
- [ ] Add consistent error handling for sales API failures
- [ ] Validate sales UI against backend sale schema
