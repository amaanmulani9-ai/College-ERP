# Enterprise AI Academic Assistant Architecture (`apps/ai`)

## Provider-Agnostic Design

The Enterprise AI Academic Assistant is built with a **Pluggable Provider Architecture** designed to seamlessly interface with external or local LLM engines without tying the core ERP to any single proprietary AI service.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Chat UI / ERP                     │
└────────────────────────────────┬────────────────────────────────┘
                                 │ REST API (/api/ai/conversations/{id}/chat/)
┌────────────────────────────────▼────────────────────────────────┐
│                           AIService                             │
│       Prompt Rendering | RAG Knowledge | Usage Logging          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                       Provider Registry                         │
└──────┬─────────────────┬─────────────────┬─────────────┬────────┘
       │                 │                 │             │
┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐ ┌────▼──────┐
│ OpenAI API  │   │ Gemini API  │   │ Azure OpenAI│ │ Ollama/   │
│ (Placeholder│   │ (Placeholder│   │ (Placeholder│ │ Local LLM │
└─────────────┘   └─────────────┘   └─────────────┘ └───────────┘
```

---

## Architecture Components

### 1. Provider Abstraction Layer (`ProviderRegistry`)
- Defines `BaseLLMProvider` interface requiring `generate_response(prompt, system_prompt)`.
- Instantiates provider implementations based on active `AIProvider` records ordered by priority.
- Supports pluggable integration for:
  - **OpenAI API** (`gpt-4o`, `gpt-4o-mini`)
  - **Google Gemini API** (`gemini-1.5-pro`, `gemini-1.5-flash`)
  - **Azure OpenAI Service**
  - **Ollama Local Instance** (`llama3:8b`, `mistral:7b`)
  - **Local VLLM / HuggingFace Server**

### 2. Prompt Template Engine (`render_prompt_template`)
- Manages institutional prompt templates with variable placeholders (e.g. `{sem_no}`, `{student_id}`, `{amount}`).
- Ensures consistent AI assistant persona and structured output generation across departments.

### 3. Knowledge Base RAG Search (`search_knowledge_base`)
- Indexes institutional policies, student handbooks, hostel rules, library guidelines, and academic regulations.
- Provides vector/keyword RAG search context to augment user prompts before passing to the LLM engine.

### 4. Predictive Recommendation Engine (`generate_recommendations`)
- Analyzes student attendance, exam performance, fee dues, and placement skills.
- Generates early warning indicators for student risk, attendance alerts, fee defaulters, and corporate career matches.

### 5. Telemetry & Governance
- **`AIUsageLog`**: Tracks latency (ms), token consumption, prompt types, and status.
- **`AIAuditLog`**: Maintains audit trails for AI operations.
- **`AIFeedback`**: Captures user ratings and accuracy feedback.
