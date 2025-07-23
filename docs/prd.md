# PRD

## Overview

**Objective**: Create a commemorative website to promote and celebrate the 50th wedding anniversary of Iria & Ari.

**Timeline**: Party on November 8, 2025

**Audience**: Couple's family and friends

## Product Objectives

### Main Objective

Promote Iria & Ari's 50th wedding anniversary and provide a memorable digital experience to celebrate this achievement.

## Personas

### Guest/Visitor

- Couple's family and friends
- Ages vary (20-80 years)
- Different levels of tech familiarity
- Access via mobile and desktop
- Wants to leave a heartfelt message

### Administrator

- Developer and family member responsible for the site
- Full control over content
- Message moderation
- Photo gallery management

## Features

### 1. Header/Hero Section

- **Description**: Main section with couple's names, special date, and elegant design
- **Content**: Static
- **Responsibility**: Present the couple and the reason for the celebration

### 2. Countdown

- **Description**: Countdown timer to the party date
- **Target date**: November 8, 2025, 7:00 PM
- **Format**: Days, hours, minutes, seconds
- **Behavior**: Real-time updates

### 3. Photo Gallery

- **Control**: Initial manual upload (admin via panel in backlog)
- **Viewing**: Main carousel + thumbnail grid
- **Performance**: Lazy loading and image optimization
- **Navigation**: Arrows, clickable thumbnails
- **Responsiveness**: Adaptable to mobile and desktop

### 4. GuestBook

- **Posting**: Any visitor can send a message
- **Moderation**: All messages require admin approval
- **Notification**: Daily digest at 8 PM with all pending messages (via Vercel Cron)
- **Limit**: 500 characters per message
- **Required fields**: Name and message
- **Display**: 5 messages per page (pagination)
- **Status**: Pending → Approved → Visible

### 5. Family Messages

- **Description**: Special section with messages from children and grandchildren
- **Content**: Initially static (CRUD via admin in backlog)

### 6. Timeline

- **Description**: Section dedicated to important milestones in the couple's life
- **Content**: Initially static (CRUD via admin in backlog)
- **Viewing**: Interactive timeline with dates and events
- **Design**: Timeline with event cards

### 7. Footer

- **Content**: Inspirational quote, credits
- **Future links**: Developer's website

### 8. Admin Panel

- **Access**: Authentication via Supabase Auth
- **Notifications**:
  - Email alias via environment variable
  - Fixed daily digest at 8 PM
  - Cron job via Vercel Cron + backup GitHub Actions
- **Features**:
  - Approve/reject guestbook messages
  - View basic statistics
- **Backlog**: Photo upload, CRUD family messages, CRUD timeline

## Success Criteria

### Technical

- **Performance**: Load time < 3 seconds
- **Responsiveness**: Works on mobile (375px+) and desktop (1024px+)
- **Scalability**: Support up to 1,000 messages
- **Availability**: 99.9% uptime during active period

### UX/UI

- **Accessibility**: Adequate contrast, keyboard navigation
- **Usability**: Intuitive message submission flow
- **Design**: Elegant, thematic (gold), celebratory

### Functional

- **GuestBook**: 100% functional moderation system
- **Gallery**: Smooth display of optimized photos
- **Admin**: Simple and effective moderation interface

## Definition of Done

The product will be considered done when:

- All core features are implemented
- Responsive design is working
- Moderation system is operational
- Performance meets criteria
- Deployment completed and domain configured
- Admin trained for basic use
