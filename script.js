#!/usr/bin/env node
//-drake(SHEBANG)


const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL ="nvidia/nemotron-3-ultra-550b-a55b:free";
if (!OPENROUTER_API_KEY) {
    console.error("victorylap needs an OpenRouter API key.");
    console.error("set it first:  $env:OPENROUTER_API_KEY = \"your-key\"");
    process.exit(1);
}
import { analyzeRepo } from "./analyze.js";
import { writeFileSync, existsSync, statSync, readdirSync, copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { execSync, execFileSync, spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { titleCard } from "./templates/title-card.js";
import { join } from "node:path";
const PKG_DIR = import.meta.dirname;
const THEMES = {
    default: titleCard,

};


function isRepoUrl(input) {
    return input.startsWith("https://") || input.startsWith("http://") || input.startsWith("git@");
}

function parseArgs(argv) {
    const args = { repoPath: ".", out: null, theme: "default" };
    for (let i = 2; i < argv.length; i++) {
        const flag = argv[i];
        if (flag === "--out") args.out = argv[++i];
        else if (flag === "--theme") args.theme = argv[++i];
        else args.repoPath = flag;
    }
    return args;
}



async function askLLM(prompt) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json", 
        }, 
        body: JSON.stringify({
            model: MODEL,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    if (!res.ok) {
        throw new Error(`openrouter said ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;

}


const args = parseArgs(process.argv);

let cloneDir = null;

if (isRepoUrl(args.repoPath)) {
    cloneDir = mkdtempSync(join(tmpdir(), "victorylap-"));
    console.log("cloning", args.repoPath, "...");
    try {
        execFileSync("git", ["clone", args.repoPath, join(cloneDir, "repo")], { stdio: "inherit" });
    } catch {
        console.error("could not clone that url, is that a real PUBLIC repo?");
        process.exit(1);
    }
    args.repoPath = join(cloneDir, "repo");
}

if (!existsSync(args.repoPath)) {
    console.error(`no such folder: ${args.repoPath}`);
    process.exit(1);
}

 if (!statSync(args.repoPath).isDirectory()) {
    console.error(`${args.repoPath} is a file, not a folder. point me at a repo`);
    process.exit(1);
 }

 if (!THEMES[args.theme]) {
    console.error(`unknown theme "${args.theme}". available: ${Object.keys(THEMES).join(", ")}`);
    process.exit(1);
 }

 const facts = analyzeRepo(args.repoPath);

 if (!facts.package && !facts.git && !facts.readme.found) {
    console.error("no package.json, no git history, no readme. nothing to take a victory lap about here.");
    process.exit(1);

 }



const prompt = `you are writing a short "brag" video script for a developer's project. here are the facts about the repo in json:
${JSON.stringify(facts, null, 2)}

write the script as json with exactly this shape: 
 {
    "projectName": "the project's display name, short, uppercase",
    "hook": "one punchy line to open the video, max 8 words",
    "tagline": "one sentence saying what the project does, max 15 words",
    "stats": [
      { "value": "short number or word", "label": "what it measures, 1-2 words" },
      { "value": "...", "label": "..." },
      { "value": "...", "label": "..." }
    ],
    "closer": "one short final line, max 6 words"
  } 
    
  
  rules:
  - only use facts from the json above. never invent numbers.
  - stat values must come from real data: commits, languages, dates.
  - no generic startup language, be specific to this project.
  - reply with ONLY the json, no other text.`;

  const reply = await askLLM(prompt);

  //json striping 
  const clean = reply.replace(/```json|```/g, "").trim();
  let script;
  try {
    script = JSON.parse(clean);
} catch {
    console.error("the llm replied with broken json. run it again, free models have moods :)");
    process.exit(1);
}





writeFileSync(join(PKG_DIR, "video", "index.html"), THEMES[args.theme](script));
console.log("script ready for", script.projectName, "- rendering...");








const WORDS = [
    "counting commits...",
    "reading the readme...",
    "framing the art...",
    "polishing pixels...",
    "rendering glory..."


];


const SPINNER = [ "|", "/", "-", "\\"];

function renderVideo(videoDir) {
    return new Promise((resolve, reject) => {
        const proc = spawn("npx -y hyperframes render --quality draft", {
            cwd: videoDir,
            shell: true,
            env: { ...process.env, CI: "true" },
        });
        let percent = 0;
        let output = "";
        const readPercent = chunk => {
            output += String(chunk);
            const matches = String(chunk).match(/(\d+)%/g);
            if (matches) percent = parseInt(matches[matches.length -1]);
        };
        proc.stdout.on("data", readPercent);
        proc.stderr.on("data", readPercent);

        let tick = 0;
        const timer = setInterval(() => {
            tick++;
            const word = WORDS[Math.floor(tick / 25) % WORDS.length];
            const bar = "#".repeat(Math.round(percent / 5)).padEnd(20, "-");
            process.stdout.write(`\r${SPINNER[tick % SPINNER.length]} [${bar}] ${percent}% ${word}   `);
        }, 120);





        proc.on("close", code => {
            clearInterval(timer);
            process.stdout.write("\n");
            if (code === 0) resolve();
            else reject(new Error(`render failed:\n${output.slice(-800)}`));
        });
    });
}

await renderVideo(join(PKG_DIR, "video"));


const rendersDir = join(PKG_DIR, "video", "renders");
const newestMp4 = readdirSync(rendersDir)
    .filter(f => f.endsWith(".mp4"))
    .sort((a, b) => statSync(join(rendersDir, b)).mtimeMs - statSync(join(rendersDir, a)).mtimeMs)[0];
const outPath = args.out || `${script.projectName.toLowerCase().replace(/\s+/g, "-")}.mp4`;
copyFileSync(join(rendersDir, newestMp4), outPath);
console.log("your video:", outPath);

if (cloneDir) rmSync(cloneDir, { recursive: true, force: true, maxRetries: 3 })