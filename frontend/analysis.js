/**
 * Smart Care - AI Symptom Analysis
 * Connects the chat interface to the Flask prediction API (localhost:5000)
 */

const API_BASE = 'http://localhost:5000';

let allSymptoms = [];         // full valid symptom list from backend
let detectedSymptoms = new Set(); // symptoms found so far in conversation
let latestPredictions = [];   // last /predict response

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

const riskCard = document.getElementById('risk-card');
const riskIndicator = document.getElementById('risk-indicator');
const riskLabel = document.getElementById('risk-label');

const symptomListCard = document.getElementById('symptom-list-card');
const symptomTags = document.getElementById('symptom-tags');

const reportModal = document.getElementById('report-modal');
const finalTriageBadge = document.getElementById('final-triage-badge');
const conditionsList = document.getElementById('conditions-list');
const recommendationText = document.getElementById('recommendation-text');
const specialistCard = document.getElementById('specialist-card');
const bookTokenBtn = document.getElementById('book-token-btn');

const confidenceValueEl = document.querySelector('.metric-value');
const confidenceFillEl = document.querySelector('.metric-fill');

// ---------------------------------------------------------
// Init: load valid symptom list from backend
// ---------------------------------------------------------
fetch(`${API_BASE}/symptoms`)
    .then(res => res.json())
    .then(data => {
        allSymptoms = data.symptoms;
    })
    .catch(() => {
        appendBotMessage("I'm having trouble connecting to the analysis server. Please make sure the backend (app.py) is running on localhost:5000.");
    });

// ---------------------------------------------------------
// Chat UI helpers
// ---------------------------------------------------------
function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerHTML = `<div class="user-bubble">${escapeHtml(text)}</div>`;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function appendBotMessage(html) {
    const div = document.createElement('div');
    div.className = 'message system-message';
    div.innerHTML = `
        <div class="bot-avatar">AI</div>
        <div class="message-bubble">${html}</div>
    `;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showTyping(show) {
    typingIndicator.classList.toggle('active', show);
}

// ---------------------------------------------------------
// Symptom matching: free text -> known symptom keys
// e.g. "I have a high fever and headache" -> ["high_fever", "headache"]
// ---------------------------------------------------------
function extractSymptoms(text) {
    const normalized = text.toLowerCase();
    const found = [];

    allSymptoms.forEach(symptomKey => {
        const phrase = symptomKey.replace(/_/g, ' ').trim().toLowerCase();
        if (normalized.includes(phrase)) {
            found.push(symptomKey);
        }
    });

    return found;
}

// ---------------------------------------------------------
// Update right-side "Detected Symptoms" panel
// ---------------------------------------------------------
function renderSymptomTags() {
    if (detectedSymptoms.size === 0) return;
    symptomListCard.classList.remove('hidden');
    symptomTags.innerHTML = '';
    detectedSymptoms.forEach(symptom => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = symptom.replace(/_/g, ' ');
        symptomTags.appendChild(tag);
    });
}

// ---------------------------------------------------------
// Update confidence meter (left panel)
// ---------------------------------------------------------
function updateConfidenceMeter(percent) {
    if (confidenceValueEl) confidenceValueEl.textContent = `${percent}%`;
    if (confidenceFillEl) confidenceFillEl.style.width = `${percent}%`;
}

// ---------------------------------------------------------
// Update risk gauge (right panel)
// riskScore: 0-100, maps to needle rotation -90deg (low) to 90deg (high)
// ---------------------------------------------------------
function updateRiskGauge(riskScore, label) {
    riskCard.classList.remove('hidden');
    const rotation = -90 + (riskScore / 100) * 180;
    riskIndicator.style.transform = `rotate(${rotation}deg)`;
    riskLabel.textContent = label;
}

// ---------------------------------------------------------
// Call backend and show results
// ---------------------------------------------------------
function runPrediction() {
    showTyping(true);

    fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: Array.from(detectedSymptoms) })
    })
    .then(res => res.json())
    .then(data => {
        showTyping(false);

        if (data.error) {
            appendBotMessage(data.error + " Please tell me more about how you're feeling.");
            return;
        }

        latestPredictions = data.predictions;
        const top = latestPredictions[0];

        updateConfidenceMeter(Math.round(top.confidence));

        // Simple risk labeling based on top confidence + specialist type
        let riskScore = top.confidence;
        let riskLevelLabel = riskScore > 60 ? "Elevated" : riskScore > 35 ? "Moderate" : "Low";
        updateRiskGauge(riskScore, riskLevelLabel);

        appendBotMessage(`
            Based on what you've told me, this looks like it could be <strong>${top.disease}</strong>
            (${top.confidence}% match). I'd recommend seeing a <strong>${top.specialist}</strong>.
            <br><br>Click below to see the full report and available doctors.
        `);

        showReportModal(latestPredictions, riskLevelLabel);
    })
    .catch(() => {
        showTyping(false);
        appendBotMessage("Something went wrong reaching the analysis server. Please make sure the backend is running.");
    });
}

// ---------------------------------------------------------
// Populate and open the report modal
// ---------------------------------------------------------
function showReportModal(predictions, riskLevelLabel) {
    finalTriageBadge.textContent = riskLevelLabel.toUpperCase();
    finalTriageBadge.className = 'triage-badge ' +
        (riskLevelLabel === "Elevated" ? "triage-high" : riskLevelLabel === "Moderate" ? "triage-moderate" : "triage-low");

    conditionsList.innerHTML = '';
    predictions.forEach(pred => {
        const li = document.createElement('li');
        li.className = 'condition-item';
        li.innerHTML = `<span>${pred.disease}</span><span>${pred.confidence}%</span>`;
        conditionsList.appendChild(li);
    });

    recommendationText.textContent = riskLevelLabel === "Elevated"
        ? "Please consult a specialist as soon as possible."
        : "Book an appointment with the suggested specialist at your convenience.";

    const top = predictions[0];
    specialistCard.textContent = `${top.specialist} recommended`;

    // Store data for the doctor-suggestion page
    bookTokenBtn.onclick = () => {
        localStorage.setItem('suggestedSpecialist', top.specialist);
        localStorage.setItem('suggestedDoctors', JSON.stringify(top.doctors));
        localStorage.setItem('predictedDisease', top.disease);
        window.location.href = 'doctor-suggestion.html';
    };

    reportModal.classList.add('active');
}

// Close modal if clicking outside the card
reportModal.addEventListener('click', (e) => {
    if (e.target === reportModal) {
        reportModal.classList.remove('active');
    }
});

// ---------------------------------------------------------
// Main send handler
// ---------------------------------------------------------
function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    userInput.value = '';

    const newSymptoms = extractSymptoms(text);
    newSymptoms.forEach(s => detectedSymptoms.add(s));
    renderSymptomTags();

    showTyping(true);

    setTimeout(() => {
        showTyping(false);

        if (detectedSymptoms.size === 0) {
            appendBotMessage("I couldn't identify specific symptoms from that. Could you describe what you're feeling more specifically? (e.g. fever, headache, cough, vomiting)");
            return;
        }

        if (detectedSymptoms.size < 4) {
            appendBotMessage(`Got it — I've noted: <strong>${newSymptoms.map(s => s.replace(/_/g, ' ')).join(', ') || 'that'}</strong>. Please tell me if you have any other symptoms so I can analyze this accurately (need at least 4 total).`);
            return;
        }

        appendBotMessage("Thanks, analyzing your symptoms now...");
        runPrediction();
    }, 600); // small delay to feel natural with the typing indicator
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});