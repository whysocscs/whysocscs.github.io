import { getAllPosts, getCategoryCounts } from '@/lib/posts';
import HomeEffects from '@/components/HomeEffects';

export default function HomePage() {
  const posts = getAllPosts();
  const counts = getCategoryCounts(posts);

  return (
    <>
      <HomeEffects />
      <main>

        {/* HERO */}
        <section className="hero" id="hero">
          <div className="hero-top">
            <div className="hero-meta">
              <strong>Lee Sangho</strong> — Security research<br />
              &amp; AI guardrails. Writing from the<br />
              trench where kernels, models,<br />
              and threat actors meet.
            </div>
            <div className="hero-meta" style={{ textAlign: 'right' }}>
              2026 · Portfolio Vol. 01<br />
              <strong>INDEX</strong> · 5 Sections<br />
              {posts.length} archived entries
            </div>
          </div>
          <h1>
            <span className="sub">Notes from the —</span>
            <span className="accent">Deep</span> Sea
          </h1>
          <div className="scroll-hint">Descend</div>
        </section>

        {/* TWILIGHT — About */}
        <section className="stage" id="about">
          <div className="section-tag"><span className="tag-dot" /><span>§ 01 · 0200m · Twilight Zone</span></div>
          <div className="about-grid" data-reveal="">
            <h2>Security<br />research,<br /><em>quietly.</em></h2>
            <div className="about-body">
              <p>Undergraduate at Sangmyung University, studying information security engineering. I spent 2025 in <em>BoB 14기</em>, a six-month intensive where I learned to read kernels like poetry and threat actors like strangers on the train.</p>
              <p>My work sits at two depths. The shallow: directed fuzzing, deception telemetry, packet-level attack analysis. The deep: <em>guardrails for small language models</em> deployed in OT and industrial control environments — where a hallucination costs more than a wrong answer.</p>
              <div className="about-status">Seeking roles in <strong>AI safety / security research</strong></div>
            </div>
          </div>
          <div className="timeline" data-reveal="" data-delay="2">
            <div className="timeline-row">
              <div className="tl-date">2026.01 — 02</div>
              <div className="tl-title">Undergraduate Research Intern<span className="org">Confidential · Winter</span></div>
              <div className="tl-desc">Security research and AI guardrail engineering in a production environment.</div>
            </div>
            <div className="timeline-row">
              <div className="tl-date">2025.06 — 12</div>
              <div className="tl-title">BoB (Best of the Best) 14기 수료<span className="org">KITRI · Security Track</span></div>
              <div className="tl-desc">14th cohort. Six months of security research, product building, and team projects.</div>
            </div>
            <div className="timeline-row">
              <div className="tl-date">2021 — Now</div>
              <div className="tl-title">Information Security Engineering<span className="org">Sangmyung University</span></div>
              <div className="tl-desc">Practical security engineering, AI-oriented defense, systems research.</div>
            </div>
          </div>
        </section>

        {/* MIDNIGHT — Projects */}
        <section className="stage" id="projects">
          <div className="section-tag"><span className="tag-dot" /><span>§ 02 · 1000m · Midnight Zone</span></div>
          <div className="projects-header" data-reveal="">
            <h2>In <em>flight</em>,<br />or already surfaced.</h2>
          </div>
          <div className="log-group active" data-reveal="" data-delay="1">
            <span className="lg-dot" /><span>Active threads · 2026</span>
            <span className="lg-line" /><span>02 entries</span>
          </div>
          <div className="log-entry" data-reveal-x="" data-delay="2">
            <div className="le-meta">
              <div className="le-status"><span className="sd" />Live</div>
              <div>Entry 01</div>
              <span className="le-depth" data-le-depth="">~1000m</span>
            </div>
            <h3 className="le-title">Syz<em>Direct</em></h3>
            <p className="le-body">Directed greybox fuzzing for the Linux kernel. Path-aware seed steering to surface bugs in targeted syscall regions, faster than syzkaller&apos;s scatter approach.</p>
            <div className="le-tags">Kernel<br />Fuzzing<br />Ongoing</div>
          </div>
          <div className="log-entry" data-reveal-x="" data-delay="3">
            <div className="le-meta">
              <div className="le-status"><span className="sd" />Live</div>
              <div>Entry 02</div>
              <span className="le-depth" data-le-depth="">~1000m</span>
            </div>
            <h3 className="le-title">Honey<em>pot</em></h3>
            <p className="le-body">Deception-oriented telemetry: lure, observe, fingerprint. Attacker-behavior analysis for threat intelligence, built for research deployments.</p>
            <div className="le-tags">Deception<br />Telemetry<br />Ongoing</div>
          </div>
          <div className="log-group past" data-reveal="" data-delay="4">
            <span className="lg-dot" /><span>Shelved · rests on the record</span>
            <span className="lg-line" /><span>01 entry</span>
          </div>
          <div className="log-entry past" data-reveal-x="" data-delay="5">
            <div className="le-meta">
              <div style={{ color: 'var(--muted)' }}>Closed<br />Entry 01</div>
              <span className="le-depth">~1000m</span>
            </div>
            <h3 className="le-title">SLM-based <em>OT</em></h3>
            <p className="le-body">Applied security architecture for OT environments with a small-language-model defensive workflow. Completed during BoB 14기, 2025.</p>
            <div className="le-tags">SLM · OT<br />BoB 14<br />2025</div>
          </div>
        </section>

        {/* ABYSSAL — Archive */}
        <section className="stage" id="topics">
          <div className="section-tag"><span className="tag-dot dim" /><span>§ 03 · 3000m · Abyssal Zone</span></div>
          <div className="topics-header" data-reveal="">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--foam-muted)', marginBottom: '20px' }}>
                {posts.length} entries · 6 categories
              </div>
              <h2>By <em>topic</em></h2>
            </div>
            <a className="archive-link" href="/blog">Open archive →</a>
          </div>
          <div className="archive-grid">
            <a className="archive-cell" href="/blog#development" style={{ '--cat-color': 'oklch(0.78 0.14 210)' } as React.CSSProperties} data-reveal-blur="" data-count={counts['Development']}>
              <div className={`rec-num${counts['Development'] === 0 ? ' zero' : ''}`}>{String(counts['Development']).padStart(2,'0')}</div>
              <div className="rec-label"><span className="rec-category">Development</span><span className="rec-name">Building &amp; scripting</span></div>
            </a>
            <a className="archive-cell" href="/blog#ctf" style={{ '--cat-color': 'oklch(0.72 0.12 35)' } as React.CSSProperties} data-reveal-blur="" data-count={counts['CTF/Wargame']}>
              <div className={`rec-num${counts['CTF/Wargame'] === 0 ? ' zero' : ''}`}>{String(counts['CTF/Wargame']).padStart(2,'0')}</div>
              <div className="rec-label"><span className="rec-category">CTF / Wargame</span><span className="rec-name">Capture the flag</span></div>
            </a>
            <a className="archive-cell" href="/blog#bugbounty" style={{ '--cat-color': 'oklch(0.65 0.10 150)' } as React.CSSProperties} data-reveal-blur="" data-count={counts['BugBounty']}>
              <div className={`rec-num${counts['BugBounty'] === 0 ? ' zero' : ''}`}>{String(counts['BugBounty']).padStart(2,'0')}</div>
              <div className="rec-label"><span className="rec-category">Bug Bounty</span><span className="rec-name">Hunting in the wild</span></div>
            </a>
            <a className="archive-cell" href="/blog#techdoc" style={{ '--cat-color': 'oklch(0.82 0.12 195)' } as React.CSSProperties} data-reveal-blur="" data-count={counts['Technical Document']}>
              <div className={`rec-num${counts['Technical Document'] === 0 ? ' zero' : ''}`}>{String(counts['Technical Document']).padStart(2,'0')}</div>
              <div className="rec-label"><span className="rec-category">Technical Document</span><span className="rec-name">Notes &amp; teardowns</span></div>
            </a>
            <a className="archive-cell" href="/blog#paper" style={{ '--cat-color': 'oklch(0.75 0.10 280)' } as React.CSSProperties} data-reveal-blur="" data-count={counts['Paper/Conference']}>
              <div className={`rec-num${counts['Paper/Conference'] === 0 ? ' zero' : ''}`}>{String(counts['Paper/Conference']).padStart(2,'0')}</div>
              <div className="rec-label"><span className="rec-category">Paper / Conference</span><span className="rec-name">Reading the field</span></div>
            </a>
            <a className="archive-cell" href="/blog#contest" style={{ '--cat-color': 'oklch(0.78 0.11 85)' } as React.CSSProperties} data-reveal-blur="" data-count={counts['Contest/Certification']}>
              <div className={`rec-num${counts['Contest/Certification'] === 0 ? ' zero' : ''}`}>{String(counts['Contest/Certification']).padStart(2,'0')}</div>
              <div className="rec-label"><span className="rec-category">Contest / Cert</span><span className="rec-name">Competitions earned</span></div>
            </a>
          </div>
        </section>

        {/* HADAL — Contact */}
        <footer className="site-footer">
          <div className="hadal-tag"><span className="ht-line" /><span>§ 04 · 4000m · Hadal Zone</span></div>
          <div className="footer-contact" data-reveal="">
            Write<br />
            <a href="mailto:whysocscs@gmail.com">
              <em style={{ color: 'var(--plankton)' }}>whysocscs</em>@gmail.com
              <span className="cursor-blink" id="email-cursor" />
            </a>
          </div>
          <div className="footer-grid">
            <div data-reveal="" data-delay="1">
              <span className="fg-label">Elsewhere</span>
              <a href="https://github.com/whysocscs" target="_blank" rel="noopener">GitHub ↗</a><br />
              <a href="/blog">Blog archive ↗</a>
            </div>
            <div data-reveal="" data-delay="2"><span className="fg-label">Now</span>Seoul · KR<br />2026 · April</div>
            <div data-reveal="" data-delay="3"><span className="fg-label">Building</span>SyzDirect<br />Honeypot telemetry</div>
            <div data-reveal="" data-delay="4" style={{ textAlign: 'right' }}><span className="fg-label">© 2026</span>Lee Sangho<br />All notes, submerged.</div>
          </div>
        </footer>

      </main>
    </>
  );
}
