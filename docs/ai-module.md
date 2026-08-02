# Enterprise AI Academic Assistant (apps/ai)

## Executive Summary

The **Enterprise AI Academic Assistant** provides AI-powered workflows for students, faculty, administrators, and parents. It includes interactive AI chat assistance, institutional prompt template libraries, knowledge base RAG search, predictive student risk recommendations, summary generation, token usage logging, user feedback ratings, and LLM provider management.

---

## Data Models Summary (`apps/ai/models.py`)

| Model | Description |
|-------|-------------|
| `AIProvider` | Pluggable LLM provider configurations (OpenAI, Gemini, Azure OpenAI, Ollama, Local LLM). |
| `AIConfiguration` | System-wide AI parameters (max token limits, temperature, top-K RAG limits). |
| `AIPromptTemplate` | Standardized prompt templates for attendance summaries, exam analysis, fee reminders, etc. |
| `AIConversation` | Chat session logs across roles (Student, Faculty, Parent, Principal, Admin). |
| `AIMessage` | Chat messages exchanged between User, Assistant, and System. |
| `AITask` | Asynchronous AI tasks (Summarize, Explain, Draft, Recommend, Predict, Generate, Translate). |
| `AIRecommendation` | Predictive recommendations for student risk, attendance warnings, placement matches, and courses. |
| `AIKnowledgeBase` | Knowledge base categories across Academic, HR, Finance, Library, Hostel, Transport, Inventory, Policies. |
| `AIKnowledgeDocument` | Knowledge base documents and handbook articles indexed for RAG retrieval. |
| `AISummary` | AI summary records for academic subjects and modules. |
| `AIUsageLog` | Token usage logs, provider latency metrics, and execution status. |
| `AIFeedback` | User satisfaction ratings and feedback comments. |
| `AIAuditLog` | Security audit log for AI actions. |

---

## Core Service API (`apps/ai/services/ai_service.py`)

- `ProviderRegistry.get_provider(provider_id)`
- `AIService.render_prompt_template(template_name, context)`
- `AIService.create_conversation(user, role, title, performed_by)`
- `AIService.process_chat(conversation_id, user_message_text, provider_id, performed_by)`
- `AIService.search_knowledge_base(query, category)`
- `AIService.generate_summary(subject_or_module, text, performed_by)`
- `AIService.generate_recommendations(target_user, performed_by)`
- `AIService.compute_dashboard_kpis()`
- `AIService.soft_delete_conversation(conversation_id, performed_by)`

---

## REST Endpoints (`/api/ai/`)

- `/api/ai/providers/` — AI Providers
- `/api/ai/configurations/` — AI System Settings
- `/api/ai/prompt-templates/` — Prompt Templates
- `/api/ai/conversations/` — AI Conversations (`/chat/`)
- `/api/ai/messages/` — Chat Messages
- `/api/ai/tasks/` — Asynchronous AI Tasks
- `/api/ai/recommendations/` — AI Recommendations (`/generate/`)
- `/api/ai/knowledge-bases/` — Knowledge Bases
- `/api/ai/knowledge-documents/` — Knowledge Documents (`/search/`)
- `/api/ai/summaries/` — AI Summaries
- `/api/ai/usage-logs/` — Token Usage Logs
- `/api/ai/feedbacks/` — Response Feedback
- `/api/ai/audit-logs/` — AI Audit Logs
- `/api/ai/dashboard/kpis/` — AI Dashboard KPIs
- `/api/ai/reports/` — AI Reports Suite

---

## Frontend Navigation & Pages (`frontend/src/pages/ai/`)

1. **`AIDashboardPage.tsx`** — Command center KPIs, feature navigation, and live activity stream.
2. **`AssistantPage.tsx`** — Interactive AI Chat Assistant UI with quick prompts and token stats.
3. **`PromptLibraryPage.tsx`** — Standardized prompt templates for attendance, exams, fees, and notices.
4. **`KnowledgeBasePage.tsx`** — RAG Knowledge Base articles and handbook documentation.
5. **`ConversationsPage.tsx`** — Chat session logs and history across roles.
6. **`RecommendationsPage.tsx`** — Predictive student risk warnings, attendance alerts, and placement matches.
7. **`UsageAnalyticsPage.tsx`** — Token usage analytics, provider latency metrics, and execution logs.
8. **`ProviderSettingsPage.tsx`** — LLM Provider configurations (OpenAI, Gemini, Azure OpenAI, Ollama, Local LLM).
9. **`ConfigurationPage.tsx`** — Global AI parameters, sampling temperature, and max token limits.
10. **`FeedbackPage.tsx`** — User satisfaction ratings and response quality comments.
11. **`ReportsPage.tsx`** — Comprehensive AI Reports suite (Usage, Prompt Popularity, Feedback, Recommendations, Knowledge Coverage).

---

## Verification & Compliance

- **Backend Unit & Integration Tests**: `venv\Scripts\python.exe -m pytest tests/test_ai.py`
- **TypeScript Type Checker**: `npx tsc --noEmit`
- **Frontend Production Build**: `npm run build`
