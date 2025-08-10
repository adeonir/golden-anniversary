# Project Overview - Golden Anniversary

## Project Context

Commemorative website for Iria & Ari's 50th wedding anniversary.
**Celebration date**: November 8, 2025, 6:30 PM

## Objectives

- Promote and celebrate 50 years of marriage
- Provide a memorable digital experience
- Allow family and friends to leave heartfelt messages
- Create an interactive photo gallery of special moments

## Target Audience

- **Visitors**: Family and friends of the couple (ages 20-80, varying tech familiarity levels)
- **Admin**: Developer/family member responsible for the site (full content control)

## Key Features

### 1. Hero/Header

Elegant couple presentation with names, special date, and golden design.

### 2. Countdown

Countdown timer to November 8, 2025, 6:30 PM (days, hours, minutes, seconds) with real-time updates.

### 3. Gallery

- Main carousel + thumbnail grid
- Lazy loading and image optimization
- Navigation via arrows and clickable thumbnails
- Manual upload by admin via panel

### 4. Guestbook (Guest Messages)

- **Posting**: Any visitor can send a message (500 chars max)
- **Moderation**: All messages require admin approval
- **Workflow**: Pending → Admin approves/rejects → Visible (5 per page)
- **Notification**: Daily digest at 8 PM via Vercel Cron

### 5. Family Messages

Special dedicated section for messages from children and grandchildren of the couple.

### 6. Timeline

Important milestones in the couple's life with interactive visualization.

### 7. Footer

Inspirational quote, credits, and future links.

### 8. Admin Panel

- Authentication via JWT tokens (stateless)
- Approve/reject guestbook messages
- Upload and manage gallery photos via ImageKit
- Basic usage statistics

## Critical Flows

### Guestbook Flow

1. Visitor fills name + message → Sends
2. Message saved with 'pending' status
3. Admin accesses panel → Approves/Rejects messages
4. Only 'approved' messages appear on site

### Gallery Flow

1. Admin uploads photos via panel
2. Images processed and saved to ImageKit CDN
3. Automatic blur placeholders generated
4. Order defined by 'order' field in database
5. Lazy loading implemented for performance
6. Smooth navigation between photos in carousel

## Performance Targets

- Load time < 3 seconds
- Support up to 1,000 guestbook messages
- 99.9% uptime during active period
- Green Core Web Vitals (LCP, FID, CLS)

## Known Limitations

- Manual message moderation (no automation but could be integrated with some AI)
- Photo uploads only via admin panel
- No real-time notifications for new messages
