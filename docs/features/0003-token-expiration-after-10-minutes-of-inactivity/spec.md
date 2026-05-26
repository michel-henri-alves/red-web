# Token expiration after 10 minutes of inactivity Spec

## Problem
Currently the token expires after 5 minutes even if the user still actively using the system. This affects user experience cause user is logout during execute some process when reach 5 minutes since token was created

## Scope
User must be logout just after 10 minutes of inactivity

## Domain
user

## User Workflow
login; logout

## API/Data Contracts
`POST /users/login` returns an access token that expires after 10 minutes;Every successful authenticated API invocation returns a refreshed access token in the `X-Access-Token` response header;Clients must replace the current bearer token with the latest `X-Access-Token` header value after authenticated responses;

## Requirements
- REQ-USER-001: users must be logged to access system web and apis, after 10 minutes of inactivity token must be invalid
- REQ-USER-002: while accessing any apis within 10 minutes timeshift, users token must be refresh

## UI States
- Loading: Define if the feature uses async data.
- Error: Define user-facing feedback for failures.
- Empty: Define behavior when there is no data.
- Success: Define the expected completed state.

## Acceptance Criteria
- not logged user cannot access the system
- users inactivited for 10 minutes are logout
- users logged that accessed any other api within 10 minutes after login must keep access granted
- users logged that accessed any other api within 10 minutes after access any other api must keep access granted

## Out Of Scope
- No explicit out-of-scope items yet.
