# RED Frontend Context

`red-web` is the React frontend for the RED multi-tenant commerce platform.

## Architecture
- React 19 with Vite
- React Router v7 for navigation
- React Query for async data fetching
- Axios configured with auth and tenant headers
- Tailwind CSS for styling
- i18next for internationalization
- React Hook Form for form handling

## Core Domains
- Products (`/products`)
- Customers (`/customers`)
- Sectors (`/sectors`)
- Sales (`/sales`)
- POS (`/pos`)
- Payment (`/payment`)
- Booklet / pending accounts (`/booklet`)
- Users (`/users`)

## Key Patterns
- `src/pages/` contains page-level components
- `src/shared/api/` contains backend API wrappers
- `src/shared/hooks/` contains data hooks using React Query
- `src/components/` contains reusable UI components
- `src/hooks/` contains application-specific hooks like cart and keyboard shortcuts

## Important Files
- `src/RouteConfig.jsx` — route and access control definitions
- `src/PrivateRoute.jsx` — private authentication wrapper
- `src/RoleRoute.jsx` — role-based access control wrapper
- `src/shared/api/*Api.js` — API clients for backend entities
- `src/pages/pos/PosPage.jsx` — POS workflow and barcode scanning
- `src/pages/sales/payment/PaymentPage.jsx` — payment finalization
- `src/pages/sales/booklet/BookletPage.jsx` — customer pending account view

## Integration Notes
- Frontend UX depends on backend domain APIs and company scoping.
- Auth tokens and tenant context are required for API calls.
- Route authorization must align with backend roles and permissions.

## AI Usage
- Use this context when creating or modifying frontend code.
- Keep solutions generic and portable across AI assistants.
- Avoid using proprietary or product-specific assumptions.
