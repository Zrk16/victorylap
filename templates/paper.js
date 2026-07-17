export function paper(script) {
    return {
        "index.html": hostFile(),
        "compositions/hook.html": hookScene(script),
        "compositions/name.html": nameScene(script),
        "compositions/stats.html": statsScene(script),
        "compositions/closer.html": closerScene(script),
    };
}

function fitSize(text, base, min) {
    const len = (text || "").length;
    if (len <= 22) return base;
    return Math.max(min, Math.round(base - (len - 22) * 2));
}

function hostFile() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, height=1080">
    <title>victorylap frame</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #e8e4da; }
        #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; }
        .paper { position: absolute; inset: 0; background: #f4f1ea; }
        .rule {
            position: absolute;
         top: 0;
            bottom: 0;
            left: 220px;
            width: 2px;
            background: rgba(166, 61, 47, 0.25);

    
        }

        .grain {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(rgba(26, 26, 26, 0.04) 1px, transparent 1px);
            background-size: 4px 4px;
        }

        #wipe {
            position: absolute;
            inset: 0;
            background: #a63d2f;
            transform: translateX(-120%);
        }
    </style>
</head>
<body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="12">
        <section id="bg-layer" class="clip" data-start="0" data-duration="12" data-track-index="0" style="position: absolute; inset: 0;">
            <div class="paper"></div>
            <div class="rule"></div>
            <div class="grain"></div>
        </section>

        <audio id="bgm" src="assets/music.mp3" data-start="0" data-duration="12" data-media-start="30" data-track-index="10" data-volume="0.8"></audio>

        <div id="slot-hook" data-composition-id="hook" data-composition-src="compositions/hook.html" data-start="0" data-duration="3" data-track-index="1" data-width="1920" data-height="1080"></div>

        <div id="slot-name" data-composition-id="name" data-composition-src="compositions/name.html" data-start="3" data-duration="3.5" data-track-index="1" data-width="1920" data-height="1080"></div>

        <div id="slot-stats" data-composition-id="stats" data-composition-src="compositions/stats.html" data-start="6.5" data-duration="3" data-track-index="1" data-width="1920" data-height="1080"></div>

        <div id="slot-closer" data-composition-id="closer" data-composition-src="compositions/closer.html" data-start="9.5" data-duration="2.5" data-track-index="1" data-width="1920" data-height="1080"></div>
        <div id="wipe" class="clip" data-start="0" data-duration="12" data-track-index="2"></div>

    </div>

    <script>
        window.__timelines = window.__timelines || {};
        const tl = gsap.timeline({ paused: true });
        tl.to("#bgm", { volume: 0, duration: 1.2 }, 10.8);
        tl.fromTo("#wipe", { xPercent: -120 }, { xPercent: 120, duration: 0.5, ease: "power1.inOut", immediateRender }, 2.75);
        tl.fromTo("#wipe", { xPercent: -120 }, { xPercent: 120, duration: 0.5, ease: "power1.inOut", immediateRender }, 6.25);
        tl.fromTo("#wipe", { xPercent: -120 }, { xPercent: 120, duration: 0.5, ease: "power1.inOut", immediateRender }, 9.25);

        window.__timelines["main"] = tl;
    <\/script>
</body>
</html>`;
}


function hookScene(script) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
    <template>
        <style> 
            #root {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 120px 120px 120px 300px;
                font-family: Georgia, "Times New Roman", serif;
                color: #1a1a1a;

            }

            .hook-text {
                font-size: ${fitSize(script.hook, 96, 54)}px;
                font-style: italic;
                font-weight: 700;
                line-height: 1.15;
                max-width: 1400px;
            }

        </style>
        <div id="root" data-composition-id="hook" data-width="1920" data-height="1080">
            <h1 class="hook-text" id="hook-text">${script.hook}</h1>
        </div>
        <script>
            window.__timelines = window.__timelines || {};
            const tl = gsap.timeline({ paused: true });
            tl.fromTo("#hook-text", { opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, 0.3);
            window.__timelines["hook"] = tl;
        <\/script>
    </template>
</body>
</html>`;
}


function nameScene(script) {
    return `<!DOCTYPE htm>
<html>
<head><meta charset="UTF-8"></head>
<body>
    <template>
        <style>
            #root {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 120px 120px 120px 300px;
                font-family: Georgia, "Times New Roman", serif;
                color: #1a1a1a;
            }
            
            .project-name {
                font-size: ${fitSize(script.projectName, 150, 74)}px;
                font-weight: 700;
                line-height: 1;
                margin-bottom: 32px;
            }

            .tagline {
                font-size: ${fitSize(script.tagline, 38, 24)}px;
                font-style: italic;
                color: #6b5d52;
                max-width: 1200px;

                
                
            }
        </style>
        <div id="root" data-composition-id="name" data-width="1920" data-height="1080">
            <h1 class="project-name" id="name-title">${script.projectName}</h1>
            <p class="tagline" id="name-tag">${script.tagline}</p>
        </div>
        <script>
            window.__timelines = window.__timelines || {}; 
            const tl = gsap.timeline({ paused: true });
            tl.fromTo("#name-title", { y: 30, opacity: 0 }, {y: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, 0.2);
            tl.fromTo("#name-tag", { y:20, opacity: 0}, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 0.6);
            window.__timelines["name"] = tl;
        <\/script>
    </template>
</body>
</html>`;

}










function statsScene(script) {
    const statsHtml = script.stats.map( s=> `
        <div>
            <div class="stat-value">${s.value}</div>
            <div class="stat-label">${s.label}</div>
        </div>`).join("");
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
    <template>
        <style>
            #root {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 120px;
                font-family: Georgia, "Times New Roman", serif;
                color: #1a1a1a;
            }

            .stats {
                display: flex;
                gap: 140px;
                justify-content: center;

            }

            .stat-value{
                font-size: 120px;
                font-weight: 700;
                color: #a63d2f;
            }

            .stat-label {
                font-size: 24px;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #6b5d52;
                margin-top: 12px;
            }
        </style>
        <div id="root" data-composition-id="stats" data-width="1920" data-height="1080">
            <div class="stats" id="stats-row">${statsHtml}
            </div>
        </div>
        <script>
            window.__timelines = window.__timelines || {};
            const tl = gsap.timeline({ paused: true });
            tl.fromTo("#stats-row > div", { opacity: 0, }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.15 }, 0.2);
            tl.to("#stats-row > div", { opacity: 0, duration: 0.5, ease: "power1.in", stagger: 0.08 }, 2.5);
            window.__timelines["stats"] = tl;
        <\/script>
    </template>
</body>
</html>`; 
}



function closerScene(script) {
    return `<!DOCTYPE html>
<html>

<head><meta charset="UTF-8"></head>
<body>
    <template>
        <style>
            #root {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 120px 120px 120px 300px;
                font-family: Georgia, "Times New Roman", serif;
                color: #1a1a1a;


            }

            .closer-text {
                font-size: ${fitSize(script.closer, 88, 52)}px;
                font-style: italic;
                font-weight: 700;
                max-width: 1400px;
            }

            .credit {
                position: absolute;
                bottom: 80px;
                left: 300px;
                font-size: 20px;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: #6b5d52;

            }
        </style>
        <div id="root" data-composition-id="closer" data-width="1920" data-height="1080">
            <h1 class="closer-text" id="closer-text"> ${script.closer}</h1>
            <p class="credit" id="closer-credit">MADE WITH VICTORYLAP</p>
        </div>
        <script>
            window.__timelines = window.__timelines || {}; 
             const tl = gsap.timeline({ paused: true });
             tl.fromTo("#closer-text", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, 0.2);
             tl.fromTo("#closer-credit", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.7);
             window.__timelines["closer"] = tl;
        <\/script>
    </template>
</body>
</html>`;
}
    

