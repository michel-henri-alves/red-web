# Product Domain Specification (Frontend)

## Overview
The Product domain in `red-web` provides product browsing, creation, editing and selection functionality to support inventory management and POS workflows.

## Pages and Views
- **/products** — `ProductPage`
- **Product list** — `ProductList`
- **Product details** — `ProductDetails`
- **Product creation** — `ProductCreate`
- **Product form** — `ProductForm`
- **Product add to cart** — `ProductAddToCart`

## Key User Stories
- As a user, I can view a paginated list of products
- As a user, I can filter products by name
- As a user, I can create a new product
- As a user, I can edit existing products
- As a user, I can add a product to the cart from the POS workflow
- As a user, I can view product details inline in the product list

## Data and API
- Fetch products with `fetchAllProductsPaginated` (React Query infinite scroll)
- Backend endpoint: `GET /products?name={filter}&page={page}&limit={limit}`
- Create product: `POST /products`
- Update product: `PUT /products/{id}`
- Delete product: `DELETE /products/{id}`
- Fetch by smart code: `GET /products/by-smartcode/{smartCode}`

## Behavior
- List supports infinite scroll and incremental loading
- Filter input debounces user text before fetching
- Create and edit actions invalidate the products cache
- Products can be selected by smart code in POS flow
- Product form reuses shared field components and validation patterns

## Validation
- Product form data should match backend validation rules:
  - name required
  - priceForSale required
  - companyId present in request header / tenant context
- Frontend should display user-friendly validation feedback

## UI Patterns
- Use `ExpandableTable` for list rows with expandable details
- Provide `renderCreateButton` and `renderExpandedDiv` props for list components
- Reuse `FilterBar` for search input
- Show loading and error states clearly

## Integration Notes
- `ProductAddToCart` is used by POS modal search
- Product smart code lookup is essential for checkout flow
- Product item data must map to sales cart fields: name, price, quantity, unitOfMeasurement
