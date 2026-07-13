 export function titleCard(script) {
      const statsHtml = script.stats.map(s => `
          <div>
              <div class="stat-value">${s.value}</div>
              <div class="stat-label">${s.label}</div>
          </div>`).join("");

      return `<!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=1920, height=1080">
      <title>victorylap frame</title>
      <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              background: #0a0a0a;
              font-family: "JetBrains Mono", monospace;
          }

          /* composition root */
          #root {
              position: relative;
              width: 1920px;
              height: 1080px;
              overflow: hidden;
              color: #f0ede4;
          }

          /* clip */
          .clip {
              position: absolute;
              inset: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: 120px;
          }

          .label {
              font-size: 22px;
              letter-spacing: 0.2em;
              color: #8a8474;
              margin-bottom: 40px;
          }

          .project-name {
              font-size: 140px;
              font-weight: 800;
              line-height: 1;
              margin-bottom: 40px;
          }

          .tagline {
              font-size: 36px;
              color: #b8b2a2;
              max-width: 1200px;
              margin-bottom: 80px;
          }

          .stats {
              display: flex;
              gap: 100px;
          }

          .stat-value {
              font-size: 72px;
              font-weight: 800;
              color: #ffb000;
          }

          .stat-label {
              font-size: 20px;
              letter-spacing: 0.15em;
              color: #8a8474;
              margin-top: 8px;
          }
      </style>
  </head>

  <body>

      <div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="5">

          <section id="title-card" class="clip" data-start="0" data-duration="5" data-track-index="1">
              <p class="label" id="shipped">${script.hook}</p>
              <h1 class="project-name" id="name">${script.projectName}</h1>
              <p class="tagline" id="tag">${script.tagline}</p>
              <div class="stats" id="stats">${statsHtml}
              </div>
          </section>
      </div>

      <script>
          // hyperframes scrubs this paused timeline
          window.__timelines = window.__timelines || {};

          const tl = gsap.timeline({ paused: true });
          tl.from("#shipped", { y: 30, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.3);
          tl.from("#name", { y: 60, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.5);
          tl.from("#tag", { y: 30, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.9);
          tl.from("#stats", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" }, 1.2);

          window.__timelines["main"] = tl;
      <\/script>

  </body>

  </html>`;
  }