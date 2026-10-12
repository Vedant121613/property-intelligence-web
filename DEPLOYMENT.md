# Pureframe Production Deployment Guide for Coolify

Complete guide for deploying Pureframe on **Coolify** with PostgreSQL and a **Strict Single-User** architecture.

---

## 1. Single User Account Details

The platform is configured in **Strict Single-User Mode**:
- **Username / Identifier**: `user@123`
- **Password**: `pass@123`
- **Privileges**: Full Access
  - Unlimited Deed Unlocks (Enterprise Plan active)
  - Full Access to MahaRERA and Pune Property Intelligence
  - Full Access to Admin Portal (`/admin`) and document generation
  - All public/unknown user registrations are disabled

---

## 2. Coolify Deployment Methods

Coolify supports two easy deployment approaches. Choose whichever fits your workflow:

### Option 1: Unified Single Container (Recommended — Simplest Setup)

In this setup, a single Docker container builds the React/Vite SPA and serves it directly via the Node.js Express server on port **5000**.
- **No CORS issues**: Frontend and API live on the exact same domain.
- **No client-side URL mismatch**: `/api/*` routes are relative.
- **Automatic DB setup**: The server automatically runs schema migrations and seeds `user@123` on startup.

#### Step-by-Step for Coolify:

1. **Create PostgreSQL in Coolify**:
   - In Coolify, click **+ New Resource** > **Database** > **PostgreSQL**.
   - Database name: `pureframe_db`
   - Once started, copy the **Internal URL** (e.g. `postgresql://postgres:<password>@<internal-host>:5432/pureframe_db`).

2. **Deploy Pureframe Application**:
   - In Coolify, click **+ New Resource** > **Application** > Select your Git repository.
   - **Build Pack**: Select `Dockerfile`.
   - **Base Directory**: `/`
   - **Dockerfile Path**: `Dockerfile`
   - **Exposed Port**: `5000`
   - **Domains**: Enter your domain (e.g., `https://pureframe.yourdomain.com`).

3. **Set Environment Variables in Coolify**:
   Add the following environment variables:
   ```ini
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://postgres:<password>@<internal-host>:5432/pureframe_db
   SINGLE_USER_NAME=user@123
   SINGLE_USER_PASS=pass@123
   ```
   *(Optional)* If using MSG91 for SMS/OTP verification:
   ```ini
   MSG91_AUTH_KEY=your_msg91_auth_key
   MSG91_WIDGET_ID=366a666d3673323037323934
   ```

4. **Click Deploy**:
   - Coolify will build the Dockerfile and start the container.
   - On startup, the container connects to PostgreSQL, runs `init-db.sql` automatically, and creates all tables and the `user@123` account.
   - Coolify automatically provisions free Let's Encrypt SSL certificates for HTTPS.

---

### Option 2: Docker Compose in Coolify (Full Stack in One Resource)

If you prefer deploying the app and database together inside a single Coolify Docker Compose resource:

1. In Coolify, click **+ New Resource** > **Application** > Select your Git repository.
2. Select **Docker Compose** as the build pack.
3. Coolify detects `docker-compose.yml` automatically.
4. Set your domain for the `app` service in Coolify's settings (port `5000`).
5. Configure Environment Variables if customizing credentials:
   ```ini
   PORT=5000
   SINGLE_USER_NAME=user@123
   SINGLE_USER_PASS=pass@123
   POSTGRES_DB=pureframe_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   ```
6. Click **Deploy**. Both the application and PostgreSQL will start together with persistent storage (`pureframe_pgdata`).

---

## 3. Database Schema & Auto-Migration

The database connection in `server/db.js` includes an automatic migration runner on container startup:
- Creates `users`, `plans`, `unlock_logs`, and `pune_projects` tables.
- Cleans any old demo accounts and guarantees `user@123` is the sole authorized user.
- Sets `is_payment_done = TRUE` and unlocks deed `11089052`.
- Retries connection automatically if PostgreSQL takes a few seconds to start up.

No manual `psql` command execution is required.

---

## 4. Local Testing with Docker

To test the container before pushing to Coolify:

```bash
# Option A: Full Compose (App + Postgres)
docker compose up --build

# Open in browser:
# App: http://localhost:5000
# Login with: user@123 / pass@123
```

To stop:
```bash
docker compose down
```

---

## 5. Verification Checklist

1. **Health Check**:
   - Visit `https://your-domain.com/api/health`
   - Expected JSON:
     ```json
     {
       "success": true,
       "message": "API is running",
       "database": "connected"
     }
     ```
2. **Citizen Login**:
   - Visit `https://your-domain.com/`
   - Enter `user@123` and `pass@123` (or click "Fill Credentials").
   - Click Sign In. Confirm dashboard and Pune property repository loads.
3. **Deed Unlocks**:
   - Open any property transaction and verify deed unlock works with unlimited enterprise access.
4. **Admin Portal**:
   - Navigate to `/admin`.
   - Enter `user@123` and `pass@123`.
   - Verify official Admin Panel loads with document retrieval, verification, and PDF issuance.
