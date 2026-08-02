# Enterprise AI Academic Assistant — Workspace Integration (`frontend/src/workspace/ai/`)

## Overview

Integrates the **Enterprise AI Academic Assistant** (TASK-030) into every layer of the workspace. The integration is **provider-agnostic** — no external AI API is called directly. All AI calls flow through a `callPlaceholderAI()` function that can be swapped for OpenAI, Gemini, Azure OpenAI, or Ollama by replacing a single async function.

---

## Directory Structure

| File | Purpose |
|------|---------|
| `useAIWorkspace.ts` | Central AI state hook — conversations, usage stats, `localStorage` persistence, `Ctrl+Shift+A` shortcut, placeholder API. |
| `AIWorkspacePanel.tsx` | Full-page AI workspace (`/workspace/ai`) — collapsible conversation sidebar + central chat + right tools panel. |
| `AIAssistantDock.tsx` | Dockable right sidebar with 6 tabs: Chat · Prompts · Actions · Suggestions · Insights · History. Mounted in `WorkspaceShell`. |
| `AIQuickChat.tsx` | Chat UI with minimal Markdown rendering, copy, 👍/👎 feedback, regenerate placeholder, Enter-to-send. |
| `AIConversationSidebar.tsx` | Pinned / Favorites / Recent conversation sidebar. |
| `AIPromptLauncher.tsx` | Prompt template library — 12 templates across Academic/Finance/Admin/Careers/HR/Library/Transport. |
| `AIQuickActions.tsx` | 3×3 quick-action grid — Summarize, Explain, Report, Announcement, Email, Meeting Notes, Recommend, Translate, Custom. |
| `AISuggestionsPanel.tsx` | Contextual AI suggestions for prompts, reports, and actions with reason text. |
| `AIInsightsPanel.tsx` | Placeholder analytics insights — 8 KPI metrics with trend indicators for all modules. |
| `AIHistoryPanel.tsx` | Conversation history with search, pin, favorite, delete, and All/Pinned/Favorites filter. |
| `AIContextPanel.tsx` | Displays auto-detected module/page/role/tenant/academic-session passed to every prompt. |
| `AIStatusIndicator.tsx` | Provider connection badge (compact + full modes) with Knowledge Base and Last Sync status. |
| `AITokenUsageWidget.tsx` | Today's prompt count, estimated tokens, average response time, and model name. |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + A` | Toggle AI Assistant Dock in `WorkspaceShell` |
| `Enter` | Send chat message |
| `Shift + Enter` | Insert newline in chat input |
| `Esc` | Dismiss overlays |

---

## Context Awareness

Every AI prompt automatically includes:
- Current **module** (from URL path)
- Current **page** (full URL)
- **User role** (administrator / faculty / student / etc.)
- **Tenant** (Springfield Academic Cloud)
- **Academic session** (2025–2026)
- **Breadcrumb** trail

---

## Prompt Templates (12)

| Template | Category |
|----------|----------|
| Attendance Summary | Academic |
| Exam Analysis | Academic |
| Student Performance | Academic |
| Timetable Summary | Academic |
| Fee Reminder Draft | Finance |
| Notice Draft | Admin |
| Email Draft | Admin |
| Placement Recommendation | Careers |
| Leave Recommendation | HR |
| Library Usage Report | Library |
| Transport Route Analysis | Transport |
| HR Overview | HR |

---

## Quick Actions (9)

Summarize Page · Explain Dashboard · Generate Report · Draft Announcement · Draft Email · Meeting Notes · Recommend Action · Translate (placeholder) · Custom Prompt

---

## Plugging in a Real AI Provider

Replace `callPlaceholderAI()` in `useAIWorkspace.ts`:

```typescript
export async function callPlaceholderAI(prompt: string, context: AIContext): Promise<string> {
  // Replace with your provider:
  // OpenAI:      openai.chat.completions.create(...)
  // Gemini:      google.generativeai.generate(...)
  // Azure OpenAI: azureOpenai.getChatCompletions(...)
  // Ollama:      fetch("http://localhost:11434/api/generate", ...)
  return "AI response here";
}
```

---

## Routes

| Route | Component |
|-------|-----------|
| `/workspace/ai` | `AIWorkspacePanel` (full page) |
| `/workspace` | `WorkspaceShell` with embedded `AIAssistantDock` (Ctrl+Shift+A) |

---

## Persistence

- Conversations → `localStorage` key: `college_erp_ai_conversations`
- Usage stats   → `localStorage` key: `college_erp_ai_usage`
