const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const WORKFLOWS_FILE = path.join(__dirname, 'workflows.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

// Serve architecture-generator.html as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'architecture-generator.html'));
});

// Initialize workflows file
async function initWorkflowsFile() {
    try {
        await fs.access(WORKFLOWS_FILE);
    } catch {
        await fs.writeFile(WORKFLOWS_FILE, JSON.stringify([]));
    }
}

// Get all workflows
app.get('/api/workflows', async (req, res) => {
    try {
        const data = await fs.readFile(WORKFLOWS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read workflows' });
    }
});

// Save workflow
app.post('/api/workflows', async (req, res) => {
    try {
        const { name, description, services, diagram } = req.body;
        const data = await fs.readFile(WORKFLOWS_FILE, 'utf8');
        const workflows = JSON.parse(data);
        
        const newWorkflow = {
            id: Date.now().toString(),
            name,
            description,
            services,
            diagram,
            createdAt: new Date().toISOString()
        };
        
        workflows.push(newWorkflow);
        await fs.writeFile(WORKFLOWS_FILE, JSON.stringify(workflows, null, 2));
        res.json(newWorkflow);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save workflow' });
    }
});

// Delete workflow
app.delete('/api/workflows/:id', async (req, res) => {
    try {
        const data = await fs.readFile(WORKFLOWS_FILE, 'utf8');
        const workflows = JSON.parse(data);
        const filtered = workflows.filter(w => w.id !== req.params.id);
        await fs.writeFile(WORKFLOWS_FILE, JSON.stringify(filtered, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete workflow' });
    }
});

initWorkflowsFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});