from rest_framework import serializers
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


class AIProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIProvider
        fields = "__all__"


class AIConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIConfiguration
        fields = "__all__"


class AIPromptTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIPromptTemplate
        fields = "__all__"


class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMessage
        fields = "__all__"


class AIConversationSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    messages = AIMessageSerializer(many=True, read_only=True)

    class Meta:
        model = AIConversation
        fields = [
            "id",
            "user",
            "user_email",
            "role",
            "session_title",
            "messages",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class AITaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = AITask
        fields = "__all__"


class AIRecommendationSerializer(serializers.ModelSerializer):
    target_user_email = serializers.CharField(source="target_user.email", read_only=True)

    class Meta:
        model = AIRecommendation
        fields = "__all__"


class AIKnowledgeDocumentSerializer(serializers.ModelSerializer):
    knowledge_base_name = serializers.CharField(source="knowledge_base.name", read_only=True)
    knowledge_base_category = serializers.CharField(source="knowledge_base.category", read_only=True)

    class Meta:
        model = AIKnowledgeDocument
        fields = "__all__"


class AIKnowledgeBaseSerializer(serializers.ModelSerializer):
    documents = AIKnowledgeDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = AIKnowledgeBase
        fields = [
            "id",
            "name",
            "category",
            "description",
            "documents",
            "created_at",
        ]


class AISummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AISummary
        fields = "__all__"


class AIUsageLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    provider_name = serializers.CharField(source="provider.name", read_only=True)

    class Meta:
        model = AIUsageLog
        fields = "__all__"


class AIFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIFeedback
        fields = "__all__"


class AIAuditLogSerializer(serializers.ModelSerializer):
    performed_by_email = serializers.CharField(source="performed_by.email", read_only=True)

    class Meta:
        model = AIAuditLog
        fields = "__all__"
