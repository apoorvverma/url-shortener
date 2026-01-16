All the issues I found and fixed:

1. Started with improving the dev experience by adding some files and reorganizing the codebase (commits 0.01-0.02).
2. There was no URL validation, implemented it on the server side (commit 0.03).
3. Replaced the part where we were rendering the URL straight into the innerHTML (Risk of XSS) with textContent (commit 0.04).
4. Shifted the increment logic for visits to the SQL query. This also leaves no room for race conditions (commit 0.05).
5. Added a new route to get rows from the urls_visits table (commit 0.06).
6. Displaying errors in the UI (commit 0.07).

Some more changes I would've done:

1. Add tests using Jest and test cases for the server routes.
2. The current logic for device_id for tracking device visits is not reliable and isn’t actually a device identifier. It could be improved by using a better method like cookies. This would ensure that the same device is tracked consistently.
