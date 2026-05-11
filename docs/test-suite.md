# SRHR Portal Test Suite

This document is the canonical test matrix for the SRHR Dashboard application.

It covers:
- Public Portal
- Logged-in Reporting Portal
- Data Capture
- Budget Analysis
- Reports Workspace
- Analysis Matrix
- Library
- AI Assistant
- Exports
- Security
- Roles
- API endpoints
- Responsive design

Approved application structure:

```text
Public Portal
Logged-in Portal:
  Dashboard
  Reports Workspace
  Data Capture
  Analysis
  Library
  Administration
```

Approved Stockfel design system:
- Forest Green
- Warm Gold
- Off-white background
- Manrope typography
- Rounded cards
- Clean spacing
- Uncluttered reporting screens

## 1. Test Strategy

### 1.1 Test Levels
- Unit Tests
- Feature Tests
- API Tests
- Integration Tests
- End-to-End Tests
- Security Tests
- Role-Based Access Tests
- Responsive UI Tests
- Visual Regression Tests
- Export Tests
- AI Safety Tests

### 1.2 Recommended Tools
- Backend: PHPUnit or Pest
- Frontend: Vitest + Testing Library
- E2E: Playwright
- Visual Regression: Playwright screenshots, Percy, or Chromatic
- API Testing: Pest, PHPUnit, Postman, or Newman
- Security Testing: OWASP ZAP, dependency scanning, custom permission tests

### 1.3 Required Seed Data
- Countries: Malawi, Zambia, Angola, South Africa, Mozambique, Zimbabwe
- Roles: Super Admin, Secretariat, Programme Manager, M&E Officer, Finance Officer, Country Reviewer, SRHR Researcher, Communications User, Partner / Donor Viewer
- Reporting Periods: April 2026, Q2 2026, Year 3
- Outcomes: Outcome 2 through Outcome 7
- Budget Lines: B11, B12, B13, B14, B16, B17

## 2. Public Portal

### 2.1 Public Home
- PUB-HOME-001 Open public home page and verify it loads.
- PUB-HOME-002 Verify menu items: Home, Dashboard, Countries, Reports, Stories, Resources, News & Events, About.
- PUB-HOME-003 Verify Login and Register actions are visible and clickable.
- PUB-HOME-004 Verify approved public metrics render.
- PUB-HOME-005 Verify latest reports show only approved public reports.
- PUB-HOME-006 Verify stories show only consent-cleared public stories.
- PUB-HOME-007 Verify draft, returned, restricted, and confidential records are hidden.

### 2.2 Public Dashboard
- PUB-DASH-001 Open Public Dashboard successfully.
- PUB-DASH-002 Filter by country, reporting period, outcome, and indicator status.
- PUB-DASH-003 Search public data and verify only matching public results appear.
- PUB-DASH-004 Open related public report detail.
- PUB-DASH-005 Verify internal record IDs are not enumerable or exposed.

### 2.3 Public Countries
- PUB-COUNTRY-001 Open Countries page and verify country cards load.
- PUB-COUNTRY-002 Open country detail page and verify overview loads.
- PUB-COUNTRY-003 Verify Reports, Indicators, Interventions, Stories, and Resources tabs.
- PUB-COUNTRY-004 Verify confidential country data remains hidden.
- PUB-COUNTRY-005 Verify country report filters work by year.

### 2.4 Public Reports Library
- PUB-REP-001 Open Reports Library successfully.
- PUB-REP-002 Filter reports by country, type, year, outcome, and language.
- PUB-REP-003 Search by title.
- PUB-REP-004 Open report detail.
- PUB-REP-005 Download public PDF where available.
- PUB-REP-006 Verify draft, returned, and restricted reports do not appear.

### 2.5 Public Auth
- PUB-AUTH-001 Open Register page.
- PUB-AUTH-002 Submit a valid registration and create a pending access request.
- PUB-AUTH-003 Submit invalid registration and show validation errors.
- PUB-AUTH-004 Request upload access and keep it pending until approval.
- PUB-AUTH-005 Verify registration does not auto-create an active user.
- PUB-AUTH-006 Open Login page.
- PUB-AUTH-007 Verify invalid credentials are rejected.
- PUB-AUTH-008 Verify rate limiting on repeated failed logins.
- PUB-AUTH-009 Verify forgot-password flow exists or is disabled intentionally.
- PUB-AUTH-010 Verify an approved user can enter the logged-in portal.

## 3. Authentication and Sessions
- AUTH-001 Login as SRHR Researcher, Finance Officer, and Admin.
- AUTH-002 Logout invalidates the session.
- AUTH-003 Accessing portal routes without login redirects to login.
- AUTH-004 Session timeout logs the user out.
- AUTH-005 Disabled users cannot log in.
- AUTH-006 Password reset tokens expire correctly.
- AUTH-007 Remember-me tokens behave securely.
- AUTH-008 `/api/auth/me` returns only the current authenticated user.

## 4. Role-Based Access

### 4.1 Navigation
- RBAC-NAV-001 Researcher sees Dashboard, Reports Workspace, Data Capture, Analysis, and Library.
- RBAC-NAV-002 Researcher does not see Administration.
- RBAC-NAV-003 Finance Officer sees budget-related actions.
- RBAC-NAV-004 Partner / Donor Viewer sees read-only data only.
- RBAC-NAV-005 Admin sees Administration.
- RBAC-NAV-006 Communications User sees only permitted publishing tools.
- RBAC-NAV-007 Country Reviewer sees assigned-country review tabs.
- RBAC-NAV-008 M&E Officer sees regional analysis and validation tools.

### 4.2 Backend Authorization
- RBAC-API-001 Cross-country report access is forbidden.
- RBAC-API-002 Unauthorised report approval is forbidden.
- RBAC-API-003 Donor upload actions are forbidden.
- RBAC-API-004 Finance-only budget actions require the correct role.
- RBAC-API-005 Admin role changes are allowed and audit logged.
- RBAC-API-006 Public requests to admin and budget APIs return 401 or 403.

## 5. Logged-in Layout and Navigation
- LAYOUT-001 Sidebar renders the six main sections only.
- LAYOUT-002 Sidebar expands and collapses correctly.
- LAYOUT-003 Focus mode hides the sidebar and expands workspace.
- LAYOUT-004 Exit focus mode restores the normal layout.
- LAYOUT-005 Top bar renders period, country, search, notifications, Add/Upload, AI, and profile.
- LAYOUT-006 Country and period selectors update the current view.
- LAYOUT-007 Global search opens.
- LAYOUT-008 Notifications panel opens.

## 6. Dashboard
- DASH-001 Dashboard loads by role.
- DASH-002 Summary cards render reports, indicators, evidence, budget, and stories.
- DASH-003 Quick actions change by role.
- DASH-004 Widgets can be added, removed, reordered, resized, and persisted.
- DASH-005 Budget utilisation links to Budget Analysis.
- DASH-006 Dashboard filters by country and period.
- DASH-007 Dashboard exports to PDF and Excel.
- DASH-008 AI summary returns editable output.
- DASH-009 Donor dashboard remains read-only.

## 7. Global Add / Upload
- ADD-001 Clicking `+ Add / Upload` opens the action panel.
- ADD-002 Reporting Indicators is prominent.
- ADD-003 Monthly report wizard starts.
- ADD-004 Annual report wizard starts.
- ADD-005 Evidence upload opens.
- ADD-006 Budget Excel upload opens.
- ADD-007 Add Activity opens.
- ADD-008 Add Intervention opens.
- ADD-009 Add Story opens.
- ADD-010 Unauthorised actions are hidden.

## 8. Data Capture
- CAP-001 Data Capture landing page loads.
- CAP-002 Capture cards are visible and usable.
- CAP-003 Start Report opens the correct wizard.
- CAP-004 Upload Evidence opens the evidence flow.
- CAP-005 Upload Budget Excel opens the budget wizard.
- CAP-006 Add Activity opens the activity form.
- CAP-007 Add Intervention opens the intervention form.
- CAP-008 Add Story opens the story form.
- CAP-009 Country dropdown is restricted by role.
- CAP-010 Drafts can be saved and restored.

### 8.1 Indicator Entry
- IND-MAN-001 Manual entry form loads.
- IND-MAN-002 Valid indicator result saves successfully.
- IND-MAN-003 Missing country, period, status, or indicator code shows validation errors.
- IND-MAN-004 Evidence can be linked.
- IND-MAN-005 Draft save works.
- IND-MAN-006 Submit changes status to submitted.
- IND-MAN-007 Duplicate indicators in the same period are warned or blocked.

### 8.2 Excel / Paste Upload
- IND-XLS-001 Valid Excel upload is accepted.
- IND-XLS-002 Uploaded rows are previewed and mapped.
- IND-XLS-003 Validation summary shows accepted, warning, and rejected rows.
- IND-XLS-004 Unknown codes, invalid statuses, and missing fields are rejected.
- IND-XLS-005 Formula injection and oversized files are rejected or neutralised.
- IND-XLS-006 Confirming import saves indicator results.

## 9. Monthly and Annual Reports
- REP-MON-001 Monthly report draft is created.
- REP-MON-002 All core sections can be completed and saved.
- REP-MON-003 Validation blocks submission when required fields are missing.
- REP-MON-004 Complete monthly report can be submitted and exported.
- REP-ANN-001 Annual report draft is created.
- REP-ANN-002 Narrative, achievements, challenges, mitigation, lessons learnt, and annexes save correctly.
- REP-ANN-003 Annual report validates and submits correctly.
- REP-ANN-004 AI summary returns editable output.

## 10. Reports Workspace
- RW-001 Reports Workspace loads.
- RW-002 Role-specific tabs appear correctly.
- RW-003 Drafts can be continued.
- RW-004 Submitted reports can be reviewed.
- RW-005 Returned reports can be corrected and resubmitted.
- RW-006 Approved reports can be locked and published.
- RW-007 Generated and published report versions are handled correctly.
- RW-008 Export actions work where supported.

## 11. Review Workflow
- REV-001 Reviewer sees assigned reports.
- REV-002 Reviewer can preview evidence.
- REV-003 Reviewer can approve, return, and comment.
- REV-004 Returned comments are visible to the researcher.
- REV-005 Approval and return actions create audit logs.
- REV-006 Approved reports become locked when finalised.

## 12. Evidence Library
- EVD-001 Upload PDF and image evidence successfully.
- EVD-002 Invalid executables and oversized files are rejected.
- EVD-003 Public / confidential visibility is enforced.
- EVD-004 Evidence can be linked to reports, indicators, and activities.
- EVD-005 Preview and download behave correctly.
- EVD-006 Signed URLs expire and are denied after expiry.
- EVD-007 Verify and reject actions update status and audit logs.

## 13. Activities and Interventions
- ACT-001 Add activity and save it.
- ACT-002 Validation catches missing dates and invalid links.
- ACT-003 Activity can link to outcomes, indicators, and evidence.
- INT-001 Add intervention and save it.
- INT-002 Intervention validates required fields and links.
- INT-003 Approved public visibility follows the intended approval flow.

## 14. Stories of Change
- STORY-001 Add story draft and save it.
- STORY-002 Upload photo and supporting media.
- STORY-003 Consent gate blocks public publication without approval.
- STORY-004 Approved internal and public statuses behave correctly.
- STORY-005 Published stories appear on the public portal.
- STORY-006 AI summary returns editable draft text.

## 15. Budget Analysis

### 15.1 Upload
- BUD-UP-001 Budget Excel wizard opens for Finance Officer.
- BUD-UP-002 Valid budget files upload and preview correctly.
- BUD-UP-003 Column mapping and validation summary work.
- BUD-UP-004 Missing budget lines, invalid activities, invalid countries, and negative values are rejected.
- BUD-UP-005 Overspend, duplicate rows, and missing variance explanation are flagged.
- BUD-UP-006 Confirming import persists budget entries.

### 15.2 Calculations
- BUD-CALC-001 Utilisation, balance, spending rate, and remaining rate are correct.
- BUD-CALC-002 Zero-budget calculations do not crash.
- BUD-CALC-003 Currency and percentage formatting is consistent.

### 15.3 Tabs
- BUD-ANA-001 Overview, Activities, Countries, No-Spend, Variance, Reconciliation, Priority Actions, and AI Insights load.
- BUD-ANA-002 Filters update results.
- BUD-ANA-003 Export PDF and Excel work.

### 15.4 No-Spend and Reconciliation
- BUD-NS-001 True no-spend and in-progress no-spend states are separated.
- BUD-NS-002 Follow-up actions can be assigned and resolved.
- BUD-REC-001 Matched and mismatched totals are classified correctly.
- BUD-REC-002 Differences, explanations, and resolved states persist.

## 16. Analysis and Matrix Builder
- ANA-001 Analysis page loads.
- ANA-002 Visual Explorer updates charts by country and outcome.
- ANA-003 Matrix Builder generates a matrix from selected dimensions.
- ANA-004 Matrix can be converted to chart.
- ANA-005 Matrix exports to Excel and PDF.
- ANA-006 AI explanation returns editable text.
- ANA-007 Unauthorized users cannot save restricted views.

## 17. Library
- LIB-001 Library loads.
- LIB-002 Evidence, Stories, Resources, and Media tabs render.
- LIB-003 Public Publishing is visible only to authorised users.
- LIB-004 Approved content can be published to the public site.
- LIB-005 Unapproved content cannot be published.
- LIB-006 Resources can be marked private and downloaded when permitted.

## 18. Administration
- ADMIN-001 Admin opens Administration.
- ADMIN-002 Non-admin access is denied.
- ADMIN-003 Admin can create users and roles.
- ADMIN-004 Admin can assign roles, countries, and suspend users.
- ADMIN-005 Access requests can be approved or rejected.
- ADMIN-006 Countries, indicators, templates, and configuration can be managed.
- ADMIN-007 Audit logs are visible and protected from editing.

## 19. AI Assistant
- AI-001 AI side panel opens.
- AI-002 Dashboard, chart, country, and variance summaries can be requested.
- AI-003 Report draft and story summary generation work.
- AI-004 AI only uses authorised context.
- AI-005 AI cannot approve, publish, or change system data directly.
- AI-006 AI requests are audit logged.

## 20. Export Tests
- EXP-001 Dashboard, report, budget, matrix, and evidence exports generate files.
- EXP-002 Exports include filter metadata where appropriate.
- EXP-003 Permissions are respected.
- EXP-004 Public exports exclude confidential data.
- EXP-005 Signed export URLs expire correctly.
- EXP-006 Export completion triggers notification and audit logs.

## 21. Notifications
- NOTIF-001 Report submitted, returned, approved, and evidence-requested notifications are delivered.
- NOTIF-002 Access request submitted and approved notifications are delivered.
- NOTIF-003 Export completion and deadline reminders are delivered.
- NOTIF-004 Notification read state updates correctly.

## 22. Security
- SEC-PUB-001 Public APIs never return draft, returned, or confidential records.
- SEC-UP-001 Executables, invalid MIME types, oversized uploads, and path traversal filenames are rejected or sanitised.
- SEC-INJ-001 SQL injection, stored XSS, CSV formula injection, and command injection are handled safely.
- SEC-API-001 Missing auth returns 401.
- SEC-API-002 Missing permission returns 403.
- SEC-API-003 Object-level access is enforced.
- SEC-API-004 Rate limiting and pagination are enforced where needed.

## 23. Audit Logs
- AUD-001 Login success and failure create audit logs.
- AUD-002 Role, report, evidence, indicator, budget, public content, export, and AI actions are logged.
- AUD-003 Audit entries contain user, action, record, and timestamp.

## 24. Responsive Design
Test each major page at:

```text
Desktop: 1440px
Laptop: 1280px
Tablet: 768px
Mobile: 390px
Small mobile: 320px
```

- RESP-001 Public pages stack cleanly on mobile.
- RESP-002 Logged-in sidebar collapses or hides correctly.
- RESP-003 Data Capture, Budget, Analysis, and Reports remain usable.
- RESP-004 Tables and charts avoid unwanted horizontal overflow.
- RESP-005 AI panel and forms adapt cleanly to mobile.

## 25. Visual Regression
- VIS-001 Public Home matches the approved design.
- VIS-002 Public Dashboard matches the approved design.
- VIS-003 Reports Library matches the approved design.
- VIS-004 Logged-in Dashboard, Data Capture, Reports Workspace, Budget, Analysis, Library, and Administration match the approved design.
- VIS-005 Build fails if visual differences exceed the approved threshold.

## 26. Database Integrity
- DB-001 Report-country and indicator-period relationships are valid.
- DB-002 Evidence links are valid.
- DB-003 Users have roles and country assignments.
- DB-004 Soft delete and status history behave correctly.
- DB-005 Deleting related records is handled safely.

## 27. API Endpoint Matrix

### Public
- `/api/public/dashboard`
- `/api/public/countries`
- `/api/public/countries/{slug}`
- `/api/public/reports`
- `/api/public/reports/{slug}`
- `/api/public/stories`
- `/api/public/resources`
- `/api/public/news`
- `/api/public/events`
- `/api/public/register`

### Auth
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/password-reset`
- `/api/auth/register-request`

### Portal
- `/api/portal/dashboard`
- `/api/portal/reports`
- `/api/portal/indicators`
- `/api/portal/indicators/metadata`
- `/api/portal/indicators/validate`
- `/api/portal/indicators/submit`
- `/api/portal/evidence`
- `/api/portal/evidence/metadata`

### Budget
- `/api/budget/overview`
- `/api/budget/activities`
- `/api/budget/countries`
- `/api/budget/no-spend`
- `/api/budget/variance`
- `/api/budget/reconciliation`
- `/api/budget/priority-actions`

### Admin
- `/api/admin/users`
- `/api/admin/roles`
- `/api/admin/access-requests`
- `/api/admin/notifications`
- `/api/admin/audit-logs`

### AI / Exports
- `/api/ai/dashboard/summary`
- `/api/ai/report/draft`
- `/api/ai/budget/summary`
- `/api/ai/analysis/explain`
- `/api/export/dashboard/pdf`
- `/api/export/dashboard/excel`
- `/api/export/report/pdf`
- `/api/export/report/excel`
- `/api/export/budget/pdf`
- `/api/export/budget/excel`

## 28. Critical E2E Flows
- E2E-001 Public visitor finds and downloads a report.
- E2E-002 User registration is approved by admin and the user can log in.
- E2E-003 Researcher submits a monthly report with indicators, evidence, and activity.
- E2E-004 Reviewer returns and then approves the corrected report.
- E2E-005 Finance Officer uploads budget data, reviews analysis, and exports results.
- E2E-006 Communications user publishes approved content to the public site.
- E2E-007 M&E Officer builds a matrix and exports it.

## 29. Final Readiness Gate
The application is not ready unless all of these pass:
- Public pages load.
- Public portal exposes only public-approved data.
- Login and registration work.
- Role-based access works on frontend and backend.
- Users can input data.
- Users can upload indicators manually and through Excel.
- Users can upload evidence.
- Users can upload budget data.
- Budget analysis calculates correctly.
- Reports can be created, submitted, reviewed, approved, and exported.
- AI assistant is permission-aware and draft-only.
- PDF and Excel exports work.
- Audit logs are created.
- Security tests pass.
- Responsive tests pass.
- Visual regression tests pass.
- No unapproved menu items or screens exist.
- Designs match the approved Stockfel design system.

Final status options:
- READY
- READY WITH MINOR FIXES
- NOT READY

