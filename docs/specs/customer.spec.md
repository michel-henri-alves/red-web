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
- As a user, I can choose whether a new customer is Pessoa Física (PF) or Pessoa Jurídica (PJ)
- As a user, I can open a customer booklet to see pending accounts

## Data and API
- Fetch customers with `GET /customers?name={filter}&page={page}&limit={limit}`
- Create customer with `POST /customers`
- Update customer with `PUT /customers/{id}`
- Delete customer with `DELETE /customers/{id}`
- Customer payloads include `customerType` with `PF` or `PJ`
- PF customers use the default customer fields: smart code, name, nickname, phone, address, email, birth date, plus optional CPF, CEP, and phone 2
- PJ customers use enterprise fields: smart code, name, fantasy name, CNPJ, address, CEP, phone 1, phone 2, website, email, and optional nested contact `{ name, phone, email }`

## Behavior
- Customer list uses infinite scrolling or pagination patterns
- Creation and update actions invalidate customer cache
- Customer pages show audit and identification details
- Customer booklet is opened from customer context with customer data passed in state

## Validation
- Forms should validate required fields: name, email, phone
- PF creation validates the existing required default fields; CPF, CEP, and phone 2 are optional and CPF/CEP use Brazilian masks in the form
- PJ creation validates name, CNPJ, address, CEP, phone 1, and email; CNPJ/CEP use Brazilian masks in the form and contact name/phone/email are optional
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
