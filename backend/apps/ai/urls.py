from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.ai.views import (
    AIProviderViewSet,
    AIConfigurationViewSet,
    AIPromptTemplateViewSet,
    AIConversationViewSet,
    AIMessageViewSet,
    AITaskViewSet,
    AIRecommendationViewSet,
    AIKnowledgeBaseViewSet,
    AIKnowledgeDocumentViewSet,
    AISummaryViewSet,
    AIUsageLogViewSet,
    AIFeedbackViewSet,
    AIAuditLogViewSet,
    ai_dashboard_kpis,
    ai_reports,
)

router = DefaultRouter()
router.register(r"providers", AIProviderViewSet, basename="ai-provider")
router.register(r"configurations", AIConfigurationViewSet, basename="ai-configuration")
router.register(r"prompt-templates", AIPromptTemplateViewSet, basename="ai-prompt-template")
router.register(r"conversations", AIConversationViewSet, basename="ai-conversation")
router.register(r"messages", AIMessageViewSet, basename="ai-message")
router.register(r"tasks", AITaskViewSet, basename="ai-task")
router.register(r"recommendations", AIRecommendationViewSet, basename="ai-recommendation")
router.register(r"knowledge-bases", AIKnowledgeBaseViewSet, basename="ai-knowledge-base")
router.register(r"knowledge-documents", AIKnowledgeDocumentViewSet, basename="ai-knowledge-document")
router.register(r"summaries", AISummaryViewSet, basename="ai-summary")
router.register(r"usage-logs", AIUsageLogViewSet, basename="ai-usage-log")
router.register(r"feedbacks", AIFeedbackViewSet, basename="ai-feedback")
router.register(r"audit-logs", AIAuditLogViewSet, basename="ai-audit-log")

urlpatterns = [
    path("dashboard/kpis/", ai_dashboard_kpis, name="ai-dashboard-kpis"),
    path("reports/", ai_reports, name="ai-reports"),
    path("", include(router.urls)),
]
