# Vercel Deployment Guide - National Exam Preparation System

## ⚠️ CRITICAL: Fix UI Rendering Issue on Vercel

If your deployed site shows a **plain white page** with only text links (no styling, no modern UI), follow these steps:

### Solution: Set Root Directory in Vercel Dashboard

The `vercel.json` in the root directory should handle the build, but for best results, configure Vercel to use the `frontend` folder as root:

#### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Navigate to your project: `national-exam`

2. **Open Settings**
   - Click on the **Settings** tab at the top
   - Select **General** from the left sidebar

3. **Configure Root Directory**
   - Scroll down to the **Root Directory** section
   - Click the **Edit** button
   - Enter: `frontend`
   - Click **Save**

4. **Redeploy**
   - Go to the **Deployments** tab
   - Find the latest deployment
   - Click the **⋮** (three dots) menu
   - Select **Redeploy**
   - Confirm the redeployment

5. **Wait for Build**
   - The build process will take 2-5 minutes
   - Once complete, your site should have the full modern UI with:
     - ✅ Gradient backgrounds (green → gold)
     - ✅ Styled buttons and components
     - ✅ Proper typography and spacing
     - ✅ All visual elements from local development

---

## Alternative: Using vercel.json (Already Configured)

A `vercel.json` file has been added to the root directory with the following configuration:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install"
}
```

This should automatically build from the `frontend` directory. However, the **Root Directory method above is more reliable**.

---

## Environment Variables Required

Make sure to set these environment variables in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add the following:

```
VITE_API_URL=https://your-backend-api-url.com
```

Replace `your-backend-api-url.com` with your actual backend URL (e.g., your Render backend URL).

---

## Verification Checklist

After deployment, verify:

- [ ] Page loads with gradient background (green to gold)
- [ ] "ExamPrep" branding is visible
- [ ] Buttons are styled (not plain text links)
- [ ] Typography looks professional
- [ ] All UI components render correctly
- [ ] No console errors about missing CSS/JS files

---

## Troubleshooting

### Still Seeing Plain White Page?

1. **Clear Vercel Cache**
   - Go to **Deployments**
   - Delete all previous deployments
   - Trigger a new deployment

2. **Check Build Logs**
   - In **Deployments**, click on the latest deployment
   - Review the build logs for errors
   - Look for "Build completed" message

3. **Verify frontend/vercel.json Exists**
   - Make sure `frontend/vercel.json` is committed to git
   - It should contain proper routing configuration

4. **Force Rebuild**
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

### CSS Not Loading

- Check that `frontend/src/index.css` imports Tailwind directives
- Verify `frontend/tailwind.config.js` includes correct content paths
- Ensure build completes without errors

### API Calls Failing

- Set `VITE_API_URL` environment variable in Vercel
- Check that backend is deployed and accessible
- Verify CORS is configured on backend

---

## Contact

If issues persist, check:
- Vercel deployment logs
- Browser console for errors
- Network tab for failed requests

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
