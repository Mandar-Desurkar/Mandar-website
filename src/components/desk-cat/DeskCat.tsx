"use client";

// Chai, the desk cat: an AI guide that naps in the corner of the desktop. Asleep it breathes and
// floats "z z z"; a click wakes it (stretch, yawn, blink) and opens a chat that answers questions
// about the portfolio through /api/agent, with replies that carry buttons into the site. Awake, its
// eyes follow the pointer; clicking it again pets it. Left alone for a while, it curls back up.
// Desktop only; hidden while Mission Control or a prototype is open.
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp, X } from "lucide-react";
import CatArt from "./CatArt";
import s from "./DeskCat.module.css";
import { AGENT_ACTIONS, AGENT_LIMITS, CAT_NAME, STARTER_QUESTIONS, type AgentAction, type AgentReply } from "@/data/agent";
import { profile } from "@/data/resume";
import { useWindow } from "@/context/WindowContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { trackEvent } from "@/lib/analytics";

type CatState = "sleep" | "waking" | "awake" | "dozing";
type Msg = { role: "user" | "assistant"; content: string; actions?: AgentAction[] };

const WAKE_MS = 1100;
const DOZE_AFTER_MS = 25_000; // awake with the chat closed and nobody near: back to sleep
const DOZE_MS = 1300;

const GREETING: Msg = {
  role: "assistant",
  content: `Mrrp! You woke me. I'm ${CAT_NAME}, ${profile.name.split(" ")[0]}'s desk cat. Ask me anything about his work.`,
};

export default function DeskCat() {
  const isMobile = useIsMobile();
  const { openSection, openPrototype, prototype } = useWindow();
  const router = useRouter();
  const [state, setState] = useState<CatState>("sleep");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hearts, setHearts] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const asked = useRef(0);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Click the cat: wake it, or pet it if it's already up
  const onCat = () => {
    if (state === "sleep" || state === "dozing") {
      trackEvent("Woke Desk Cat", {});
      setState("waking");
      later(() => {
        setState("awake");
        setOpen(true);
      }, WAKE_MS);
      return;
    }
    if (state === "awake") {
      trackEvent("Petted Desk Cat", {});
      setHearts((h) => h + 1);
      if (!open) setOpen(true);
    }
  };

  const close = () => {
    setOpen(false);
    trackEvent("Closed Desk Cat Chat", { questions: asked.current });
  };

  // Back to sleep after a while with the chat closed; any hover over the cat resets the clock
  const [nudge, setNudge] = useState(0);
  useEffect(() => {
    if (state !== "awake" || open) return;
    const t = window.setTimeout(() => {
      setState("dozing");
      window.setTimeout(() => setState("sleep"), DOZE_MS);
    }, DOZE_AFTER_MS);
    return () => clearTimeout(t);
  }, [state, open, nudge]);

  // Awake, the pupils follow the pointer (written to CSS vars, no re-render)
  useEffect(() => {
    if (state !== "awake") return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = rootRef.current;
        if (!el) return;
        const r = el.querySelector("svg")?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width * 0.37);
        const dy = e.clientY - (r.top + r.height * 0.6);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 160);
        el.style.setProperty("--px", `${((dx / d) * 1.6 * k).toFixed(2)}px`);
        el.style.setProperty("--py", `${((dy / d) * 1.4 * k).toFixed(2)}px`);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [state]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const ask = async (text: string, source: "starter" | "typed") => {
    const question = text.trim().slice(0, AGENT_LIMITS.maxChars);
    if (!question || busy) return;
    const history: Msg[] = [...msgs, { role: "user", content: question }];
    setMsgs(history);
    setInput("");
    setBusy(true);
    asked.current += 1;
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-AGENT_LIMITS.maxTurns).map(({ role, content }) => ({ role, content })) }),
      });
      const data = (await res.json()) as AgentReply;
      if (!data?.reply) throw new Error("empty reply");
      setMsgs((m) => [...m, { role: "assistant", content: data.reply, actions: data.actions }]);
      trackEvent("Asked Desk Cat", { source, mode: data.mode, turn: asked.current });
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "Mrrp, my whiskers lost the signal. These still work:", actions: ["open_case_studies", "open_contact"] },
      ]);
      trackEvent("Asked Desk Cat", { source, mode: "error", turn: asked.current });
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input, "typed");
  };

  const run = (a: AgentAction) => {
    trackEvent("Clicked Desk Cat Action", { action: a });
    if (a.startsWith("case:")) {
      const slug = a.slice(5);
      trackEvent("Opened Case Study", { slug, placement: "desk_cat" });
      router.push(`/case-studies/${slug}`);
      return;
    }
    switch (a) {
      case "open_about":
        return openSection("about", "desk_cat");
      case "open_experience":
        return openSection("experience", "desk_cat");
      case "open_education":
        return openSection("education", "desk_cat");
      case "open_case_studies":
        return openSection("projects", "desk_cat");
      case "open_contact":
        return openSection("contact", "desk_cat");
      case "view_resume":
        trackEvent("Opened Resume", { placement: "desk_cat" });
        window.open(profile.resumeUrl, "_blank", "noopener");
        return;
      case "try_kissan":
        return openPrototype("kissan-sampurna", "desk_cat");
      case "try_gau":
        return openPrototype("gau-sampurna", "desk_cat");
    }
  };

  // Esc closes the chat without also closing the window behind it (DraggableWindow skips handled keys)
  const onPanelKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  if (isMobile || prototype) return null;

  const awake = state === "awake";
  const label =
    state === "sleep"
      ? `${CAT_NAME} is napping. Click to wake ${CAT_NAME} and ask about Mandar's work`
      : awake
        ? open
          ? `Pet ${CAT_NAME}`
          : `Chat with ${CAT_NAME}`
        : `${CAT_NAME} is waking up`;

  return (
    <div ref={rootRef} className={s.root} data-state={state}>
      {open && (
        <section className={s.panel} role="dialog" aria-label={`Chat with ${CAT_NAME}`} onKeyDown={onPanelKey} data-allow-copy>
          <header className={s.panelHead}>
            <span className={s.headText}>
              <b>
                {CAT_NAME}
                <i className={s.badge}>AI guide</i>
              </b>
              <small>Mandar&apos;s desk cat. Ask about his work.</small>
            </span>
            <button type="button" className={s.iconBtn} onClick={close} aria-label="Close chat">
              <X size={16} />
            </button>
          </header>

          <div className={s.log} ref={logRef} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? s.me : s.cat}>
                <p>{m.content}</p>
                {m.actions && m.actions.length > 0 && (
                  <span className={s.actions}>
                    {m.actions.map((a) => (
                      <button key={a} type="button" className={s.action} onClick={() => run(a)}>
                        {AGENT_ACTIONS[a]}
                        <ArrowRight size={13} />
                      </button>
                    ))}
                  </span>
                )}
              </div>
            ))}
            {busy && (
              <div className={s.cat} aria-label={`${CAT_NAME} is thinking`}>
                <span className={s.typing}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
            {msgs.length === 1 && !busy && (
              <div className={s.starters}>
                {STARTER_QUESTIONS.map((q) => (
                  <button key={q} type="button" className={s.starter} onClick={() => void ask(q, "starter")}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className={s.composer} onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={AGENT_LIMITS.maxChars}
              placeholder="Ask about Mandar's work…"
              aria-label={`Ask ${CAT_NAME} a question`}
            />
            <button type="submit" className={s.send} disabled={!input.trim() || busy} aria-label="Send">
              <ArrowUp size={16} />
            </button>
          </form>
          <p className={s.note}>Answers come from Mandar&apos;s resume and case studies, and can be wrong.</p>
        </section>
      )}

      <button type="button" className={s.catBtn} onClick={onCat} onPointerEnter={() => setNudge((n) => n + 1)} aria-label={label}>
        <CatArt />
        {state === "sleep" && (
          <span className={s.zzz} aria-hidden="true">
            <i>z</i>
            <i>z</i>
            <i>z</i>
          </span>
        )}
        {state === "waking" && (
          <span className={s.pop} aria-hidden="true">
            Mrrp?
          </span>
        )}
        {hearts > 0 && (
          <span key={hearts} className={s.hearts} aria-hidden="true">
            <i>♥</i>
            <i>♥</i>
            <i>♥</i>
          </span>
        )}
      </button>
      {state === "sleep" && <span className={s.hint}>{CAT_NAME} is napping · click to wake</span>}
    </div>
  );
}
