# System Execution Flow & Architectural Tracing

## Overview
This document traces how execution moves between frontend UI components, server actions, database queries, and dynamic routing across the vendor bidding threshold feature and OEM job progress view.

---

## 1. Vendor RFQ Marketplace & Lead-Time Threshold ($X$ Days)

```
[Vendor Navigates to /vendor/jobs]
  │
  ├──> app/vendor/jobs/page.tsx (Server Component)
  │      │
  │      └──> Calls server action: getOpenJobsForBidding() in actions/vendor-bids.ts
  │             │
  │             ├──> Queries database: prisma.job.findMany({ where: { status: "OPEN" } })
  │             │
  │             ├──> Calculates maxLeadTimeDays (X):
  │             │      X = Math.max(1, Math.ceil((job.deadline - Date.now()) / (1000 * 60 * 60 * 24)))
  │             │
  │             └──> Returns Array<{ id, title, deadline, maxLeadTimeDays, ... }>
  │
  └──> Renders List of JobBidCard Components: components/vendor/job-bid-card.tsx
         │
         └──> Renders SubmitBidModal: components/vendor/submit-bid-modal.tsx
                │
                ├──> Props passed: { maxLeadTimeDays, deadline, jobId, ... }
                │
                ├──> Client Input UI (<Input type="number" max={maxLeadTimeDays} />):
                │      └─> Live onChange handler checks: parseInt(leadTime) > maxLeadTimeDays
                │            ├─> IF TRUE: Sets UI error alert & disables "Submit Bid" button
                │            └─> IF FALSE: Clears error alert
                │
                └──> User Clicks "Submit Bid":
                       └─> Executes server action submitBid(jobId, price, leadTime, notes)
                              │
                              └──> actions/vendor-bids.ts (Server Action):
                                     ├─> Recalculates X = Math.max(1, Math.ceil((job.deadline - Date.now()) / ...))
                                     ├─> Asserts: if (leadTime > X) throw new Error("Lead time cannot exceed threshold...")
                                     └─> Executes: prisma.bid.upsert({ ... })
```

---

## 2. OEM Clickable Job Cards & Job Progress View

```
[OEM Navigates to /oem/dashboard]
  │
  ├──> app/oem/dashboard/page.tsx (Server Component)
  │      │
  │      └──> Queries database: prisma.job.findMany({ where: { oemId: session.user.id } })
  │             │
  │             └──> Passes jobs array to OEMJobList (components/oem/oem-job-list.tsx)
  │                    │
  │                    └──> Renders JobCard: components/oem/JobCard.tsx
  │                           │
  │                           └──> JobCard is wrapped in <Link href={`/oem/jobs/${id}`}>
  │                                  (Whole card is clickable with hover animation & arrow indicator)
  │
[OEM Clicks Job Card]
  │
  └──> Route Triggered: /oem/jobs/[id]
         │
         └──> app/oem/jobs/[id]/page.tsx (Server Component)
                │
                ├──> Security & Authorization Check:
                │      └─> prisma.job.findFirst({ where: { id, oemId: session.user.id } })
                │            (Ensures OEM can ONLY access their own jobs; returns 404 otherwise)
                │
                ├──> Data Resolution:
                │      ├─> Fetches assigned vendor bid (assignedBid = job.bids.find(b => b.vendorId === job.vendorId))
                │      ├─> Extracts vendorLeadTimeDays = assignedBid?.proposedLeadTime
                │      ├─> Calculates Final Delivery Date:
                │      │      estimatedDeliveryDate = assignmentDate + (vendorLeadTimeDays * 24h)
                │      └─> Maps JobStatusLog entries to Stage Stepper dates (logDateMap)
                │
                ├──> Renders Relaxation Affirmation Banner:
                │      └─> Displays "Guaranteed Delivery On Track" & Promised Delivery Date badge
                │
                └──> Renders Live Manufacturing Timeline Stepper:
                       └─> Highlights active stage, completed stages, and exact timestamps per stage
```
