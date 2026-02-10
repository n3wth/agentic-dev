# Agentic.dev - AI Agent Orchestration Consulting

Production-ready consulting landing page for AI agent orchestration services powered by n3wth-orchestrator.

## 🚀 Live Site

**Production URL:** https://agentic-dev-rho.vercel.app

## ✨ Features

### Production SaaS Features
- ✅ **Contact Form** - FormSubmit.co integration (serverless, no backend needed)
- ✅ **Cal.com Booking Links** - Direct calendar booking for consultations
- ✅ **Project Inquiry System** - Detailed form with budget/timeline fields
- ✅ **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- ✅ **Analytics Ready** - Event tracking for CTAs and scroll depth
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **Fast Loading** - Static HTML, no heavy frameworks

### Design System
- Clean, minimal Apple-inspired design
- Space Grotesk + Geist font pairing
- Subtle animations and transitions
- Professional color palette (#1d1d1f, #f5f5f7, #e5e5ea)

### Content Highlights
- n3wth-orchestrator proof points (360x cost improvement, $0.59 for 11 PRs)
- Three core service offerings
- Battle-tested tech stack showcase
- Clear pricing ($200/hr consulting rate)
- GitHub repository link

## 📋 Setup Instructions

### 1. Form Configuration
The contact form uses FormSubmit.co and is configured to send to `o@newth.ai`. To change:
```html
<form action="https://formsubmit.co/YOUR-EMAIL" method="POST">
```

### 2. Calendar Links
Update Cal.com links in index.html:
```html
<a href="https://cal.com/YOUR-USERNAME/consultation">Book Consultation</a>
<a href="https://cal.com/YOUR-USERNAME/project">Book Project Discovery</a>
```

### 3. Custom Domain Setup

#### Option A: Using Vercel Dashboard (Easiest)
1. Go to https://vercel.com/n3wth/agentic-dev/settings/domains
2. Click "Add Domain"
3. Enter `agentic.dev` or your preferred domain
4. Follow DNS configuration instructions

#### Option B: Using CLI
```bash
vercel domains add agentic.dev
```

#### DNS Configuration
Add these records to your domain:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Deploy Updates
```bash
cd /Users/n3wth/.openclaw/workspace/revenue-sprint/agentic-dev
git add -A
git commit -m "Your update message"
vercel --prod
```

## 🔧 Customization Guide

### Update Pricing
Edit the pricing section in `index.html`:
```html
<div class="pricing-amount">$200<span>...
```

### Add More Services
Copy the `.service-card` block and modify:
```html
<div class="service-card">
    <svg class="service-icon">...</svg>
    <h3 class="service-title">Your Service</h3>
    <p class="service-description">Description...</p>
    <ul class="service-list">...</ul>
</div>
```

### Change Tech Stack
Edit the `.tech-grid` section:
```html
<div class="tech-item">
    <div class="tech-name">Your Tech</div>
</div>
```

### Update Proof Points
Modify the stats in `.proof-stats`:
```html
<div>
    <div class="proof-stat-value">360x</div>
    <div class="proof-stat-label">Cost Improvement</div>
</div>
```

## 📊 Analytics & Tracking

Current implementation includes:
- Console logging for CTA clicks
- Scroll depth tracking (25%, 50%, 75%, 100%)

To add Google Analytics:
```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎯 Revenue Optimization Tips

### Immediate Actions
1. ✅ Set up Cal.com account and update booking links
2. ✅ Test FormSubmit by submitting a test inquiry
3. ⏳ Add custom domain (agentic.dev recommended)
4. ⏳ Set up Google Analytics for conversion tracking
5. ⏳ Create Stripe payment links for retainer packages

### Content Improvements
- Add case studies section with client testimonials
- Create downloadable "Agent System Audit" lead magnet
- Add blog/articles section for SEO
- Include video demo of n3wth-orchestrator

### Conversion Optimization
- A/B test headline variants
- Add urgency ("Limited slots available")
- Include social proof (Twitter mentions, GitHub stars)
- Add FAQ section for common objections

## 🔗 Key Links

- **Live Site:** https://agentic-dev-rho.vercel.app
- **Vercel Dashboard:** https://vercel.com/n3wth/agentic-dev
- **GitHub Repo (n3wth-orchestrator):** https://github.com/n3wth/orchestrator
- **Cal.com Setup:** https://cal.com/newth

## 📧 Contact

For questions about this implementation:
- Email: o@newth.ai
- GitHub: github.com/n3wth

---

**Status:** ✅ Production Ready | 🚀 Deployed | 💰 Revenue Enabled
