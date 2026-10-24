# Changelog

All notable changes to Chatterra are documented in this file.  history.

## 2026-10

### Changed
- Updated the mobile navigation to display the user's profile picture instead of their username, preventing long usernames from disrupting the top-bar layout.

### Fixed
- Resolved linting and TypeScript issues across the project.

## 2026-09

### Added
- Added a global search bar for searching posts, users, and communities.
- Added a categorized search-results view displaying up to three results per category, with options to view more results in the corresponding category tab.
- Added automatic linkification for URLs, user mentions, and hashtags in posts and comments.
- Added skeleton loading states to improve the loading experience.

### Changed
- Updated public profile pages and profile-related UI.
- Added an ESLint cleanup and formatting pass.
- Updated project documentation and the README.

### Fixed
- Resolved import errors and TypeScript issues.

### Developer Experience
- Added a GitHub Actions CI workflow that runs on pushes and pull requests targeting `main`. The workflow installs dependencies, runs ESLint, and builds the project.
- Added Dependabot configuration for dependency updates.

## 2026-08

### Added
- Added support for uploading multiple images to posts.
- Added Vercel deployment configuration.
- Added a project license and related repository metadata.

### Changed
- Improved search-bar layout and navigation.
- Added image fallback support.
- Refined application responsiveness and UI presentation.

## 2026-06

### Added
- Added an API keepalive endpoint and scheduled cron job to periodically contact the hosted service and reduce inactivity-related interruptions.

## 2026-05

### Added
- Added community search to the community discovery page.
- Added community creation, browsing, display, and management functionality, including administrative tools for adding communities and assigning users to them.
- Added community membership features, including joining communities and viewing member counts.
- Enabled users to publish posts within communities and interact with community posts through likes and comments.

### Changed
- Improved comment rendering and interactions.
- Updated public profile pages and profile-picture components.
- Added Vercel Analytics and Insights.

## 2026-04

### Added
- Added toast notifications for errors, including attempts by unauthenticated users to like posts.
- Added a dedicated mobile navigation component to simplify navigation logic.

### Changed
- Improved like and share interactions, enabling users to like posts directly from the home page rather than relying on the individual post page.
- Refined profile-page organization and community-related UI.
- Improved mobile-menu interactions and scrolling usability.

## 2026-03

### Added
- Added community pages and community-focused browsing.
- Added community member seeding and functionality for managing community membership.
- Added post detail pages with support for viewing posts, associated metadata, comments, and replies.
- Added post deletion and related error handling.
- Added public profile pages and profile-related navigation, including support for viewing user profiles and their posts, likes, and replies.
- Added threaded comment and reply functionality, including comment deletion.
- Added seed data to support development and initial application content.

### Changed
- Improved post metadata and user-specific information.
- Refined sign-in and sign-up flows.
- Updated profile-picture components and references.
- Updated project branding, README content, and deployment configuration.

### Fixed
- Addressed various UI and CSS issues and improved application consistency.

## 2026-02

### Added
- Established the initial React application structure and core pages.
- Implemented authentication flows, including sign-in and sign-up.
- Added post creation and display functionality, including image uploads.
- Added post detail pages.
- Implemented post liking.
- Added comments and threaded discussion support.
- Added profile pages and initial profile management.
- Introduced the initial community experience.
- Added seed data and initial application styling.
