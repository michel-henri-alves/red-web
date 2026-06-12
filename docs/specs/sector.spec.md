# Sector Domain Specification (Frontend)

## Overview
The Sector domain in `red-web` supports management of sector records used for product categorization and business organization.

## Pages and Views
- **/sectors** — `SectorPage`
- **Sector list** — `SectorList`
- **Sector details** — `SectorDetails`
- **Sector creation** — `SectorCreate`
- **Sector form** — `SectorForm`

## Key User Stories
- As a user, I can view a paginated list of sectors
- As a user, I can filter sectors by name
- As a user, I can create and edit sectors
- As a user, I can optionally maintain additional sector data: type, address, CEP, and contact details
- As a user, I can delete sectors

## Data and API
- Fetch sectors with `GET /sectors?name={filter}&page={page}&limit={limit}`
- Create sector with `POST /sectors`
- Update sector with `PUT /sectors/{id}`
- Delete sector with `DELETE /sectors/{id}`
- Sector create/update payloads may include optional `type`, `address`, `cep`, and nested `contact` fields.
- `contact` may include optional `name`, `phone`, and `email` string fields.

## Behavior
- Sector list supports filtering and list rendering
- Creation/edit forms follow shared form patterns
- Sector names are displayed as primary identifiers
- Optional additional fields are grouped in the sector form under a collapsible `Additional data` panel
- Sector details display optional additional fields only when each field is non-empty/non-null
- Sector API calls are made through `SectorApi`

## Validation
- Frontend forms should require sector name
- Additional sector fields are optional
- Frontend validation should align with backend uniqueness and smarCode rules
- Show error feedback for invalid creation/update operations

## UI Patterns
- Use `ExpandableTable` or list rows with details
- Provide create button for sector creation
- Keep sector UI consistent with products and customers

## Integration Notes
- Sector selection can be used for future product categorization
- Sector domain is currently a lightweight management area in the frontend
