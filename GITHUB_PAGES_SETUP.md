# GitHub Pages Setup for Sentiment Slider v2

This document explains how to properly set up GitHub Pages for the Sentiment Slider demo and documentation.

## Steps for Setting Up GitHub Pages

1. **Push your code to the `main` branch**
   
   Make sure all your code is committed and pushed to the `main` branch of your repository.

2. **Configure GitHub Pages in Repository Settings**

   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to the "Pages" section
   - Under "Build and deployment", select:
     - Source: "Deploy from a branch"
     - Branch: "gh-pages" / "/(root)"
   - Click "Save"

3. **Wait for the Deployment**

   - GitHub Actions will automatically deploy your pages to GitHub Pages
   - You can check the status in the "Actions" tab of your repository
   - Once complete, your site will be available at `https://[your-username].github.io/sentiment-slider/`

## Important Files for GitHub Pages

- **`/docs` directory**: Contains all the files for the GitHub Pages site
  - `index.html`: The main demo page
  - `documentation.html`: Component documentation
  - `styles.css`: Styles for the GitHub Pages site
  - `demo.js`: JavaScript for the interactive demo
  - `.nojekyll`: Prevents GitHub from processing the site with Jekyll

- **`.github/workflows/pages.yml`**: GitHub Actions workflow that automatically deploys the `/docs` directory to GitHub Pages when you push to main

## Testing Locally

To test the GitHub Pages site locally before deploying:

1. Navigate to the `/docs` directory
2. Start a local server:
   ```
   npx serve
   ```
   or
   ```
   python -m http.server
   ```
3. Open your browser to the local server address (typically `http://localhost:5000` or `http://localhost:8000`)

## Troubleshooting

- If your site isn't deploying, check the "Actions" tab to see if there are any workflow errors
- Make sure you have the `.nojekyll` file in your `/docs` directory
- If styles aren't loading, check the paths in your HTML files

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)