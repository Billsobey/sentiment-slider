# Setting Up GitHub Pages for Sentiment Slider

This document explains how to properly set up GitHub Pages to display the interactive demo instead of the README file.

## Option 1: Configure in Repository Settings

1. Go to your GitHub repository at `https://github.com/Billsobey/sentiment-slider`
2. Click on **Settings** (tab near the top right)
3. Scroll down to the **GitHub Pages** section
4. Under **Source**, select "Deploy from a branch"
5. Under **Branch**, select "main" and "/docs" folder, then click **Save**
6. Wait a few minutes for GitHub Pages to build and deploy your site
7. Your site will be available at `https://billsobey.github.io/sentiment-slider/`

## Option 2: Create a gh-pages Branch

Alternatively, you can create a dedicated `gh-pages` branch:

```bash
# Clone the repository if you haven't already
git clone https://github.com/Billsobey/sentiment-slider.git
cd sentiment-slider

# Create and checkout a new orphan branch (no history)
git checkout --orphan gh-pages

# Remove all files from the working directory
git rm -rf .

# Copy the contents of the docs folder to the root of this branch
# (You can do this manually or with a script)

# Add all files
git add .

# Commit changes
git commit -m "Set up GitHub Pages"

# Push to GitHub
git push origin gh-pages
```

## Option 3: Change GitHub Pages Settings in Repository Configuration

You can also add a `.github/workflows/pages.yml` file (which we've already added) and configure GitHub Pages to use this GitHub Actions workflow:

1. Go to your GitHub repository settings
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select "GitHub Actions"
4. This will use our existing workflow file to build and deploy the site

## Troubleshooting

If you're still seeing the README instead of the interactive demo:

1. Check that the files are properly organized in the `/docs` folder
2. Ensure there's an `index.html` file in the root of your GitHub Pages source
3. Check the GitHub Pages build logs for any errors
4. It might take a few minutes for changes to take effect after updating settings

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)