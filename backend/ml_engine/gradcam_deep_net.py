import math
from typing import List, Dict, Any, Tuple

class GradCamDeepNet:
    """
    Mathematical Implementation of Gradient-weighted Class Activation Mapping (Grad-CAM)
    for Geriatric Pulmonary Radiographs using DenseNet-121 convolutional representations.
    Ref: Selvaraju et al., ICCV 2017 & Rajpurkar et al. (CheXNet), Stanford ML Group.
    """

    def __init__(self, architecture: str = "DenseNet-121-CheXNet-Geriatric"):
        self.architecture = architecture
        self.input_shape = (224, 224, 3)
        self.target_classes = ["Pneumonia", "Cardiomegaly", "Atelectasis", "Infiltration", "Effusion"]

    def compute_neuron_importance_weights(self, feature_map: List[List[float]], gradients: List[List[float]]) -> float:
        """
        Global Average Pooling of gradients to compute importance weights alpha_k^c:
        alpha_k^c = (1 / Z) * sum_i sum_j (d Y^c / d A_i,j^k)
        """
        rows = len(gradients)
        cols = len(gradients[0]) if rows > 0 else 0
        if rows == 0 or cols == 0:
            return 0.0
        
        grad_sum = sum(sum(row) for row in gradients)
        z = rows * cols
        return max(0.0, grad_sum / z)

    def generate_activation_matrix(self, rows: int = 14, cols: int = 14, peak_x: int = 9, peak_y: int = 9, sigma: float = 2.4) -> List[List[float]]:
        """
        Synthesize Gaussian-weighted forward activation tensor for pathological focal point.
        L_Grad-CAM = ReLU( sum_k alpha_k^c * A^k )
        """
        matrix = []
        for r in range(rows):
            row_data = []
            for c in range(cols):
                dist_sq = (r - peak_y) ** 2 + (c - peak_x) ** 2
                val = math.exp(-dist_sq / (2 * (sigma ** 2)))
                row_data.append(round(val, 4))
            matrix.append(row_data)
        return matrix

    def bilinear_upsample(self, low_res: List[List[float]], target_rows: int = 28, target_cols: int = 28) -> List[List[float]]:
        """
        Bilinear interpolation to project feature map activation to radiograph canvas.
        """
        src_rows = len(low_res)
        src_cols = len(low_res[0]) if src_rows > 0 else 0
        upsampled = []

        for tr in range(target_rows):
            row = []
            sr = tr * (src_rows - 1) / (target_rows - 1)
            r0 = int(math.floor(sr))
            r1 = min(src_rows - 1, r0 + 1)
            dr = sr - r0

            for tc in range(target_cols):
                sc = tc * (src_cols - 1) / (target_cols - 1)
                c0 = int(math.floor(sc))
                c1 = min(src_cols - 1, c0 + 1)
                dc = sc - c0

                v00 = low_res[r0][c0]
                v01 = low_res[r0][c1]
                v10 = low_res[r1][c0]
                v11 = low_res[r1][c1]

                interp = (1 - dr) * (1 - dc) * v00 + (1 - dr) * dc * v01 + dr * (1 - dc) * v10 + dr * dc * v11
                row.append(round(interp, 4))
            upsampled.append(row)
        return upsampled

    def apply_colormap_rgb(self, norm_val: float, colormap: str = "jet") -> Tuple[int, int, int]:
        """
        Convert normalized float activation [0.0, 1.0] to RGB tuple for rendering.
        """
        v = min(1.0, max(0.0, norm_val))
        if colormap == "jet":
            # Classic Jet colormap: Blue -> Cyan -> Green -> Yellow -> Red
            if v < 0.125:
                return (0, 0, int(128 + 127 * (v / 0.125)))
            elif v < 0.375:
                return (0, int(255 * ((v - 0.125) / 0.25)), 255)
            elif v < 0.625:
                return (int(255 * ((v - 0.375) / 0.25)), 255, int(255 * (1 - (v - 0.375) / 0.25)))
            elif v < 0.875:
                return (255, int(255 * (1 - (v - 0.625) / 0.25)), 0)
            else:
                return (int(255 - 128 * ((v - 0.875) / 0.125)), 0, 0)
        elif colormap == "turbo":
            # High dynamic range
            r = int(255 * (0.1357 + 4.5 * v - 12.0 * (v**2) + 9.5 * (v**3)))
            g = int(255 * (0.0914 + 2.1 * v - 1.2 * (v**2)))
            b = int(255 * (0.1067 + 12.5 * v - 45.0 * (v**2) + 40.0 * (v**3)))
            return (min(255, max(0, r)), min(255, max(0, g)), min(255, max(0, b)))
        else:
            # Default Viridis/Inferno style
            r = int(255 * v)
            g = int(180 * (1 - abs(v - 0.5) * 2))
            b = int(255 * (1 - v))
            return (r, g, b)
