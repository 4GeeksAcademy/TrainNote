import React, { useEffect, useMemo, useRef, useState } from "react";

// ==============================
// LocalStorage keys
// ==============================
const LS_MESSAGES_KEY = "gastacobre_messages_v1";
const LS_CONTEXT_KEY = "gastacobre_context_v1";


const DEFAULT_BACKEND = "http://127.0.0.1:3001";


const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content:
      "👋 Soy GASTACOBRE. Dime qué tipo de bici buscas (carretera, gravel, XC, enduro, DH) y tu presupuesto aprox.",
  },
];

// Contexto inicial
const DEFAULT_CONTEXT = {
  mode: null,
  budget: null,
  budget_min: null,
  budget_max: null,
  exclude_modes: [],
  preferred_brands: [],
  excluded_brands: [],
  tags: [],
};

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalize(str) {
  return (str || "").toLowerCase().trim();
}


function renderTextWithLinks(text) {
  if (!text) return null;

  const mdLink = new RegExp(String.raw`\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)`, "g");
  const urlRx = new RegExp(String.raw`(https?:\/\/[^\s]+)|(\bwww\.[^\s]+)`, "g");

  // 1) trocear por markdown links
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mdLink.exec(text)) !== null) {
    const full = match[0];
    const label = match[1];
    const url = match[2];
    const start = match.index;

    if (start > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, start) });
    }
    parts.push({ type: "link", label, url });
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  // 2) dentro de cada "text", linkificar urls peladas
  const nodes = [];
  let key = 0;

  for (const p of parts) {
    if (p.type === "link") {
      nodes.push(
        <a
          key={`md-${key++}`}
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="gc-link"
        >
          {p.label}
        </a>
      );
      continue;
    }

    const chunk = p.value || "";
    if (!chunk) continue;

    let last = 0;
    let m;

    while ((m = urlRx.exec(chunk)) !== null) {
      const raw = m[0];
      const start = m.index;

      if (start > last) {
        nodes.push(<span key={`t-${key++}`}>{chunk.slice(last, start)}</span>);
      }

      const url = raw.startsWith("http") ? raw : `https://${raw}`;
      nodes.push(
        <a
          key={`u-${key++}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="gc-link"
        >
          {raw}
        </a>
      );

      last = start + raw.length;
    }

    if (last < chunk.length) {
      nodes.push(<span key={`t-${key++}`}>{chunk.slice(last)}</span>);
    }
  }

  return nodes;
}


function updateContextFromUserText(prev, text) {
  const t = normalize(text);
  const next = { ...prev };

  const modes = [
    { key: "Carretera", rx: new RegExp(String.raw`\bcarretera\b|\broad\b|\basfalto\b`, "i") },
    { key: "Gravel", rx: new RegExp(String.raw`\bgravel\b`, "i") },
    { key: "XC", rx: new RegExp(String.raw`\bxc\b|\bcross\s*country\b`, "i") },
    { key: "Enduro", rx: new RegExp(String.raw`\benduro\b`, "i") },
    { key: "DH", rx: new RegExp(String.raw`\bdh\b|\bdownhill\b|\bbike\s*park\b|\bbikepark\b`, "i") },
    { key: "Trail", rx: new RegExp(String.raw`\btrail\b`, "i") },
  ];

  // excluir modo: "no quiero enduro", "no quiero una gravel", etc
  for (const m of modes) {
    const keyLower = m.key.toLowerCase();
    const noRx = new RegExp(String.raw`\bno\s+quiero\s+(una\s+)?` + keyLower + String.raw`\b`, "i");
    if (noRx.test(t)) {
      const set = new Set([...(next.exclude_modes || []), m.key]);
      next.exclude_modes = Array.from(set);
      if (next.mode === m.key) next.mode = null;
    }
  }

  // elegir modo si lo menciona
  for (const m of modes) {
    if (m.rx.test(t)) {
      if (!(next.exclude_modes || []).includes(m.key)) {
        next.mode = m.key;
      }
      break;
    }
  }

  // presupuesto: primer número (3-5 dígitos)
  const digits = String(text || "").replaceAll(".", "").replaceAll(",", "");
  const budgetMatch = digits.match(new RegExp(String.raw`\b(\d{3,5})\b`));
  if (budgetMatch) {
    const b = Number(budgetMatch[1]);
    if (!Number.isNaN(b)) next.budget = b;
  }

  // rango máximo: "menos de 2000", "máximo 2500", "por debajo de 1800"
  const maxMatch =
    t.match(new RegExp(String.raw`(menos de|maximo|máximo|por debajo de)\s*(\d{3,5})`, "i")) ||
    t.match(new RegExp(String.raw`(\d{3,5})\s*(€|eur)\s*(max|máx|maximo|máximo)`, "i"));
  if (maxMatch) {
    const num = Number(String(maxMatch[2] || maxMatch[1] || "").replace(/[^\d]/g, ""));
    if (!Number.isNaN(num)) next.budget_max = num;
  }

  // rango mínimo: "mínimo 1500", "a partir de 1200"
  const minMatch = t.match(new RegExp(String.raw`(minimo|mínimo|a partir de)\s*(\d{3,5})`, "i"));
  if (minMatch) {
    const num = Number(String(minMatch[2] || "").replace(/[^\d]/g, ""));
    if (!Number.isNaN(num)) next.budget_min = num;
  }

  // marca preferida: "quiero canyon", "me gusta trek"
  const wantBrand = t.match(new RegExp(String.raw`\b(quiero|prefiero|me gusta)\s+([a-z0-9\-]{3,20})\b`, "i"));
  if (wantBrand) {
    const brand = wantBrand[2].toLowerCase();
    const set = new Set([...(next.preferred_brands || []), brand]);
    next.preferred_brands = Array.from(set);
  }

  // excluir marca: "no quiero specialized"
  const noBrand = t.match(new RegExp(String.raw`\bno\s+quiero\s+([a-z0-9\-]{3,20})\b`, "i"));
  if (noBrand) {
    const brand = noBrand[1].toLowerCase();
    const set = new Set([...(next.excluded_brands || []), brand]);
    next.excluded_brands = Array.from(set);
  }

  return next;
}

export default function AiChatDialog({ floating = true }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Backend URL (localStorage -> env -> default)
  const backendUrl = useMemo(() => {
    const stored = localStorage.getItem("backendUrl");
    const env = import.meta?.env?.VITE_BACKEND_URL;
    return (stored || env || DEFAULT_BACKEND).replace(/\/$/, "");
  }, []);

  // Persistencia: mensajes
  const [messages, setMessages] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem(LS_MESSAGES_KEY), null);
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_MESSAGES;
  });

  // Persistencia: contexto
  const [context, setContext] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem(LS_CONTEXT_KEY), null);
    return saved && typeof saved === "object"
      ? { ...DEFAULT_CONTEXT, ...saved }
      : DEFAULT_CONTEXT;
  });

  const listRef = useRef(null);

  // Guardar mensajes
  useEffect(() => {
    localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  // Guardar contexto
  useEffect(() => {
    localStorage.setItem(LS_CONTEXT_KEY, JSON.stringify(context));
  }, [context]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, sending]);

  const toggleOpen = () => setOpen((v) => !v);

  const resetChat = () => {
    setMessages(DEFAULT_MESSAGES);
    setContext(DEFAULT_CONTEXT);
    setInput("");
    localStorage.removeItem(LS_MESSAGES_KEY);
    localStorage.removeItem(LS_CONTEXT_KEY);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const updatedContext = updateContextFromUserText(context, text);
    setContext(updatedContext);

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const resp = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          context: updatedContext,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `⚠️ Error: ${data?.msg || data?.error || "algo falló en el servidor"}`,
          },
        ]);
        return;
      }

      // Mensaje principal
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: (data?.assistant_message || "").trim() || "OK",
        },
      ]);

      // Recomendaciones
      const recs = Array.isArray(data?.recommendations) ? data.recommendations : [];
      if (recs.length) {
        setMessages((m) => [...m, { role: "assistant", content: "__RECS_BLOCK__", recs }]);
      }

      // Preguntas
      const qs = Array.isArray(data?.next_questions) ? data.next_questions : [];
      if (qs.length) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: `❓ Preguntas:\n- ${qs.join("\n- ")}` },
        ]);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ Error de red/servidor: ${e?.message || "Failed to fetch"}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={floating ? "gc-fab-wrap" : ""}>
      {floating && (
        <button
          type="button"
          className="gc-fab"
          onClick={toggleOpen}
          aria-label="Abrir GASTACOBRE"
        >
          <span className="gc-fab-icon">🤖</span>
          <span className="gc-fab-text">GASTACOBRE</span>
        </button>
      )}

      {open && (
        <div className="gc-overlay" onMouseDown={() => setOpen(false)}>
          <div className="gc-dialog" onMouseDown={(e) => e.stopPropagation()}>
            <div className="gc-header">
              <div>
                <div className="gc-title">GASTACOBRE</div>
                <div className="gc-subtitle">Asistente IA</div>
              </div>

              <div className="gc-header-actions">
                <button type="button" className="gc-reset" onClick={resetChat} title="Reset">
                  Reset
                </button>
                <button
                  type="button"
                  className="gc-close"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="gc-messages" ref={listRef}>
              {messages.map((m, idx) => {
                const isUser = m.role === "user";

                // bloque recomendaciones
                if (m.content === "__RECS_BLOCK__" && Array.isArray(m.recs)) {
                  return (
                    <div
                      key={`recs-${idx}`}
                      className={`gc-bubble ${isUser ? "gc-bubble-user" : "gc-bubble-assistant"}`}
                    >
                      <div className="gc-recs-title">📌 Recomendaciones:</div>
                      <div className="gc-recs">
                        {m.recs.map((r, i) => {
                          const title = r.name || r.model || r.id || `Recomendación ${i + 1}`;
                          const price = r.price_eur ? `${r.price_eur}€` : "";
                          const why = r.why || r.reason || "";
                          const url = r.url || r.link || "";

                          return (
                            <div key={`rec-${idx}-${i}`} className="gc-rec">
                              <div className="gc-rec-top">
                                {url ? (
                                  <a className="gc-rec-link" href={url} target="_blank" rel="noreferrer">
                                    {title}
                                  </a>
                                ) : (
                                  <div className="gc-rec-name">{title}</div>
                                )}
                                {price && <div className="gc-rec-price">{price}</div>}
                              </div>

                              {why && <div className="gc-rec-why">{renderTextWithLinks(why)}</div>}

                              {url && (
                                <div className="gc-rec-url">
                                  <a href={url} target="_blank" rel="noreferrer">
                                    Ver producto
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // mensaje normal
                return (
                  <div
                    key={idx}
                    className={`gc-bubble ${isUser ? "gc-bubble-user" : "gc-bubble-assistant"}`}
                  >
                    {renderTextWithLinks(m.content)}
                  </div>
                );
              })}

              {sending && (
                <div className="gc-bubble gc-bubble-assistant gc-typing">Escribiendo…</div>
              )}
            </div>

            <div className="gc-inputbar">
              <textarea
                className="gc-input"
                placeholder="Escribe aquí"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
              />
              <button type="button" className="gc-send" onClick={send} disabled={sending}>
                {sending ? "..." : "Enviar"}
              </button>
            </div>

            <div className="gc-footer">
              <small>Backend: {backendUrl}</small>
              <small className="gc-footer-right">
                Memoria: {context?.mode ? `modo ${context.mode}` : "sin modo"}
                {context?.budget ? ` · ${context.budget}€` : ""}
              </small>
            </div>
          </div>
        </div>
      )}

      {!floating && (
        <button type="button" className="gc-inline-btn" onClick={toggleOpen}>
          Abrir GASTACOBRE
        </button>
      )}
    </div>
  );
}
