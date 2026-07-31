from apps.authentication.services import log_audit_event


def log_academic_action(request, action_type, entity_name, entity_id, details=None):
    if request:
        log_audit_event(
            request,
            event_type=f"academic_{action_type}",
            user=request.user,
            details={
                "entity": entity_name,
                "entity_id": str(entity_id),
                "action": action_type,
                **(details or {}),
            },
        )


def soft_delete_entity(instance, request=None):
    instance.soft_delete()
    if request:
        log_academic_action(request, "deleted", instance.__class__.__name__, instance.id)
    return True


def restore_entity(instance, request=None):
    instance.is_deleted = False
    instance.save()
    if request:
        log_academic_action(request, "restored", instance.__class__.__name__, instance.id)
    return instance
