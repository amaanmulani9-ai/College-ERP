"""
Unit and Integration Tests for Enterprise AI Academic Assistant
==================================================================
Tests:
1. Provider Registry & LLM abstraction
2. Prompt Template rendering
3. Conversation creation & chat processing
4. Knowledge Base search
5. Summary generation
6. Predictive Recommendation Engine
7. Conversation soft delete
8. Dashboard KPIs & REST API endpoints
"""

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

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
from apps.ai.services.ai_service import AIService, ProviderRegistry

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def setup_ai_data(db):
    admin_user = User.objects.create_user(
        email="ai.admin@example.com",
        password="Password123!",
        first_name="AI",
        last_name="Admin",
        is_staff=True,
        is_superuser=True,
    )

    provider = AIProvider.objects.create(
        name="Test OpenAI Provider",
        provider_type="OpenAI",
        model_name="gpt-4o-mini",
        enabled=True,
        priority=1,
    )

    template = AIPromptTemplate.objects.create(
        template_name="Test Attendance Summary",
        category="Attendance Summary",
        user_prompt_template="Summarize attendance for semester {sem_no}.",
        enabled=True
    )

    kb = AIKnowledgeBase.objects.create(
        name="Academic Policy KB",
        category="Academic",
        description="Core institutional rules and regulations."
    )

    doc = AIKnowledgeDocument.objects.create(
        knowledge_base=kb,
        title="Grading & Examination Policy 2026",
        content="Mandatory 75% attendance required for semester exam eligibility.",
        version="v1.0",
        status="Published"
    )

    return {
        "admin_user": admin_user,
        "provider": provider,
        "template": template,
        "kb": kb,
        "doc": doc,
    }


# ===========================================================================
# 1. Provider Registry & Abstraction Tests
# ===========================================================================

def test_provider_registry_response(setup_ai_data):
    provider_inst = ProviderRegistry.get_provider()
    res = provider_inst.generate_response("Summarize CSE semester attendance records.")
    assert "content" in res
    assert "tokens" in res
    assert res["tokens"] > 0


# ===========================================================================
# 2. Prompt Template Rendering Tests
# ===========================================================================

def test_prompt_rendering(setup_ai_data):
    rendered = AIService.render_prompt_template("Test Attendance Summary", {"sem_no": "6"})
    assert "semester 6" in rendered


# ===========================================================================
# 3. Conversation & Chat Processing Tests
# ===========================================================================

def test_conversation_and_chat_flow(setup_ai_data):
    user = setup_ai_data["admin_user"]
    conv = AIService.create_conversation(user=user, role="Faculty", title="Attendance Query Chat")

    assert conv.role == "Faculty"
    assert AIConversation.objects.filter(id=conv.id).exists()

    asst_msg = AIService.process_chat(
        conversation_id=str(conv.id),
        user_message_text="What is the exam grade distribution?",
        performed_by=user
    )

    assert asst_msg.role == "Assistant"
    assert AIMessage.objects.filter(conversation=conv).count() == 2
    assert AIUsageLog.objects.filter(user=user).exists()
    assert AIAuditLog.objects.filter(action__startswith="PROCESS_CHAT").exists()


# ===========================================================================
# 4. Knowledge Base Search Tests
# ===========================================================================

def test_knowledge_base_search(setup_ai_data):
    results = AIService.search_knowledge_base(query="Grading", category="Academic")
    assert len(results) >= 1
    assert results[0].title == "Grading & Examination Policy 2026"


# ===========================================================================
# 5. Summary & Recommendation Engine Tests
# ===========================================================================

def test_summary_and_recommendations(setup_ai_data):
    user = setup_ai_data["admin_user"]

    summary = AIService.generate_summary(
        subject_or_module="Machine Learning Syllabus",
        text="Supervised learning, classification, neural networks and deep learning models.",
        performed_by=user
    )
    assert summary.subject_or_module == "Machine Learning Syllabus"

    recs = AIService.generate_recommendations(target_user=user, performed_by=user)
    assert len(recs) >= 1
    assert AIRecommendation.objects.count() >= 1


# ===========================================================================
# 6. Soft Delete Test
# ===========================================================================

def test_soft_delete_conversation(setup_ai_data):
    user = setup_ai_data["admin_user"]
    conv = AIService.create_conversation(user=user, role="Student", title="Temp Chat")

    AIService.soft_delete_conversation(str(conv.id), performed_by=user)
    assert AIConversation.objects.filter(id=conv.id).count() == 0


# ===========================================================================
# 7. Dashboard KPIs & REST API Tests
# ===========================================================================

def test_ai_kpis_api(setup_ai_data):
    client = APIClient()
    client.force_authenticate(user=setup_ai_data["admin_user"])

    res = client.get("/api/ai/dashboard/kpis/")
    assert res.status_code == 200
    assert "ai_conversations" in res.data
    assert "knowledge_articles" in res.data


def test_ai_providers_list_api(setup_ai_data):
    client = APIClient()
    client.force_authenticate(user=setup_ai_data["admin_user"])

    res = client.get("/api/ai/providers/")
    assert res.status_code == 200
    assert len(res.data.get("results", res.data)) >= 1
