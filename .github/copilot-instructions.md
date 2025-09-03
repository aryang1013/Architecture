# AWS Architecture Workflow Generator

AWS Architecture Workflow Generator is a Node.js Express web application that analyzes text requirements and generates professional AWS cloud architecture diagrams with intelligent service suggestions and workflow generation.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap, Build, and Test the Repository

**NEVER CANCEL ANY BUILD OR COMMAND** - All operations complete quickly (under 5 seconds), but if any command appears to hang, wait at least 60 seconds before considering alternatives.

1. **Install dependencies:**
   ```bash
   npm install
   ```
   - **Timing:** Completes in under 1 second (typically 0.7s)
   - **Expected output:** "up to date, audited 101 packages in [time]ms, found 0 vulnerabilities"

2. **Fix nodemon permissions (required for development mode):**
   ```bash
   chmod +x node_modules/.bin/nodemon
   ```
   - **Why needed:** nodemon binary lacks execute permissions in fresh installs

### Running the Application

**Production mode:**
```bash
npm start
```
- **Timing:** Starts instantly (under 1 second)
- **Expected output:** "Server running at http://localhost:3000"
- **Access:** Open http://localhost:3000 in browser

**Development mode (with auto-reload):**
```bash
npm run dev
```
- **Timing:** Starts instantly after fixing permissions
- **Expected output:** "[nodemon] starting `node server.js`" followed by "Server running at http://localhost:3000"
- **Note:** Will fail with EADDRINUSE if production server is already running on port 3000

### API Testing

**Test workflow storage API:**
```bash
# Get all workflows
curl -X GET http://localhost:3000/api/workflows

# Save a workflow
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Workflow","description":"Test description","services":["s3","lambda"],"diagram":"test diagram"}'

# Delete a workflow (replace {id} with actual workflow ID)
curl -X DELETE http://localhost:3000/api/workflows/{id}
```

## Validation Scenarios

**ALWAYS manually validate any changes using these complete end-to-end scenarios:**

### Core Functionality Test
1. **Start the application:** `npm start`
2. **Open browser:** Navigate to http://localhost:3000
3. **Test service suggestion:**
   - Enter: "Create a system with user authentication, file storage, and database"
   - Click "Analyze & Suggest Services"
   - **Expected:** Should automatically select S3 Storage, Cognito Auth, DynamoDB, RDS Database, Kinesis Streams
4. **Test architecture generation:**
   - Click "Generate Architecture" 
   - **Expected:** Should display:
     - Architecture Workflow section with Mermaid diagram (may show raw text if CDN blocked)
     - Selected Services list with descriptions
     - 11-step User Workflow Steps
5. **Test different input:**
   - Try: "Build a chatbot with search and notifications"
   - **Expected:** Should suggest different services like Lex, OpenSearch, Pinpoint

### API Workflow Test  
1. **Test empty state:** `curl -X GET http://localhost:3000/api/workflows` should return `[]`
2. **Save workflow:** Use POST command above, verify JSON response with id and timestamp
3. **Verify persistence:** GET request should return the saved workflow
4. **Test deletion:** Use DELETE with the workflow id, verify removal

### Known Issues and Workarounds

**Mermaid.js CDN blocked:**
- **Issue:** Console shows "ERR_BLOCKED_BY_CLIENT" for Mermaid.js CDN
- **Impact:** Diagram renders as raw text instead of visual diagram
- **Workaround:** Functionality works correctly; diagrams display as formatted text
- **Not a breaking issue:** All core features work properly

**Nodemon permissions:**
- **Issue:** `npm run dev` fails with "Permission denied"  
- **Fix:** Run `chmod +x node_modules/.bin/nodemon` after `npm install`

## Application Architecture

### File Structure
```
/
├── package.json          # Dependencies and scripts
├── server.js            # Main Express server
├── workflows.json       # Persistent workflow storage
├── public/
│   └── architecture-generator.html  # Main web interface
└── test-enhanced.html   # Documentation/demo page
```

### Key Features
- **Intelligent Service Mapping:** Analyzes text input using keyword detection and scoring
- **16 AWS Services:** S3, Cognito, API Gateway, Lambda, DynamoDB, RDS, ElastiCache, SQS, Kinesis, Lex, Personalize, OpenSearch, Pinpoint, SES, SNS, CloudWatch
- **Service Categories:** Organized into Frontend, API, Backend, Database, AI/ML, Notifications, Management layers
- **Workflow Persistence:** Save/load architecture workflows via REST API
- **Professional Diagrams:** Mermaid.js integration with AWS-style layered architecture

### Dependencies
- **Production:** express (4.18.2), cors (2.8.5)
- **Development:** nodemon (3.0.1)
- **Runtime:** Node.js 20.19.4, npm 10.8.2

## Common Tasks

### Adding New AWS Services
1. Edit `public/architecture-generator.html`
2. Add service to the `services` array around line 200
3. Include icon URL, keywords, description, and category
4. Test service suggestion with relevant keywords

### Debugging Service Suggestions  
- Check browser console for JavaScript errors
- Verify keyword matching in the `analyzeRequirements()` function
- Test with different input phrases to validate scoring algorithm

### Performance Monitoring
- All operations complete in under 5 seconds
- Server startup: Instant
- npm install: ~0.7 seconds  
- API responses: Instant
- Page load: Under 2 seconds

**NEVER CANCEL builds or commands** - this application has no long-running build processes, but always wait at least 60 seconds if any command appears unresponsive before troubleshooting.

## Testing Changes

Always validate changes with these steps:
1. **Stop existing server:** Kill any running npm/node processes
2. **Install dependencies:** `npm install` (if package.json changed)
3. **Fix permissions:** `chmod +x node_modules/.bin/nodemon`
4. **Start server:** `npm start`
5. **Manual validation:** Run complete Core Functionality Test scenario
6. **API validation:** Test all three API endpoints
7. **Browser console:** Check for new JavaScript errors