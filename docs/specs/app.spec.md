# Frontend Application Specification

## Overview
`red-web` is the frontend application for the RED multi-tenant commerce platform. It consumes backend APIs exposed by `red-backend` and provides a browser interface for sales, products, customers, sectors, users, POS and payment workflows.

## Architecture
- **React 19** with **Vite** as build tool
- **React Router v7** for route-based navigation
- **React Query** for server state management and data fetching
- **Axios** for HTTP communication with backend APIs
- **Tailwind CSS** for styling
- **i18next** for localization
- **React Hook Form** for form handling

## Core App Flows

### Authentication
- Login page at `/login`
- Public route for unauthenticated access
- Private routes wrapped by `PrivateRoute`
- Role-based access controlled by `RoleRoute`
- User token stored in `localStorage`
- Axios attaches JWT token and tenant headers to requests

### Main Application Pages
- `/` — Home dashboard
- `/products` — Product list and management
- `/customers` — Customer list and management
- `/sectors` — Sector list and management
- `/sales` — Sales list and details
- `/pos` — Point of Sale workflow
- `/payment` — Payment finalization page
- `/booklet` — Customer booklet / pending accounts
- `/users` — User management
- `/unauthorized` — Unauthorized access page

## Data Integration
- Uses backend APIs for CRUD and search operations
- Domain APIs are centralized under `src/shared/api`
- Product, customer, sector, sales, pending, and user APIs mirror backend routes
- Frontend handles pagination, filtering, and incremental loading

## State Management
- Server state is managed with **React Query**
- Local application state is managed with React hooks and custom hooks
- Shopping cart state is managed by `useCart`
- Form state is managed by `react-hook-form`

## UI Component Patterns
- Shared components under `src/components`
- Domain-specific pages under `src/pages/{domain}`
- Page composition via render props for lists and expanded details
- Modular reusable components for tables, modals, forms, and filters

## Localization
- `react-i18next` provides translated text keys
- UI uses translated labels for pages, buttons, notifications, and validations

## Error Handling
- Axios interceptor redirects to login on `401`
- React Query handles loading and error states
- Toast notifications provide user feedback

## Build and Deployment
- Development: `npm run dev`
- Production build: `npm run build`
- Preview: `npm run preview`

## Frontend Domain Coverage
- Products
- Customers
- Sectors
- Sales
- POS / Payment
- Users
- Customer Booklet (pending accounts)

## Integration Notes
- The frontend relies on backend domain behavior defined in `red-backend` SDD
- Backend endpoints are expected to support authentication and company scoping
- Frontend route permissions should reflect backend authorization rules
