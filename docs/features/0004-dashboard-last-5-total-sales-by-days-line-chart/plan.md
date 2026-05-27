# Dashboard - last 5 total sales by days line chart Plan

## Files
- `src/components/Dashboard.jsx`
- `src/components/SalesChart.jsx`
- `src/components/Dashboard.test.jsx`
- `src/shared/api/DashboardApi.js` (new)
- `src/shared/hooks/useDashboard.js` (new)

## Context Bundle
- `docs/sdd/constitution.md`
- `docs/features/0004-dashboard-last-5-total-sales-by-days-line-chart/spec.md`
- `docs/features/0004-dashboard-last-5-total-sales-by-days-line-chart/tasks.md`
- `docs/specs/sales.spec.md`
- `docs/tasks/sales.tasks.md`

## Verification
- `npm run sdd:check`
- `npm run lint`
- `npm run build`
- `npm run test`

## Risks
- leak data from others companyIds
