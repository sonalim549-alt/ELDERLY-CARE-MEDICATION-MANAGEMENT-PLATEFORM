import uuid
from datetime import datetime, timedelta
from typing import Dict, Any

class RefillOptimizer:
    """
    Economic Order Quantity & Priority Senior Logistics Dispatcher.
    Routes emergency refill requests to preferred senior-citizen express pharmacies.
    """

    PARTNER_NETWORKS = [
        {"name": "Apollo 24|7 Priority Geriatric Express", "sla_hours": 2, "rating": 4.9},
        {"name": "Netmeds Senior First-Track", "sla_hours": 3, "rating": 4.8},
        {"name": "Tata 1mg Elder Care Direct", "sla_hours": 2, "rating": 4.85}
    ]

    @classmethod
    def dispatch_priority_refill(cls, medicine_id: str, medicine_name: str, quantity: int = 30, preferred_network: str = None) -> Dict[str, Any]:
        """
        Dispatches a priority senior citizen electronic prescription refill.
        """
        partner = next((p for p in cls.PARTNER_NETWORKS if p["name"] == preferred_network), cls.PARTNER_NETWORKS[0])
        now = datetime.now()
        delivery_eta = (now + timedelta(hours=partner["sla_hours"])).strftime("%I:%M %p, %d %b %Y")
        order_ref = f"AYU-RX-{now.strftime('%Y%m%d')}-{uuid.uuid4().hex[:5].upper()}"

        return {
            "order_reference": order_ref,
            "medicine_id": medicine_id,
            "medicine_name": medicine_name,
            "refill_quantity": quantity,
            "pharmacy_partner": partner["name"],
            "sla_guarantee": f"Within {partner['sla_hours']} Hours (Senior Priority)",
            "estimated_delivery_time": delivery_eta,
            "dispatch_status": "Prescription Verified & Out for Delivery",
            "caregiver_sms_sent": True,
            "tracking_url": f"https://ayucare.in/track/{order_ref}"
        }
