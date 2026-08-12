(function () {
    "use strict";

    const root = document.querySelector("[data-article]");
    if (!root) return;

    const tocLinks = Array.from(root.querySelectorAll("[data-article-toc] a[href^='#']"));
    const heads = tocLinks
        .map((link) => {
            const id = link.getAttribute("href").slice(1);
            return document.getElementById(id);
        })
        .filter(Boolean);

    if (!tocLinks.length || !heads.length) return;

    function setActive(id) {
        tocLinks.forEach((link) => {
            const active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", active);
        });
    }

    tocLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const id = link.getAttribute("href").slice(1);
            if (id) setActive(id);
        });
    });

    if (typeof IntersectionObserver === "undefined") {
        setActive(heads[0].id);
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            if (visible && visible.target.id) setActive(visible.target.id);
        },
        { rootMargin: "-96px 0px -70% 0px", threshold: [0, 1] }
    );

    heads.forEach((h) => io.observe(h));
    setActive(heads[0].id);
})();
