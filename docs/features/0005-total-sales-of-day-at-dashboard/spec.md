# Total sales of day at dashboard Spec

## Problem
provide to user of system a way of see total of sales at current day

## Scope
consuming api get /dashboard/sales/total-today for populate a label at dashboard page

## Domain
sales

## User Workflow
dashboard; sales

## API/Data Contracts
consuming api get /dashboard/sales/total-today;request:{}; success: {"total": 120.50}; error: 404 companyId not found, 400 bad request

## Requirements
- REQ-SALES-001: populate a dashboard`s label with value of total sales at current day

## UI States
- Loading: Show a loading message in the daily sales card while `/dashboard/sales/total-today` is pending.
- Error: Show a user-facing failure message with a retry action when the total cannot be loaded.
- Empty: Show `R$ 0,00` and an empty-state message when the returned total is zero.
- Success: Show the returned total as BRL currency with exactly two decimal places.

## Acceptance Criteria
- only data of current day
- response will be a object {"total": Number}
- sales value must be only 2 decimal places
- only data from user's companyId must be exposed for this endpoint
- a new variable will receive value from total parameter and this variable  must replace "R$ 5.350,32" label that currently is just used like a example at dashboard page

## Out Of Scope
- changes at last-5-days line chart
