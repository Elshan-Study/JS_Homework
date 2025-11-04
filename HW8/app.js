class AnimatedSlider {
    constructor(sliderId, indicatorsId) {
        const slider = document.getElementById(sliderId);
        const ind = document.getElementById(indicatorsId);
        if (!slider || !ind) throw new Error("Slider elements not found");

        this.sliderEl = slider;
        this.indicatorsEl = ind;

        this.duration = 520;
        this.easing = AnimatedSlider.easeInOutQuad;
        this.current = 0;
        this.isAnimating = false;

        this.autoplayTimer = null;
        this.autoplayInterval = 3000;
        this.isPlaying = false;

        this.slides = Array.from(this.sliderEl.querySelectorAll(".slide"));
        if (this.slides.length === 0) throw new Error("No slides found");

        this.slides.forEach((s, i) => {
            const offset = (i - this.current) * 100;
            s.style.transform = `translateX(${offset}%)`;
        });

        this.renderIndicators();
        this.updateIndicators();
        this.attachInteractionHandlers();
    }

    async next() {
        const target = (this.current + 1) % this.slides.length;
        await this.goToIndex(target);
    }

    async prev() {
        const target = (this.current - 1 + this.slides.length) % this.slides.length;
        await this.goToIndex(target);
    }

    async first() {
        await this.goToIndex(0);
    }

    async last() {
        await this.goToIndex(this.slides.length - 1);
    }

    startAutoplay() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.autoplayTimer = window.setInterval(async () => {
            if (this.current === this.slides.length - 1) {
                this.stopAutoplay();
                return;
            }
            await this.next();
            if (this.current === this.slides.length - 1) {
                this.stopAutoplay();
            }
        }, this.autoplayInterval);
    }

    stopAutoplay() {
        if (this.autoplayTimer !== null) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
        this.isPlaying = false;
    }

    async goTo(index) {
        if (index < 0 || index >= this.slides.length) return;
        await this.goToIndex(index);
    }

    async goToIndex(target) {
        if (this.isAnimating || target === this.current) {
            this.current = target;
            this.updateIndicators();
            return;
        }

        this.stopAutoplay();

        this.isAnimating = true;
        this.disableControls(true);

        const fromPositions = this.slides.map((_, i) => (i - this.current) * 100);
        const toPositions = this.slides.map((_, i) => (i - target) * 100);

        await Promise.all(
            this.slides.map((s, i) =>
                this.animateTranslate(s, fromPositions[i], toPositions[i], this.duration)
            )
        );

        this.current = target;
        this.isAnimating = false;
        this.updateIndicators();
        this.disableControls(false);
    }

    animateTranslate(elem, fromPercent, toPercent, durationMs) {
        return new Promise((resolve) => {
            const start = performance.now();

            const step = (now) => {
                const elapsed = now - start;
                const t = Math.min(elapsed / durationMs, 1);
                const eased = this.easing(t);
                const value = fromPercent + (toPercent - fromPercent) * eased;
                elem.style.transform = `translateX(${value}%)`;

                if (t < 1) {
                    requestAnimationFrame(step);
                } else {
                    elem.style.transform = `translateX(${toPercent}%)`;
                    resolve();
                }
            };

            requestAnimationFrame(step);
        });
    }

    disableControls(disable) {
        const buttons = Array.from(document.querySelectorAll(".controls button"));
        buttons.forEach((b) => (b.disabled = disable));
    }

    renderIndicators() {
        this.indicatorsEl.innerHTML = "";
        this.slides.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.className = "indicator";
            dot.dataset.index = String(i);
            dot.title = `Go to slide ${i + 1}`;
            this.indicatorsEl.appendChild(dot);
        });
    }

    updateIndicators() {
        const dots = Array.from(this.indicatorsEl.children);
        dots.forEach((d, i) => {
            d.classList.toggle("active", i === this.current);
        });
    }

    attachInteractionHandlers() {
        const btnPrev = document.getElementById("btnPrev");
        const btnNext = document.getElementById("btnNext");
        const btnFirst = document.getElementById("btnFirst");
        const btnLast = document.getElementById("btnLast");
        const btnPlay = document.getElementById("btnPlay");
        const btnFs = document.getElementById("btnFullscreen");

        if (!btnPrev || !btnNext || !btnFirst || !btnLast || !btnPlay || !btnFs) {
            throw new Error("Control buttons not found");
        }

        btnNext.addEventListener("click", async () => {
            this.stopAutoplay();
            await this.next();
            this.updatePlayButton(btnPlay);
        });

        btnPrev.addEventListener("click", async () => {
            this.stopAutoplay();
            await this.prev();
            this.updatePlayButton(btnPlay);
        });

        btnFirst.addEventListener("click", async () => {
            this.stopAutoplay();
            await this.first();
            this.updatePlayButton(btnPlay);
        });

        btnLast.addEventListener("click", async () => {
            this.stopAutoplay();
            await this.last();
            this.updatePlayButton(btnPlay);
        });

        btnPlay.addEventListener("click", () => {
            if (this.isPlaying) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
            this.updatePlayButton(btnPlay);
        });

        this.indicatorsEl.addEventListener("click", async (ev) => {
            const target = ev.target;
            if (!target || !target.classList || !target.classList.contains("indicator")) return;
            const idx = Number(target.dataset.index);
            this.stopAutoplay();
            await this.goTo(idx);
            this.updatePlayButton(btnPlay);
        });

        btnFs.addEventListener("click", async () => {
            this.stopAutoplay();
            await this.toggleFullscreen();
            this.updatePlayButton(btnPlay);
        });

        this.sliderEl.addEventListener("pointerdown", () => {
            if (this.isPlaying) {
                this.stopAutoplay();
                this.updatePlayButton(btnPlay);
            }
        });

        window.addEventListener("keydown", async (e) => {
            if (e.key === "ArrowLeft") {
                this.stopAutoplay();
                await this.prev();
                this.updatePlayButton(btnPlay);
            } else if (e.key === "ArrowRight") {
                this.stopAutoplay();
                await this.next();
                this.updatePlayButton(btnPlay);
            }
        });
    }

    updatePlayButton(btn) {
        btn.textContent = this.isPlaying ? "⏸ Pause" : "▶ Play";
    }

    async toggleFullscreen() {
        const wrap = document.getElementById("sliderWrap");
        if (!wrap) return;

        if (!document.fullscreenElement) {
            try {
                await wrap.requestFullscreen();
            } catch (err) {
                console.warn("Fullscreen failed", err);
            }
        } else {
            try {
                await document.exitFullscreen();
            } catch (err) {
                console.warn("Exit fullscreen failed", err);
            }
        }
    }

    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const slider = new AnimatedSlider("slider", "indicators");

    slider.startAutoplay();
    window.sliderInstance = slider;
});
