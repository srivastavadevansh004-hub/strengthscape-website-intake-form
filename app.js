const FORM_API_URL = "https://script.google.com/macros/s/AKfycbzSf3lWaKFTX72LHAR7hNXZQCBSogNyWKCiYzGvOTTfGNqfpGuZ3ql8CXLuXmjQZMV9/exec";
const EDGE10_WEBHOOK_SECRET = "E10F_strengthscape_webform_2026_9Xk2pQ7mL4vR";

const programsByCluster = {
    "DiSC, Assessments & Certification": [
        "DiSC Trainer Certification",
        "Everything DiSC® Workplace Assessment",
        "Everything DiSC® Workplace Debrief",
        "Everything DiSC® Management",
        "Everything DiSC® Sales",
        "Everything DiSC® Work of Leaders",
        "Everything DiSC® Agile EQ",
        "Everything DiSC® Productive Conflict",
        "Five Behaviors of a Cohesive Team",
        "Five Behaviors – Personal Development Profile",
        "Other – Instructional Design / Facilitation Certification",
        "Need help choosing the right assessment"
    ],
    "Leadership & Manager Development": [
        "First-time manager development",
        "Managerial effectiveness / MDP",
        "People manager capability building",
        "Senior leadership development",
        "Emerging leaders / high-potential development",
        "Leadership pipeline / succession development",
        "Coaching and feedback for managers",
        "Performance conversations for managers",
        "Delegation, accountability and ownership",
        "Strategic thinking for leaders",
        "Leadership communication",
        "Leadership journey design",
        "Need help designing a leadership program",
        "Other leadership or manager development need"
    ],
    "Teams, Culture & Change": [
        "Team effectiveness and collaboration",
        "Trust, conflict and accountability in teams",
        "Five Behaviors / cohesive team development",
        "Cross-functional collaboration",
        "Team charter / team alignment workshop",
        "Culture transformation / values activation",
        "Vision, values and behaviour alignment",
        "Psychological safety and trust building",
        "Inclusive leadership / DEI",
        "Women in leadership",
        "Change leadership / agility",
        "Culture champions / change champions development",
        "Need help with team, culture or change challenges",
        "Other team or culture requirement"
    ],
    "Communication, Influence & Executive Presence": [
        "Business communication skills",
        "Email writing / written communication",
        "Spoken communication / articulation",
        "Presentation skills",
        "Executive presence",
        "Business storytelling",
        "Storytelling for leaders",
        "Stakeholder communication",
        "Influence and persuasion",
        "Negotiation skills",
        "Stakeholder management",
        "Managing difficult conversations",
        "Time management / productivity / resilience",
        "Other communication or influence requirement"
    ],
    "Sales & Customer Service": [
        "Sales effectiveness / consultative selling",
        "Sales conversation skills",
        "Sales negotiation / objection handling",
        "Key account management / account growth",
        "Strategic account planning",
        "Sales leadership / sales manager development",
        "Customer service excellence",
        "Customer centricity / customer experience",
        "Escalation handling",
        "Support communication",
        "Client-facing communication skills",
        "Other sales or customer service requirement"
    ],
    "HR, L&D & Talent Capability": [
        "HRBP capability development",
        "L&D capability development",
        "Talent acquisition capability",
        "Interviewing skills / competency-based hiring",
        "Competency mapping",
        "Talent review / talent development capability",
        "Assessment centre / development centre support",
        "Learning needs diagnosis",
        "Learning journey design capability",
        "Internal academy / faculty capability",
        "Train-the-Trainer / facilitation skills for trainers",
        "Need help building HR or L&D capability",
        "Other HR, L&D or talent requirement"
    ],
    "Strategy, Business Alignment & Offsites": [
        "Visioning / strategic planning workshop",
        "Annual business planning workshop",
        "Growth / expansion planning workshop",
        "Strategy-to-execution alignment",
        "Business review / QBR effectiveness workshop",
        "Leadership offsite / senior team retreat",
        "Senior leadership alignment workshop",
        "Leadership council / executive alignment session",
        "Vision, mission and values workshop",
        "Jamavaar strategic planning experience",
        "Need help designing a strategic business workshop",
        "Other strategic requirement"
    ],
    "AI, Innovation & Future Skills": [
        "AI for leaders",
        "AI productivity / Copilot / GenAI at work",
        "AI for managers",
        "AI for HR / L&D teams",
        "AI for sales teams",
        "Human-AI collaboration",
        "Prompting and AI use-case practice",
        "AI adoption / responsible AI use",
        "Innovation / design thinking",
        "Critical thinking / problem solving",
        "Future of work / future skills",
        "Other AI, innovation or future-skill requirement"
    ],
    "Technical, Digital & Functional Training": [
        "Excel / PowerPoint / workplace productivity tools",
        "JIRA / Agile / Scrum",
        "Cloud skills",
        "Cybersecurity skills",
        "Data analytics / data science",
        "AI / ML technical training",
        "Salesforce / CRM / functional systems",
        "Six Sigma / process improvement",
        "Software testing / automation testing",
        "Technical capability training for teams",
        "Digital transformation capability",
        "Other technical, digital or functional training need"
    ],
    "Custom Program / Not Sure": [
        "Tailored training program",
        "Custom leadership / manager development program",
        "Custom team / culture workshop",
        "Custom communication / sales program",
        "Need proposal for my organization",
        "I want to speak to a consultant"
    ]
};

function deriveWebsiteFromEmail(email) {
    if (!email || !email.includes("@")) return "";
    const domain = email.split("@")[1].trim().toLowerCase();

    const personalDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "icloud.com",
        "rediffmail.com",
        "aol.com",
        "protonmail.com"
    ];

    if (personalDomains.includes(domain)) return "";
    return domain;
}

function showSuccess(formWrapper, successCard) {
    formWrapper.classList.add("hidden");
    successCard.classList.remove("hidden");
}

function showError(formStatus, message) {
    formStatus.textContent = message || "Sorry, something went wrong while submitting your request. Please try again or email us directly.";
    formStatus.className = "form-status error";
    formStatus.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("intakeForm");
    const clusterSelect = document.getElementById("cluster");
    const requirementSelect = document.getElementById("requirementProgram");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    const formStatus = document.getElementById("formStatus");
    const formWrapper = document.getElementById("formWrapper");
    const successCard = document.getElementById("successCard");
    const resetFormBtn = document.getElementById("resetFormBtn");
    const workEmailInput = document.getElementById("workEmail");

    clusterSelect.addEventListener("change", (e) => {
        const selectedCluster = e.target.value;
        const programs = programsByCluster[selectedCluster] || [];

        requirementSelect.innerHTML = '<option value="" disabled selected>Select a Requirement / Program...</option>';

        programs.forEach((program) => {
            const option = document.createElement("option");
            option.value = program;
            option.textContent = program;
            requirementSelect.appendChild(option);
        });

        requirementSelect.disabled = false;
    });

    workEmailInput.addEventListener("input", () => {
        if (workEmailInput.validity.patternMismatch || workEmailInput.validity.typeMismatch) {
            workEmailInput.parentElement.classList.add("has-error");
        } else {
            workEmailInput.parentElement.classList.remove("has-error");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(workEmailInput.value.trim())) {
            workEmailInput.parentElement.classList.add("has-error");
            return;
        }

        const honeypotEl = document.getElementById("company_website_confirm");
        const honeypot = honeypotEl ? honeypotEl.value : "";

        // If bot fills honeypot, show fake success and do not submit.
        if (honeypot) {
            showSuccess(formWrapper, successCard);
            return;
        }

        const formData = new FormData(form);

        const websiteFormPayload = {
            fullName: String(formData.get("fullName") || "").trim(),
            workEmail: String(formData.get("workEmail") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            organization: String(formData.get("organization") || "").trim(),
            designation: String(formData.get("designation") || "").trim(),
            city: String(formData.get("city") || "").trim(),
            cluster: String(formData.get("cluster") || "").trim(),
            requirementProgram: String(formData.get("requirementProgram") || "").trim(),
            participants: String(formData.get("participants") || "").trim(),
            timeline: String(formData.get("timeline") || "").trim(),
            deliveryMode: String(formData.get("deliveryMode") || "").trim(),
            briefRequirement: String(formData.get("briefRequirement") || "").trim(),
            pageUrl: window.location.href,
            referrer: document.referrer || "",
            submittedAt: new Date().toISOString(),
            source: "Strengthscape Website Query Form",
            company_website_confirm: honeypot
        };

        const service = `${websiteFormPayload.cluster} / ${websiteFormPayload.requirementProgram}`;

        const message = [
            `Brief Requirement: ${websiteFormPayload.briefRequirement || ""}`,
            websiteFormPayload.participants ? `Participants: ${websiteFormPayload.participants}` : "",
            websiteFormPayload.timeline ? `Timeline: ${websiteFormPayload.timeline}` : "",
            websiteFormPayload.deliveryMode ? `Preferred Delivery Mode: ${websiteFormPayload.deliveryMode}` : "",
            websiteFormPayload.pageUrl ? `Page URL: ${websiteFormPayload.pageUrl}` : "",
            websiteFormPayload.referrer ? `Referrer: ${websiteFormPayload.referrer}` : "",
            websiteFormPayload.submittedAt ? `Submitted At: ${websiteFormPayload.submittedAt}` : ""
        ].filter(Boolean).join("\n");

        const edge10Payload = {
            secret: EDGE10_WEBHOOK_SECRET,
            name: websiteFormPayload.fullName,
            email: websiteFormPayload.workEmail,
            phone: websiteFormPayload.phone,
            company: websiteFormPayload.organization,
            website: deriveWebsiteFromEmail(websiteFormPayload.workEmail),
            designation: websiteFormPayload.designation,
            source: "Strengthscape Website Query Form",
            service: service,
            city: websiteFormPayload.city,
            message: message,
            rawWebsiteForm: websiteFormPayload
        };

        submitBtn.disabled = true;
        btnText.classList.add("hidden");
        btnLoader.classList.remove("hidden");
        formStatus.classList.add("hidden");

        try {
            /*
              Direct Apps Script submission.
              mode: "no-cors" avoids browser CORS blocking.
              Because response is opaque in no-cors mode, we cannot check response.ok.
              So after fetch completes, we show success and verify actual creation in Apps Script Executions / Notion.
            */
            await fetch(FORM_API_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(edge10Payload)
            });

            showSuccess(formWrapper, successCard);

        } catch (error) {
            console.error("Form submission error:", error);
            showError(formStatus, "Sorry, something went wrong while submitting your request. Please try again or email us directly.");
        } finally {
            submitBtn.disabled = false;
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
        }
    });

    resetFormBtn.addEventListener("click", () => {
        form.reset();
        requirementSelect.innerHTML = '<option value="" disabled selected>Please select a Cluster first</option>';
        requirementSelect.disabled = true;
        successCard.classList.add("hidden");
        formWrapper.classList.remove("hidden");
        formStatus.classList.add("hidden");
    });
});
