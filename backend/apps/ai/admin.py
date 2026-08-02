from django.contrib import admin
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


class AIMessageInline(admin.TabularInline):
    model = AIMessage
    extra = 0


class AIKnowledgeDocumentInline(admin.TabularInline):
    model = AIKnowledgeDocument
    extra = 0


@admin.register(AIProvider)
class AIProviderAdmin(admin.ModelAdmin):
    list_display = ["name", "provider_type", "model_name", "enabled", "priority"]
    list_filter = ["provider_type", "enabled"]
    search_fields = ["name", "model_name", "endpoint"]


@admin.register(AIConfiguration)
class AIConfigurationAdmin(admin.ModelAdmin):
    list_display = ["config_key", "config_value", "description"]
    search_fields = ["config_key", "config_value"]


@admin.register(AIPromptTemplate)
class AIPromptTemplateAdmin(admin.ModelAdmin):
    list_display = ["template_name", "category", "enabled", "created_at"]
    list_filter = ["category", "enabled"]
    search_fields = ["template_name", "user_prompt_template"]
    actions = ["action_bulk_enable_templates"]

    @admin.action(description="Bulk Enable Selected Prompt Templates")
    def action_bulk_enable_templates(self, request, queryset):
        count = queryset.update(enabled=True)
        self.message_user(request, f"Enabled {count} prompt template(s).")


@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    list_display = ["session_title", "user", "role", "created_at", "updated_at"]
    list_filter = ["role"]
    search_fields = ["session_title", "user__email"]
    inlines = [AIMessageInline]


@admin.register(AIMessage)
class AIMessageAdmin(admin.ModelAdmin):
    list_display = ["conversation", "role", "token_count_placeholder", "created_at"]
    list_filter = ["role"]
    search_fields = ["content"]


@admin.register(AITask)
class AITaskAdmin(admin.ModelAdmin):
    list_display = ["task_type", "status", "created_at"]
    list_filter = ["task_type", "status"]


@admin.register(AIRecommendation)
class AIRecommendationAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "target_user", "score", "created_at"]
    list_filter = ["category"]
    search_fields = ["title", "details"]


@admin.register(AIKnowledgeBase)
class AIKnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "created_at"]
    list_filter = ["category"]
    search_fields = ["name", "description"]
    inlines = [AIKnowledgeDocumentInline]
    actions = ["action_bulk_knowledge_import_placeholder"]

    @admin.action(description="Bulk Knowledge Import Placeholder")
    def action_bulk_knowledge_import_placeholder(self, request, queryset):
        self.message_user(request, f"Bulk knowledge import executed for {queryset.count()} knowledge base(s).")


@admin.register(AIKnowledgeDocument)
class AIKnowledgeDocumentAdmin(admin.ModelAdmin):
    list_display = ["title", "knowledge_base", "version", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["title", "content"]


@admin.register(AISummary)
class AISummaryAdmin(admin.ModelAdmin):
    list_display = ["subject_or_module", "created_at"]
    search_fields = ["subject_or_module", "summary_text"]


@admin.register(AIUsageLog)
class AIUsageLogAdmin(admin.ModelAdmin):
    list_display = ["prompt_type", "user", "provider", "response_time_ms", "estimated_tokens", "status", "timestamp"]
    list_filter = ["status", "prompt_type"]


@admin.register(AIFeedback)
class AIFeedbackAdmin(admin.ModelAdmin):
    list_display = ["conversation", "rating", "comment", "created_at"]


@admin.register(AIAuditLog)
class AIAuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "performed_by", "timestamp"]
    search_fields = ["action"]
