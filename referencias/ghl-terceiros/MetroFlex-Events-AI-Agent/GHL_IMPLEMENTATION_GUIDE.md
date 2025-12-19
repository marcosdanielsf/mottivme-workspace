# MetroFlex Events - GoHighLevel Implementation Guide
**Complete Step-by-Step Deployment Instructions**

## Overview

This guide walks you through deploying the MetroFlex Events website to GoHighLevel's Site Builder. The website is **100% custom-coded** with modular components designed for easy copy-paste implementation.

---

## What You're Getting

### Files Included

1. **METROFLEX_HOMEPAGE_COMPLETE.html** - Full homepage (production-ready)
2. **components/01_hero_vintage_video.html** - Standalone hero component
3. **DESIGN_SYSTEM.md** - Complete design tokens and guidelines
4. **ASSET_SOURCING_GUIDE.md** - Where to get videos/images legally
5. **This file** - Step-by-step deployment instructions

### Features

✅ **World-Class SEO**
- Schema.org JSON-LD markup (Organization + Events)
- Semantic HTML5 (header, nav, main, article, footer)
- Meta tags (description, keywords, Open Graph, Twitter Cards)
- Mobile-responsive meta viewport
- Accessible ARIA labels

✅ **Responsive Design**
- Mobile-first CSS approach
- Breakpoints: 768px (tablet), 480px (mobile)
- Touch-optimized buttons (44px minimum)
- Reduced motion support

✅ **Premium Design**
- MetroFlex Championship Series branding
- Dark industrial theme with red accents
- Bebas Neue typography (athletic, bold)
- Smooth animations and hover effects
- Film grain aesthetic

✅ **Performance Optimized**
- Inline CSS (no external dependencies)
- Compressed file sizes
- Lazy loading ready
- Fast page load

---

## Pre-Deployment Checklist

### 1. Asset Preparation

**Required Assets:**

- [ ] **Video Background** (hero section)
  - Format: MP4
  - Size: Under 10MB
  - Resolution: 1920x1080
  - See ASSET_SOURCING_GUIDE.md for sources

- [ ] **MetroFlex Logo** (PNG with transparent background)
  - Request from brian@metroflexgym.com
  - Or use text-only logo (already in code)

- [ ] **Event Photos** (3 images for event cards)
  - 800x600px each
  - Under 300KB each
  - See ASSET_SOURCING_GUIDE.md for sources

- [ ] **Favicon** (optional but recommended)
  - 32x32px or 16x16px
  - .ico or .png format

### 2. Content Preparation

**Information You Need:**

- [ ] Event dates and locations (update placeholders)
- [ ] Registration links (replace `#register` placeholders)
- [ ] Contact information (verify phone/email)
- [ ] Social media URLs (Facebook, Instagram)
- [ ] Any custom copy changes

---

## Deployment Method

### Option A: Full Page Deployment (Recommended for New Site)

**Best for:** Brand new website or complete redesign

**Steps:**

1. **Access GHL Site Builder**
   - Log in to GoHighLevel
   - Navigate to Sites → Select your site
   - Click "Edit" to open Site Builder

2. **Create New Page**
   - Click "+ Add Page"
   - Name: "Home" or "Index"
   - URL Slug: leave blank (for homepage) or "home"

3. **Switch to Code View**
   - Click the `</>` icon in top toolbar
   - Delete all default code
   - Copy entire contents of `METROFLEX_HOMEPAGE_COMPLETE.html`
   - Paste into code editor

4. **Save and Preview**
   - Click "Save"
   - Click "Preview" to see desktop view
   - Toggle "Mobile View" to test responsiveness

5. **Set as Homepage**
   - Go to Site Settings
   - Set this page as default/index page

**Pros:**
- Fastest deployment (5 minutes)
- Complete control over code
- All SEO features intact

**Cons:**
- Harder to edit using visual builder later
- Requires code knowledge for future changes

---

### Option B: Modular Component Deployment (Recommended for Existing Site)

**Best for:** Adding sections to existing GHL site

**Steps:**

#### Component 1: Navigation

1. Add new Section at top of page
2. Click Section Settings (gear icon)
3. Go to "Custom Code" tab
4. Copy navigation code from `METROFLEX_HOMEPAGE_COMPLETE.html` (lines 195-210)
5. Paste and Save

#### Component 2: Hero Section

1. Add new Section below navigation
2. Click Section Settings → Custom Code
3. Option A: Use standalone component
   - Copy all code from `components/01_hero_vintage_video.html`
4. Option B: Use simplified version
   - Copy hero code from `METROFLEX_HOMEPAGE_COMPLETE.html` (lines 212-233)
5. **Important:** Upload video to GHL Media Library first
6. Replace `VIDEO_URL.mp4` with your actual video URL
7. Save

#### Component 3: Events Section

1. Add new Section
2. Custom Code tab
3. Copy events section code from `METROFLEX_HOMEPAGE_COMPLETE.html` (lines 235-287)
4. Update event details:
   - Event titles
   - Dates (replace "TBA 2025" with actual dates)
   - Locations
   - Registration links (replace `#register`)
5. Save

#### Component 4: Stats Section

1. Add new Section
2. Custom Code tab
3. Copy stats section code (lines 289-310)
4. Customize numbers if needed
5. Save

#### Component 5: Footer

1. Add final Section
2. Custom Code tab
3. Copy footer code (lines 312-343)
4. Update:
   - Social media URLs
   - Contact information
   - Copyright year
5. Save

**Pros:**
- Modular, easy to rearrange
- Can mix with GHL visual builder sections
- Easier for non-coders to manage

**Cons:**
- Takes longer (20-30 minutes)
- Need to manage CSS conflicts if mixing with GHL elements

---

## Step-by-Step: Full Deployment Walkthrough

### Step 1: Upload Video to GHL Media Library

1. In GHL dashboard, go to **Media** section
2. Click **Upload**
3. Select your compressed MP4 video (under 10MB)
4. Wait for upload to complete
5. Right-click uploaded video → **Copy Link**
6. Save this URL (you'll need it in Step 4)

### Step 2: Create New Page

1. Go to **Sites** → Your Site
2. Click **Pages** tab
3. Click **+ Add Page**
4. Settings:
   - Page Name: "Home"
   - URL Slug: (leave blank for homepage)
   - Page Type: "Standard"
5. Click **Create Page**

### Step 3: Switch to Code Editor

1. In Page Builder, click `</>` Code View icon (top toolbar)
2. You'll see default HTML code
3. **Select All** (Cmd+A or Ctrl+A)
4. **Delete**

### Step 4: Paste Custom Code

1. Open `METROFLEX_HOMEPAGE_COMPLETE.html` on your computer
2. Select All → Copy
3. Return to GHL Code Editor
4. Paste

### Step 5: Update Video URL

1. In code editor, press Cmd+F (or Ctrl+F) to find
2. Search for: `VIDEO_URL.mp4`
3. Replace with your actual video URL from Step 1
4. Example: `https://storage.gohighlevel.com/media/abc123/metroflex-hero.mp4`

### Step 6: Customize Content

**Required Updates:**

1. **Event Dates**
   - Find: `<p class="event-date"><strong>Date:</strong> TBA 2025</p>`
   - Replace "TBA 2025" with actual dates

2. **Event Locations**
   - Update all location text as needed

3. **Registration Links**
   - Find: `href="#register"`
   - Replace with actual registration form URLs
   - Example: `href="https://forms.gohighlevel.com/your-form-id"`

4. **Social Media Links**
   - Find: `href="https://www.facebook.com/metroflexevents"`
   - Update with actual URLs

5. **Contact Information**
   - Verify phone number: (817) 465-9331
   - Verify email: brian@metroflexgym.com

### Step 7: SEO Optimization

1. **Page Title** (line 16)
   - Current: "MetroFlex Events | Texas Premier NPC Bodybuilding Competitions..."
   - Customize if needed

2. **Meta Description** (line 14)
   - Current: "MetroFlex Events hosts Texas' premier NPC bodybuilding competitions..."
   - Edit for your specific focus

3. **Open Graph Images** (lines 22, 29)
   - Upload social share image (1200x630px recommended)
   - Replace placeholder URLs with actual image URLs

4. **Schema.org Data** (lines 36-86)
   - Update event dates in JSON-LD
   - Add more events if needed

### Step 8: Test Responsiveness

1. Click **Preview** (desktop view)
2. Check all sections load correctly
3. Click videos play/pause as expected
4. Test all links work

5. Click **Mobile View** toggle
6. Verify:
   - Text is readable
   - Buttons are tappable
   - Layout adjusts properly
   - Video pauses on mobile (performance optimization)

### Step 9: Test on Real Devices

1. Click **Publish** (temporary)
2. Get preview URL
3. Open on:
   - iPhone (Safari)
   - Android phone (Chrome)
   - iPad (Safari)
   - Desktop (Chrome, Firefox, Safari)
4. Verify everything works

### Step 10: Final Publish

1. Make any final adjustments
2. Click **Publish** (final)
3. Set as homepage in Site Settings
4. Test live URL
5. Submit to Google Search Console (for SEO indexing)

---

## Customization Guide

### Changing Colors

**Find and Replace:**

| Element | Current Color | CSS Variable |
|---------|---------------|--------------|
| Primary Red | `#C41E3A` | `--mf-red` |
| Light Red | `#DC2626` | `--mf-red-light` |
| Dark Red | `#991B2E` | `--mf-red-dark` |
| Steel/Gray | `#C2C8CF` | `--mf-steel-80` |
| Gold Accent | `#FFD700` | `--mf-gold` |

**How to Change:**
1. Press Cmd+F in code editor
2. Find: `#C41E3A` (old color)
3. Replace All with your new color (e.g., `#FF0000` for bright red)

### Changing Typography

**Headline Font:**
- Current: Bebas Neue (bold, athletic)
- To change: Find `--font-display: 'Bebas Neue'`
- Replace with: `'Your Font Name', sans-serif`
- Add Google Font link to `<head>` if needed

**Body Font:**
- Current: Inter (clean, modern)
- To change: Find `--font-body: 'Inter'`
- Replace with your preferred font

### Adding More Events

**Duplicate Event Card:**

1. Find this block in code:
```html
<article class="event-card">
    <h3 class="event-title">NPC Better Bodies Mutant Classic</h3>
    ...
</article>
```

2. Copy entire `<article>...</article>` block
3. Paste below existing event cards (inside `.events-grid`)
4. Update:
   - Event title
   - Date
   - Location
   - Description
   - Registration link

### Adding Logo Image

**Replace Text Logo with Image:**

1. Upload logo PNG to GHL Media Library
2. Copy logo URL
3. Find this code:
```html
<div class="logo">Metro<span>Flex</span> Events</div>
```

4. Replace with:
```html
<div class="logo">
    <img src="YOUR_LOGO_URL.png" alt="MetroFlex Events" width="200" height="60">
</div>
```

5. Adjust CSS if needed:
```css
.logo img {
    height: 60px;
    width: auto;
}
```

---

## Troubleshooting

### Issue: Video Not Playing

**Possible Causes:**
1. Video URL is incorrect
2. Video file too large (over 10MB)
3. Wrong video format (not MP4/H.264)

**Solutions:**
- Verify video URL is correct
- Compress video to under 10MB
- Convert to MP4 format using HandBrake
- Test video URL directly in browser

### Issue: Fonts Not Loading

**Cause:** Google Fonts blocked or slow to load

**Solution:**
- Fonts are loaded from Google Fonts CDN (line 33)
- If blocked, fonts fallback to 'Arial Black' and 'system-ui'
- Can upload custom fonts to GHL if needed

### Issue: Page Looks Broken on Mobile

**Possible Causes:**
1. Missing viewport meta tag
2. CSS not loading properly

**Solutions:**
- Verify this line exists in `<head>`:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- Check browser console for CSS errors
- Clear browser cache and reload

### Issue: Links Not Working

**Cause:** Placeholder links (`#`) not updated

**Solution:**
- Find all `href="#register"` and replace with actual URLs
- Find all `href="#events"` and replace with page anchors or URLs
- Test each link manually

### Issue: Images Not Loading

**Cause:** Image URLs incorrect or broken

**Solution:**
- Upload images to GHL Media Library
- Copy exact URL from Media Library
- Replace placeholder URLs in code
- Verify URLs work by pasting in browser

---

## Performance Optimization

### Video Optimization

**Before Upload:**
1. Compress to under 10MB using:
   - HandBrake (desktop app)
   - VideoSmaller.com (online)
   - FFmpeg (command line)

2. Settings:
   - Format: MP4 (H.264 codec)
   - Resolution: 1920x1080 or 1280x720
   - Frame Rate: 30fps or 24fps
   - Bitrate: 2-5 Mbps

3. Add poster image (fallback):
   - Export single frame from video as JPG
   - Compress to under 100KB
   - Upload to GHL
   - Add to video tag:
     ```html
     <video ... poster="POSTER_URL.jpg">
     ```

### Image Optimization

**Tools:**
- TinyPNG (https://tinypng.com/) - Best compression
- Squoosh (https://squoosh.app/) - WebP conversion

**Target Sizes:**
- Hero background: Under 500KB
- Event cards: Under 300KB each
- Logo: Under 50KB

### Page Load Speed

**Current Optimizations:**
- ✅ Inline CSS (no external stylesheet requests)
- ✅ Minimal JavaScript
- ✅ System fonts as fallbacks
- ✅ Mobile video auto-pause

**Further Optimizations:**
- Convert images to WebP format
- Add lazy loading to images:
  ```html
  <img src="image.jpg" loading="lazy" alt="Description">
  ```
- Minify HTML before deploying (optional)

---

## SEO Best Practices

### Already Included

✅ **Schema.org Markup**
- Organization schema
- Event schema
- LocalBusiness schema (address, contact)

✅ **Meta Tags**
- Title tag (60 characters)
- Description (155 characters)
- Keywords
- Open Graph (Facebook)
- Twitter Cards

✅ **Semantic HTML**
- `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for accessibility

### Post-Launch SEO Tasks

**1. Submit to Google Search Console**
- URL: https://search.google.com/search-console
- Add your domain
- Submit sitemap

**2. Create Sitemap**
- In GHL, go to Site Settings
- Enable XML sitemap
- Submit to Google

**3. Set Up Google Analytics**
- Add tracking code to GHL site settings
- Monitor traffic and user behavior

**4. Verify Schema Markup**
- Test URL: https://search.google.com/test/rich-results
- Paste your live URL
- Fix any errors

**5. Optimize for Local SEO**
- Add business to Google My Business
- Include location keywords in content
- Build local citations (Yelp, Yellow Pages, etc.)

---

## Maintenance & Updates

### Updating Event Information

**How Often:** Monthly or as new events are added

**Steps:**
1. Edit page in GHL Site Builder
2. Find event card section
3. Update dates, locations, registration links
4. Save and publish

### Adding New Events

**Frequency:** 2-4 times per year

**Steps:**
1. Duplicate an existing event card block
2. Update all content (title, date, location, description)
3. Add new event to Schema.org JSON-LD
4. Update "Upcoming Events" count if displayed

### Seasonal Updates

**Every 6 Months:**
- Update copyright year in footer
- Refresh event photos
- Update stats (e.g., "300+ Pro Cards" → "350+ Pro Cards")
- Review and update testimonials

---

## Support & Resources

### GoHighLevel Resources
- GHL Support: https://support.gohighlevel.com/
- GHL Community: https://www.facebook.com/groups/gohighlevel
- GHL YouTube: https://www.youtube.com/c/GoHighLevel

### Web Development Resources
- HTML/CSS Help: https://www.w3schools.com/
- Responsive Design: https://web.dev/responsive-web-design-basics/
- SEO Guide: https://developers.google.com/search/docs

### MetroFlex Contact
- Email: brian@metroflexgym.com
- Phone: (817) 465-9331

---

## Checklist: Final Launch

- [ ] All videos uploaded and tested
- [ ] All images optimized and uploaded
- [ ] All event information updated (dates, locations)
- [ ] All links working (registration, social media)
- [ ] Contact information verified
- [ ] Logo added (if available)
- [ ] Favicon added
- [ ] Mobile responsive tested on real devices
- [ ] Desktop tested in Chrome, Firefox, Safari
- [ ] Page speed tested (Google PageSpeed Insights)
- [ ] Schema.org validated (Google Rich Results Test)
- [ ] Google Analytics added
- [ ] Submitted to Google Search Console
- [ ] Social media updated with new website URL
- [ ] Email signature updated with website URL

---

**Deployment Time Estimate:**
- Full page: 30-60 minutes (first time)
- Updates: 5-10 minutes

**Questions?**
- Review DESIGN_SYSTEM.md for design guidelines
- Review ASSET_SOURCING_GUIDE.md for video/image sources
- Contact developer or GHL support for technical issues

**Good luck with your launch! 🚀**
