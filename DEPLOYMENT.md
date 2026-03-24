# Deployment Guide

This guide covers how to deploy IIFTA Portal to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account
- GitHub repository connected
- Environment variables configured

### Steps

1. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```json
   {
     "buildCommand": "bun run build",
     "outputDirectory": ".next",
     "installCommand": "bun install"
   }
   ```

3. **Set Environment Variables**
   ```
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-domain.vercel.app`

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/iifta
      - JWT_SECRET=your-jwt-secret
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=iifta
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# Run database migrations
docker-compose exec app bun run db:migrate

# View logs
docker-compose logs -f app
```

## 🌐 Netlify Deployment

### Build Configuration
Create `netlify.toml`:
```toml
[build]
  command = "bun run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### Environment Variables
Set in Netlify dashboard:
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## 🐧 DigitalOcean App Platform

### app.yaml
```yaml
name: iifta-portal
services:
- name: web
  source_dir: /
  github:
    repo: jitenkr2030/IIFTA
    branch: main
  run_command: bun start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
databases:
- name: db
  engine: PG
  version: "15"
```

## 🔧 AWS Deployment

### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - bun install
       build:
         commands:
           - bun run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   Set in Amplify Console:
   ```
   DATABASE_URL=your_rds_database_url
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

### Using EC2

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS
   # t3.micro (for testing)
   # t3.small (for production)
   ```

2. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Bun
   curl -fsSL https://bun.sh/install | bash
   
   # Install PM2
   sudo npm install -g pm2
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/jitenkr2030/IIFTA.git
   cd IIFTA
   
   # Install dependencies
   bun install
   
   # Set environment variables
   cp .env.example .env.local
   # Edit .env.local with production values
   
   # Build application
   bun run build
   
   # Setup database (PostgreSQL)
   sudo apt install postgresql postgresql-contrib
   sudo -u postgres createdb iifta
   
   # Run migrations
   bun run db:migrate
   
   # Start with PM2
   pm2 start bun --name "iifta" -- start
   pm2 startup
   pm2 save
   ```

## 🗄️ Database Setup

### PostgreSQL (Production)

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Windows
   # Download from postgresql.org
   ```

2. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE iifta;
   CREATE USER iifta_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE iifta TO iifta_user;
   \q
   ```

3. **Update Environment**
   ```
   DATABASE_URL="postgresql://iifta_user:your_password@localhost:5432/iifta"
   ```

### Database Migration

```bash
# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate

# Seed data (optional)
bun run db:seed
```

## 🔒 Security Considerations

### SSL/HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Update security headers

### Environment Security
- Use strong, random secrets
- Never commit .env files
- Use environment-specific configs
- Rotate secrets regularly

### Database Security
- Use strong passwords
- Limit database access
- Enable SSL connections
- Regular backups

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# PM2 Monitoring
pm2 monit

# Log viewing
pm2 logs iifta

# Restart application
pm2 restart iifta
```

### Health Checks

Create `/api/health`:
```typescript
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
}
```

## 🚦 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      
    - name: Install dependencies
      run: bun install
      
    - name: Run tests
      run: bun run test
      
    - name: Build application
      run: bun run build
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        JWT_SECRET: ${{ secrets.JWT_SECRET }}
        
    - name: Deploy to production
      run: |
        # Your deployment script here
        echo "Deploying to production..."
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check environment variables

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check database is running
   - Test connection manually

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Verify CORS settings

### Debug Commands

```bash
# Check application logs
pm2 logs iifta

# Test database connection
bun run db:push

# Check environment variables
printenv | grep NODE_ENV

# Test API endpoints
curl http://localhost:3000/api/health
```

## 📞 Support

For deployment issues:

- 📧 Email: [dev@iifta.portal.com](mailto:dev@iifta.portal.com)
- 🐛 Issues: [GitHub Issues](https://github.com/jitenkr2030/IIFTA/issues)
- 💬 Discord: [Community Support](https://discord.gg/iifta)

---

Happy deploying! 🚀