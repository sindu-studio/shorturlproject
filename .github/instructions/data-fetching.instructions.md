---
description: Read this file to understand how to fetch data in the project.
---
# Data Fetching Instructions
In this project, we use the `fetch` API to retrieve data from our backend services. Below are some guidelines on how to properly fetch data in our application:

##1. Use server components for data fetching

In Next.js ALWAYS using server components for data fetching. NEVER use client components for data fetching.

##2. Data fetching methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch the data directly in the components.
ALL helper functions in the /data directory should use drizzle ORM for database interactions.

