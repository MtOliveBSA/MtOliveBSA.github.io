(function () {
  const API_BASE = "https://mobsa-crossbonesbot.dean-taylor.workers.dev";

  const style = document.createElement("style");
  style.textContent = `
  #mobsabot-btn {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 999px;
    padding: 8px 18px 8px 8px;
    font: 700 15px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: #111;
    color: #fff;
    border: 2px solid #ceba5a;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0,0,0,.28);
    transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
  }

  #mobsabot-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px rgba(0,0,0,.32);
    background: #1a1a1a;
  }

  #mobsabot-btn:active {
    transform: translateY(0);
  }

  #mobsabot-btn img {
    width: 48px;
    height: 48px;
    display: block;
    object-fit: contain;
    flex: 0 0 48px;
  }

  #mobsabot-btn .mobsabot-btn-label {
    white-space: nowrap;
    letter-spacing: .2px;
  }

  #mobsabot-panel {
    position: fixed;
    right: 18px;
    bottom: 72px;
    z-index: 99999;
    width: 360px;
    max-width: calc(100vw - 36px);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 20px 60px rgba(0,0,0,.25);
    overflow: hidden;
    display: none;
  }

  #mobsabot-head {
    padding: 10px 12px;
    background: #111;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #mobsabot-head b {
    font: 700 13px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }

  .mobsabot-head-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font: 700 14px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
  }

  .mobsabot-head-title img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    display: block;
  }

  #mobsabot-close {
    background: transparent;
    border: 0;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }

  #mobsabot-body {
    padding: 10px 12px;
    height: 340px;
    overflow: auto;
    font: 14px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: #111;
    background: #fafafa;
  }

  .mobsabot-msg {
    margin: 8px 0;
    display: flex;
  }

  .mobsabot-msg.user {
    justify-content: flex-end;
  }

  .mobsabot-bubble {
    max-width: 88%;
    padding: 10px 12px;
    border-radius: 12px;
    background: #f2f2f2;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .mobsabot-msg.user .mobsabot-bubble {
    background: #111;
    color: #fff;
  }

  .mobsabot-bubble a {
    color: #0a58ca;
    text-decoration: underline;
    word-break: break-all;
  }

  .mobsabot-msg.user .mobsabot-bubble a {
    color: #9ec5fe;
  }

  .mobsabot-bubble ul,
  .mobsabot-bubble ol {
    margin: 8px 0 8px 20px;
    padding: 0;
  }

  .mobsabot-bubble li {
    margin: 4px 0;
  }

  .mobsabot-bubble p {
    margin: 0 0 8px 0;
  }

  .mobsabot-bubble p:last-child {
    margin-bottom: 0;
  }

  #mobsabot-form {
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    border-top: 1px solid #eee;
    background: #fff;
  }

  #mobsabot-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font: 14px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }

  #mobsabot-send {
    padding: 10px 12px;
    border: 0;
    border-radius: 10px;
    background: #111;
    color: #fff;
    font: 600 14px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    cursor: pointer;
  }

  #mobsabot-email {
    width: calc(100% - 24px);
    margin: 0 12px 12px 12px;
    padding: 9px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font: 13px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    box-sizing: border-box;
  }

  .mobsabot-typing {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .mobsabot-dot {
    width: 6px;
    height: 6px;
    background: #666;
    border-radius: 50%;
    animation: mobsabotTyping 1.2s infinite;
  }

  .mobsabot-dot:nth-child(2) {
    animation-delay: .2s;
  }

  .mobsabot-dot:nth-child(3) {
    animation-delay: .4s;
  }

  @keyframes mobsabotTyping {
    0% { opacity: .2; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-3px); }
    100% { opacity: .2; transform: translateY(0); }
  }

  #mobsabot-btn.attention {
    animation: mobsabotAttention 1.8s ease-in-out infinite;
  }

  @keyframes mobsabotAttention {
    0% { transform: scale(1); }
    50% { transform: scale(1.08); }
    100% { transform: scale(1); }
  }

    .mobsabot-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .mobsabot-action-btn {
    border: 1px solid #ccc;
    background: #fff;
    color: #111;
    border-radius: 999px;
    padding: 8px 12px;
    font: 600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    cursor: pointer;
  }

  .mobsabot-action-btn:hover {
    background: #f5f5f5;
  }

  .mobsabot-action-btn.primary {
    background: #111;
    color: #fff;
    border-color: #111;
  }

  .mobsabot-action-btn.primary:hover {
    background: #222;
  }

  #mobsabot-email.error {
    border-color: #ec2027;
    background: #fff5f5;
  }
`;
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.id = "mobsabot-btn";
  btn.setAttribute("aria-label", "Ask Bones");

  const btnIcon = document.createElement("img");
  btnIcon.src = "https://mtolivebsa.github.io/bones/gif-pack/bones_bounce.gif"; // animated GIF path
  btnIcon.alt = "Bones logo";

  const btnLabel = document.createElement("span");
  btnLabel.className = "mobsabot-btn-label";
  btnLabel.textContent = "Ask Bones";

  btn.appendChild(btnIcon);
  btn.appendChild(btnLabel);
  document.body.appendChild(btn);

  const panel = document.createElement("div");
  panel.id = "mobsabot-panel";
  panel.innerHTML = `
    <div id="mobsabot-head">
      <div class="mobsabot-head-title">
        <img src="https://mtolivebsa.github.io/bones/bones-static.png" alt="Bones logo">
        <span>Ask Bones - the MOBSA Assistant</span>
      </div>
      <button id="mobsabot-close" aria-label="Close">X</button>
    </div>
    <div id="mobsabot-body">
      <div class="mobsabot-msg bot">
        <div class="mobsabot-bubble">
          Ask Bones anything about registration, divisions, schedules, uniforms, volunteering, and more.
        </div>
      </div>
    </div>
    <input id="mobsabot-email" type="email" placeholder="Your email (optional, for follow-up)" />
    <form id="mobsabot-form">
      <input id="mobsabot-input" placeholder="Type your question..." />
      <button id="mobsabot-send" type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(panel);

  const body = panel.querySelector("#mobsabot-body");
  const input = panel.querySelector("#mobsabot-input");
  const emailEl = panel.querySelector("#mobsabot-email");

  let pendingFollowupQuestion = null;
  let conversationHistory = [];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function linkify(text) {
    let html = text;

    // Clickable URLs
    html = html.replace(
      /\bhttps?:\/\/[^\s<]+[^\s<.,:;"')\]\}]/gi,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    // Clickable email addresses
    html = html.replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      (email) => `<a href="mailto:${email}">${email}</a>`
    );

    return html;
  }

  function trackConversationMessage(role, text) {
      const msg = String(text || "").trim();
      if (!msg) return;

      conversationHistory.push({
          role,
          text: msg
      });

      // Keep only the most recent 12 messages total
      if (conversationHistory.length > 12) {
          conversationHistory = conversationHistory.slice(-12);
      }
  }

  function formatStructuredText(raw) {
    const escaped = escapeHtml(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = escaped.split("\n");

    const out = [];
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) {
        out.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        closeLists();
        continue;
      }

      const ulMatch = line.match(/^[-*•]\s+(.+)$/);
      const olMatch = line.match(/^\d+\.\s+(.+)$/);

      if (ulMatch) {
        if (inOl) {
          out.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          out.push("<ul>");
          inUl = true;
        }
        out.push(`<li>${linkify(ulMatch[1])}</li>`);
        continue;
      }

      if (olMatch) {
        if (inUl) {
          out.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          out.push("<ol>");
          inOl = true;
        }
        out.push(`<li>${linkify(olMatch[1])}</li>`);
        continue;
      }

      closeLists();

      // Preserve inline line breaks within normal paragraphs by treating each non-list line as its own paragraph
      out.push(`<p>${linkify(line)}</p>`);
    }

    closeLists();
    return out.join("");
  }

  function renderMessageContent(el, text) {
    el.innerHTML = formatStructuredText(text || "");
  }

  function addMsg(text, who) {
      const row = document.createElement("div");
      row.className = "mobsabot-msg " + (who === "user" ? "user" : "bot");

      const bubble = document.createElement("div");
      bubble.className = "mobsabot-bubble";

      if (who === "user") {
          bubble.textContent = text;
          trackConversationMessage("user", text);
      } else {
          renderMessageContent(bubble, text);
          trackConversationMessage("bot", text);
      }

      row.appendChild(bubble);
      body.appendChild(row);
      body.scrollTop = body.scrollHeight;
      return bubble;
  }

  function greetVisitor() {
    const STORAGE_KEY = "bonesGreetingShownAt";
    const RESET_MS = 24 * 60 * 60 * 1000; // 24 hours

    const lastShown = Number(localStorage.getItem(STORAGE_KEY) || "0");
    const now = Date.now();

    if (lastShown && (now - lastShown) < RESET_MS) return;
    if (panel.style.display === "block") return;

    addMsg(
      `Hi! I'm Bones.

    Need help with:
    - Registration
    - Age Divisions
    - Game Schedules
    - Uniforms & Equipment
    - Field Locations

    Ask me anything!`,
      "bot"
    );

    panel.style.display = "block";
    localStorage.setItem(STORAGE_KEY, String(now));
  }

  function addTypingIndicator() {

    const row = document.createElement("div");
    row.className = "mobsabot-msg bot";

    const bubble = document.createElement("div");
    bubble.className = "mobsabot-bubble";

    bubble.innerHTML = `
        <div style="font-size:12px;color:#777;margin-bottom:4px;">
          Bones is thinking...
        </div>
        <div class="mobsabot-typing">
          <span class="mobsabot-dot"></span>
          <span class="mobsabot-dot"></span>
          <span class="mobsabot-dot"></span>
        </div>
      `;

    row.appendChild(bubble);
    body.appendChild(row);

    body.scrollTop = body.scrollHeight;

    return row;
  }

  function addFollowupPrompt(question, promptText) {
    pendingFollowupQuestion = question;

    const row = document.createElement("div");
    row.className = "mobsabot-msg bot";

    const bubble = document.createElement("div");
    bubble.className = "mobsabot-bubble";

    bubble.innerHTML = `
          <p>${escapeHtml(promptText || "I’m not fully sure about that based on the information I have.")}</p>
          <p>Would you like me to send your question to the MOBSA team for follow-up?</p>
          <div class="mobsabot-actions">
            <button type="button" class="mobsabot-action-btn primary" data-action="send-followup">Yes, send it</button>
            <button type="button" class="mobsabot-action-btn" data-action="cancel-followup">No, thanks</button>
          </div>
        `;

    row.appendChild(bubble);
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }

  async function sendConfirmedFollowup() {
    if (!pendingFollowupQuestion) return;

    const email = (emailEl.value || "").trim();
    emailEl.classList.remove("error");

    // Require email before sending
    if (!email) {
      emailEl.classList.add("error");
      addMsg("Before I send your question to the MOBSA team, please enter your email address so they can reply to you.", "bot");
      emailEl.focus();
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      emailEl.classList.add("error");
      addMsg("That doesn't look like a valid email address. Please check it and try again.", "bot");
      emailEl.focus();
      return;
    }

    const question = pendingFollowupQuestion;
    const recentConversation = conversationHistory.slice(-6);  // Last 6 conversation messages for context
    pendingFollowupQuestion = null;

    const typingRow = addTypingIndicator();

    try {

      const resp = await fetch(API_BASE + "/api/contact-fallback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question,
          email,
          page: window.location.href,
          recentConversation
        })
      });

      const data = await resp.json();

      typingRow.remove();

      addMsg(
        data?.answer || "Thanks — I sent your question to the MOBSA team for follow-up.",
        "bot"
      );

    } catch (err) {

      typingRow.remove();

      addMsg(
        "Sorry — I couldn't send your question right now. Please email info@mtolivebsa.com directly.",
        "bot"
      );
    }

    body.scrollTop = body.scrollHeight;
  }

  async function ask(question) {
    addMsg(question, "user");

    const typingRow = addTypingIndicator();

    try {
      const resp = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question,
          email: emailEl.value || ""
        })
      });

      const data = await resp.json();
      typingRow.remove();

      if (data?.needs_followup_confirmation) {
        addFollowupPrompt(question, data?.answer);
        return;
      }

      addMsg(
        data?.answer || "Sorry—something went wrong.",
        "bot"
      );

    } catch (err) {
      typingRow.remove();

      addMsg(
        "Sorry—network error. Please email info@mtolivebsa.com.",
        "bot"
      );
    }

    body.scrollTop = body.scrollHeight;
  }

  btn.addEventListener("click", () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
    if (panel.style.display === "block") {
      input.focus();
    }
  });

  panel.querySelector("#mobsabot-close").addEventListener("click", () => {
    panel.style.display = "none";
  });

  panel.querySelector("#mobsabot-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = (input.value || "").trim();
    if (!q) return;
    input.value = "";
    ask(q);
  });

  body.addEventListener("click", async (e) => {
    const btn = e.target.closest(".mobsabot-action-btn");
    if (!btn) return;

    const action = btn.getAttribute("data-action");

    if (action === "send-followup") {

      if (!emailEl.value.trim()) {
        addMsg("Please enter your email address above so the MOBSA team can respond to you.", "bot");
        emailEl.classList.add("error");
        emailEl.focus();
        return;
      } else {
        emailEl.classList.remove("error");
      }

      addMsg("Yes, send it to the MOBSA team.", "user");
      await sendConfirmedFollowup();
      return;
    }

    if (action === "cancel-followup") {
      pendingFollowupQuestion = null;
      addMsg("No thanks.", "user");
      addMsg("No problem — feel free to ask me something else.", "bot");
    }
  });

  setTimeout(() => { greetVisitor(); }, 3000);
})();