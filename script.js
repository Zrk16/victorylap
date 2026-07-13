#!/usr/bin/env node
//-drake(SHEBANG)


const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL ="nvidia/nemotron-3-ultra-550b-a55b:free";
import { analyzeRepo } from "./analyze.js";
import { writeFileSync } from "node:fs";
import { titleCard } from "./templates/title-card.js";
import { join } from "node:path";
const PKG_DIR = import.meta.dirname;



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


const repoPath = process.argv[2] || ".";
const facts = analyzeRepo(repoPath);

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
  const script = JSON.parse(clean); 

 writeFileSync(join(PKG_DIR, "video", "index.html"), titleCard(script));
console.log("wrote video/index.html for", script.projectName);