import { spawnSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const frameRoot = path.resolve(root, ".gif-frames");
const outputRoot = path.resolve(root, "public", "demos");
const frameRate = 15;
const loopDurationSeconds = 5;
const frameCount = frameRate * loopDurationSeconds;

function assertWorkspaceChild(target) {
  const workspacePrefix = `${path.resolve(root)}${path.sep}`.toLowerCase();
  if (!path.resolve(target).toLowerCase().startsWith(workspacePrefix)) {
    throw new Error(`Refusing to modify a path outside the workspace: ${target}`);
  }
}

assertWorkspaceChild(frameRoot);
assertWorkspaceChild(outputRoot);

const commonStyles = `
  * { box-sizing: border-box; }
  html, body { width: 720px; height: 450px; margin: 0; overflow: hidden; }
  body { font-family: Arial, Helvetica, sans-serif; background: #eef1ed; color: #111827; }
  .app { width: 720px; height: 450px; display: grid; grid-template-columns: 128px 1fr; background: #f8faf8; }
  .side { padding: 18px 14px; background: #153f38; color: #fff; }
  .brand { display: flex; align-items: center; gap: 8px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,.16); font-size: 13px; font-weight: 700; }
  .brand-mark { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 7px; background: #f4c95d; color: #111827; }
  .nav { margin-top: 20px; display: grid; gap: 6px; font-size: 11px; color: rgba(255,255,255,.66); }
  .nav span { padding: 9px 10px; border-radius: 7px; }
  .nav .active { background: #fff; color: #111827; font-weight: 700; }
  .main { padding: 22px 26px; overflow: hidden; }
  .eyebrow { margin: 0; font-size: 10px; font-weight: 700; color: #176b5b; }
  h1 { margin: 5px 0 0; font-size: 22px; line-height: 1.2; }
  .muted { color: #6b7280; }
  .panel { border: 1px solid #d8ddda; border-radius: 8px; background: #fff; }
  .tag { display: inline-flex; align-items: center; min-height: 24px; border-radius: 999px; padding: 0 9px; font-size: 10px; font-weight: 700; }
  .teal { color: #176b5b; }
  .green-tag { background: #dcfce7; color: #166534; }
  .amber-tag { background: #fef3c7; color: #92400e; }
  .red-tag { background: #fee2e2; color: #991b1b; }
  .blue-tag { background: #dbeafe; color: #1d4ed8; }
  .top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .bar { height: 6px; overflow: hidden; border-radius: 999px; background: #e5e7eb; }
  .bar > span { display: block; height: 100%; border-radius: inherit; background: #176b5b; transform-origin: left; }
  @keyframes rise { 0%, 12% { opacity: 0; transform: translateY(14px); } 28%, 82% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-6px); } }
  @keyframes fill { 0%, 12% { transform: scaleX(.08); } 48%, 82% { transform: scaleX(1); } 100% { transform: scaleX(.08); } }
  @keyframes slide { 0%, 15% { opacity: 0; transform: translateX(34px); } 35%, 82% { opacity: 1; transform: translateX(0); } 100% { opacity: 0; transform: translateX(-10px); } }
  @keyframes pop { 0%, 24% { opacity: 0; transform: scale(.88); } 40%, 82% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(.9); } }
`;

const scenes = [
  {
    name: "goals-to-roadmap",
    content: `
      <div class="app">
        <aside class="side">
          <div class="brand"><span class="brand-mark">✓</span> RoadmapOS</div>
          <div class="nav"><span>Today</span><span class="active">Goals</span><span>Roadmap</span><span>Review</span><span>Research</span></div>
        </aside>
        <main class="main">
          <div class="top"><div><p class="eyebrow">GOALS → ROADMAP</p><h1>Give every goal a place in the plan.</h1></div><span class="tag green-tag">3 goals ready</span></div>
          <div style="display:grid;grid-template-columns:.9fr 1.1fr;gap:14px;margin-top:22px;">
            <section style="display:grid;gap:9px;">
              ${[
                ["CAREER", "Move into a stronger role", "P1", "0s"],
                ["WEALTH", "Build a home deposit", "P2", ".35s"],
                ["HEALTH", "Train three times a week", "P2", ".7s"],
              ].map(([domain, title, priority, delay]) => `
                <div class="panel" style="padding:13px;animation:rise 5s ease-in-out ${delay} infinite;">
                  <div style="display:flex;justify-content:space-between;gap:8px;"><span style="font-size:9px;font-weight:700;color:#6b7280;">${domain}</span><span style="font-size:10px;font-weight:700;color:#176b5b;">${priority}</span></div>
                  <p style="margin:8px 0 0;font-size:12px;font-weight:700;">${title}</p>
                </div>`).join("")}
            </section>
            <section class="panel" style="padding:16px;animation:slide 5s ease-in-out .8s infinite;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#176b5b;">THE RIGHT SEQUENCE</p>
              <div style="margin-top:16px;display:grid;gap:15px;">
                ${[
                  ["NOW", "Protect monthly surplus"],
                  ["Q2", "Build career proof"],
                  ["Q3", "Increase income, then accelerate savings"],
                ].map(([date, title], index) => `
                  <div style="display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:start;">
                    <span style="display:grid;width:31px;height:31px;place-items:center;border-radius:50%;background:${index === 0 ? "#176b5b" : "#e5e7eb"};color:${index === 0 ? "#fff" : "#4b5563"};font-size:8px;font-weight:700;">${date}</span>
                    <div style="padding-top:2px;"><p style="margin:0;font-size:11px;font-weight:700;">${title}</p><div class="bar" style="margin-top:8px;"><span style="animation:fill 5s ease-in-out ${.7 + index * .24}s infinite;background:${index === 2 ? "#2563eb" : "#176b5b"};"></span></div></div>
                  </div>`).join("")}
              </div>
            </section>
          </div>
        </main>
      </div>`,
  },
  {
    name: "conflict-check",
    content: `
      <div class="app">
        <aside class="side">
          <div class="brand"><span class="brand-mark">✓</span> RoadmapOS</div>
          <div class="nav"><span>Today</span><span>Goals</span><span class="active">Roadmap</span><span>Review</span><span>Research</span></div>
        </aside>
        <main class="main">
          <div class="top"><div><p class="eyebrow">PLAN HEALTH</p><h1>See exactly why a plan does not fit.</h1></div><span class="tag red-tag">Conflicting</span></div>
          <div style="margin-top:20px;border:1px solid #fecaca;border-radius:8px;background:#fff7f7;padding:14px 16px;animation:rise 5s ease-in-out .1s infinite;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div><p style="margin:0;font-size:10px;font-weight:700;color:#991b1b;">READINESS SCORE</p><p style="margin:5px 0 0;font-size:12px;font-weight:700;color:#7f1d1d;">Money and time both exceed their protected limits.</p></div>
              <p style="margin:0;font-size:24px;font-weight:700;color:#991b1b;">52</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:13px;">
            <div class="panel" style="padding:16px;animation:rise 5s ease-in-out .35s infinite;">
              <p style="margin:0;font-size:10px;color:#6b7280;">SAFE MONEY LIMIT</p>
              <p style="margin:8px 0 0;font-size:18px;font-weight:700;">INR 72k / INR 60k</p>
              <div class="bar" style="margin-top:10px;"><span style="width:100%;background:#dc2626;animation:fill 5s ease-in-out .4s infinite;"></span></div>
              <p style="margin:7px 0 0;font-size:10px;color:#6b7280;">Monthly buffer stays untouched</p>
            </div>
            <div class="panel" style="padding:16px;animation:rise 5s ease-in-out .65s infinite;">
              <p style="margin:0;font-size:10px;color:#6b7280;">SAFE DAILY TIME</p>
              <p style="margin:8px 0 0;font-size:18px;font-weight:700;">142 / 113 min</p>
              <div class="bar" style="margin-top:10px;"><span style="width:100%;background:#dc2626;animation:fill 5s ease-in-out .7s infinite;"></span></div>
              <p style="margin:7px 0 0;font-size:10px;color:#6b7280;">Recovery time stays outside the plan</p>
            </div>
          </div>
          <div style="margin-top:13px;border-left:4px solid #f4c95d;background:#fff9e8;padding:11px 13px;font-size:11px;color:#4b5563;animation:slide 5s ease-in-out 1.05s infinite;"><strong>Do this:</strong> move the lowest-priority goal to maintenance and extend one paid deadline.</div>
        </main>
      </div>`,
  },
  {
    name: "weekly-recovery",
    content: `
      <div class="app">
        <aside class="side">
          <div class="brand"><span class="brand-mark">✓</span> RoadmapOS</div>
          <div class="nav"><span>Today</span><span>Goals</span><span>Roadmap</span><span class="active">Review</span><span>Research</span></div>
        </aside>
        <main class="main">
          <div class="top"><div><p class="eyebrow">WEEKLY RECOVERY</p><h1>Adjust the plan without starting over.</h1></div><span class="tag blue-tag">Current week</span></div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px;">
            ${[
              ["Study", "5.5h", "#dbeafe", "0s"],
              ["Workouts", "3", "#dcfce7", ".25s"],
              ["Saved", "₹12k", "#fef3c7", ".5s"],
            ].map(([label, value, bg, delay]) => `
              <div class="panel" style="padding:14px;text-align:center;background:${bg};animation:rise 5s ease-in-out ${delay} infinite;">
                <p style="margin:0;font-size:20px;font-weight:700;">${value}</p><p style="margin:5px 0 0;font-size:10px;color:#6b7280;">${label}</p>
              </div>`).join("")}
          </div>
          <div style="display:grid;grid-template-columns:.82fr 1.18fr;gap:13px;margin-top:13px;">
            <div class="panel" style="padding:16px;">
              <p style="margin:0;font-size:10px;color:#6b7280;">WHAT SLIPPED</p>
              <p style="margin:9px 0 0;font-size:12px;font-weight:700;">One fitness session</p>
              <p style="margin:7px 0 0;font-size:11px;line-height:1.5;color:#6b7280;">Unexpected work pressure. Energy next week: medium.</p>
            </div>
            <div style="border-radius:8px;background:#153f38;padding:17px;color:#fff;animation:slide 5s ease-in-out .8s infinite;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#f4c95d;">NEXT WEEK'S RECOVERY</p>
              <p style="margin:10px 0 0;font-size:13px;font-weight:700;">Keep the career block. Move one workout to Saturday.</p>
              <p style="margin:8px 0 0;font-size:11px;line-height:1.5;color:rgba(255,255,255,.66);">No catch-up marathon needed. The priority goal remains on track.</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:9px;margin-top:15px;font-size:11px;color:#166534;animation:pop 5s ease-in-out 1.2s infinite;"><span style="display:grid;width:24px;height:24px;place-items:center;border-radius:50%;background:#dcfce7;font-weight:700;">✓</span>Recovery saved. Your next week is ready.</div>
        </main>
      </div>`,
  },
];

await rm(frameRoot, { recursive: true, force: true });
await mkdir(frameRoot, { recursive: true });
await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 720, height: 450 } });

  for (const scene of scenes) {
    const sceneFrames = path.join(frameRoot, scene.name);
    await mkdir(sceneFrames, { recursive: true });
    await page.setContent(`<style>${commonStyles}</style>${scene.content}`);
    await page.evaluate(() => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        animation.currentTime = 0;
      }
    });

    for (let index = 0; index < frameCount; index += 1) {
      const currentTime = (index / frameRate) * 1000;
      await page.evaluate((time) => {
        for (const animation of document.getAnimations()) {
          animation.currentTime = time;
        }
      }, currentTime);
      const frameName = `${String(index).padStart(3, "0")}.png`;
      await page.screenshot({ path: path.join(sceneFrames, frameName) });
    }

    const output = path.join(outputRoot, `${scene.name}.gif`);
    const result = spawnSync(
      "ffmpeg",
      [
        "-y",
        "-framerate",
        String(frameRate),
        "-i",
        path.join(sceneFrames, "%03d.png"),
        "-filter_complex",
        `fps=${frameRate},split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3`,
        "-loop",
        "0",
        output,
      ],
      { encoding: "utf8" },
    );

    if (result.status !== 0) {
      throw new Error(result.stderr || `ffmpeg failed for ${scene.name}`);
    }

    console.log(`Generated ${path.relative(root, output)}`);
  }
} finally {
  await browser.close();
  await rm(frameRoot, { recursive: true, force: true });
}
