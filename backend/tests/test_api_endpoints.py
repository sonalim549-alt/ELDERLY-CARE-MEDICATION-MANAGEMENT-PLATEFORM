import unittest
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app
from seed_data import get_seed_patient

class TestApiEndpoints(unittest.TestCase):

    def test_app_metadata(self):
        self.assertEqual(app.title, "AyuCare AI: Intelligent Elderly Care & Medication Ecosystem")
        self.assertEqual(app.version, "2.4.0")

    def test_patient_seed_integrity(self):
        patient = get_seed_patient()
        self.assertEqual(patient.name, "Rameshwar Prasad")
        self.assertEqual(patient.age, 72)
        self.assertEqual(patient.blood_group, "B+")
        self.assertIn("Penicillin (Severe Urticaria / Bronchospasm)", patient.allergies)

if __name__ == "__main__":
    unittest.main()
