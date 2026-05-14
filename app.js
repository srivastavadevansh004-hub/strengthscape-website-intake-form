const FORM_API_URL = "REPLACE_WITH_CLOUDFLARE_WORKER_URL";

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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('intakeForm');
    const clusterSelect = document.getElementById('cluster');
    const requirementSelect = document.getElementById('requirementProgram');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formStatus = document.getElementById('formStatus');
    const formWrapper = document.getElementById('formWrapper');
    const successCard = document.getElementById('successCard');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // Handle cluster change to populate requirements dropdown
    clusterSelect.addEventListener('change', (e) => {
        const selectedCluster = e.target.value;
        const programs = programsByCluster[selectedCluster] || [];
        
        requirementSelect.innerHTML = '<option value="" disabled selected>Select a Requirement / Program...</option>';
        
        programs.forEach(program => {
            const option = document.createElement('option');
            option.value = program;
            option.textContent = program;
            requirementSelect.appendChild(option);
        });
        
        requirementSelect.disabled = false;
    });

    // Custom validation for work email
    const workEmailInput = document.getElementById('workEmail');
    workEmailInput.addEventListener('input', () => {
        if (workEmailInput.validity.patternMismatch || workEmailInput.validity.typeMismatch) {
            workEmailInput.parentElement.classList.add('has-error');
        } else {
            workEmailInput.parentElement.classList.remove('has-error');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic HTML5 validation trigger
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Custom work email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(workEmailInput.value)) {
            workEmailInput.parentElement.classList.add('has-error');
            return;
        }

        // Get honeypot
        const honeypot = document.getElementById('company_website_confirm').value;

        // Collect data
        const formData = new FormData(form);
        const payload = {
            fullName: formData.get('fullName'),
            workEmail: formData.get('workEmail'),
            phone: formData.get('phone'),
            organization: formData.get('organization'),
            designation: formData.get('designation') || null,
            city: formData.get('city') || null,
            cluster: formData.get('cluster'),
            requirementProgram: formData.get('requirementProgram'),
            participants: formData.get('participants') || null,
            timeline: formData.get('timeline') || null,
            deliveryMode: formData.get('deliveryMode') || null,
            briefRequirement: formData.get('briefRequirement'),
            pageUrl: window.location.href,
            referrer: document.referrer || '',
            submittedAt: new Date().toISOString(),
            source: "Strengthscape Website Query Form",
            company_website_confirm: honeypot
        };

        // UI Loading state
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        formStatus.classList.add('hidden');

        try {
            const response = await fetch(FORM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Success
                formWrapper.classList.add('hidden');
                successCard.classList.remove('hidden');
            } else {
                throw new Error('Server responded with an error');
            }
        } catch (error) {
            // Failure
            formStatus.textContent = "Sorry, something went wrong while submitting your request. Please try again or email us directly.";
            formStatus.className = 'form-status error';
            formStatus.classList.remove('hidden');
        } finally {
            // Restore UI
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }
    });

    resetFormBtn.addEventListener('click', () => {
        form.reset();
        requirementSelect.innerHTML = '<option value="" disabled selected>Please select a Cluster first</option>';
        requirementSelect.disabled = true;
        successCard.classList.add('hidden');
        formWrapper.classList.remove('hidden');
        formStatus.classList.add('hidden');
    });
});
