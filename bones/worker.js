export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const EMAIL_WEBHOOK = "https://script.google.com/macros/s/AKfycbzEuRHAZ5DNE1NKHaun4g2JRhZHAhDSxksH0IZJ3bGz9QC35apTNoQ0m8QH0hPtv7Fc_w/exec";

    // Basic CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response("", { headers: corsHeaders });

    if (url.pathname === "/api/chat" && request.method === "POST") {
      const { question, email } = await request.json().catch(() => ({}));
      if (!question || typeof question !== "string") {
        return json({ ok: false, error: "Missing question" }, 400, corsHeaders);
      }

      // --- Your “knowledge base” (keep this updated) ---
      // TIP: Replace with your real content. You can paste policies, fees, key dates, links, etc.
      const KB = `
Mount Olive Baseball & Softball Association (MOBSA)
Primary contact email: info@mtolivebsa.com
Sponsorship contact email: sponsorships@mtolivebsa.com
Board contact email: board@mtolivebsa.com
Baseball contact email: baseball@mtolivebsa.com
Softball contact email: softball@mtolivebsa.com
Player Agent contact email: playeragent@mtolivebsa.com
Registration contact email: registration@mtolivebsa.com
Travel Baseball contact email: TravelBaseball@mtolivebsa.com
Travel Softball contact email: TravelSoftball@mtolivebsa.com
Bullpen contact email: bullpen@mtolivebsa.com


Include: registration steps, age groups, season dates, refund policy, uniform pickup, volunteer requirements,
tryouts evaluations, field locations, rainouts, fundraiser details, etc.

Authoritative MOBSA links:
- Registration page: https://mtolivebsa.sportngin.com/active-registrations/
- Rec Programs / divisions page: https://mtolivebsa.sportngin.com/page/show/7536021-recreation-baseball-and-softball
- Calendar / schedule: https://mtolivebsa.sportngin.com/page/show/7501472-calendar
- Contact page: https://mtolivebsa.sportngin.com/page/show/7536108-contact-us-
- General FAQ: https://mtolivebsa.sportngin.com/faq
- Coaches / Manager Info: https://mtolivebsa.sportngin.com/coaches
- Baseball FAQ PDF: https://cdn1.sportngin.com/attachments/document/dd2b-3116901/BaseballFAQs.pdf
- Softball FAQ PDF: https://cdn2.sportngin.com/attachments/document/6b41-3157438/SoftballFAQs.pdf
- Sponsorship Form PDF: https://cdn2.sportngin.com/attachments/document/6282-3158245/MOBSA_Sponsorship_Form_2025.pdf

GENERAL FAQ KNOWLEDGE
- For parent-related SportsEngine help, direct parents to: https://mtolivebsa.sportngin.com/forparents
- To add a spouse or guardian to a SportsEngine account, use the SportsEngine "Adding an additional guardian" help flow.
- To merge 2 SportsEngine accounts, use the merge form linked from the FAQ.
- If a parent's name appears instead of the child's on a roster, update the child profile in SportsEngine under the user profiles area.
- Anyone interested may attend association meetings; meetings are open to the public.
- To become a manager or coach, interested volunteers should attend monthly association meetings and connect with the respective league VP.
- Managers/coaches are subject to background checks and certification requirements.
- MOBSA supplies team equipment except gloves. Parents may optionally buy personal bats/catching gear if approved for play.
- Baseball players generally provide their own WHITE baseball pants.
- Softball players are required to purchase a batting helmet with face guard and a protective fielding face guard.
- Siblings in the same age division are generally assigned to the same team unless parents request otherwise.
- Friend requests are only attempted at Farm division levels and cannot be guaranteed.
- Teams are organized using player assessments and draft/assignment processes depending on division.
- Late registrations may be waitlisted if teams are already full.
- Bump-up program: a team may receive up to 2 players from the lower division when short on players; bump-up players stay on their regular team, must bat, play at least 2 innings in the field, and may not pitch at the higher division.
- Baseball age is determined by age on April 30 for the season.
- Softball age is determined by age on January 1 for the season.
- Boys Majors are split into Black and Red divisions; Black typically includes all 12-year-olds and stronger 11-year-olds, while Red is normally 10- and 11-year-olds.

BASEBALL FAQ KNOWLEDGE
Required baseball gear:
- Fielding glove
- Batting helmet
- White baseball pants for games

Recommended baseball gear:
- Bat with USA certified stamp
- Plastic cleats (no metal spikes)
- Athletic supporter / protective cup

Baseball divisions and general expectations:
- Farms: PreK/K, must be 4 years old or older, tee-ball working toward coach pitch, focus on developmental skills and fun, typically 2 times per week (1 weeknight and Saturday morning)
- Rookies: 1st/2nd grade, coach pitch working toward kid pitch, focus on developmental skills and fun
- Minors: 3rd/4th grade, fully kid pitch, modified baseball rules with limited stealing, typically 2-3 times per week
- Majors: 5th/6th grade, full baseball rules on a 50/70 field
- Babe Ruth: 7th/8th grade and up, full baseball rules on a 60/90 field
- In limited circumstances and as permitted by MOBSA, players may play above their stated grade level.
- MOBSA typically has a Dick's Sporting Goods 20% off weekend in March.

SOFTBALL FAQ KNOWLEDGE
Required softball gear:
- Fielding glove
- Batting helmet with face guard
- Fielding face guard
- Black softball pants for games

Recommended softball gear:
- Bat with USA certified stamp
- Plastic cleats (no metal spikes)
- For Minors / Majors, chest/heart guard is strongly recommended

Softball divisions and general expectations:
- Farms: Kindergarten and 1st grade, must be 4 years old or older, tee-ball working toward coach pitch, focus on developmental skills and fun, typically 2 times per week (1 weeknight and Saturday morning)
- Rookies: 2nd/3rd grade, coach pitch working toward kid pitch, focus on developmental skills and fun
- Minors: 4th/5th grade, fully kid pitch, modified softball rules with limited stealing, typically 2-3 times per week
- Majors: 6th/7th grade, full softball rules
- In limited circumstances and as permitted by MOBSA, players may play above their stated grade level.
- MOBSA typically has a Dick's Sporting Goods 20% off weekend in March.

SPONSORSHIP KNOWLEDGE
Sponsorship options:
- $150: online / digital banners on website
- $250: online / digital banners on website and field banner
- $350: online / digital banners on website and team sponsorship
- $575: online / digital banners on website, field banner, and team sponsorship
- $650: online / digital banners on website, 2 field banners, and 2 team sponsorships
- $1200: online / digital banners on website, 2 field banners, 2 team sponsorships, and exclusive special event sponsorship
- Special event sponsorship examples include Homerun Derby, Skills Competition, Clinic, etc.
- Sponsorship contact: Steve Nicholl, 973-479-2197, Steve.Nicholl@mtolivebsa.com
- Checks payable to M.O.B.S.A.
- Venmo payment is also available.

COACH / MANAGER KNOWLEDGE
- Coach/staff registration page is linked from the Coaches page as "Register: 2026 Coach / Staff"
- All MOBSA managers and coaches must complete required registration steps.
- Background check is mandatory for all MOBSA managers and coaches and must be renewed every 3 years.
- Coaches/managers must complete at least 1 approved youth sports certification plus the CDC Concussion Training Course.
- Accepted certification paths listed on the Coaches page include Rutgers SAFETY Clinic, NAYS Coaching Youth Sports, and Babe Ruth Baseball & Softball Coaching Certification.
- The CDC Concussion Training Course is mandatory for all MOBSA managers and coaches.
- Coaches can use SportsEngine Team Management / TeamCenter tools for communications, schedules, RSVPs, and team management.

ANSWERING RULES
- Prefer answers from the links above.
- When answering, include the most relevant link if available.
- For sponsorship questions, provide the sponsorship PDF link and Steve Nicholl contact info.
- For coach registration/background check/certification questions, provide the Coaches page link.
- For equipment, age cutoff, team placement, sibling/friend requests, bump-up program, or division questions, use the FAQ links above.
- If the answer is not clearly covered here or requires board/staff judgment, reply exactly with: UNCERTAIN
`;

      // System + “confidence gate” instructions
      const system = `
You are Bones, the MOBSA assistant for parent-help related Mt Olive Baseball & Softball Association (MOBSA) for mtolivebsa.sportngin.com.

You are friendly, helpful, and speak in a fun baseball tone.
Keep answers short and clear for parents using the knowledge base provided.
Always include the most relevant MOBSA link when one is available.

Formatting rules:
- Put website URLs on their own line when possible.
- Use short bullet lists for multiple items.
- Use numbered steps when explaining a process.
- Include email addresses plainly when relevant.
- Do not output HTML.

If the KB does not contain the answer, say exactly: I'm not sure about that
If the user asks something requiring staff confirmation, say exactly: I'm not sure about that
Do not make up dates, fees, registration windows, or policy exceptions.
`;

      // Call Cloudflare Workers AI LLM (example model)
      // You can swap to another Workers AI Llama instruct model if you prefer. :contentReference[oaicite:6]{index=6}
      const llmResp = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: system },
          { role: "user", content: `KNOWLEDGE BASE:\n${KB}\n\nQUESTION:\n${question}` },
        ],
        // Keep responses short and cheap
        max_tokens: 280,
        temperature: 0.2,
      });

      const answer = (llmResp?.response || "").trim();

      // Confidence gate
      const uncertain =
        !answer ||
        answer.trim().toUpperCase().includes("UNCERTAIN") ||
        answer.length < 10;

      if (uncertain) {
        try {
          await fetch(EMAIL_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question,
              email,
              page: request.headers.get("referer") || ""
            })
          });
        } catch (err) {
          console.error("Webhook email failed:", err);
        }

        return json({
          ok: true,
          routed_to_email: true,
          answer:
            "I’m not completely sure about that, so I forwarded your question to the MOBSA team. Someone should follow up with you shortly."
        });
      }

      return json({ ok: true, routed_to_email: false, answer }, 200, corsHeaders);
    }

    // (Optional) health check
    if (url.pathname === "/health") return json({ ok: true }, 200, corsHeaders);

    return new Response("Not found", { status: 404, headers: corsHeaders });
  },
};

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

// MailChannels Email API (Cloudflare Workers friendly) :contentReference[oaicite:7]{index=7}
async function sendFallbackEmail(env, { fromName, fromEmail, toEmail, subject, text }) {
  try {
    const payload = {
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: fromName },
      subject,
      content: [{ type: "text/plain", value: text }],
    };

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    return resp.ok;
  } catch (e) {
    return false;
  }
}