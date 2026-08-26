# 🚀 SmartGrow — EC2 Deployment Guide

This document explains how to build and deploy the SmartGrow frontend (`apps/web`) to an AWS EC2 instance using **Nginx** as the web server, with **PM2** for process management and **HTTPS via Certbot (Let's Encrypt)**.

---

## 📋 Prerequisites

| Requirement        | Detail                                                    |
| ------------------ | --------------------------------------------------------- |
| AWS EC2 Instance   | Ubuntu 22.04 LTS (`t3.small` or larger recommended)       |
| Security Groups    | Ports `22` (SSH), `80` (HTTP), `443` (HTTPS) open inbound |
| Domain / Subdomain | Pointed to your EC2 Elastic IP (e.g. `app.smartgrow.in`)  |
| Node.js            | v20+ (installed via `nvm` on the server)                  |
| Git                | To clone the repository                                   |

---

## 1. 🔑 Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@<your-ec2-public-ip>
```

---

## 2. 🛠️ Initial Server Setup

Run these once on a fresh EC2 instance:

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl unzip nginx certbot python3-certbot-nginx

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell profile to activate nvm
source ~/.bashrc   # or ~/.zshrc if using zsh

# Install Node.js LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verify versions
node -v   # should output v20.x.x
npm -v

# Install PM2 globally (keeps the preview server alive if needed)
npm install -g pm2
```

---

## 3. 📦 Clone the Repository

```bash
# Navigate to a suitable directory
cd /var/www

# Clone your repo (use SSH key or HTTPS)
sudo git clone https://github.com/<your-org>/smartgrow-new.git smartgrow
sudo chown -R ubuntu:ubuntu /var/www/smartgrow
cd /var/www/smartgrow
```

> [!TIP]
> For private repositories, set up a **GitHub Deploy Key** on the EC2 instance and add the public key to your GitHub repo's _Settings → Deploy Keys_.

---

## 4. ⚙️ Configure Environment Variables

The app reads environment variables at **build time** via Vite's `import.meta.env`.

```bash
# Copy the example env file
cp apps/web/.env.example apps/web/.env

# Edit with your production values
nano apps/web/.env
```

**`apps/web/.env` (production)**:

```env
VITE_API_BASE_URL=https://api.smartgrow.in
VITE_APP_ENV=production
```

> [!CAUTION]
> Never commit `.env` to Git. It is already listed in `.gitignore`.

---

## 5. 🏗️ Install Dependencies & Build

```bash
cd /var/www/smartgrow

# Install all monorepo dependencies
npm install

# Run typechecks (must exit with 0 errors)
npm run typecheck

# Build production bundle for all packages
npm run build
```

The production-ready static files are output to:

```
apps/web/dist/
```

> [!NOTE]
> The build includes automatic **code-splitting** — each route (Login, Signup, Home, 404) is a separate lazy-loaded JS chunk for faster initial page loads.

---

## 6. 🌐 Configure Nginx

### 6a. Create the Nginx Site Config

```bash
sudo nano /etc/nginx/sites-available/smartgrow
```

Paste the following (replace `app.smartgrow.in` with your domain):

```nginx
server {
    listen 80;
    server_name app.smartgrow.in;

    root /var/www/smartgrow/apps/web/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1024;
    gzip_vary on;

    # Cache static assets aggressively (Vite hashes filenames)
    location ~* \.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Serve index.html for all routes (React SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
}
```

### 6b. Enable the Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/smartgrow /etc/nginx/sites-enabled/

# Remove the default site (optional but recommended)
sudo rm /etc/nginx/sites-enabled/default

# Test the nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 7. 🔒 Enable HTTPS with Let's Encrypt

```bash
# Obtain SSL certificate (replace with your domain and email)
sudo certbot --nginx -d app.smartgrow.in --email you@smartgrow.in --agree-tos --no-eff-email

# Certbot automatically updates your Nginx config to redirect HTTP → HTTPS
# Test the auto-renewal timer
sudo systemctl status certbot.timer
```

After running Certbot, your Nginx config will be updated to listen on port `443` with SSL, and all HTTP traffic will redirect to HTTPS automatically.

---

## 8. 🔁 Updating the Deployment (Re-deploy)

When you push new code, SSH into the server and run:

```bash
cd /var/www/smartgrow

# Pull latest changes
git pull origin master

# Install any new dependencies
npm install

# Run typecheck
npm run typecheck

# Rebuild production bundle
npm run build

# Nginx serves the static files directly — no restart needed!
# The new dist/ files are picked up immediately.
echo "✅ Deployment complete!"
```

> [!TIP]
> Consider automating this with a **GitHub Actions CD workflow** that SSHes into EC2 and runs the above commands on every push to `master`.

---

## 9. 🤖 Optional: GitHub Actions CD Pipeline

Create `.github/workflows/deploy.yml` in your repo:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH and Deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/smartgrow
            git pull origin master
            npm install
            npm run typecheck
            npm run build
            echo "✅ Deployed at $(date)"
```

**GitHub Secrets to set:**

| Secret        | Value                               |
| ------------- | ----------------------------------- |
| `EC2_HOST`    | Your EC2 public IP or domain        |
| `EC2_SSH_KEY` | Contents of your `.pem` private key |

---

## 10. 🏥 Health Check & Monitoring

```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx access logs (live)
sudo tail -f /var/log/nginx/access.log

# Check nginx error logs (live)
sudo tail -f /var/log/nginx/error.log

# Reload nginx without downtime
sudo systemctl reload nginx

# Check disk space (dist folder)
du -sh /var/www/smartgrow/apps/web/dist/
```

---

## 11. 📁 Final Directory Structure on EC2

```
/var/www/smartgrow/
├── apps/
│   └── web/
│       ├── dist/                ← Production build (served by Nginx)
│       │   ├── index.html
│       │   └── assets/
│       ├── src/
│       └── .env                 ← Production env vars (NOT in git)
├── packages/
│   └── ui/
├── docs/
├── AGENTS.md
└── package.json
```

---

## 12. 🔒 Security Checklist Before Going Live

- [ ] `.env` is NOT committed to Git
- [ ] Security group allows only ports `22`, `80`, `443`
- [ ] SSH key-based authentication only (disable password login)
- [ ] `VITE_API_BASE_URL` points to your production API
- [ ] HTTPS is enabled via Certbot
- [ ] Nginx security headers are set (`X-Frame-Options`, `X-Content-Type-Options`, etc.)
- [ ] `npm run typecheck` exits with 0 errors
- [ ] `npm run build` exits with 0 errors

---

## 📞 Troubleshooting

| Problem               | Fix                                                                               |
| --------------------- | --------------------------------------------------------------------------------- |
| Blank page on refresh | Ensure `try_files $uri $uri/ /index.html;` is in Nginx config                     |
| CSS/JS not loading    | Check `gzip` settings and `Cache-Control` headers                                 |
| Nginx config error    | Run `sudo nginx -t` to see exact error                                            |
| SSL certificate error | Run `sudo certbot renew --dry-run` to test renewal                                |
| Build fails           | Run `npm run typecheck` first to catch TS errors                                  |
| 403 Forbidden         | Check ownership: `sudo chown -R ubuntu:www-data /var/www/smartgrow/apps/web/dist` |
