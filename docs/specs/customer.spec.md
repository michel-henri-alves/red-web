# Customer Domain Specification (Frontend)

## Overview
The Customer domain in `red-web` supports customer listing, detail view, creation, and customer-specific booklets with pending account information.

## Pages and Views
- **/customers** — `CustomerPage`
- **Customer list** — `CustomerList`
- **Customer details** — `CustomerDetails`
- **Customer creation** — `CustomerCreate`
- **Customer form** — `CustomerForm`
- **Customer booklet** — `BookletPage`

## Key User Stories
- As a user, I can view a paginated list of customers
- As a user, I can filter customers by name
- As a user, I can create and edit customer records
- As a user, I can open a customer booklet to see pending accounts

## Data and API
- Fetch customers with `GET /customers?name={filter}&page={page}&limit={limit}`
- Create customer with `POST /customers`
- Update customer with `PUT /customers/{id}`
- Delete customer with `DELETE /customers/{id}`

## Behavior
- Customer list uses infinite scrolling or pagination patterns
- Creation and update actions invalidate customer cache
- Customer pages show audit and identification details
- Customer booklet is opened from customer context with customer data passed in state

## Validation
- Forms should validate required fields: name, email, phone
- Frontend validation should align with backend rules for uniqueness and formats
- Friendly user feedback on validation errors is required

## UI Patterns
- Use shared `FilterBar` for list filtering
- Use modals or inline expansion for customer details
- Maintain responsive layout for list/detail pages

## Integration Notes
- Customer booklet uses `customer._id` and `customer.name` from selected customer
- Booklet pages should support pending account operations
- Customer domain is integrated with sales and pending feature sets
