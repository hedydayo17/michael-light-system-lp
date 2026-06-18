/* =========================================================
   ミカエルライト LP — アニメーション初期化
   Claude Design 版から復元・標準化したスタンドアロン版。
   GSAP + ScrollTrigger + Lenis（いずれも CDN から window に読み込み）で、
   data-* 属性をフックに演出を組み立てる。
   ========================================================= */
(function () {
  const ACCENT_MAP = { green: "#0ae448", purple: "#6a5cff", pink: "#ff2d78", orange: "#ff7a00" };
  // アクセントカラーを変えたいときはここを green / purple / pink / orange に
  const ACCENT = "green";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function boot() {
    const g = window.gsap, ST = window.ScrollTrigger, L = window.Lenis;
    const root = document.getElementById("ml-root");
    if (!root) return setTimeout(boot, 60);
    if (!g || !ST || !L) return setTimeout(boot, 60);
    if (root.dataset.mlBooted === "1") return;
    root.dataset.mlBooted = "1";
    g.registerPlugin(ST);

    const accent = ACCENT_MAP[ACCENT] || "#0ae448";
    root.style.setProperty("--accent", accent);

    const q = (s) => root.querySelector(s);
    const qa = (s) => Array.from(root.querySelectorAll(s));
    const isTouch = window.matchMedia("(hover: none)").matches;

    // ----- reduced motion: プリローダーだけ消して内容は静止表示 -----
    if (reduce) {
      const pre = q("[data-preloader]"); if (pre) pre.style.display = "none";
      const cur = q("[data-cursor]"); if (cur) cur.style.display = "none";
      wireNav(root, qa, null);
      wireForm(q);
      return;
    }

    // ----- Lenis スムーススクロール -----
    const lenis = new L({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ST.update);
    g.ticker.add((t) => lenis.raf(t * 1000));
    g.ticker.lagSmoothing(0);

    // ----- カスタムカーソル -----
    const cur = q("[data-cursor]");
    if (cur && !isTouch) {
      window.addEventListener("mousemove", (e) => {
        g.to(cur, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
      });
      qa("a, [data-magnetic]").forEach((el) => {
        el.addEventListener("mouseenter", () => g.to(cur, { scale: 2.6, duration: 0.3 }));
        el.addEventListener("mouseleave", () => g.to(cur, { scale: 1, duration: 0.3 }));
      });
    } else if (cur) {
      cur.style.display = "none";
    }

    // ----- プリローダー（カウントアップ → せり上げ → ヒーロー出現） -----
    const pre = q("[data-preloader]");
    const numEl = q("[data-count]");
    const counter = { v: 0 };
    const tl = g.timeline();
    tl.to(counter, {
      v: 100, duration: 1.5, ease: "power2.inOut",
      onUpdate: () => { if (numEl) numEl.textContent = String(Math.round(counter.v)).padStart(2, "0"); },
    });
    tl.to(q("[data-bar]"), { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0);
    tl.to(pre, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.15");
    tl.from(qa("[data-hero-line] > span"), { yPercent: 115, duration: 1.0, ease: "power4.out", stagger: 0.12 }, "-=0.5");
    tl.from(qa("[data-hero-fade]"), { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" }, "-=0.6");
    tl.from(qa("[data-hero-sub]"), { y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }, "<");

    // ----- ヒーローの浮遊シェイプ・パララックス -----
    qa("[data-float]").forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-float")) || 0.3;
      g.to(el, {
        y: () => speed * 260, ease: "none",
        scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // ----- 提供内容: 横スクロール（ピン留め） -----
    const track = q("[data-track]");
    const servicesSec = q("[data-services]");
    if (track && servicesSec) {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      g.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: servicesSec, start: "top top",
          end: () => "+=" + dist(),
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
    }

    // ----- 理念: 単語ごとにせり上げ -----
    const philo = q("[data-philo]");
    if (philo) {
      g.from(qa("[data-philo-word]"), {
        yPercent: 110, opacity: 0, duration: 0.9, ease: "power4.out", stagger: 0.1,
        scrollTrigger: { trigger: philo, start: "top 80%" },
      });
    }

    // ----- 汎用リベール -----
    qa("[data-reveal]").forEach((el) => {
      g.from(el, {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // ----- マグネティックボタン -----
    if (!isTouch) {
      qa("[data-magnetic]").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const r = btn.getBoundingClientRect();
          const mx = e.clientX - r.left - r.width / 2;
          const my = e.clientY - r.top - r.height / 2;
          g.to(btn, { x: mx * 0.4, y: my * 0.4, duration: 0.4, ease: "power3.out" });
        });
        btn.addEventListener("mouseleave", () => {
          g.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.3)" });
        });
      });
    }

    wireNav(root, qa, lenis);
    wireForm(q);

    window.addEventListener("load", () => ST.refresh());
    setTimeout(() => ST.refresh(), 400);
  }

  // ----- お問い合わせフォーム → mailto 起動 -----
  function wireForm(q) {
    const form = q("[data-contact-form]");
    if (!form || form.dataset.wired) return;
    form.dataset.wired = "1";
    const status = q("[data-form-status]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const company = (fd.get("company") || "").toString().trim();
      const email = (fd.get("email") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();
      const subject = "【お問い合わせ】" + (company ? company + " / " : "") + name + " 様";
      const body =
        "お名前: " + name + "\n" +
        "会社名: " + (company || "（未記入）") + "\n" +
        "メールアドレス: " + email + "\n" +
        "\n--- ご相談内容 ---\n" + message + "\n";
      const href =
        "mailto:contact@michael-light.co.jp" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
      if (status) {
        status.style.display = "block";
        status.textContent =
          "メールソフトを起動しました。内容をご確認のうえ送信してください。起動しない場合は contact@michael-light.co.jp まで直接お送りください。";
      }
    });
  }

  // ----- ナビ・アンカーのスムーススクロール -----
  function wireNav(root, qa, lenis) {
    qa("[data-nav-link]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#")) return;
        e.preventDefault();
        const target = root.querySelector(href);
        if (!target) return;
        if (lenis) {
          lenis.scrollTo(target, { offset: 0, duration: 1.1 });
        } else {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
