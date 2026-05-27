# Dashboard - last 5 total sales by days line chart Spec

## Problem
provide to user of system a way of follow sales evolution in the last 5 days

## Scope
Consuming api get /dashboard/sales/last-5-days for populate line chart 'Sales Last 5 Days' at dashboard page

## Domain
sales

## User Workflow
dashboard

## API/Data Contracts
consuming api get /dashboard/sales/last-5-days;request:{}; success: [{"day": "dd/MM", sales: 120.50}]; error: 404 companyId not found, 400 bad request

## Requirements
- REQ-SALES-001: provide a line chart with total sales of last 5 days for give to system user possibility to follow sales evolution per days

## UI States
- Loading: Show a fixed-height dashboard panel message while `/dashboard/sales/last-5-days` is loading.
- Error: Show a user-facing failure message and a retry action when the request fails.
- Empty: Show an empty-state message when the endpoint returns no sales rows.
- Success: Show the "Sales Last 5 Days" line chart populated by the endpoint response.

## Acceptance Criteria
- just get data for last 5 days
- starting from previous day
- response will be a array of object {"day": "string", sales: "number"}
- days must be day/month format (dd/MM)
- sales value must be only 2 decimal places
- only data from user's companyId must be exposed for this endpoint

## Out Of Scope
- No explicit out-of-scope items yet.
