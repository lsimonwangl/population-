# CLAUDE.md - Population Management System

**AI Assistant Guide for Codebase Understanding and Development**

Last Updated: 2025-12-06

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Development Setup](#development-setup)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Frontend Components](#frontend-components)
8. [Database Schema](#database-schema)
9. [Docker Configuration](#docker-configuration)
10. [Coding Conventions](#coding-conventions)
11. [Git Workflow](#git-workflow)
12. [Key Files Reference](#key-files-reference)

---

## Project Overview

### Application Name
Population Management System (人口管理系統)

### Purpose
A full-stack web application for managing and visualizing population statistics, including birth, death, marriage, and divorce data organized by village/district (村里) and time period.

### Key Features
- **CRUD Operations**: Create, read, update, and delete population records
- **Birth Statistics**: Total births, gender ratios, and trends by area
- **Death Statistics**: Total deaths, ratios, and trends
- **Marriage Statistics**: Marriage totals and trends
- **Divorce Statistics**: Divorce totals and trends
- **Data Visualization**: Charts and graphs using Chart.js
- **Village/District Management**: Query by specific locations or time periods

### Language
Primary code comments are in Traditional Chinese (繁體中文)

---

## Codebase Structure

```
population-/
├── client/                    # Frontend Vue.js application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images, CSS, JSON data
│   │   ├── components/       # Vue components
│   │   │   ├── birthviews/   # Birth-related components
│   │   │   ├── deathviews/   # Death-related components
│   │   │   ├── marryviews/   # Marriage-related components
│   │   │   ├── divorceviews/ # Divorce-related components
│   │   │   ├── cudaviews/    # CRUD operation components
│   │   │   ├── common/       # Reusable components (selectors)
│   │   │   └── icons/        # SVG icons
│   │   ├── router/           # Vue Router configuration
│   │   ├── views/            # Main view components
│   │   ├── App.vue           # Root component
│   │   └── main.js           # Application entry point
│   ├── Dockerfile            # Client container configuration
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite build configuration
│   └── README.md             # Vue project documentation
│
├── server/                    # Backend Express.js application
│   ├── models/               # Mongoose data models
│   │   └── Record.js         # Population record schema
│   ├── routes/               # API route handlers
│   │   ├── recordRoutes.js   # CRUD operations
│   │   ├── birthRoutes.js    # Birth statistics
│   │   ├── deathRoutes.js    # Death statistics
│   │   ├── marryRoutes.js    # Marriage statistics
│   │   └── divorceRoutes.js  # Divorce statistics
│   ├── app.js                # Express server entry point
│   ├── .env                  # Environment variables
│   ├── Dockerfile            # Server container configuration
│   └── package.json          # Backend dependencies
│
├── nginx/                     # Nginx reverse proxy
│   └── default.conf          # Nginx configuration
│
├── docker-compose.yml         # Docker orchestration
└── .git/                      # Git repository
```

---

## Tech Stack

### Frontend
- **Framework**: Vue 3 (v3.5.17)
- **Build Tool**: Vite 7
- **Router**: Vue Router 4
- **Charts**: Chart.js 4.5.0 + vue-chartjs 5.3.2
- **HTTP Client**: Axios 1.10.0
- **Dev Tools**: Vite Plugin Vue DevTools

### Backend
- **Runtime**: Node.js 22
- **Framework**: Express.js 4.18.2
- **Database ORM**: Mongoose 7.6.1
- **Middleware**:
  - CORS 2.8.5
  - body-parser 1.20.2
  - dotenv 16.3.1

### Database
- **Database**: MongoDB 8.0.11
- **Container**: Official mongo Docker image
- **Port**: 27018 (host) → 27017 (container)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (reverse proxy)
- **Node Version**: 22 (LTS)

---

## Architecture

### Application Architecture

```
┌─────────────────┐
│     Nginx       │ Port 80 (www.lsimonwangl.com)
│  Reverse Proxy  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Vue Client    │ Port 5173 (internal)
│    (Vite Dev)   │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Express API    │ Port 3000
│     Server      │
└────────┬────────┘
         │ Mongoose ODM
         ▼
┌─────────────────┐
│    MongoDB      │ Port 27017 (internal)
│    Database     │ Port 27018 (external)
└─────────────────┘
```

### Request Flow

1. **User Request** → Nginx (Port 80)
2. **Static/Client** → Proxied to Vue Dev Server (Port 5173)
3. **API Calls** → Direct to Express Server (Port 3000)
4. **Data Operations** → MongoDB via Mongoose (Port 27017)

### Data Flow Pattern

**Frontend** → Axios → **API Routes** → Mongoose → **MongoDB** → Response → **Vue Components** → Chart.js

---

## Development Setup

### Prerequisites
- Docker & Docker Compose
- Git
- (Optional) Node.js 22 for local development

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd population-

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### Local Development (without Docker)

**Backend:**
```bash
cd server
npm install
# Configure .env file
npm start  # Runs on port 3000
```

**Frontend:**
```bash
cd client
npm install
npm run dev  # Runs on port 5173
```

**Database:**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27018:27017 mongo:8.0.11
```

### Environment Variables

**server/.env:**
```env
MONGO_URL=mongodb://mongodb:27017/population
PORT=3000
```

### Access Points

- **Frontend**: http://localhost:5173 (dev) or http://www.lsimonwangl.com (production)
- **Backend API**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27018 (external access)

---

## API Endpoints Reference

### Base URL
`http://localhost:3000/api`

### Record CRUD Operations (`/api/records`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | `/api/records` | Create new record | Body: Record object |
| GET | `/api/records` | Get paginated records | Query: `?page=1` |
| GET | `/api/records/count` | Get total record count | None |
| GET | `/api/records/:id` | Get record by ID | Path: `id` |
| PUT | `/api/records/:id` | Update record by ID | Path: `id`, Body: Updated fields |
| DELETE | `/api/records/:id` | Delete record by ID | Path: `id` |
| GET | `/api/records/month/:yyyymm` | Get records by month | Path: `yyyymm` (e.g., 10810) |
| GET | `/api/records/village/:name` | Get records by village name (grouped by site_id) | Path: `name` |
| GET | `/api/records/village/:site_id/:village` | Get records by site_id and village | Path: `site_id`, `village` |

### Birth Statistics (`/api/birth`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/birth/total/:yyyymm` | Get total births for a month | Path: `yyyymm` |
| GET | `/api/birth/ratio/:yyyymm/:village` | Get male/female birth ratio | Path: `yyyymm`, `village` |
| GET | `/api/birth/trend/:site_id` | Get birth trend by site | Path: `site_id` |

### Death Statistics (`/api/death`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/death/total/:yyyymm` | Get total deaths for a month | Path: `yyyymm` |
| GET | `/api/death/ratio/:yyyymm/:village` | Get male/female death ratio | Path: `yyyymm`, `village` |
| GET | `/api/death/trend/:site_id` | Get death trend by site | Path: `site_id` |

### Marriage Statistics (`/api/marry`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/marry/total/:yyyymm` | Get total marriages for a month | Path: `yyyymm` |
| GET | `/api/marry/trend/:site_id` | Get marriage trend by site | Path: `site_id` |

### Divorce Statistics (`/api/divorce`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/divorce/total/:yyyymm` | Get total divorces for a month | Path: `yyyymm` |
| GET | `/api/divorce/trend/:site_id` | Get divorce trend by site | Path: `site_id` |

### Response Formats

**Success Response (Record):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "statistic_yyyymm": 10810,
  "district_code": "6300001",
  "site_id": "63000010",
  "village": "永康里",
  "birth_total": 25,
  "birth_total_m": 13,
  "birth_total_f": 12,
  "death_total": 15,
  "death_m": 8,
  "death_f": 7,
  "marry_pair": 10,
  "divorce_pair": 3
}
```

**Error Response:**
```json
{
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

---

## Frontend Components

### Component Organization

**By Feature:**
- `birthviews/` - Birth statistics components (BirthTotalView, BirthTrendView)
- `deathviews/` - Death statistics components (DeathTotalView, DeathRatioView, DeathTrendView)
- `marryviews/` - Marriage statistics components (MarryTotalView, MarryTrendView)
- `divorceviews/` - Divorce statistics components (DivorceTotalView, DivorceTrendView)
- `cudaviews/` - CRUD operation components (CrudVillageView, CrudCreateView, CrudMonthView, CrudListView)

**Common Components:**
- `AreaSelector.vue` - Location/area selection dropdown
- `AreaSelector2.vue` - Alternative area selector
- `LocationSelector.vue` - Enhanced location selector
- `MonthSelector.vue` - Month/year selection component

### Main Views (client/src/views/)

- `HomeView.vue` - Landing page
- `CudaView.vue` - CRUD operations dashboard
- `BirthView.vue` - Birth statistics dashboard
- `DeathView.vue` - Death statistics dashboard
- `MarryView.vue` - Marriage statistics dashboard
- `DivorceView.vue` - Divorce statistics dashboard

### Routing Structure (client/src/router/index.js)

Routes follow a hierarchical pattern:
```
/ (home)
├── /cuda (CRUD dashboard)
│   ├── /crud/village
│   ├── /crud/village2
│   ├── /crud/create
│   ├── /crud/month
│   └── /crud/list
├── /birth
│   ├── /birth/total
│   └── /birth/trend
├── /death
│   ├── /death/total
│   ├── /death/ratio
│   └── /death/trend
├── /marry
│   ├── /marry/total
│   └── /marry/trend
└── /divorce
    ├── /divorce/total
    └── /divorce/trend
```

### Styling
- **CSS Files**: `client/src/assets/base.css`, `client/src/assets/main.css`
- **Framework**: Scoped CSS in Vue components
- **Theme**: Green accent colors (#42b883, #2f9e6e)
- **Responsive**: Mobile-first design with desktop breakpoint at 1024px

---

## Database Schema

### Collection: `records`

**Model File**: `server/models/Record.js`

**Schema Definition:**

```javascript
{
  statistic_yyyymm: Number,    // 統計年月 (e.g., 10810 = Year 108, Month 10)
  district_code: String,       // 行政區代碼 (District code)
  site_id: String,             // 地點 ID (Unique site identifier)
  village: String,             // 村里名稱 (Village/neighborhood name)

  // Birth statistics
  birth_total: Number,         // 出生總數 (Total births)
  birth_total_m: Number,       // 男性出生數 (Male births)
  birth_total_f: Number,       // 女性出生數 (Female births)

  // Death statistics
  death_total: Number,         // 死亡總數 (Total deaths)
  death_m: Number,             // 男性死亡數 (Male deaths)
  death_f: Number,             // 女性死亡數 (Female deaths)

  // Marriage statistics
  marry_pair: Number,          // 結婚對數 (Marriage pairs)
  divorce_pair: Number         // 離婚對數 (Divorce pairs)
}
```

### Data Conventions

**Date Format**: `statistic_yyyymm` uses Taiwan (ROC) calendar format
- Format: `YYYMMM` where `YYY` = Year - 1911, `MM` = Month
- Example: `10810` = October 2019 (Year 108 + Month 10)

**Unique Identifiers**:
- `site_id`: Unique location identifier
- `village`: May have duplicates (same village name in different districts)
- **Best Practice**: Use `site_id` + `village` for precise queries

### Indexing Recommendations

When modifying the database schema, consider these indexes for performance:
```javascript
// Recommended indexes (not currently implemented)
recordSchema.index({ statistic_yyyymm: 1 });
recordSchema.index({ site_id: 1 });
recordSchema.index({ village: 1 });
recordSchema.index({ site_id: 1, village: 1 });
recordSchema.index({ statistic_yyyymm: 1, village: 1 });
```

---

## Docker Configuration

### Services Overview

**docker-compose.yml** defines 4 services:

1. **mongodb** - Database service
2. **server** - Express API backend
3. **client** - Vue.js frontend
4. **nginx** - Reverse proxy

### Service Details

#### MongoDB Service
```yaml
Container Name: mongodbtest
Image: mongo:8.0.11
Ports: 27018:27017
Volume: mongodb_data:/data/db
```

#### Server Service
```yaml
Build: ./server
Dockerfile: server/Dockerfile (Node 22)
Ports: 3000:3000
Environment:
  - MONGO_URI=mongodb://mongodb:27017/population
Depends On: mongodb
```

#### Client Service
```yaml
Container Name: client
Build: ./client
Dockerfile: client/Dockerfile (Node 22)
Ports: 5173:5173
Command: npm run dev -- --host
Depends On: server
```

#### Nginx Service
```yaml
Container Name: nginx
Image: nginx:latest
Ports: 80:80
Config: ./nginx/default.conf
Depends On: client
```

### Dockerfile Configurations

**Server Dockerfile:**
- Base: node:22
- Workdir: /app
- Installs dependencies first (layer caching)
- Exposes: 3000
- Command: npm start

**Client Dockerfile:**
- Base: node:22
- Workdir: /app
- Installs dependencies first (layer caching)
- Exposes: 5173
- Command: npm run dev -- --host

### Network Configuration

All services are on the same Docker network, allowing internal communication:
- `mongodb://mongodb:27017` (server → database)
- `http://client:5173` (nginx → frontend)
- Services use internal DNS resolution

### Volumes

**Named Volume:**
- `mongodb_data` - Persists MongoDB data across container restarts

**Bind Mounts:**
- `./nginx/default.conf:/etc/nginx/conf.d/default.conf` - Nginx configuration

---

## Coding Conventions

### General Guidelines

1. **Comments**: Write comprehensive Chinese comments for complex logic
2. **Variable Naming**: Use descriptive English names (camelCase)
3. **File Naming**: Use PascalCase for Vue components, camelCase for JS files
4. **Code Organization**: Separate concerns (routes, models, views, components)

### Backend Conventions (server/)

**File Structure:**
```javascript
// ===== Section Title =====
// Detailed explanation

const module = require('module');

// Function/route definition
router.get('/endpoint', async (req, res) => {
  try {
    // Implementation
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});
```

**Best Practices:**
- Always use async/await for database operations
- Include try-catch blocks for error handling
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Validate input parameters
- Use meaningful error messages in Chinese

**Route Patterns:**
```javascript
// Specific routes before parameterized routes
router.get('/count', handler);        // ✓ First
router.get('/:id', handler);          // ✓ After specific routes
```

### Frontend Conventions (client/)

**Vue Component Structure:**
```vue
<script setup>
// Imports
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive state
const data = ref([]);

// Methods
const fetchData = async () => {
  // Implementation
};

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Scoped styles */
</style>
```

**API Calls:**
- Use Axios for HTTP requests
- Base URL should point to backend server
- Handle errors with try-catch
- Show loading states during async operations

**Component Naming:**
- Views: `SomethingView.vue`
- Components: `SomethingComponent.vue` or descriptive names
- Use PascalCase for all component files

### Database Conventions

**Mongoose Patterns:**
```javascript
// Always use async/await
const result = await Record.find({ field: value });

// Use aggregation for complex queries
const stats = await Record.aggregate([
  { $match: { field: value } },
  { $group: { _id: '$field', total: { $sum: '$value' } } }
]);

// Handle not found cases
if (!result) return res.status(404).json({ message: '找不到資料' });
```

### Error Handling

**Standard Error Response:**
```javascript
res.status(statusCode).json({
  message: 'User-friendly Chinese message',
  error: err.message  // Optional: detailed error
});
```

**Common Status Codes:**
- `200`: Success (GET, PUT)
- `201`: Created (POST)
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Server Error

---

## Git Workflow

### Branch Strategy

**Main Branch:**
- Protected, represents production-ready code
- Branch name not explicitly set in this project

**Development Branches:**
- Pattern: `claude/claude-md-miu00ri30xmdxapw-<session-id>`
- Current: `claude/claude-md-miu00ri30xmdxapw-013mDqvzstf4c2xp8pqXVwVR`

### Commit Guidelines

**Format:**
```
<type>: <description in Chinese/English>

[optional body with details]
```

**Recent Commits:**
- `091e03b` - 加上 allowedHosts: 'all'
- `a776760` - 加上nginx
- `a5ddd46` - 將前端localhost更改為ec2 ip
- `bf280f3` - docker
- `ebd2de8` - 後端更改0.0.0.0

**Commit Types:**
- Feature additions: `加上`, `add`
- Modifications: `更改`, `update`
- Fixes: `修正`, `fix`
- Configuration: `設定`, `config`

### Pushing Changes

**Always use:**
```bash
git push -u origin <branch-name>
```

**Important:**
- Branch must start with `claude/` and end with matching session ID
- Push will fail with 403 if branch name doesn't match pattern
- Retry with exponential backoff on network errors (2s, 4s, 8s, 16s)

### Pull Request Workflow

When creating pull requests:
1. Ensure all changes are committed
2. Push to the designated claude branch
3. Create PR with descriptive title and summary
4. Include test plan in PR description
5. Use `gh pr create` command if using GitHub CLI

---

## Key Files Reference

### Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `docker-compose.yml` | Multi-container orchestration | Service definitions, ports, dependencies |
| `server/.env` | Backend environment variables | MONGO_URL, PORT |
| `client/vite.config.js` | Vite build configuration | Host: 0.0.0.0, Port: 5173, allowedHosts |
| `nginx/default.conf` | Nginx reverse proxy | Server name, proxy settings |

### Entry Points

| File | Purpose |
|------|---------|
| `server/app.js` | Express server initialization and middleware setup |
| `client/src/main.js` | Vue application initialization |
| `client/src/App.vue` | Root Vue component with navigation |
| `client/src/router/index.js` | Vue Router configuration |

### Critical Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `server/models/Record.js` | MongoDB schema definition | 38 |
| `server/routes/recordRoutes.js` | CRUD operations API | 238 |
| `server/routes/birthRoutes.js` | Birth statistics API | 113 |
| `server/routes/deathRoutes.js` | Death statistics API | Similar to birth |
| `server/routes/marryRoutes.js` | Marriage statistics API | Similar to birth |
| `server/routes/divorceRoutes.js` | Divorce statistics API | Similar to birth |

### Critical Frontend Files

| File | Purpose |
|------|---------|
| `client/src/App.vue` | Main layout with navigation bar and router-view |
| `client/src/router/index.js` | Route definitions (17 routes) |
| `client/src/components/common/AreaSelector.vue` | Reusable location selector |
| `client/src/components/common/MonthSelector.vue` | Reusable month selector |

---

## Development Workflows

### Adding a New Feature

1. **Plan the Feature**
   - Identify affected components (frontend/backend/database)
   - Design API endpoints if needed
   - Plan database schema changes if required

2. **Backend Changes**
   ```bash
   # Add new route file if needed
   server/routes/newFeatureRoutes.js

   # Update app.js to include new routes
   # Add route handler with proper error handling
   # Test with curl or Postman
   ```

3. **Frontend Changes**
   ```bash
   # Create new view/component
   client/src/views/NewFeatureView.vue

   # Add route in router/index.js
   # Create API service calls with Axios
   # Test in browser
   ```

4. **Testing**
   - Test API endpoints independently
   - Test frontend components
   - Test integration
   - Verify responsive design

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "add: new feature description"
   git push -u origin claude/claude-md-miu00ri30xmdxapw-<session-id>
   ```

### Modifying Existing Features

1. **Locate the Code**
   - Frontend: Check `client/src/views/` or `client/src/components/`
   - Backend: Check corresponding route in `server/routes/`
   - Database: Check `server/models/Record.js`

2. **Make Changes**
   - Maintain existing code style and commenting patterns
   - Update related documentation
   - Preserve Chinese comments

3. **Test Changes**
   - Restart Docker containers if needed: `docker-compose restart`
   - Test affected functionality
   - Check for regression issues

### Debugging

**Backend Debugging:**
```bash
# View server logs
docker-compose logs -f server

# Connect to server container
docker exec -it <server-container-id> /bin/bash

# Check MongoDB connection
docker exec -it mongodbtest mongosh
```

**Frontend Debugging:**
```bash
# View client logs
docker-compose logs -f client

# Check Vite dev server output
# Use browser dev tools for client-side debugging
```

**Database Debugging:**
```bash
# Connect to MongoDB
docker exec -it mongodbtest mongosh

# Switch to population database
use population

# Query records
db.records.find().limit(5)

# Check collection stats
db.records.countDocuments()
```

---

## Common Tasks for AI Assistants

### Task: Add New API Endpoint

**Example: Add a combined statistics endpoint**

1. Create route in appropriate file or new file in `server/routes/`
2. Use existing patterns from other route files
3. Add comprehensive Chinese comments
4. Include error handling with try-catch
5. Test endpoint before committing

### Task: Create New Vue Component

**Example: Add a comparison chart component**

1. Create component file in appropriate directory
2. Use `<script setup>` composition API
3. Import necessary libraries (axios, chart.js)
4. Add route to `client/src/router/index.js`
5. Include scoped styles
6. Add navigation link if needed

### Task: Modify Database Schema

**Warning: Schema changes may require data migration**

1. Update `server/models/Record.js`
2. Consider backward compatibility
3. Update API routes that use the modified fields
4. Update frontend components that display the data
5. Document the change in commit message

### Task: Update Docker Configuration

1. Modify `docker-compose.yml` or Dockerfiles
2. Rebuild containers: `docker-compose build`
3. Restart services: `docker-compose up -d`
4. Verify all services are running: `docker-compose ps`

### Task: Fix CORS Issues

If frontend can't access backend:

1. Check CORS configuration in `server/app.js`
2. Verify Axios base URL in frontend
3. Check Docker network connectivity
4. Review nginx proxy configuration

---

## Important Notes for AI Assistants

### Do's ✓

- Read existing code before making changes
- Maintain Chinese comment style for complex logic
- Use async/await consistently
- Follow existing file organization patterns
- Test changes in Docker environment
- Include error handling in all API routes
- Validate user inputs
- Use appropriate HTTP status codes
- Keep frontend and backend concerns separated
- Commit frequently with descriptive messages

### Don'ts ✗

- Don't modify database schema without considering migrations
- Don't remove existing functionality without confirmation
- Don't change established naming conventions
- Don't expose sensitive data in API responses
- Don't skip error handling
- Don't use synchronous operations for I/O
- Don't hardcode URLs or ports (use env variables)
- Don't commit sensitive data (.env files)
- Don't break existing API contracts without versioning
- Don't remove Chinese comments without replacing them

### Security Considerations

- Validate all user inputs
- Use parameterized queries (Mongoose handles this)
- Sanitize data before displaying
- Keep dependencies updated
- Don't expose internal error details to clients
- Use HTTPS in production (currently HTTP in dev)
- Implement rate limiting for production
- Add authentication/authorization if handling sensitive data

### Performance Considerations

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data if needed
- Optimize MongoDB aggregation pipelines
- Minimize bundle size (code splitting)
- Lazy load routes in Vue Router
- Optimize images and assets

---

## Troubleshooting

### Common Issues

**Issue: MongoDB connection failed**
```
Solution:
1. Check if MongoDB container is running: docker-compose ps
2. Verify MONGO_URL in server/.env
3. Check MongoDB logs: docker-compose logs mongodb
```

**Issue: Frontend can't connect to backend**
```
Solution:
1. Verify server is running: docker-compose ps
2. Check Axios base URL configuration
3. Review nginx proxy settings
4. Check CORS configuration in server/app.js
```

**Issue: Port already in use**
```
Solution:
1. Stop conflicting service
2. Change port in docker-compose.yml
3. Update corresponding environment variables
```

**Issue: Changes not reflecting**
```
Solution:
1. Hard refresh browser (Ctrl+Shift+R)
2. Restart Docker containers: docker-compose restart
3. Rebuild if Dockerfile changed: docker-compose build
4. Clear browser cache
```

**Issue: Database data lost**
```
Solution:
1. Check if volume exists: docker volume ls
2. Don't use docker-compose down -v unless intentional
3. Backup important data regularly
```

---

## Additional Resources

### Documentation Links
- [Vue 3 Documentation](https://vuejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Vite Guide](https://vitejs.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Docker Documentation](https://docs.docker.com/)

### Project-Specific Resources
- Client README: `client/README.md`
- Sample Data: `client/src/assets/output.json`

---

## Changelog

### 2025-12-06
- Initial CLAUDE.md creation
- Documented current codebase structure
- Added comprehensive API reference
- Documented Docker setup and workflows
- Added coding conventions and best practices

---

**For AI Assistants**: This document should be your primary reference when working with this codebase. Always consult this file before making significant changes. Keep this document updated as the codebase evolves.
