# CLAUDE.md - Population Statistics Management System

## Project Overview

This is a **Population Statistics Management System** built as a full-stack web application for managing and visualizing demographic data including birth, death, marriage, and divorce statistics. The system provides CRUD operations and statistical analysis features with interactive data visualization.

**Primary Language**: Traditional Chinese (繁體中文) - All comments and documentation in code are in Chinese.

### Tech Stack

**Frontend**:
- Vue.js 3.5.17 with Composition API
- Vue Router 4.5.1 for navigation
- Chart.js 4.5.0 + vue-chartjs 5.3.2 for data visualization
- Axios 1.10.0 for HTTP requests
- Vite 7.0.0 as build tool

**Backend**:
- Node.js 22 with Express 4.18.2
- MongoDB with Mongoose 7.6.1 ODM
- CORS enabled for cross-origin requests
- Body-parser for request parsing

**Infrastructure**:
- Docker & Docker Compose for containerization
- Nginx as reverse proxy
- MongoDB 8.0.11 in Docker container

---

## Directory Structure

```
population-/
├── client/                      # Vue.js frontend application
│   ├── src/
│   │   ├── components/          # Reusable Vue components
│   │   │   ├── common/          # Common UI components (selectors)
│   │   │   │   ├── AreaSelector.vue
│   │   │   │   ├── AreaSelector2.vue
│   │   │   │   ├── LocationSelector.vue
│   │   │   │   └── MonthSelector.vue
│   │   │   ├── birthviews/      # Birth statistics views
│   │   │   │   ├── BirthTotalView.vue
│   │   │   │   └── BirthTrendView.vue
│   │   │   ├── deathviews/      # Death statistics views
│   │   │   │   ├── DeathTotalView.vue
│   │   │   │   ├── DeathRatioView.vue
│   │   │   │   └── DeathTrendView.vue
│   │   │   ├── marryviews/      # Marriage statistics views
│   │   │   │   ├── MarryTotalView.vue
│   │   │   │   └── MarryTrendView.vue
│   │   │   ├── divorceviews/    # Divorce statistics views
│   │   │   │   ├── DivorceTotalView.vue
│   │   │   │   └── DivorceTrendView.vue
│   │   │   └── cudaviews/       # CRUD operation views
│   │   │       ├── CrudCreateView.vue
│   │   │       ├── CrudListView.vue
│   │   │       ├── CrudEditView.vue
│   │   │       ├── CrudDeleteView.vue
│   │   │       ├── CrudVillageView.vue
│   │   │       ├── CrudVillageView2.vue
│   │   │       └── CrudMonthView.vue
│   │   ├── views/               # Page-level components
│   │   │   ├── HomeView.vue
│   │   │   ├── BirthView.vue
│   │   │   ├── DeathView.vue
│   │   │   ├── MarryView.vue
│   │   │   ├── DivorceView.vue
│   │   │   └── CudaView.vue
│   │   ├── router/
│   │   │   └── index.js         # Vue Router configuration
│   │   ├── assets/              # Static assets (CSS, images)
│   │   └── main.js              # Application entry point
│   ├── public/                  # Public static files
│   ├── Dockerfile               # Client Docker configuration
│   ├── vite.config.js           # Vite build configuration
│   └── package.json
│
├── server/                      # Express.js backend application
│   ├── routes/                  # API route handlers
│   │   ├── recordRoutes.js      # CRUD operations for records
│   │   ├── birthRoutes.js       # Birth statistics endpoints
│   │   ├── deathRoutes.js       # Death statistics endpoints
│   │   ├── marryRoutes.js       # Marriage statistics endpoints
│   │   └── divorceRoutes.js     # Divorce statistics endpoints
│   ├── models/
│   │   └── Record.js            # Mongoose schema for population records
│   ├── app.js                   # Express server entry point
│   ├── Dockerfile               # Server Docker configuration
│   ├── .env                     # Environment variables
│   └── package.json
│
├── nginx/
│   └── default.conf             # Nginx reverse proxy configuration
│
└── docker-compose.yml           # Multi-container Docker configuration
```

---

## Development Setup

### Prerequisites
- Docker and Docker Compose installed
- Git for version control

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd population-
   ```

2. **Start all services with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB on port 27018 (mapped from internal 27017)
   - Backend server on port 3000
   - Frontend development server on port 5173
   - Nginx reverse proxy on port 80

3. **Access the application**:
   - Frontend (via Nginx): http://localhost or http://www.lsimonwangl.com
   - Backend API: http://localhost:3000
   - MongoDB: mongodb://localhost:27018

### Environment Variables

**Server (.env)**:
```env
MONGO_URL=mongodb://mongodb:27017/population
PORT=3000
```

**Client (vite.config.js)**:
- Host: `0.0.0.0` (allows external access)
- Port: `5173`
- Allowed Hosts: `all`

### Docker Services

**mongodb**:
- Image: mongo:8.0.11
- Container: mongodbtest
- Port: 27018:27017
- Volume: mongodb_data:/data/db

**server**:
- Build: ./server
- Port: 3000:3000
- Depends on: mongodb

**client**:
- Build: ./client
- Container: client
- Port: 5173:5173
- Depends on: server

**nginx**:
- Image: nginx:latest
- Container: nginx
- Port: 80:80
- Depends on: client

---

## Database Schema

### Record Model (MongoDB Collection: `records`)

```javascript
{
  // Identification
  statistic_yyyymm: Number,    // Statistics year-month (ROC calendar, e.g., 10810 = Year 108, Month 10)
  district_code: String,        // Administrative district code
  site_id: String,              // Unique location identifier
  village: String,              // Village/neighborhood name

  // Birth Statistics
  birth_total: Number,          // Total births
  birth_total_m: Number,        // Male births
  birth_total_f: Number,        // Female births

  // Death Statistics
  death_total: Number,          // Total deaths
  death_m: Number,              // Male deaths
  death_f: Number,              // Female deaths

  // Marriage Statistics
  marry_pair: Number,           // Number of marriages
  divorce_pair: Number          // Number of divorces
}
```

**Important Notes**:
- `statistic_yyyymm` uses Taiwan's ROC (Republic of China) calendar format
- `site_id` is the unique identifier for each geographic location
- Same village names may exist in different `site_id` locations

---

## API Endpoints

### Base URL: `http://localhost:3000/api`

### Record Management (`/api/records`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | `/` | Create new record | Body: Record object |
| GET | `/` | Get paginated records | Query: `page` (default: 1, limit: 10) |
| GET | `/count` | Get total record count | None |
| GET | `/:id` | Get record by ID | Param: `id` (MongoDB ObjectId) |
| PUT | `/:id` | Update record | Param: `id`, Body: Updated fields |
| DELETE | `/:id` | Delete record | Param: `id` |
| GET | `/month/:yyyymm` | Get records by month | Param: `yyyymm` (e.g., 10810) |
| GET | `/village/:name` | Get all sites with village name | Param: `name` (village name) |
| GET | `/village/:site_id/:village` | Get specific village records | Params: `site_id`, `village` |

### Birth Statistics (`/api/birth`)

| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/total/:yyyymm` | Total births for a month | `{ total: Number }` |
| GET | `/ratio/:yyyymm/:village` | Male/female ratio for village | `{ male, female, ratio }` |
| GET | `/trend/:site_id` | Birth trend for location | Array of `{ month, total }` |

### Death Statistics (`/api/death`)

| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/total/:yyyymm` | Total deaths for a month | `{ total: Number }` |
| GET | `/ratio/:yyyymm/:village` | Male/female death ratio | `{ male, female, ratio }` |
| GET | `/trend/:site_id` | Death trend for location | Array of `{ month, total }` |

### Marriage Statistics (`/api/marry`)

| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/total/:yyyymm` | Total marriages for month | `{ total: Number }` |
| GET | `/trend/:site_id` | Marriage trend | Array of `{ month, total }` |

### Divorce Statistics (`/api/divorce`)

| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/total/:yyyymm` | Total divorces for month | `{ total: Number }` |
| GET | `/trend/:site_id` | Divorce trend | Array of `{ month, total }` |

---

## Frontend Structure

### Routing (`/client/src/router/index.js`)

**Main Routes**:
- `/` - Home page
- `/cuda` - CRUD operations hub
- `/birth` - Birth statistics
- `/death` - Death statistics
- `/marry` - Marriage statistics
- `/divorce` - Divorce statistics

**CRUD Sub-routes**:
- `/crud/village` - Village-based CRUD
- `/crud/village2` - Alternative village view
- `/crud/create` - Create new record
- `/crud/month` - Month-based CRUD
- `/crud/list` - List all records

**Statistics Sub-routes**:
- `/{category}/total` - Total statistics view
- `/{category}/trend` - Trend visualization
- `/death/ratio` - Death ratio visualization

### Component Organization

**Common Components** (`/client/src/components/common/`):
- `AreaSelector.vue` - Administrative area selector
- `AreaSelector2.vue` - Alternative area selector
- `LocationSelector.vue` - Location picker
- `MonthSelector.vue` - Year-month selector

**View Pattern**:
Each statistical category (birth/death/marry/divorce) follows this pattern:
- `{Category}View.vue` - Main category page in `/views`
- `{Category}TotalView.vue` - Total count visualization
- `{Category}TrendView.vue` - Trend chart visualization
- `{Category}RatioView.vue` - Ratio analysis (death only)

---

## Development Workflow

### Working with Git

**Current Branch**: `claude/claude-md-miu00h5hkaz0naan-01QfmrxqFKT1SfUWeh8kAjqA`

**Git Commands**:
```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to remote (with retry logic for network issues)
git push -u origin claude/claude-md-miu00h5hkaz0naan-01QfmrxqFKT1SfUWeh8kAjqA
```

**Important Git Notes**:
- All development happens on feature branches starting with `claude/`
- Branch names must match the session ID for successful push
- Retry pushes up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network failures
- Never push directly to main/master

### Recent Commits

```
091e03b 加上 allowedHosts: 'all'
a776760 加上nginx
a5ddd46 將前端localhost更改為ec2 ip
bf280f3 docker
ebd2de8 後端更改0.0.0.0
```

---

## Key Conventions for AI Assistants

### Code Style

1. **Language**: All code comments and documentation are written in Traditional Chinese (繁體中文)
2. **Comment Style**: Use comprehensive inline comments with section dividers:
   ```javascript
   // ===== Section Title =====
   // Detailed explanation of what this code does
   ```
3. **Naming Conventions**:
   - Routes: kebab-case (e.g., `/api/birth/total`)
   - Components: PascalCase (e.g., `BirthTotalView.vue`)
   - Files: camelCase for JS, PascalCase for Vue components

### When Making Changes

1. **Read First**: Always read existing files before modifying
2. **Match Style**: Follow existing code patterns and comment styles
3. **Chinese Comments**: Maintain Chinese language in all comments
4. **Test Changes**: If modifying Docker setup, rebuild containers
5. **Route Patterns**: Keep consistent with existing aggregation pipeline patterns
6. **Error Handling**: Include try-catch blocks with appropriate status codes

### Common Patterns

**MongoDB Aggregation Pipeline**:
```javascript
const result = await Record.aggregate([
  { $match: { /* filter criteria */ } },
  { $group: { /* grouping logic */ } },
  { $sort: { /* sorting */ } },
  { $project: { /* field selection */ } }
]);
```

**Express Route Handler**:
```javascript
router.get('/endpoint/:param', async (req, res) => {
  try {
    // Business logic
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'error', error: err.message });
  }
});
```

**Vue Component with Chart.js**:
- Use `vue-chartjs` for chart components
- Fetch data via Axios from backend API
- Use common selectors for filters

---

## Common Tasks

### Adding New Statistical Endpoint

1. **Create route handler** in appropriate route file (e.g., `birthRoutes.js`)
2. **Define aggregation pipeline** using MongoDB operators
3. **Add error handling** with try-catch and appropriate status codes
4. **Test endpoint** using curl or Postman
5. **Create Vue component** in corresponding view folder
6. **Add route** to `/client/src/router/index.js`
7. **Update navigation** if needed

### Modifying Database Schema

1. **Update** `/server/models/Record.js`
2. **Restart server** to apply changes
3. **Update API routes** that use the schema
4. **Update frontend components** that display the data
5. **Test CRUD operations** to ensure compatibility

### Debugging Docker Issues

```bash
# View logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart [service-name]

# Rebuild after code changes
docker-compose up -d --build [service-name]

# Stop all services
docker-compose down

# Remove volumes (CAUTION: deletes data)
docker-compose down -v
```

### Working with MongoDB

**Access MongoDB Shell**:
```bash
docker exec -it mongodbtest mongosh
```

**Common MongoDB Commands**:
```javascript
use population                 // Switch to database
db.records.find().limit(5)     // View sample records
db.records.countDocuments()    // Count total records
db.records.createIndex({ site_id: 1, statistic_yyyymm: 1 })  // Add index
```

### Frontend Development

**Run Vite dev server** (if not using Docker):
```bash
cd client
npm install
npm run dev
```

**Build for production**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

### Backend Development

**Run Express server** (if not using Docker):
```bash
cd server
npm install
npm start
```

---

## Important Notes

### Taiwan ROC Calendar

The `statistic_yyyymm` field uses Taiwan's ROC (Republic of China) calendar:
- ROC Year = Gregorian Year - 1911
- Format: YYYMM (e.g., 10810 = October 2019)
- To convert: ROC 108 = Gregorian 2019 (108 + 1911)

### Handling Same Village Names

Multiple geographic locations may have identical village names but different `site_id` values. Always use:
- `/api/records/village/:site_id/:village` for precise queries
- `/api/records/village/:name` returns all sites grouped by `site_id`

### CORS Configuration

CORS is enabled globally in `server/app.js`:
```javascript
app.use(cors());
```

For production, consider restricting to specific origins.

### Port Mappings

External → Internal:
- 80 → Nginx → 5173 (Frontend)
- 3000 → Backend
- 27018 → 27017 (MongoDB)

---

## Troubleshooting

### Container Won't Start

1. Check logs: `docker-compose logs [service-name]`
2. Verify ports aren't in use: `lsof -i :[port]`
3. Rebuild: `docker-compose up -d --build`

### Database Connection Issues

1. Ensure MongoDB container is running: `docker ps`
2. Check connection string in `.env` matches docker-compose service name
3. Wait for MongoDB to fully initialize (can take 10-20 seconds)

### Frontend Can't Reach Backend

1. Check Vite proxy configuration in `vite.config.js`
2. Verify backend is running on correct port
3. Check CORS settings in `server/app.js`
4. Ensure Axios requests use correct base URL

### Changes Not Reflecting

1. For code changes: Rebuild container `docker-compose up -d --build`
2. For Vue components: Check Vite HMR is working
3. For API routes: Restart server container
4. Clear browser cache if needed

---

## Security Considerations

1. **Environment Variables**: Never commit `.env` files with sensitive data
2. **MongoDB**: Currently has no authentication - add for production
3. **CORS**: Restrict origins in production environment
4. **Input Validation**: Always validate and sanitize user inputs
5. **Error Messages**: Don't expose sensitive information in error responses

---

## Performance Optimization

1. **Database Indexes**: Add indexes on frequently queried fields:
   ```javascript
   db.records.createIndex({ statistic_yyyymm: 1 })
   db.records.createIndex({ site_id: 1 })
   db.records.createIndex({ village: 1 })
   ```

2. **Pagination**: Use pagination for large datasets (already implemented)

3. **Caching**: Consider adding Redis for frequently accessed statistics

4. **Aggregation**: Use MongoDB aggregation pipelines efficiently

---

## Additional Resources

- **Vue.js Documentation**: https://vuejs.org/
- **Express.js Guide**: https://expressjs.com/
- **Mongoose Docs**: https://mongoosejs.com/
- **Chart.js**: https://www.chartjs.org/
- **Docker Compose**: https://docs.docker.com/compose/

---

**Last Updated**: 2025-12-06
**Maintained For**: Claude AI Assistant and Development Team
