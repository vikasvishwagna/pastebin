
# PasteBin-lite

This project is a PasteBin-like application that allows users to create text pastes with:

Time-based expiration (TTL)

Limited number of views

Both JSON API access and HTML-based viewing

Once a paste expires (by time or view count), it is automatically removed and becomes inaccessible.

The application is built with a Node.js + Express backend, uses Redis for persistence, and includes a simple frontend UI for testing and usage.


## Tech Stack


**Server:** NodeJs, ExpressJs

**Client:** React, JavaScript, TailwindCSS

**Persistence:** Redis

**API Testing:** Postman





## Installation

Step 1: Install Required Software

 Node.js (v18 or higher)
   Download from: https://nodejs.org

   After installing, verify by running:

 ```bash
    node -v
    npm -v
 ```
    
Redis

Option A: Use Upstash Redis (Recommended)
```bash
No local Redis required

Just set REDIS_URL in .env
```
Option B: Use Local Redis (Optional)
```bash
Install Redis

Run redis-server

Use REDIS_URL=redis://localhost:6379
```
Step 2: Clone the Repository

Clone the project from GitHub:

```bash
git clone <your-repository-url>
```
Move into the project directory:

```bash
cd <your-repository-folder>
```

Step 3: Backend Setup

Navigate to the backend folder:
```bash
cd backend
```
Install backend dependencies:
```bash
npm install
```
Step 4: Create Environment Variables

Inside the backend folder, create a file named .env.

For Production / Deployment (using Upstash Redis)
```bash
PORT=3000
REDIS_URL=rediss://<your-upstash-redis-url>
BASE_URL=https://<your-deployed-domain>
TEST_MODE=0
```

Step 5: Start the Backend Server

Run the backend server:
```bash
npm run dev
```
Step 6: Frontend Setup

Navigate back to the project root:
```bash
cd ..
cd frontend
npm install
npm run dev

```
Create a .env file inside the frontend folder and add:
```bash
VITE_API_BASE_URL=http://localhost:3000
```

Step 7: Verify the Application

-Open the frontend UI in the browser

-Enter some text

-Select:

-Time limit (TTL)

-Maximum views

-Click Create Paste

-Open the generated paste URL

-Refresh multiple times to verify:

-Remaining views decrease

-Paste expires after limit