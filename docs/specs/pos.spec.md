# POS Domain Specification (Frontend)

## Overview
The POS domain supports the point-of-sale checkout workflow, including barcode scanning, cart management, and navigation to payment.

## Pages and Views
- **/pos** — `PosPage`
- **Cart table** — `CartTable`
- **Product search modal** — `ProductList` with `ProductAddToCart`
- **Delete item modal** — `DeleteItem`
- **Payment navigation** — transition to `/payment`

## Key User Stories
- As a cashier, I can scan product barcodes into the cart
- As a cashier, I can manually add products from the search modal
- As a cashier, I can remove items from the cart
- As a cashier, I can view cart total and item count
- As a cashier, I can proceed to payment when the cart is not empty

## Behavior
- Barcode scanner input is auto-focused and listens for scans
- F1–F7 keyboard shortcuts support quick actions
- Products are fetched by smart code from the backend
- A beep plays when products are added
- Search modal allows manual product selection
- Cart state is managed by `useCart`
- Payment only opens when total > 0

## Data and API
- Backend product lookup: `GET /products/by-smartcode/{smartCode}`
- Product data from backend used to populate cart item fields: name, price, measure
- Payment page receives cart total and products via router state or query params

## Validation
- Prevent checkout if cart is empty
- Validate product lookup and handle missing products
- Display errors for backend request failures

## UI Patterns
- Use `ActionStrip` for POS actions
- Use `Modal` for search and deletion confirmation
- Use `CartTable` for line item display
- Keep POS interface keyboard-friendly and fast

## Integration Notes
- POS is the primary entry point for sale creation
- Payment page finalizes the sale and communicates with `/sales` API
- POS integrates with product domain and backend product smart code lookup
