# Frontend API URL Update Instructions

## After deploying backend to Render, follow these steps:

### Step 1: Get your Render backend URL
Example: `https://skillswap-backend.onrender.com`

### Step 2: Update .env.production file
The file is already created at: `Frontend/.env.production`
Replace the URL with your actual Render URL:
```
VITE_API_URL=https://your-actual-backend-url.onrender.com
```

### Step 3: Find and Replace in VS Code
1. Press `Ctrl + Shift + H` (Find and Replace in Files)
2. In "Search" field, enter: `http://localhost:8000`
3. In "Replace" field, enter: `${API_URL}`
4. In "files to include": `Frontend/src/**/*.jsx`
5. Click "Replace All"

### Step 4: Add import statement
At the top of each file that uses API_URL, add:
```javascript
import API_URL from '../config/api';
// or
import API_URL from '../../config/api';
// (adjust path based on file location)
```

### Alternative (Easier): Use environment variable directly
Instead of importing, you can use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```
Then use `${API_URL}` in axios calls.

## For now, we'll deploy with localhost URLs and update after Vercel deployment
