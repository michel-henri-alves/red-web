# Now customer have two differents types Spec

## Problem
system user must be able to create to different types of custgomer. Pessoa Fisica aka PF or Pessoa Juridica aka PJ

## Scope
Currently users can only create a standard type of user. Now we will provide possibility of select between PJ or PF with different configuration of attributes

## Impact Classification
- Impact: high
- Creates new domain/workflow: no
- Changes domain model: yes
- Changes public API contract: no
- Changes durable architecture/project memory: no
- Impacted canonical docs: `docs/specs/customer.spec.md`, `docs/tasks/customer.tasks.md`

This changes customer domain data assumptions by adding PF/PJ customer type selection and PJ enterprise/contact fields. Canonical docs updated: `docs/specs/customer.spec.md` and `docs/tasks/customer.tasks.md`.

## Domain
customer

## User Workflow
customer CRUD

## API/Data Contracts
- Customer creation and update continue to use the existing `POST /customers` and `PUT /customers/{id}` contracts through `src/shared/api/CustomerApi.js`.
- Submitted payloads include `customerType` with `PF` or `PJ`.
- PF payloads preserve the existing default customer fields and may include optional `cpf`, `cep`, and `phone2`.
- PJ payloads include `smartCode`, `name`, `fantasyName`, `cnpj`, `address`, `cep`, `phone`, `phone2`, `website`, `email`, and optional nested `contact: { name, phone, email }`.

## Requirements
- REQ-CUSTOMER-001: - User will select a type of customer Pessoa Fisica or Pessoa Juridica
- REQ-CUSTOMER-002: At creation form if Pessoa Fisica selected then default form will be shown with optional CPF, CEP, and phone 2 fields
- REQ-CUSTOMER-003: Case Pessoa Juridica was selected then will appers a form with the following parameters: smartCode, name*, fantasy name, cnpj*, address*, cep*(brazilian postal code), phone 1*, phone 2, website, email* (parameters with * are required) and an optional subobject named contact. Contact will be a person thats wil represents the customer enterprise. Your parameters will be name, phone and email, visually separated from the enterprise fields.
- REQ-CUSTOMER-004: only forms will be diferent, list page will be the same where each register will shown your own data

## UI States
- Loading: Customer list keeps existing loading state and form submit disables the save button while submitting.
- Error: List fetch failures keep the existing error state; create/update failures show toast feedback with formatted API cause.
- Empty: Customer list keeps the existing empty state for all customer types.
- Success: Successful PF or PJ create/update closes the modal and shows the existing success toast.

## Acceptance Criteria
- system users may be create customers PJ or PF
- at creation proccess, system users define which type of before goes to form
- list page is the same for all customer type

## Out Of Scope
- create differents pages for PF and PJ customers
