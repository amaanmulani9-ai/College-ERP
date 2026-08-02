"""
Enterprise AI Academic Assistant Models
=========================================
Covers AIProvider, AIConfiguration, AIPromptTemplate, AIConversation,
AIMessage, AITask, AIRecommendation, AIKnowledgeBase, AIKnowledgeDocument,
AISummary, AIUsageLog, AIFeedback, and AIAuditLog.
"""

import uuid
from django.conf import settings
from django.db import models


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


# ---------------------------------------------------------------------------
# 1. AI Provider & System Configurations
# ---------------------------------------------------------------------------
class AIProvider(models.Model):
    PROVIDER_TYPE_CHOICES = [
        ("OpenAI", "OpenAI API"),
        ("Gemini", "Google Gemini API"),
        ("Azure OpenAI", "Azure OpenAI Service"),
        ("Ollama", "Ollama Local Instance"),
        ("Local LLM", "Local HuggingFace / VLLM Server"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    provider_type = models.CharField(max_length=30, choices=PROVIDER_TYPE_CHOICES, default="OpenAI")
    endpoint = models.CharField(max_length=300, default="https://api.openai.com/v1/chat/completions")
    api_key_placeholder = models.CharField(max_length=200, blank=True, default="sk-placeholder-key-xyz")
    model_name = models.CharField(max_length=100, default="gpt-4o-mini")
    enabled = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["priority", "name"]
        verbose_name = "AI Provider Configuration"
        verbose_name_plural = "AI Provider Configurations"

    def __str__(self):
        return f"{self.name} ({self.provider_type} - {self.model_name})"


class AIConfiguration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    config_key = models.CharField(max_length=100, unique=True, db_index=True)
    config_value = models.TextField()
    description = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "AI System Setting"
        verbose_name_plural = "AI System Settings"

    def __str__(self):
        return f"{self.config_key} = {self.config_value[:30]}"


# ---------------------------------------------------------------------------
# 2. Prompt Templates
# ---------------------------------------------------------------------------
class AIPromptTemplate(models.Model):
    CATEGORY_CHOICES = [
        ("Attendance Summary", "Attendance Summary"),
        ("Student Performance", "Student Performance Analysis"),
        ("Exam Analysis", "Exam Analysis & Grade Insights"),
        ("Fee Reminder", "Fee Reminder Draft"),
        ("Email Draft", "Email & Notification Draft"),
        ("Notice Draft", "Institutional Notice Draft"),
        ("Timetable Summary", "Timetable & Schedule Summary"),
        ("Placement Recommendation", "Placement Recommendation"),
        ("Leave Recommendation", "Leave Recommendation"),
        ("General Academic", "General Academic Guidance"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template_name = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="General Academic")
    system_prompt = models.TextField(default="You are an expert AI Academic Assistant for educational institutions.")
    user_prompt_template = models.TextField()
    variables = models.JSONField(default=list, blank=True)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "template_name"]
        verbose_name = "AI Prompt Template"
        verbose_name_plural = "AI Prompt Templates"

    def __str__(self):
        return f"{self.template_name} [{self.category}]"


# ---------------------------------------------------------------------------
# 3. Conversations & Messages
# ---------------------------------------------------------------------------
class AIConversation(models.Model):
    ROLE_CHOICES = [
        ("Student", "Student User"),
        ("Faculty", "Faculty Member"),
        ("Parent", "Parent / Guardian"),
        ("Principal", "Principal / Management"),
        ("Admin", "System Administrator"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ai_conversations")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="Student")
    session_title = models.CharField(max_length=200, default="Academic Support Chat")

    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "AI Conversation"
        verbose_name_plural = "AI Conversations"

    def __str__(self):
        return f"Chat '{self.session_title}' ({self.user.email} - {self.role})"


class AIMessage(models.Model):
    ROLE_CHOICES = [
        ("User", "User Input"),
        ("Assistant", "AI Assistant Response"),
        ("System", "System Prompt / Context"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="User")
    content = models.TextField()
    token_count_placeholder = models.PositiveIntegerField(default=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "AI Chat Message"
        verbose_name_plural = "AI Chat Messages"

    def __str__(self):
        return f"[{self.role}] {self.content[:40]}..."


# ---------------------------------------------------------------------------
# 4. Tasks, Recommendations & Summaries
# ---------------------------------------------------------------------------
class AITask(models.Model):
    TASK_TYPE_CHOICES = [
        ("Summarize", "Summarize Text / Syllabus"),
        ("Explain", "Explain Complex Academic Topic"),
        ("Draft", "Draft Email / Letter / Circular"),
        ("Recommend", "Predictive Recommendation"),
        ("Predict", "Academic Performance Forecast"),
        ("Generate", "Generate Quiz / Test Questions"),
        ("Translate", "Translate Academic Document"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending Execution"),
        ("Completed", "Completed Successfully"),
        ("Failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task_type = models.CharField(max_length=30, choices=TASK_TYPE_CHOICES, default="Summarize")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Completed")
    payload = models.JSONField(default=dict, blank=True)
    result = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Asynchronous Task"
        verbose_name_plural = "AI Asynchronous Tasks"

    def __str__(self):
        return f"AI Task {self.task_type} [{self.status}]"


class AIRecommendation(models.Model):
    CATEGORY_CHOICES = [
        ("Student Risk", "Academic Dropout / Failure Risk"),
        ("Attendance Warning", "Low Attendance Warning"),
        ("Fee Defaulter", "Fee Payment Overdue Warning"),
        ("Placement Suggestion", "Corporate Job / Internship Match"),
        ("Course Recommendation", "Elective / Skill Course Suggestion"),
        ("Scholarship Suggestion", "Merit Scholarship Eligibility"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    target_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="ai_recommendations")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="Student Risk")
    title = models.CharField(max_length=200)
    details = models.TextField()
    score = models.DecimalField(max_digits=5, decimal_places=2, default=92.50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Recommendation"
        verbose_name_plural = "AI Recommendations"

    def __str__(self):
        return f"AI Rec: {self.title} ({self.category} - {self.score}%)"


class AISummary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject_or_module = models.CharField(max_length=150)
    summary_text = models.TextField()
    source_metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Summary Record"
        verbose_name_plural = "AI Summary Records"

    def __str__(self):
        return f"Summary: {self.subject_or_module}"


# ---------------------------------------------------------------------------
# 5. Knowledge Base & Documents
# ---------------------------------------------------------------------------
class AIKnowledgeBase(models.Model):
    CATEGORY_CHOICES = [
        ("Academic", "Academic & Curriculum Policies"),
        ("HR", "HR & Staff Guidelines"),
        ("Finance", "Fee Structure & Financial Rules"),
        ("Library", "Library Catalog & Borrowing Rules"),
        ("Hostel", "Hostel Rules & Allotment Guidelines"),
        ("Transport", "Transport Routes & Bus Regulations"),
        ("Inventory", "Asset & Equipment Guidelines"),
        ("Policies", "General Institutional Policies & Code of Conduct"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="Academic")
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "name"]
        verbose_name = "AI Knowledge Base"
        verbose_name_plural = "AI Knowledge Bases"

    def __str__(self):
        return f"{self.name} [{self.category}]"


class AIKnowledgeDocument(models.Model):
    STATUS_CHOICES = [
        ("Published", "Published & Indexed"),
        ("Draft", "Draft Document"),
        ("Archived", "Archived"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    knowledge_base = models.ForeignKey(AIKnowledgeBase, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=200)
    content = models.TextField()
    source = models.CharField(max_length=200, default="Institutional Handbook")
    version = models.CharField(max_length=20, default="v1.0")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Published")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Knowledge Document"
        verbose_name_plural = "AI Knowledge Documents"

    def __str__(self):
        return f"{self.title} ({self.knowledge_base.name} - {self.version})"


# ---------------------------------------------------------------------------
# 6. Usage Logs, Feedback & Audit
# ---------------------------------------------------------------------------
class AIUsageLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    provider = models.ForeignKey(AIProvider, on_delete=models.SET_NULL, null=True, blank=True)
    prompt_type = models.CharField(max_length=100, default="Chat Query")
    response_time_ms = models.PositiveIntegerField(default=145)
    estimated_tokens = models.PositiveIntegerField(default=250)
    status = models.CharField(max_length=20, default="Success")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "AI Usage Log"
        verbose_name_plural = "AI Usage Logs"

    def __str__(self):
        return f"Usage Log [{self.prompt_type}] -> {self.response_time_ms}ms ({self.estimated_tokens} tokens)"


class AIFeedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name="feedbacks")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    comment = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Response Feedback"
        verbose_name_plural = "AI Response Feedbacks"

    def __str__(self):
        return f"Feedback {self.rating}/5 for Chat {self.conversation.id}"


class AIAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "AI System Audit Log"
        verbose_name_plural = "AI System Audit Logs"

    def __str__(self):
        return f"[{self.timestamp}] AI Action: {self.action}"
