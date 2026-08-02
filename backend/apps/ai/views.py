from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.ai.models import (
    AIProvider,
    AIConfiguration,
    AIPromptTemplate,
    AIConversation,
    AIMessage,
    AITask,
    AIRecommendation,
    AIKnowledgeBase,
    AIKnowledgeDocument,
    AISummary,
    AIUsageLog,
    AIFeedback,
    AIAuditLog,
)
from apps.ai.serializers import (
    AIProviderSerializer,
    AIConfigurationSerializer,
    AIPromptTemplateSerializer,
    AIConversationSerializer,
    AIMessageSerializer,
    AITaskSerializer,
    AIRecommendationSerializer,
    AIKnowledgeBaseSerializer,
    AIKnowledgeDocumentSerializer,
    AISummarySerializer,
    AIUsageLogSerializer,
    AIFeedbackSerializer,
    AIAuditLogSerializer,
)
from apps.ai.services.ai_service import AIService
from apps.ai.permissions import IsAIAssistantUser


class AIProviderViewSet(viewsets.ModelViewSet):
    queryset = AIProvider.objects.all()
    serializer_class = AIProviderSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]
    filterset_fields = ["provider_type", "enabled"]


class AIConfigurationViewSet(viewsets.ModelViewSet):
    queryset = AIConfiguration.objects.all()
    serializer_class = AIConfigurationSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]


class AIPromptTemplateViewSet(viewsets.ModelViewSet):
    queryset = AIPromptTemplate.objects.all()
    serializer_class = AIPromptTemplateSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]
    filterset_fields = ["category", "enabled"]
    search_fields = ["template_name", "user_prompt_template"]


class AIConversationViewSet(viewsets.ModelViewSet):
    queryset = AIConversation.objects.filter(is_deleted=False)
    serializer_class = AIConversationSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]
    filterset_fields = ["role"]
    search_fields = ["session_title"]

    def perform_create(self, serializer):
        conv = AIService.create_conversation(
            user=self.request.user,
            role=self.request.data.get("role", "Student"),
            title=self.request.data.get("session_title", "Academic Support Chat"),
            performed_by=self.request.user
        )
        serializer.instance = conv

    def perform_destroy(self, instance):
        AIService.soft_delete_conversation(conversation_id=instance.id, performed_by=self.request.user)

    @action(detail=True, methods=["post"])
    def chat(self, request, pk=None):
        """Processes a chat message within an existing conversation session."""
        message_text = request.data.get("message")
        provider_id = request.data.get("provider_id")
        if not message_text:
            return Response({"error": "Field 'message' is required."}, status=status.HTTP_400_BAD_REQUEST)

        asst_msg = AIService.process_chat(
            conversation_id=pk,
            user_message_text=message_text,
            provider_id=provider_id,
            performed_by=request.user
        )
        return Response(AIMessageSerializer(asst_msg).data, status=status.HTTP_201_CREATED)


class AIMessageViewSet(viewsets.ModelViewSet):
    queryset = AIMessage.objects.all()
    serializer_class = AIMessageSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]


class AITaskViewSet(viewsets.ModelViewSet):
    queryset = AITask.objects.all()
    serializer_class = AITaskSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]


class AIRecommendationViewSet(viewsets.ModelViewSet):
    queryset = AIRecommendation.objects.all()
    serializer_class = AIRecommendationSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]
    filterset_fields = ["category"]

    @action(detail=False, methods=["post"])
    def generate(self, request):
        recs = AIService.generate_recommendations(performed_by=request.user)
        return Response(AIRecommendationSerializer(recs, many=True).data)


class AIKnowledgeBaseViewSet(viewsets.ModelViewSet):
    queryset = AIKnowledgeBase.objects.all()
    serializer_class = AIKnowledgeBaseSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]
    filterset_fields = ["category"]


class AIKnowledgeDocumentViewSet(viewsets.ModelViewSet):
    queryset = AIKnowledgeDocument.objects.all()
    serializer_class = AIKnowledgeDocumentSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]
    filterset_fields = ["status"]
    search_fields = ["title", "content"]

    @action(detail=False, methods=["get"])
    def search(self, request):
        query = request.query_params.get("q", "")
        category = request.query_params.get("category")
        results = AIService.search_knowledge_base(query=query, category=category)
        return Response(AIKnowledgeDocumentSerializer(results, many=True).data)


class AISummaryViewSet(viewsets.ModelViewSet):
    queryset = AISummary.objects.all()
    serializer_class = AISummarySerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]


class AIUsageLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AIUsageLog.objects.all()
    serializer_class = AIUsageLogSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]


class AIFeedbackViewSet(viewsets.ModelViewSet):
    queryset = AIFeedback.objects.all()
    serializer_class = AIFeedbackSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]


class AIAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AIAuditLog.objects.all()
    serializer_class = AIAuditLogSerializer
    permission_classes = [IsAuthenticated, IsAIAssistantUser]


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAIAssistantUser])
def ai_dashboard_kpis(request):
    """Returns Key Performance Indicators for Enterprise AI Assistant."""
    kpis = AIService.compute_dashboard_kpis()
    return Response(kpis)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAIAssistantUser])
def ai_reports(request):
    """Generates structured data for AI Analytics Reports suite."""
    report_type = request.query_params.get("type", "usage")

    if report_type == "prompt_usage":
        data = AIPromptTemplateSerializer(AIPromptTemplate.objects.all()[:50], many=True).data
    elif report_type == "feedback_report":
        data = AIFeedbackSerializer(AIFeedback.objects.all()[:50], many=True).data
    elif report_type == "recommendation_report":
        data = AIRecommendationSerializer(AIRecommendation.objects.all()[:50], many=True).data
    elif report_type == "knowledge_report":
        data = AIKnowledgeDocumentSerializer(AIKnowledgeDocument.objects.all()[:50], many=True).data
    else: # usage
        data = AIUsageLogSerializer(AIUsageLog.objects.all()[:50], many=True).data

    return Response({
        "report_type": report_type,
        "data": data
    })
