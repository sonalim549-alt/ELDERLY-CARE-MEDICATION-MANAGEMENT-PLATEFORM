import math
import random
from typing import Dict, Any, List
from models import GradCamAnalysisResponse, GradCamFinding

def generate_gradcam_analysis(
    scan_id: str = "XRAY-GER-2026-904",
    target_layer: str = "conv5_block16_concat",
    colormap: str = "jet",
    threshold: float = 0.35
) -> GradCamAnalysisResponse:
    
    # Layer specific activation parameters
    layer_config = {
        "conv5_block16_concat": {
            "name": "DenseNet-121 Layer conv5_block16 (Deep Semantic Features)",
            "primary_focus": "Alveolar consolidation & dense parenchymal infiltration",
            "feature_resolution": "7x7 feature map with bilinear upsampling (224x224)",
            "confidence_mod": 1.0
        },
        "conv4_block6_concat": {
            "name": "DenseNet-121 Layer conv4_block6 (Mid-Level Spatial Textures)",
            "primary_focus": "Peribronchial thickening & interstitial vascular markings",
            "feature_resolution": "14x14 feature map with bilinear upsampling",
            "confidence_mod": 0.94
        },
        "res_stage_5_bottleneck": {
            "name": "ResNet-50 Stage 5 Residual Bottleneck",
            "primary_focus": "Cardiac apex displacement and hilar prominence",
            "feature_resolution": "7x7 receptive field",
            "confidence_mod": 0.96
        }
    }

    selected_config = layer_config.get(target_layer, layer_config["conv5_block16_concat"])

    findings = [
        GradCamFinding(
            condition="Right Lower Lobe Consolidation (Pneumonia)",
            probability=round(94.2 * selected_config["confidence_mod"], 1),
            severity="Moderate - Early Infiltration",
            anatomical_location="Right retrocardiac & basilar bronchopulmonary segment",
            biomarker="Air bronchograms visible; localized gradient activation > 0.88"
        ),
        GradCamFinding(
            condition="Cardiomegaly (LV Hypertrophy Pattern)",
            probability=round(88.5 * selected_config["confidence_mod"], 1),
            severity="Mild to Moderate (CTR = 0.54)",
            anatomical_location="Cardiac silhouette, transverse thoracic diameter enlargement",
            biomarker="Left ventricular contour displacement toward left hemithorax"
        ),
        GradCamFinding(
            condition="Basilar Atelectasis",
            probability=round(62.3 * selected_config["confidence_mod"], 1),
            severity="Sub-segmental",
            anatomical_location="Bilateral costophrenic recesses",
            biomarker="Mild haziness without blunt obliteration of sulcus"
        ),
        GradCamFinding(
            condition="Pneumothorax",
            probability=1.2,
            severity="Negative / Rule-out",
            anatomical_location="Apical pleural interfaces",
            biomarker="Intact visceral pleural line; normal peripheral vascular arborization"
        )
    ]

    # Attention Heatmap Zones for SVG / Canvas rendering
    heatmap_zones = [
        {
            "id": "zone-pneumonia-right-base",
            "label": "Consolidation Hotspot (Alpha Gradient: 0.92)",
            "cx": 68.0,  # percentage x
            "cy": 64.0,  # percentage y
            "rx": 18.0,  # horizontal radius %
            "ry": 14.0,  # vertical radius %
            "peak_activation": 0.942,
            "condition": "Pneumonia / Opacity",
            "color_peak": "#ef4444",
            "color_mid": "#f59e0b",
            "color_edge": "#3b82f6"
        },
        {
            "id": "zone-cardiomegaly",
            "label": "Cardiac Contour Silhouette (Alpha Gradient: 0.84)",
            "cx": 44.0,
            "cy": 60.0,
            "rx": 22.0,
            "ry": 19.0,
            "peak_activation": 0.885,
            "condition": "Cardiomegaly",
            "color_peak": "#f97316",
            "color_mid": "#eab308",
            "color_edge": "#06b6d4"
        },
        {
            "id": "zone-peribronchial-marking",
            "label": "Bronchovascular Congestion (Alpha Gradient: 0.65)",
            "cx": 48.0,
            "cy": 40.0,
            "rx": 14.0,
            "ry": 12.0,
            "peak_activation": 0.623,
            "condition": "Vascular Engorgement",
            "color_peak": "#84cc16",
            "color_mid": "#06b6d4",
            "color_edge": "#3b82f6"
        }
    ]

    radiologist_notes = (
        "PA Chest Radiograph demonstrates asymmetric patchy consolidation in the right lower lobe consistent with early "
        "bacterial or aspiration bronchopneumonia in a 72-year-old male. Cardiac silhouette demonstrates mild cardiomegaly "
        "with cardiothoracic ratio of 0.54, concordant with chronic hypertension history. Grad-CAM visual gradients confirm "
        "deep neural network attention predominantly localized to the right lower paracardiac field and the left ventricular border."
    )

    geriatric_clinical_rec = (
        "1. Immediate empirical coverage: Oral Cefuroxime Axetil 500mg BID + Azithromycin 500mg OD (check penicillin allergy history: severe allergic reaction noted on file, use Respiratory Fluoroquinolone / Levofloxacin 750mg under strict supervision).\n"
        "2. Daily SpO2 pulse oximetry monitoring (maintain >= 94%).\n"
        "3. Repeat chest radiograph in 10 days to confirm radiological resolution.\n"
        "4. Strict fluid balance and continuation of daily Amlodipine 5mg + Telmisartan 40mg."
    )

    return GradCamAnalysisResponse(
        scan_id=scan_id,
        patient_id="PT-AYU-7281",
        patient_name="Rameshwar Prasad (Age 72)",
        scan_modality="High-Resolution Digital PA Chest Radiograph (16-bit DICOM Equivalent)",
        model_name="CheXNet-DenseNet121-Geriatric-v2.4",
        target_layer=target_layer,
        available_layers=list(layer_config.keys()),
        confidence_score=94.2,
        findings=findings,
        radiologist_notes=radiologist_notes,
        geriatric_clinical_recommendation=geriatric_clinical_rec,
        heatmap_zones=heatmap_zones
    )
