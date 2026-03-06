(function () {
  const API_BASE = "https://mobsa-crossbonesbot.dean-taylor.workers.dev"; // <-- change

  // --- UI styles ---
  const style = document.createElement("style");
  style.textContent = `
    #mobsabot-btn{position:fixed;right:18px;bottom:18px;z-index:99999;border-radius:999px;padding:12px 14px;
      font:600 14px/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial;background:#111;color:#fff;border:0;cursor:pointer;
      box-shadow:0 10px 30px rgba(0,0,0,.25)}
    #mobsabot-panel{position:fixed;right:18px;bottom:72px;z-index:99999;width:340px;max-width:calc(100vw - 36px);
      border-radius:14px;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden;display:none}
    #mobsabot-head{padding:10px 12px;background:#111;color:#fff;display:flex;align-items:center;justify-content:space-between}
    #mobsabot-head b{font:700 13px/1.1 system-ui}
    #mobsabot-close{background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer}
    #mobsabot-body{padding:10px 12px;height:320px;overflow:auto;font:14px/1.35 system-ui;color:#111}
    .mobsabot-msg{margin:8px 0;display:flex}
    .mobsabot-msg.user{justify-content:flex-end}
    .mobsabot-bubble{max-width:85%;padding:9px 10px;border-radius:12px;background:#f2f2f2}
    .mobsabot-msg.user .mobsabot-bubble{background:#111;color:#fff}
    #mobsabot-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #eee}
    #mobsabot-input{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font:14px system-ui}
    #mobsabot-send{padding:10px 12px;border:0;border-radius:10px;background:#111;color:#fff;font:600 14px system-ui;cursor:pointer}
    #mobsabot-email{width:100%;margin:0 12px 12px 12px;padding:9px;border:1px solid #ddd;border-radius:10px;font:13px system-ui}
  `;
  document.head.appendChild(style);

  // --- DOM ---
  const btn = document.createElement("button");
  btn.id = "mobsabot-btn";
  btn.textContent = "Ask MOBSA";
  document.body.appendChild(btn);

  const panel = document.createElement("div");
  panel.id = "mobsabot-panel";
  panel.innerHTML = `
    <div id="mobsabot-head">
      <b>MOBSA Help</b>
      <button id="mobsabot-close" aria-label="Close">×</button>
    </div>
    <div id="mobsabot-body">
      <div class="mobsabot-msg">
        <div class="mobsabot-bubble">
          Ask me anything about registration, divisions, schedules, uniforms, volunteering, and more.
        </div>
      </div>
    </div>
    <input id="mobsabot-email" type="email" placeholder="Your email (optional, for follow-up)"/>
    <form id="mobsabot-form">
      <input id="mobsabot-input" placeholder="Type your question..." />
      <button id="mobsabot-send" type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(panel);

  const body = panel.querySelector("#mobsabot-body");
  const input = panel.querySelector("#mobsabot-input");
  const emailEl = panel.querySelector("#mobsabot-email");

  function addMsg(text, who) {
    const row = document.createElement("div");
    row.className = "mobsabot-msg " + (who === "user" ? "user" : "bot");
    const bubble = document.createElement("div");
    bubble.className = "mobsabot-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }

  async function ask(question) {
    addMsg(question, "user");
    addMsg("…", "bot");

    const placeholder = body.lastElementChild;
    try {
      const resp = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, email: emailEl.value || "" }),
      });
      const data = await resp.json();
      placeholder.querySelector(".mobsabot-bubble").textContent =
        data?.answer || "Sorry—something went wrong.";
    } catch (e) {
      placeholder.querySelector(".mobsabot-bubble").textContent =
        "Sorry—network error. Please email info@mtolivebsa.com.";
    }
  }

  btn.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" || !panel.style.display ? "block" : "none";
    input && input.focus();
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
})();