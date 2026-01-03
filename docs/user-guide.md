# Recyce App User Guide

A simple guide to using the Recyce electronic recycling platform.

**Live App:** [https://recyce.vercel.app](https://recyce.vercel.app)

---

## Part 1: Public Pages (No Login Required)

### Homepage
**URL:** [https://recyce.vercel.app](https://recyce.vercel.app)

The main landing page with:
- Hero section showcasing the service
- Device categories (Phone, Tablet, Laptop, etc.)
- How it works section
- Call-to-action to start selling

**Try it:** Click any device category to start the sell flow.

---

### About Page
**URL:** [https://recyce.vercel.app/about](https://recyce.vercel.app/about)

Learn about Recyce's mission, values, and team.

---

### How It Works
**URL:** [https://recyce.vercel.app/how-it-works](https://recyce.vercel.app/how-it-works)

Detailed 4-step process:
1. **Get a Quote** - Select device, answer condition questions
2. **Ship for Free** - Receive prepaid shipping label
3. **Quick Inspection** - 1-2 business day verification
4. **Get Paid** - Fast payment via PayPal/bank/check

---

### FAQ
**URL:** [https://recyce.vercel.app/faq](https://recyce.vercel.app/faq)

Common questions about selling, shipping, payments, and data security.

---

### Contact
**URL:** [https://recyce.vercel.app/contact](https://recyce.vercel.app/contact)

Contact form to reach support with questions or issues.

---

### Blog
**URL:** [https://recyce.vercel.app/blog](https://recyce.vercel.app/blog)

Articles about electronics recycling and sustainability.

---

## Part 2: Account Registration & Login

### Creating an Account
**URL:** [https://recyce.vercel.app/signup](https://recyce.vercel.app/signup)

1. Click **"Sign Up"** in the header
2. Enter your full name, email, and password
3. Click **"Sign up"**
4. **Check your email** for a verification link
5. Click the link to verify your account
6. Now you can sign in!

### Signing In
**URL:** [https://recyce.vercel.app/login](https://recyce.vercel.app/login)

1. Click **"Login"** in the header
2. Enter your email and password
3. Click **"Sign in"**
4. You'll be redirected to your dashboard

---

## Part 3: Selling a Device (The Main Flow)

### Step 1: Select Device Category
**URL:** [https://recyce.vercel.app/sell](https://recyce.vercel.app/sell)

1. Go to the Sell page or click a category from the homepage
2. Choose: Phone, Tablet, Laptop, Smartwatch, Gaming Console, or Desktop

### Step 2: Select Brand
**Example:** [https://recyce.vercel.app/sell/phone](https://recyce.vercel.app/sell/phone)

1. Browse available brands (Apple, Samsung, Google, etc.)
2. Click on your device's brand

### Step 3: Select Model
**Example:** [https://recyce.vercel.app/sell/phone/apple](https://recyce.vercel.app/sell/phone/apple)

1. Find your specific model from the list
2. Click on your model to continue

### Step 4: Answer Condition Questions
1. **Select condition**: Excellent, Good, Fair, or Poor
2. **Answer questions** about screen, functionality, accessories
3. See your **instant quote** update in real-time
4. Click **"Add to Box"** to save the device

### Step 5: My Box
**URL:** [https://recyce.vercel.app/my-box](https://recyce.vercel.app/my-box)

1. Review all devices you've added
2. See the **total offer amount**
3. Add more devices or remove items
4. Click **"Proceed to Checkout"** when ready

### Step 6: Checkout
**URL:** [https://recyce.vercel.app/sell/checkout](https://recyce.vercel.app/sell/checkout)

1. **Review your devices** - confirm all items
2. **Enter shipping address** - where we'll send the shipping label
3. Click **"Submit Order"**
4. See confirmation and next steps

---

## Part 4: User Dashboard (Signed In)

### Dashboard Home
**URL:** [https://recyce.vercel.app/dashboard](https://recyce.vercel.app/dashboard)

Overview of your account:
- Quick stats (total orders, pending offers)
- Recent activity

### My Offers
**URL:** [https://recyce.vercel.app/dashboard/offers](https://recyce.vercel.app/dashboard/offers)

View all your submitted device offers:
- **Pending** - Waiting for review
- **Accepted** - Offer approved
- **Declined** - Offer not accepted (with reason)

### My Orders
**URL:** [https://recyce.vercel.app/dashboard/orders](https://recyce.vercel.app/dashboard/orders)

Track your orders:
- **Order Placed** - Submitted, preparing label
- **Device Shipped** - In transit to us
- **Device Received** - We have your device
- **Inspection In Progress** - Being evaluated
- **Completed** - Payment issued

### Payment History
**URL:** [https://recyce.vercel.app/dashboard/payments](https://recyce.vercel.app/dashboard/payments)

View all your payments:
- Payment date and amount
- Payment method used
- Status (pending, completed)

### Profile
**URL:** [https://recyce.vercel.app/dashboard/profile](https://recyce.vercel.app/dashboard/profile)

Update your personal information:
- Name and email
- Phone number
- Default shipping address

### Settings
**URL:** [https://recyce.vercel.app/dashboard/settings](https://recyce.vercel.app/dashboard/settings)

Account preferences and security:
- Change password
- Notification preferences

---

## Part 5: Admin Dashboard (Admin Only)

> **Note:** Admin access requires the `admin` role assigned in the database.

### Admin Dashboard
**URL:** [https://recyce.vercel.app/admin](https://recyce.vercel.app/admin)

Overview for administrators:
- Total offers, pending offers, active orders
- Revenue statistics
- Recent offers needing review

### Manage Devices
**URL:** [https://recyce.vercel.app/admin/devices](https://recyce.vercel.app/admin/devices)

Add and manage device catalog:
- **Categories** - Phone, Tablet, Laptop, etc.
- **Brands** - Apple, Samsung, Google, etc.
- **Models** - Specific device models with base prices

### Manage Offers
**URL:** [https://recyce.vercel.app/admin/offers](https://recyce.vercel.app/admin/offers)

Review and process customer offers:
1. View offer details (device, condition, quoted price)
2. **Accept** - Approve the offer
3. **Decline** - Reject with reason
4. **Edit Price** - Adjust the quoted amount

### Manage Orders
**URL:** [https://recyce.vercel.app/admin/orders](https://recyce.vercel.app/admin/orders)

Track and update order statuses:
- Update order status at each stage
- View shipping information
- Process inspections

### Pricing Rules
**URL:** [https://recyce.vercel.app/admin/pricing](https://recyce.vercel.app/admin/pricing)

Configure pricing:
- Base prices for device models
- Condition multipliers (Excellent: 100%, Good: 80%, etc.)
- Seasonal bonuses or promotions

### Manage Users
**URL:** [https://recyce.vercel.app/admin/users](https://recyce.vercel.app/admin/users)

View and manage user accounts:
- See all registered users
- View user details and order history
- Assign admin role if needed

### Admin Settings
**URL:** [https://recyce.vercel.app/admin/settings](https://recyce.vercel.app/admin/settings)

Platform configuration:
- **General**: Site name, support email, currency
- **Pricing**: Minimum payout, inspection days, offer expiry
- **Notifications**: Email/SMS toggle settings
- **System**: Maintenance mode toggle

---

## Quick Reference

| Action | URL |
|--------|-----|
| Sell a device | [recyce.vercel.app/sell](https://recyce.vercel.app/sell) |
| Track my order | [recyce.vercel.app/dashboard/orders](https://recyce.vercel.app/dashboard/orders) |
| View my payments | [recyce.vercel.app/dashboard/payments](https://recyce.vercel.app/dashboard/payments) |
| Update my profile | [recyce.vercel.app/dashboard/profile](https://recyce.vercel.app/dashboard/profile) |
| Admin: Review offers | [recyce.vercel.app/admin/offers](https://recyce.vercel.app/admin/offers) |
| Admin: Add devices | [recyce.vercel.app/admin/devices](https://recyce.vercel.app/admin/devices) |

---

## Need Help?

- **FAQ Page**: [recyce.vercel.app/faq](https://recyce.vercel.app/faq)
- **Contact Us**: [recyce.vercel.app/contact](https://recyce.vercel.app/contact)
- **Email**: support@recyce.com
