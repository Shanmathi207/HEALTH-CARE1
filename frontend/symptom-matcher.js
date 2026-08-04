function createMatcher(knownSymptoms = []) {
    const symptomList = Array.isArray(knownSymptoms) ? knownSymptoms : [];

    const synonymMap = {
        'fever': 'high_fever',
        'mild fever': 'mild_fever',
        'cold': 'continuous_sneezing',
        'runny nose': 'runny_nose',
        'stuffy nose': 'congestion',
        'body pain': 'muscle_pain',
        'body ache': 'muscle_pain',
        'tired': 'fatigue',
        'tiredness': 'fatigue',
        'throwing up': 'vomiting',
        'vomit': 'vomiting',
        'loose motion': 'diarrhoea',
        'loose motions': 'diarrhoea',
        'stomach ache': 'stomach_pain',
        'stomach hurts': 'stomach_pain',
        'stomach hurt': 'stomach_pain',
        'stomachache': 'stomach_pain',
        'belly pain': 'stomach_pain',
        'belly hurts': 'stomach_pain',
        'weakness': 'muscle_weakness',
        'itchy skin': 'itching',
        'rash': 'skin_rash',
        'sore throat': 'throat_irritation',
        'cant sleep': 'restlessness',
        "can't sleep": 'restlessness',
        'headache': 'headache',
        'cough': 'cough',
        'coughing': 'cough',
        'sneezing': 'continuous_sneezing',
        'sneeze': 'continuous_sneezing',
        'blocked nose': 'congestion',
        'nose blocked': 'congestion'
    };

    return function extractSymptoms(text) {
        if (!text || !text.trim()) return [];

        const normalized = text.toLowerCase();
        const found = new Set();

        symptomList.forEach(symptomKey => {
            const phrase = symptomKey.replace(/_/g, ' ').trim().toLowerCase();
            if (normalized.includes(phrase)) {
                found.add(symptomKey);
            }
        });

        Object.entries(synonymMap).forEach(([phrase, mappedSymptom]) => {
            if (normalized.includes(phrase) && symptomList.includes(mappedSymptom)) {
                found.add(mappedSymptom);
            }
        });

        return Array.from(found);
    };
}

if (typeof module !== 'undefined') {
    module.exports = { createMatcher };
}
