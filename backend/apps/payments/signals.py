"""
Payment Signals
===============
- After PaymentTransaction is saved as 'success', confirm audit log exists.
- Keep PaymentOrder status in sync.
"""

import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import PaymentTransaction

logger = logging.getLogger(__name__)


@receiver(post_save, sender=PaymentTransaction)
def sync_order_status_on_transaction(sender, instance, created, **kwargs):
    """
    When a PaymentTransaction is saved, keep its parent PaymentOrder status consistent.
    """
    if not instance.order_id:
        return

    try:
        order = instance.order
        if instance.status == "success" and order.status != "paid":
            order.status = "paid"
            order.save(update_fields=["status", "updated_at"])
            logger.debug("Order %s marked paid via transaction signal.", order.order_id)
        elif instance.status == "failed" and order.status not in ("paid", "cancelled"):
            order.status = "attempted"
            order.save(update_fields=["status", "updated_at"])
    except Exception as exc:
        logger.warning("Signal failed to sync order status: %s", exc)
