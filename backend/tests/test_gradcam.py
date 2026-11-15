import unittest
from ml_engine.gradcam_deep_net import GradCamDeepNet
from ml_engine.radiological_segmentation import RadiologicalSegmentation

class TestGradCam(unittest.TestCase):

    def setUp(self):
        self.gradcam = GradCamDeepNet()

    def test_activation_matrix_generation(self):
        mat = self.gradcam.generate_activation_matrix(rows=14, cols=14)
        self.assertEqual(len(mat), 14)
        self.assertEqual(len(mat[0]), 14)
        # Peak at center should be near 1.0
        self.assertGreater(mat[9][9], 0.95)

    def test_bilinear_upsampling(self):
        low_res = [[0.0, 1.0], [1.0, 0.0]]
        upsampled = self.gradcam.bilinear_upsample(low_res, target_rows=4, target_cols=4)
        self.assertEqual(len(upsampled), 4)
        self.assertEqual(len(upsampled[0]), 4)

    def test_colormap_jet_bounds(self):
        r, g, b = self.gradcam.apply_colormap_rgb(1.0, "jet")
        self.assertGreaterEqual(r, 0)
        self.assertLessEqual(r, 255)

    def test_ctr_calculation(self):
        res = RadiologicalSegmentation.calculate_cardiothoracic_ratio(162.0, 300.0)
        self.assertEqual(res["ctr"], 0.54)
        self.assertTrue(res["is_cardiomegaly"])

if __name__ == "__main__":
    unittest.main()
