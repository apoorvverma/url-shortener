All the issues I found and fixed:

1. Started with improving the dev experience by adding some files and reorganizing the codebase (commits 0.01-0.02).
2. There was no URL validation, implemented it on the server side (commit 0.03).
3. Replaced the part where we were rendering the URL straight into the innerHTML (Risk of XSS) with textContent (commit 0.04).
4. Shifted the increment logic for visits to the SQL query. This also leaves no room for race conditions (commit 0.05).
5. Added a new route to get rows from the urls_visits table (commit 0.06).
6. Displaying errors in the UI (commit 0.07).

Changes I made for the Major issues noted:

1. Significantly reduced the chances of short_code collision by using better randomization than Math.random() (commit 0.09).
2. Implemented URL normalization by adding a column and a Unique Index to the urls table to avoid the same URL being shortened multiple times (commit 0.10).
3. Refactored device tracking by using cookies and assigning an id to the device (browser profile to be more specific) (commit 0.11).

Other Changes:

1. Added linting and formatting to the codebase (commit 0.12).
2. Added API documentation and a developer-friendly README with clear setup steps (commit 0.14).
3. Added JSDoc comments and shared typedefs for the key modules (commit 0.15).
4. Added a .env.example file to the project root (commit 0.14).
5. Updated prompts.md with a few more prompts (commit 0.16).
