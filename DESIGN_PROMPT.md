# METALLYX Platform - Premium Dashboard Redesign Prompt

## Platform Overview
**METALLYX** is an industrial B2B marketplace connecting **Industrial Vendors** (manufacturers/suppliers) with **OEMs** (equipment manufacturers/buyers) through a bidding system, managed by **Admins** (platform operators).

### Design System Requirements
- **Primary Brand Color**: #f97316 (Orange)
- **Accent Colors**: Emerald-500 (#4ade80), Rose-500 (#f43f5e)
- **Neutral Base**: Slate-900 (#0F172A), Slate-50 (#F8F8F8)
- **Design Style**: Premium industrial aesthetic with neo-brutalist elements (bold borders, stark shadows, high contrast)
- **Typography**: Bold, uppercase tracking for headers; clean sans-serif for body
- **Spacing**: Consistent 8px grid system
- **Shadows**: Distinctive offset shadows (8px/8px primary, 4px/4px secondary)

---

## 1. VENDOR DASHBOARD (Industrial Vendor Panel)

### Purpose
Central hub for industrial vendors to track active bids, manage quotations, and monitor job wins.

### Key Sections

#### 1.1 Header Section
**Component: Page Header with Status Indicator**
- Headline: "VENDOR DASHBOARD" (4xl, font-black, uppercase)
- Subheading: "Operational Status: High Efficiency – Systems Normal"
- Status indicator: Animated green pulse dot with "Operational Status" label
- CTA Button: "BROWSE NEW RFQs" (Search icon, orange bg, bold shadow)
- Layout: Flex row, responsive to stacked on mobile

#### 1.2 KPI Stats Grid
**Component: Industrial Stat Cards (3-column grid)**
- **Card 1: Active Bids**
  - Title: "Active Bids"
  - Value: Dynamic number (e.g., 7)
  - Subtitle: "Quotes in submission"
  - Icon: FileText (orange border)
  - Trend: "+2 from last week"
  - Design: 4px border, shadow offset, industrial styling
  
- **Card 2: Jobs Won**
  - Title: "Jobs Won"
  - Value: Dynamic number (e.g., 12)
  - Subtitle: "Total fulfillment rate: 94%"
  - Icon: Trophy (emerald border)
  - Status Icon: Activity indicator (animated pulse)
  
- **Card 3: Rejected**
  - Title: "Rejected"
  - Value: Padded number (e.g., 03)
  - Subtitle: "Action required for RFQ-902"
  - Icon: Ban (rose border)

#### 1.3 Active Bids Pipeline
**Component: Industrial Bid Pipeline Table/List**
- Container: 2/3 width on desktop
- Column Headers:
  - Bid ID (extracted from jobId, uppercase)
  - Job Name/Title
  - Quantity (units)
  - Expires In (time remaining, e.g., "48h")
  - Bid Value (proposed price in ₹)
  - Status: Lock/Unlock icon with tooltip
  - Top Ranked Badge (if applicable)
  - Certification Tags (visual badges)
  - Revision Availability counter

- Row Actions:
  - Expand to view full quote details
  - Edit/Update Bid modal
  - Request Unlock (if locked by vendor)
  - View Job Details

- Expandable Row Details (in modal or drawer):
  - Proposed Price: ₹[amount]
  - Proposed Lead Time: [X] days
  - Notes/Special requirements
  - Update Count: [X] revisions allowed/used
  - Min Price Floor: ₹[amount] (reference)
  - Lock Status: Locked/Unlocked with last-locked timestamp
  - Unlock Request Status: Pending/Approved

- Visual Treatment:
  - 4px solid border, 8px shadow offset
  - Hover state: slight translate and shadow reduction
  - Status indicators: colored left border stripe

#### 1.4 Facility & Quality Insights
**Component: Image Insight Blocks (2-column grid)**
- **Block 1: Facility Insights**
  - Background: Industrial factory image
  - Overlay gradient: Slate-900 to transparent (top to bottom)
  - Label: "FACILITY INSIGHTS" (10px, font-bold, orange, tracked spacing)
  - Headline: "Optimization Protocol Alpha" (2xl, font-black, white)
  - Hover effect: Grayscale to color transition, scale 1.1x
  - Border: 4px solid slate-900, shadow offset

- **Block 2: Quality Control**
  - Background: Quality/inspection imagery
  - Label: "QUALITY CONTROL" (10px, font-bold, orange)
  - Headline: "99.8% Tolerance Accuracy" (2xl, font-black, white)
  - Same hover and border treatment as Block 1

#### 1.5 Recent Won Jobs List
**Component: Won Jobs Summary List (Right column, 1/3 width)**
- Section Title: "Recent Won Jobs" with trophy icon badge
- For each won job:
  - Badge: "AWARDED #[JOB_ID]" (emerald bg, dark text)
  - Job Title (2xl, font-black, uppercase)
  - Meta info row:
    - Quantity with calculator icon
    - Deadline with calendar icon
  - Contract Value: Prominent ₹[amount] (3xl, font-black)
  - Status label: "IN PRODUCTION" or "LOGISTICS PENDING"
  - Actions: Edit Quotation CTA
  - Hover state: Translate + shadow reduction

#### 1.6 Industrial Pulse / Market Insights
**Component: Market Intelligence Card**
- Section Title: "INDUSTRIAL PULSE"
- Content blocks (stacked):
  - **Steel Index Hike**: "↑ 3.2% Week-on-Week" with trend indicator
  - **Logistics Alerts**: "Express routes available to Chennai Hub"
  - **Export Optimization**: "Batch #409 Ready for Export Report"
  
- Design:
  - Each item: 4px border, inline icons, color-coded status
  - Call-to-action items: "Learn More" or "View Report" links

#### 1.7 Export Optimization Report CTA
**Component: Prominent CTA Block**
- Background: Orange (#f97316)
- Border: 4px solid slate-900
- Shadow: 8px offset
- Content:
  - Title: "EXPORT OPTIMIZATION REPORT" (xl, font-black, white)
  - Subtitle: "Available for Batch #409" (10px, font-bold, white, tracked)
  - Icon: Arrow Up-Right (top-right corner, animated on hover)
- Hover state: Slight translate, shadow reduction

---

## 2. OEM DASHBOARD (Buyer / Job Poster Panel)

### Purpose
Central hub for OEMs to create jobs, track submissions, and monitor vendor responses.

### Key Sections

#### 2.1 Header & Navigation
**Component: Page Header**
- Sidebar Trigger Button (mobile view, hamburger icon)
- Page Title: "OEM DASHBOARD" or "YOUR JOBS" (3xl, font-black, uppercase)
- Primary CTA Button: "POST JOB" (prominent position, orange bg)
- Logout/User Menu (top right)

#### 2.2 Summary KPI Cards
**Component: 4-Column KPI Grid**
- **Card 1: Total**
  - Title: "Total"
  - Value: Total jobs count
  - Subtitle: "Active Projects"
  - Icon: List icon
  - Design: Clean card with border, hover lift effect
  
- **Card 2: Active**
  - Title: "Active"
  - Value: In-progress count (ASSIGNED, IN_PROGRESS, QC statuses)
  - Subtitle: "Live Cycles"
  - Icon: Cpu icon
  - Highlight: Orange background (#f97316)
  
- **Card 3: Done**
  - Title: "Done"
  - Value: Completed count
  - Subtitle: "Shipped Items"
  - Icon: CheckCircle icon
  
- **Card 4: Queue**
  - Title: "Queue"
  - Value: Pending/backlog count
  - Subtitle: "Backlog Status"
  - Icon: Clock icon

#### 2.3 Job Listing Section
**Component: Job Cards List**
- Section Header:
  - Title: "YOUR JOBS" (3xl, font-black, uppercase)
  - Subtitle: "Sort: Recent" (small, tracked spacing, right-aligned)
  - Divider: 4px bottom border

- For each job card:
  - **Visual Layout**:
    - Top-left: Job Title (2xl, font-black, uppercase, slate-900)
    - Top-right: Status badge (colored by status)
    - Status legend:
      - Pending Review: Amber/yellow
      - Open: Green
      - Assigned: Blue
      - In Progress: Purple
      - QC: Indigo
      - Completed: Green-600
      - Paid: Teal
      - Cancelled: Gray
  
  - **Job Details Grid** (2-3 columns):
    - Material: "[Material] [Grade]" with icon
    - Quantity: "[X] Units" with icon
    - Deadline: "Due [DATE]" with calendar icon
    - Tolerance: "±[VALUE]" with precision icon
    - Location: "[City, State]" with location icon
  
  - **Job Description**: Brief text excerpt (truncated)
  
  - **Actions Row**:
    - View/Edit button
    - Bid Management (see bids received)
    - Delete/Archive
    - Copy Job (duplicate)
  
  - **Border & Spacing**: 4px border, 8px shadow, hover lift
  
- **Empty State**:
  - Icon: Hammer (muted color)
  - Headline: "No jobs found in your history"
  - CTA: "Post your first job"
  - Dashed border container with padding

---

## 3. OEM POST JOB PAGE

### Purpose
Form interface for OEMs to create and submit manufacturing job requests to vendors.

### Key Sections

#### 3.1 Page Header
- Title: "POST A NEW JOB" (2xl, font-black)
- Subtitle: "Fill in the details below and vendors will start submitting bids"
- Progress indicator: Step [X] of [Y] (if multi-step form)

#### 3.2 Job Details Form Sections

**Section 1: Basic Information**
- **Field: Job Title** (required)
  - Input type: Text
  - Placeholder: "CNC Machining - Steel Part X"
  - Validation: Required, min 5 chars
  
- **Field: Description** (optional)
  - Input type: Textarea
  - Placeholder: "Detailed requirements, special notes, reference documents..."
  - Validation: Max 1000 chars
  - Help text: "Be specific to attract quality bids"

**Section 2: Material & Specifications**
- **Field: Material Type** (required)
  - Input type: Text/Dropdown
  - Examples: "Steel, Aluminum, Titanium, Stainless Steel, etc."
  - Placeholder: "Steel, Aluminum, etc."
  
- **Field: Material Grade** (optional)
  - Input type: Text/Dropdown
  - Examples: "SS304, 6061-T6, EN8, etc."
  - Placeholder: "SS304, 6061-T6, EN8..."
  
- **Field: Quantity** (required)
  - Input type: Number
  - Min: 1
  - Help text: "Number of units required"
  
- **Field: Tolerance** (optional)
  - Input type: Text
  - Example: "±0.01mm, ±0.5%"
  - Placeholder: "±0.01mm"
  - Help text: "Specify precision requirements"
  
- **Field: Surface Finish** (optional)
  - Input type: Text/Dropdown
  - Examples: "Anodized, Powder Coated, Brushed, Polished, etc."
  - Placeholder: "Anodized, Powder Coated, Brushed..."

**Section 3: Job Timeline & Location**
- **Field: Deadline** (required)
  - Input type: Date picker
  - Validation: Future date only
  - Help text: "When do you need this completed?"
  
- **Field: Location** (required)
  - Input type: Text/Dropdown (city autocomplete)
  - Placeholder: "Mumbai, Delhi, Bangalore, etc."
  - Help text: "Delivery/pickup location"

**Section 4: File Attachments**
- **Component: File Dropzone**
  - Label: "ATTACH FILES" (10px, font-bold, tracked)
  - Subtitle: "(drawings, 3D models, specifications)"
  - Dropzone area: Dashed border, hover highlight
  - File types accepted: PDFs, images (JPG, PNG), 3D files (STEP, STL), office docs
  - Max file size: 25MB per file, 100MB total
  - Display: Uploaded file list with preview, remove button
  - Count indicator: "X files ready"

#### 3.3 Form Actions
- **Primary Button: "SUBMIT JOB FOR REVIEW"**
  - Full width
  - Disabled state: While submitting, show spinner
  - On submit: Validate form, show success toast, redirect to job details
  
- **Secondary Button: "SAVE AS DRAFT"** (optional)
  - Allows user to save and return later
  
- **Tertiary Link: "CANCEL"**
  - Confirms before discarding changes

#### 3.4 Error Handling
- Inline field validation errors (red border + help text)
- Form-level error banner at top
- Sticky submit button (follows scroll on mobile)

---

## 4. ADMIN DASHBOARD (Platform Management Panel)

### Purpose
Centralized hub for admins to manage vendors, approve jobs, and oversee platform operations.

### Key Sections

#### 4.1 Header
- Title: "ADMIN DASHBOARD" (4xl, font-black, uppercase)
- Right-aligned: "SIGN OUT" button
- Optional: Admin user profile dropdown
- Optional: Platform statistics summary (total jobs, vendors, transactions)

#### 4.2 Main Navigation Cards
**Component: Card Grid (2-3 columns)**

- **Card 1: Manage Vendors**
  - Icon: Users (top-right corner)
  - Header Background: Emerald-300
  - Title: "MANAGE VENDORS" (sm, font-bold, uppercase, tracked)
  - Main Action: "VERIFY" (4xl, font-black)
  - Description: "Review and approve vendor registrations"
  - Link: Navigate to "/admin/vendors"
  - Hover effect: Lift effect, shadow enhancement
  - Badge: [Number] pending (if applicable)
  
- **Card 2: Manage OEM Jobs**
  - Icon: Briefcase (top-right corner)
  - Header Background: Amber-300
  - Title: "MANAGE OEM JOBS" (sm, font-bold, uppercase, tracked)
  - Main Action: "REVIEW" (4xl, font-black)
  - Description: "Approve or reject job submissions"
  - Link: Navigate to "/admin/oem"
  - Hover effect: Lift effect, shadow enhancement
  - Badge: [Number] pending (if applicable)

---

## 5. ADMIN - VENDOR VERIFICATION PAGE

### Purpose
Interface for admins to review and approve/reject vendor registrations.

### Key Sections

#### 5.1 Page Header
- Title: "VENDOR VERIFICATION" (3xl, font-bold)
- Subtitle: "Review pending vendor registrations"
- Filter options: Status (Pending, Approved, Rejected), sort by date

#### 5.2 Vendor Review Cards Grid
**Component: Vendor Card (3-column grid, responsive)**

For each pending vendor:
- **Card Header**
  - Company Name (CardTitle, lg)
  - Vendor email (CardDescription, sm)
  - Status badge: "PENDING REVIEW" (amber)
  
- **Card Content**
  - Details section:
    - Workshop/Company Name
    - City/Location
    - Capabilities (comma-separated list)
    - Address/Full Details
    - Phone number (if available)
    - Tax ID / GST (if available)
  
  - Document verification (optional):
    - Business license status
    - Compliance certifications
    - Insurance proof
  
  - Rating/Verification score (optional): Visual progress bar

- **Card Footer**
  - Two action buttons:
    - "REJECT" button (destructive styling, red)
    - "VERIFY VENDOR" button (primary, emerald)
  
  - Optional: "REVIEW DOCUMENTS" link (opens modal/drawer)

- **Border & Styling**: 4px border, shadow offset, card background light color

#### 5.3 Bulk Actions
- Checkbox selection for multiple vendors
- Bulk approve/reject buttons (appears when items selected)
- Export vendor list (CSV)

---

## 6. ADMIN - OEM/JOB MANAGEMENT PAGE

### Purpose
Comprehensive interface for admins to review job submissions, manage vendor unlock requests, and oversee the job pipeline.

### Key Sections

#### 6.1 Page Header
- Title: "JOB MANAGEMENT" (3xl, font-bold)
- Subtitle: "Review, approve, and manage all OEM jobs"
- Filter tabs: All, Pending Review, In Progress, Completed

#### 6.2 Bid Unlock Requests Inbox
**Component: Inbox Section with Cards**
- Section header:
  - Icon: Unlock icon
  - Title: "INBOX: BID UNLOCK REQUESTS"
  - Badge counter: [Number] pending requests
  - Priority indicator: High/Medium/Low

- For each unlock request:
  - **Card Header**:
    - Vendor name (bold, lg)
    - Vendor email (muted)
    - Job name with factory icon
  
  - **Card Body**:
    - Current bid details section (highlighted background):
      - Price: ₹[amount]
      - Lead Time: [X] days
      - Notes/Comments (if any, italicized)
    - Request reason (optional): Why vendor is requesting unlock
    - Last updated timestamp
  
  - **Card Actions**:
    - "APPROVE UNLOCK" button (primary, indigo)
    - "DENY" button (secondary)
    - View full bid details link
  
  - **Styling**: 4px border, indigo-themed accent, light background

- **Empty State**: "No unlock requests at this time"

#### 6.3 Pending Job Approvals
**Component: Expandable Cards List**
- Section header:
  - Title: "PENDING APPROVAL" (xl, font-bold)
  - Badge counter: [Number] jobs awaiting review
  
- For each pending job:
  - **Card Header**:
    - Job title (lg, font-semibold)
    - Badge: "PENDING REVIEW" (amber)
    - Submitted by: OEM name (companyName)
  
  - **Card Body**:
    - Job description excerpt
    - Metadata grid (4 columns):
      - Material: [Type] · [Grade] (with icon)
      - Quantity: [Number] units (with icon)
      - Deadline: [DATE] (with calendar icon)
      - Location: [City] (with location icon)
    - Additional details (if present):
      - Surface Finish: [Type]
      - Tolerance: [Value]
  
  - **Card Actions**:
    - "APPROVE" button (launches approval dialog/modal)
    - "REJECT" button (destructive, red)
    - "VIEW DETAIL" button (secondary, with chevron)
  
  - **Approval Dialog** (modal):
    - Confirmation message
    - Optional comments field for approval notes
    - Publish date selector (when job goes live)
    - "CONFIRM APPROVAL" CTA
    - "CANCEL" link
  
  - **Styling**: 4px amber-tinted border, light background, hover lift

#### 6.4 All Jobs Pipeline (Table/List View)
**Component: Collapsible Table or Card List**
- Section header:
  - Title: "ALL JOBS PIPELINE" (xl, font-bold)
  - Badge: Total job count
  
- **Table/List columns**:
  - Job Name (left-aligned, truncate)
  - Material + Grade
  - Quantity (centered)
  - Delivery Location
  - Status (colored badges):
    - Open: Green
    - Assigned: Blue
    - In Progress: Purple
    - QC: Indigo
    - Completed: Green-600
    - Paid: Teal
    - Cancelled: Gray
  - View action: Chevron button (right-aligned)

- **Row interactions**:
  - Hover state: Highlight background, "View Detail" button appears
  - Click: Opens job detail view or side drawer
  - Right-click context menu: Edit, View Bids, Archive, etc.

- **Responsive**:
  - Desktop: Full table with horizontal scroll
  - Mobile: Card-based layout with essential info

- **Sorting & Filtering**:
  - Sort by: Date, Status, Material, Location
  - Filter by: Status, OEM, Date range
  - Search: Job name, OEM name

#### 6.5 Summary Statistics Bar
**Component: Metrics/Stats Bar (horizontal)**
- Total Jobs Posted: [X]
- Pending Review: [X] (in amber)
- Actively Bidding: [X] (in blue)
- Completed: [X] (in green)
- Unlock Requests: [X] (in indigo, with badge)

---

## 7. OEM POST JOB - VENDOR MANAGEMENT SECTION (Optional Enhancement)

### Purpose (Future enhancement)
Allow OEMs to manage vendor access to specific jobs and view vendor response analytics.

### Key Sections
- Vendor Whitelist: Select approved vendors for job
- Vendor Performance Metrics: Previous bid quality, fulfillment rate
- Bid Analytics: Real-time bid counts, average bid prices, lead times
- Vendor Ratings Display: Star ratings and reviews from previous jobs

---

## Design Token Summary

### Colors
- **Primary**: #f97316 (Orange)
- **Success**: #4ade80 (Emerald)
- **Error**: #f43f5e (Rose)
- **Neutral Dark**: #0F172A (Slate-900)
- **Neutral Light**: #F8F8F8 (Slate-50)
- **Accent**: #7c3aed (Violet for secondary actions)

### Typography
- **Headlines**: Font-black, uppercase, high tracking
- **Labels**: Font-bold, uppercase, 10-12px, tracked
- **Body**: Regular weight, normal case, 14-16px
- **Code/Meta**: Monospace for technical values

### Spacing
- **Base unit**: 8px (0.5rem)
- **Component padding**: 24-32px
- **Margin between sections**: 32-48px
- **Gap between cards**: 24px

### Borders & Shadows
- **Border width**: 4px for primary, 2px for secondary
- **Border style**: Solid, square corners (no border-radius on primary)
- **Shadow**: offset-x=8px, offset-y=8px, blur=0px, color=slate-900/100
- **Secondary shadow**: 4px offset for smaller elements

### Icons
- Icon library: Lucide React
- Size: 20-24px for primary actions, 16-20px for secondary
- Color: Inherit text color (slate-900 by default)

---

## Responsive Breakpoints
- **Mobile**: 0-640px (single column, stacked layout)
- **Tablet**: 641-1024px (2-column layout)
- **Desktop**: 1025px+ (3-column layout)

## Interaction States
- **Hover**: Slight translate (1-2px), shadow reduction/removal
- **Active/Pressed**: 2-3px translate, fuller shadow
- **Disabled**: 50% opacity, cursor not-allowed
- **Loading**: Spinner or skeleton loaders
- **Focus**: Outline or border highlight (for accessibility)

---

## Implementation Notes
1. Ensure all interactive elements are keyboard accessible
2. Maintain consistent spacing and alignment across all dashboards
3. Use ARIA labels for screen readers on icon-only buttons
4. Implement responsive design with mobile-first approach
5. Include loading states for all async operations
6. Add toast notifications for success/error messages
7. Implement smooth transitions (200-300ms) for state changes
8. Ensure color contrast meets WCAG AA standards
9. Test hover and focus states on all elements
10. Include empty states and error boundary components
