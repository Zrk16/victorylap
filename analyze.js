import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import { execSync } from "node:child_process";




function readPackageJson(repo) {
    const file = join(repo, "package.json");
    if (!existsSync(file)) return null;

    const pkg = JSON.parse(readFileSync(file, "utf8"));
    return {
        name: pkg.name || null,
        description: pkg.description || null,
        dependencies: Object.keys(pkg.dependencies || {}),
    };
}

function readReadme(repo) {
    const names = ["README.md", "readme.md", "README"];
    for (const name of names) {
        const file = join(repo, name);
        if (existsSync(file)) return readFileSync(file, "utf8");
    }
    return null;
}

//folders that aint code
const SKIP_DIRS = new Set([
    "node_modules", ".git", ".next", "dist", "build",
    ".venv", "venv", "__pycache__", "renders",

]);

const LANGUAGES = {
    ".js": "JavaScript",
    ".mjs": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript", 
    ".py": "Python",
    ".html":"HTML",
    ".css": "CSS",
    

};

function walk(dir, counts = {}) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) continue;
            walk(join(dir, entry.name), counts); 
        } else {
            const lang = LANGUAGES[extname(entry.name)];
            if (lang) counts[lang] = (counts[lang] || 0) + 1;
        }
    }
    return counts;
}

function detectLanguages(repo) {
    const counts = walk(repo);
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([language, files]) => ({ language, files }));
}

function readGitLog(repo) {
    try {
        const run = (cmd) => execSync(cmd, { cwd: repo, encoding: "utf8"}).trim();

        return { 
            commitCount: Number(run("git rev-list --count HEAD")),
            firstCommit: run("git log --reverse --format=%as").split("\n")[0],
            lastCommit: run("git log -1 --format=%as"),
            recentSubjects: run("git log -10 --format=%s").split("\n"), 
        };
    } catch {
        return null;
    }
}

//fisrst paragraph

function firstParagraph(markdown) {
    if (!markdown) return null;

    for (const line of markdown.split("\n")) {
        const text = line.trim();
        if(!text) continue;
        if (text.startsWith("#")) continue;
        if (text.startsWith("![") || text.startsWith("[!")) continue;
        if (text.startsWith("<")) continue;
        return text;

    }
    return null;
    
}


  const readme = readReadme(repoPath);

  const report = {
      analyzedAt: new Date().toISOString(),
      repoPath,
      package: readPackageJson(repoPath),
      languages: detectLanguages(repoPath),
      git: readGitLog(repoPath),
      readme: {
          found: readme !== null,
          firstParagraph: firstParagraph(readme),
      },
  };

   console.log(JSON.stringify(report, null, 2));