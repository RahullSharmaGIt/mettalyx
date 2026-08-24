# Architectural Decisions & Rationale (Decisions.md)

## 1. Calculation & Enforcement of Lead-Time Threshold ($X$ Days)

### The Problem
When an OEM posts a job requirement, they specify a target `deadline` (date). Previously, vendors on the `/vendor/jobs` RFQ marketplace could enter any arbitrary lead time in days (e.g. 90 days for a job required in 10 days). This caused scheduling conflicts and invalid bidding expectations.

### Technical Decision
1. **Dynamic $X$ Days Threshold Formula**:
   $$X = \max\left(1, \left\lceil \frac{\text{job.deadline} - \text{now}}{1000 \times 60 \times 60 \times 24} \right\rceil\right)$$
2. **Dual-Layer Validation**:
   - **Frontend UI Layer** (`SubmitBidModal`): The `<Input type="number" max={maxLeadTimeDays} />` dynamically checks the entered lead time on `onChange`. If `leadTime > X`, an explicit warning banner appears ("Lead time threshold exceeded! OEM deadline requires completion within X days") and disables form submission.
   - **Server Action Layer** (`actions/vendor-bids.ts`): Both `submitBid` and `updateBid` server actions recalculate $X$ directly from the database record and throw a hard error if `leadTime > X`.

### Why This Approach Was Chosen
- **Data Integrity & Security**: Client-side limits can be bypassed via API requests or console manipulation. Server-side validation guarantees zero invalid lead times enter the database.
- **Immediate UX Feedback**: Real-time client-side error messaging prevents wasted form submissions for vendors.

---

## 2. OEM Clickable Job Cards & Delivery Affirmation View

### The Problem
OEM buyers need continuous confidence that their manufacturing order is progressing and will arrive on or before their required schedule.

### Technical Decision
1. **Clickable Job Cards**:
   - Updated `components/oem/JobCard.tsx` to wrap the container in a Next.js `<Link href={`/oem/jobs/${id}`}>`.
   - Added hover state styling (`group-hover:text-blue-600` and `ChevronRight` icon) so OEMs intuitively know the card is interactive.
2. **Relaxation & Delivery Affirmation Banner**:
   - Integrated a prominent green affirmation banner on `/oem/jobs/[id]` stating *"Guaranteed Delivery On Track"*.
   - Calculates the **Promised Delivery Date**:
     $$\text{Delivery Date} = \text{Assignment Date} + (\text{Vendor Lead Time Days} \times 24\text{h})$$
   - Displays the vendor's committed lead time alongside the calculated delivery date.
3. **Live Timeline Stepper**:
   - Visual 6-stage progressive stepper (`Requirement Submitted` $\rightarrow$ `Open for Bidding` $\rightarrow$ `Vendor Partner Matched` $\rightarrow$ `In Production` $\rightarrow$ `Quality Control` $\rightarrow$ `Shipped & Delivered`).
   - Maps exact historical timestamps from `JobStatusLog` records to display the date and time each stage was executed.

### Why This Approach Was Chosen
- **Buyer Peace of Mind**: Showing a concrete, calculated delivery date and live stage progress eliminates anxiety about order status.
- **Privacy & Security**: The OEM view displays stage updates and vendor commitments while maintaining partner anonymization.
