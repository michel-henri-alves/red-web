# User Delta Specification

## Overview
Add delete and update components, pages, hooks and apis for user's domain 

## Current State (Before)
- User's domain don't had delete and update feature

## Target State (After)
- We will be able to delete and update users registers by react interface

## Required Changes

### API Client
- Update ./shared/api/UsersApi.js with required changes for support this features

### Hooks
- Update ./shared/hooks/useUsers.js with required changes for support this features

### Pages
- Add or update pages for users to support deletion and update feature. We can use product's domain as an example 


## Out of Scope
- Changes in others domains

## Acceptance Criteria

### Functional Tests
- ✅ Can delete users
- ✅ Can update users with same rules of creation

### Performance
- ✅ UI/UX clean, modern and performatic
- ✅ Follow best practices
- ✅ Use the same UI/UX used for customers 
