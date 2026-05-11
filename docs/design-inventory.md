# SRHR Design Inventory

The supplied design source of truth is under `designs/`. The requested `designs/mobile` and `designs/web` folders are not present in this repository; the available design references are grouped as `designs/Portal` for public-facing screens and `designs/LoggedinScreens` for authenticated portal screens.

## Design System

- `designs/Portal/DESIGN.md`
- `designs/Portal/stockfel_design_system/DESIGN.md`
- `designs/LoggedinScreens/stockfel_design_system/DESIGN.md`

Core extracted system:

- Typography: Manrope, with 40px display, 32px h1, 24px h2, 20px h3, 18px body-lg, 16px body-md, 14px body-sm, and 12px label-md.
- Primary colors: Forest Green `#00170d`, Warm Gold `#fed65b`, off-white surface `#fbf9f8`, low surface `#f5f3f3`, outline variant `#c1c8c2`.
- Shape: 8px component radius, 12px to 16px cards, fully rounded pills.
- Spacing: 8px base rhythm with 4px, 12px, 24px, 40px, and 64px steps.
- Depth: low-contrast borders and ambient green-tinted shadows.

## Authenticated Portal Screens

- `analysis_matrix_builder`
- `analysis_srhr_portal`
- `audit_security_logs`
- `budget_analysis_activities`
- `budget_analysis_ai_insights`
- `budget_analysis_countries`
- `budget_analysis_country_line_breakdown`
- `budget_analysis_no_spend`
- `budget_analysis_overview`
- `budget_analysis_priority_actions`
- `budget_analysis_reconciliation`
- `budget_analysis_variance`
- `comparison_insights_reporting`
- `custom_report_builder`
- `dashboard_srhr_portal`
- `data_capture_srhr_portal`
- `evidence_library_srhr_portal`
- `integrations_api_settings`
- `public_publishing_library`
- `refined_ai_insights_panel`
- `report_automation_settings`
- `report_live_preview`
- `report_sharing_permissions`
- `reports_workspace_srhr_portal`
- `resources_knowledge_hub_library`
- `saved_reports_library`
- `stories_of_change_library`
- `system_configuration`
- `upload_evidence_details_linking`
- `upload_indicators_choose_type`
- `upload_indicators_data_entry`
- `upload_indicators_manual_entry`
- `upload_indicators_select_period`
- `upload_indicators_validation`
- `user_access_management`

## Public Portal Screens

- `about_page`
- `about_us`
- `about_us_refined_regional_reach_1`
- `about_us_refined_regional_reach_2`
- `countries_page`
- `country_detail_indicators_tab`
- `country_detail_interventions_tab`
- `country_detail_overview`
- `country_detail_reports_tab`
- `country_detail_resources_tab`
- `country_detail_stories_tab`
- `data_dashboard_regional_overview`
- `event_registration`
- `home_page`
- `legislative_tracking_regional_progress`
- `login_register`
- `news_events`
- `public_dashboard`
- `reports_library`

## Current Screen Mapping

- `/portal/reports/builder` maps to `designs/LoggedinScreens/custom_report_builder`.
- Properties drawer behavior extends the closest authenticated pattern from `report_live_preview`, while preserving the `custom_report_builder` canvas structure.
