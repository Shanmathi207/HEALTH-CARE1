import os
import sys
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


class AppRoutesTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_root_shows_trained_symptoms_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        body = response.get_data(as_text=True)
        self.assertIn('Smart Care AI Symptom Engine', body)
        self.assertIn('Trained symptoms', body)
        self.assertIn('high_fever', body)

    def test_symptoms_endpoint_returns_list(self):
        response = self.client.get('/symptoms')
        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertIn('symptoms', payload)
        self.assertGreaterEqual(len(payload['symptoms']), 3)


if __name__ == '__main__':
    unittest.main()
