import os
import requests

DEFAULT_OLLAMA_URL = "http://localhost:11434"


def ollama_chat(messages, model=None, temperature=0.3, ollama_url=None, timeout=60):
    """
    messages: [{role: "system"|"user"|"assistant", content: "..."}]
    """
    base_url = (ollama_url or os.getenv("OLLAMA_URL") or DEFAULT_OLLAMA_URL).rstrip("/")
    model = model or os.getenv("OLLAMA_MODEL", "qwen2.5:latest")

    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {"temperature": temperature},
    }

    r = requests.post(f"{base_url}/api/chat", json=payload, timeout=timeout)
    r.raise_for_status()
    data = r.json()

    # Ollama devuelve: { message: { role, content }, ... }
    msg = (data.get("message") or {})
    return {
        "assistant_message": msg.get("content", "").strip(),
        "raw": data,
        "model": model,
    }
