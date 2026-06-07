# Creating issues domain Spec

## Problem
allow access to issue domain provenient from backend

## Scope
getting issue domain from backend and creating forms (create and update), paginated lists, register details, filter by workflow filter (follow project standard) and finally access to this pages from a menu sidebar item

## Domain
issue

## Impact Classification
- Impact: high
- Creates new domain/workflow: yes
- Changes domain model: yes
- Changes public API contract: no
- Changes durable architecture/project memory: no
- Impacted canonical docs: `docs/specs/issue.spec.md`, `docs/tasks/issue.tasks.md`

## User Workflow
Authenticated users can open Issues from the sidebar, review a paginated issue list, filter issues by internal id or workflow, expand an issue to inspect details, and create, update, or delete issue records through modal forms.

## API/Data Contracts
### POST /issuesRequires 
authentication.Request:
{  
    "workflow": "string",  
    "details": "string",  
    "risk": "string",  
    "sponsor": "string",  
    "metadata": "string or object"}
    
    Success:
    {  
        "message": "issue.saved.successfully"
    }
        
    Errors:
    - 400 validation.error
    - 401 unauthorized
    - 404 companyid.not.found
    
### GET /issues/by-internalid/{internalid}Requires authentication.
Request:{},
Path variable:
{  
    "internalId": "string"
}
Success:
{  
    "data": "Issues",
    "total": "number",  
    "page": "number",  
    "totalPages": "number"
}
Errors:
- 400 validation.error
- 401 unauthorized
- 404 companyid.not.found

### GET /issuesRequires 
authentication.
Request:{},

Query parameters:
{  
    "internalId": "string",  
    "page": "number",  
    "limit": "number"
}

Success:
{  
    "data": "array of Issues",  
    "total": "number",  
    "page": "number",  
    "totalPages": "number"
}

Errors:
- 400 validation.error
- 401 unauthorized
- 404 companyid.not.found

### PUT /issues/{id}
Requires authentication.

Request:
{  
    "workflow": "string",  
    "details": "string",  
    "risk": "string",  
    "status": "string",  
    "sponsor": "string",  
    "metadata": "string or object"
}

Path variable:
{  
    "id": "string"
}

Success:
{  
    "message": "issue.updated.successfully"
}

Errors:
- 400 validation.error
- 401 unauthorized
- 404 companyid.not.found
- 404 resource.not.found

### DELETE /issues/{id}Requires authentication.

Request:{}
Path variable:
{  
    "id": "string"
}

Success:
{  
    "message": "issue.updated.successfully"
}
Errors:
- 400 validation.error
- 401 unauthorized
- 404 companyid.not.found
- 404 resource.not.found


## Requirements
- REQ-ISSUE-001: add a reference of Issues at sidebar menu
- REQ-ISSUE-002: following actual project standards list register (Issues) highlighting internalId + workflow field data at register title
- REQ-ISSUE-003: add filter by internalId or workflow field value
- REQ-ISSUE-004: add create and update form using project actual standard
- REQ-ISSUE-005: Issue details and edit forms must support backend metadata returned as a structured object without rendering raw objects as React children

## UI States
- Loading: show the project loading message while issue pages are fetching or fetching more pages.
- Error: show the project error message on list fetch failure and toast API failure causes for create, update, and delete.
- Empty: show an empty issues message when the backend returns no records.
- Success: show project-standard success toasts after create, update, and delete and refresh issue lists.

## Acceptance Criteria
- pagination with actual project standard
- each action could be  validated and will return a response message using project standard
- must be created/updated internationalization for correctly translation english terms for portuguese(pt/br)
- structured metadata objects must be displayed as readable text in Issue details
- existing structured metadata must be serialized before being passed to the edit form text input

## Out Of Scope
- Issue workflow/status enumerations are not introduced until the backend publishes fixed values.
- Dedicated issue analytics, assignment, and attachments are out of scope.
