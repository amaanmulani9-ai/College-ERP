from types import SimpleNamespace

import pytest

from main_app import ai_helper


class _FakeGenerationConfig:
    response_mime_type = None


class _FakeGeminiModel:
    def generate_content(self, prompt, generation_config=None):
        return SimpleNamespace(text="external gemini response")


class _FakeGeminiClient:
    types = SimpleNamespace(GenerationConfig=_FakeGenerationConfig)

    def __init__(self):
        self.model_requested = False

    def configure(self, api_key):
        pass

    def GenerativeModel(self, *args, **kwargs):
        self.model_requested = True
        return _FakeGeminiModel()


class _FakeResponse:
    status_code = 200

    def __init__(self, payload):
        self.payload = payload

    def json(self):
        return self.payload


def test_generate_response_uses_only_ollama_when_external_keys_exist(monkeypatch):
    gemini = _FakeGeminiClient()
    posts = []

    def fake_post(url, **kwargs):
        posts.append((url, kwargs))
        return _FakeResponse({"response": "local ollama response"})

    monkeypatch.setenv("GEMINI_API_KEY", "should-be-ignored")
    monkeypatch.setenv("OPENAI_API_KEY", "should-also-be-ignored")
    monkeypatch.setenv("OLLAMA_HOST", "http://localhost:11434")
    monkeypatch.setattr(ai_helper, "genai", gemini, raising=False)
    monkeypatch.setattr(ai_helper.requests, "post", fake_post)

    result = ai_helper.generate_ollama_response("format my timetable")

    assert result == "local ollama response"
    assert gemini.model_requested is False
    assert [url for url, _ in posts] == ["http://localhost:11434/api/generate"]
    assert "Authorization" not in posts[0][1].get("headers", {})


def test_generate_response_ignores_openai_key_and_never_calls_openai(monkeypatch):
    posts = []

    def fake_post(url, **kwargs):
        posts.append((url, kwargs))
        if "api.openai.com" in url:
            return _FakeResponse(
                {"choices": [{"message": {"content": "external openai response"}}]}
            )
        return _FakeResponse({"response": "local ollama response"})

    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "should-be-ignored")
    monkeypatch.setenv("OLLAMA_HOST", "http://localhost:11434")
    monkeypatch.setattr(ai_helper, "genai", None, raising=False)
    monkeypatch.setattr(ai_helper.requests, "post", fake_post)

    result = ai_helper.generate_ollama_response("write a quiz")

    assert result == "local ollama response"
    assert [url for url, _ in posts] == ["http://localhost:11434/api/generate"]


def test_generate_response_defaults_to_qwen3(monkeypatch):
    posts = []

    def fake_post(url, **kwargs):
        posts.append((url, kwargs))
        return _FakeResponse({"response": "using default local model"})

    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("OLLAMA_MODEL", raising=False)
    monkeypatch.setenv("OLLAMA_HOST", "http://localhost:11434")
    monkeypatch.setattr(ai_helper, "genai", None, raising=False)
    monkeypatch.setattr(ai_helper.requests, "post", fake_post)

    result = ai_helper.generate_ollama_response("summarize fee rules")

    assert result == "using default local model"
    assert posts[0][1]["json"]["model"] == "qwen3"


@pytest.mark.parametrize("response_format", [None, "json"])
def test_generate_response_builds_ollama_payload(monkeypatch, response_format):
    posts = []

    def fake_post(url, **kwargs):
        posts.append((url, kwargs))
        return _FakeResponse({"response": '{"ok": true}'})

    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setenv("OLLAMA_HOST", "http://localhost:11434")
    monkeypatch.setenv("OLLAMA_MODEL", "llama3.1:8b")
    monkeypatch.setattr(ai_helper, "genai", None, raising=False)
    monkeypatch.setattr(ai_helper.requests, "post", fake_post)

    ai_helper.generate_ollama_response(
        "student context",
        system_prompt="You are CampusBot.",
        response_format=response_format,
    )

    payload = posts[0][1]["json"]
    assert payload["model"] == "llama3.1:8b"
    assert payload["prompt"] == "You are CampusBot.\n\nstudent context"
    assert payload["stream"] is False
    if response_format == "json":
        assert payload["format"] == "json"
    else:
        assert "format" not in payload
