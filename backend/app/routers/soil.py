from fastapi import APIRouter
from typing import Dict, Any
from ..schemas.crop_schemas import SoilAnalysisRequest
from ..ml.numpy_engine import NumpyAgriEngine

router = APIRouter(prefix="/soil", tags=["Soil Health & Nutrients"])

@router.post("/analyze")
def analyze_soil(request: SoilAnalysisRequest):
    """
    NumPy-backed diagnostic tool for soil fertility:
    - Calculates N:P:K stoichiometric proportions and balance score
    - Diagnoses nutrient deficiencies/toxicities
    - Computes Soil Health Index (SHI)
    - Provides specific fertilizer and pH soil amendment recommendations
    """
    engine = NumpyAgriEngine()
    
    ratios = engine.calculate_nutrient_ratios(request.nitrogen, request.phosphorus, request.potassium)
    health = engine.calculate_soil_health_index(request.nitrogen, request.phosphorus, request.potassium, request.ph)

    # Fertilizer adjustment guidelines
    fertilizer_plan = []
    if request.nitrogen < 50:
        deficit = 75 - request.nitrogen
        urea_needed = round(deficit * 2.17, 1)  # Urea is 46% N
        fertilizer_plan.append({
            "nutrient": "Nitrogen (N)",
            "action": "Supplementation required",
            "quantity_guide": f"Approx. {urea_needed} kg/ha of Urea (46% N) or 4-5 tonnes of composted cow dung manure",
            "organic_alternative": "Apply vermicompost, neem cake, or incorporate green manure (dhaincha / sunn hemp)."
        })
    elif request.nitrogen > 110:
        fertilizer_plan.append({
            "nutrient": "Nitrogen (N)",
            "action": "Excessive Nitrogen",
            "quantity_guide": "Cease nitrogenous chemical fertilization immediately.",
            "organic_alternative": "Plant heavy-feeder cover crops to absorb excess nitrates and prevent groundwater leaching."
        })

    if request.phosphorus < 30:
        deficit = 50 - request.phosphorus
        dap_needed = round(deficit * 2.17, 1)  # DAP is ~46% P2O5
        fertilizer_plan.append({
            "nutrient": "Phosphorus (P)",
            "action": "Supplementation required",
            "quantity_guide": f"Approx. {dap_needed} kg/ha of Single Super Phosphate (SSP) or Diammonium Phosphate (DAP)",
            "organic_alternative": "Apply steamed bone meal or rock phosphate inoculated with PSB (Phosphorus Solubilizing Bacteria)."
        })

    if request.potassium < 30:
        deficit = 50 - request.potassium
        mop_needed = round(deficit * 1.67, 1)  # MOP is 60% K2O
        fertilizer_plan.append({
            "nutrient": "Potassium (K)",
            "action": "Supplementation required",
            "quantity_guide": f"Approx. {mop_needed} kg/ha of Muriate of Potash (MOP)",
            "organic_alternative": "Apply wood ash, seaweed extracts, or decomposed banana peel bio-slurry."
        })

    return {
        "soil_health_index": health["overall_score"],
        "ph_rating": health["ph_rating"],
        "nitrogen_status": health["nitrogen_status"],
        "phosphorus_status": health["phosphorus_status"],
        "potassium_status": health["potassium_status"],
        "nutrient_ratios": ratios,
        "recommendations": health["fertilizer_recommendations"],
        "fertilizer_plan": fertilizer_plan,
        "sensor_free_note": "Calculations are based on standard laboratory Soil Health Card parameters. No real-time electronic sensors or IoT hardware are required."
    }
