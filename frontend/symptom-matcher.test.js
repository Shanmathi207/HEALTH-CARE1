const assert = require('assert');
const { createMatcher } = require('./symptom-matcher');

const symptoms = ['high_fever', 'headache', 'stomach_pain', 'vomiting', 'cough', 'runny_nose', 'throat_irritation'];
const extractSymptoms = createMatcher(symptoms);

function normalize(arr) {
  return [...arr].sort();
}

assert.deepStrictEqual(normalize(extractSymptoms('I have a high fever and headache')), ['headache', 'high_fever']);
assert.deepStrictEqual(normalize(extractSymptoms('I have fever and a sore throat')), ['high_fever', 'throat_irritation']);
assert.deepStrictEqual(normalize(extractSymptoms('My stomach hurts and I am vomiting')), ['stomach_pain', 'vomiting']);
assert.deepStrictEqual(normalize(extractSymptoms('I have a runny nose and cough')), ['cough', 'runny_nose']);

console.log('symptom matcher tests passed');
