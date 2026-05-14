# Strengthscape Website Query Form

A premium, responsive, static website intake form designed for Strengthscape's corporate training and consulting inquiries.

## Features
- **Professional Enterprise Design**: Clean, modern aesthetics aligned with B2B expectations.
- **Dynamic Dropdowns**: "Requirement / Program" options automatically update based on the selected "Cluster".
- **Client-Side Validation**: Ensures required fields are filled and the work email is formatted correctly.
- **Honeypot Anti-Spam**: Includes a visually hidden field (`company_website_confirm`) to deter bots.
- **Rich Payload Context**: Automatically captures the page URL, referrer, and submission timestamp.
- **Zero Dependencies**: Built entirely with vanilla HTML5, CSS3, and JavaScript. No React, no external libraries.

## Setup & Integration
1. **Host the Files**: Deploy `index.html`, `styles.css`, and `app.js` to any static hosting provider or embed within your existing CMS.
2. **Configure API Endpoint**: Open `app.js` and locate the `FORM_API_URL` constant. Replace `"REPLACE_WITH_CLOUDFLARE_WORKER_URL"` with your actual backend endpoint (e.g., a Cloudflare Worker or AWS Lambda URL that handles the POST request).

## Submission Payload Structure
When submitted, the form sends a JSON POST request with the following structure:
```json
{
  "fullName": "Jane Doe",
  "workEmail": "jane.doe@example.com",
  "phone": "+1234567890",
  "organization": "Acme Corp",
  "designation": "HR Director",
  "city": "New York",
  "cluster": "Leadership & Manager Development",
  "requirementProgram": "Senior leadership development",
  "participants": "15",
  "timeline": "Q4 2024",
  "deliveryMode": "Hybrid",
  "briefRequirement": "Looking to upskill our senior leadership team.",
  "pageUrl": "https://strengthscape.com/register",
  "referrer": "https://google.com/",
  "submittedAt": "2024-05-15T12:00:00.000Z",
  "source": "Strengthscape Website Query Form",
  "company_website_confirm": ""
}
```
