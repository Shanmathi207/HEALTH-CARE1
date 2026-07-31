/**
 * Smart Care - Digital Health Risk Classifier logic
 * Strict classification based on fixed ruleset.
 */

function classifyRisk() {
    // 1. Get Inputs
    const age = parseInt(document.getElementById('age').value);
    const symptomsInput = document.getElementById('symptoms').value.toLowerCase();
    const duration = parseInt(document.getElementById('duration').value);
    const severity = document.getElementById('severity').value;
    const resultBox = document.getElementById('result-output');

    // Validation
    if (isNaN(age) || !symptomsInput) {
        alert("Please enter patient age and symptoms.");
        return;
    }

    // 2. Define Risk Levels
    let riskLevel = "Low"; // Default
    let reason = "Symptoms appear mild based on current inputs.";

    // Keywords
    const emergencyKeywords = ['chest pain', 'breathing difficulty', 'unconsciousness', 'seizure', 'severe bleeding'];
    const mediumKeywords = ['vomiting', 'dizziness']; // specific ones

    // Check Emergency
    let foundEmergency = emergencyKeywords.find(k => symptomsInput.includes(k));

    if (foundEmergency) {
        riskLevel = "Emergency";
        reason = `Critical symptom detected: ${foundEmergency}.`;
    }
    else {
        // Check Medium Conditions
        // 1. Fever > 3 days
        if (symptomsInput.includes('fever') && duration > 3) {
            riskLevel = "Medium";
            reason = "Fever persisting for more than 3 days.";
        }
        // 2. Vomiting or Dizziness
        else if (mediumKeywords.some(k => symptomsInput.includes(k))) {
            const match = mediumKeywords.find(k => symptomsInput.includes(k));
            riskLevel = "Medium";
            reason = `Significant symptom detected: ${match}.`;
        }
        // 3. Severe Headache (Text match OR Headache + High Severity)
        else if (symptomsInput.includes('severe headache') || (symptomsInput.includes('headache') && severity === 'High')) {
            riskLevel = "Medium";
            reason = "Headache presented with high severity.";
        }
        else {
            // Check Low (Explicit matches to confirm 'Low' reasoning, otherwise default is Low)
            if (symptomsInput.includes('cold')) reason = "Common cold symptoms detected.";
            else if (symptomsInput.includes('body pain')) reason = "General body pain detected.";
            else if (symptomsInput.includes('cough')) reason = "Cough symptoms detected.";
            else reason = "Symptom profile suggests low urgency.";
        }
    }

    // 3. Apply Age Modifier
    const isVulnerable = (age > 60 || age < 5);

    // Create a visual indicator string if upgraded
    let originalRisk = riskLevel;

    if (isVulnerable && riskLevel !== "Emergency") {
        if (riskLevel === "Low") {
            riskLevel = "Medium";
            reason += ` (Risk escalated due to age vulnerability).`;
        } else if (riskLevel === "Medium") {
            riskLevel = "Emergency";
            reason += ` (Risk escalated to Emergency due to age vulnerability).`;
        }
    }

    // 4. Render Output
    // Apply styling class based on level
    resultBox.className = `result-box ${riskLevel}`;
    resultBox.style.display = 'block';

    let colorVar = '';
    if (riskLevel === 'Emergency') colorVar = 'var(--neon-red)';
    else if (riskLevel === 'Medium') colorVar = '#f59e0b';
    else colorVar = 'var(--neon-green)';

    resultBox.innerHTML = `
        <div class="result-header" style="color:${colorVar}">Risk Level: ${riskLevel}</div>
        <div class="result-reason">Reason: ${reason}</div>
        <div class="safety-note">Safety Note: This is not a diagnosis. Consult a doctor.</div>
    `;

    // Smooth scroll to result
    resultBox.scrollIntoView({ behavior: 'smooth' });
}
