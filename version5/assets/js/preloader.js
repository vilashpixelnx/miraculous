/*------------------------------------------------------------------
Template Name: Miraculous - Online Music Store Html Template
Version: 5.0.0 (Aurora Editorial)
Preloader JS (the "Vinyl Drop" loader). Loaded before main.js; also
used by login.html, which does not load main.js. To remove the loader:
delete this file's <script> tag, the #msPreloader markup and the
inline head script/style on each page.
-------------------------------------------------------------------*/
(function () {
	'use strict';
	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* Behaviour ------------------------------------------------------
	   Shown only when the head script added html.is-loading. Progress eases
	   towards 88% while assets load and completes on window load; the
	   animation gets at least MIN ms so it never cuts off, and MAX ms caps
	   slow connections. On exit the screen dissolves (fade + blur). */
	(function () {
		const pre = $('#msPreloader');
		const root = document.documentElement;
		if (!pre) return;
		if (!root.classList.contains('is-loading')) { pre.remove(); return; }   // not this visit (once / off): drop the markup
		const MIN = 1700, MAX = 4000, start = performance.now();
		const num = $('#msPreNum');   // % counter
		let p = 0, loaded = false, done = false;
		const tick = () => {
			if (done) return;
			/* follows the intro timeline, but never passes 88% until the page has loaded */
			const timeline = Math.min(1, (performance.now() - start) / MIN);
			const target = loaded ? timeline : Math.min(.88, timeline);
			p += (target - p) * .18;
			pre.style.setProperty('--p', p.toFixed(3));   // custom property inherits to every bar / ring inside
			if (num) num.textContent = Math.round(p * 100);
			requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
		const finish = () => {
			if (done) return;
			done = true;
			pre.style.setProperty('--p', 1);
			if (num) num.textContent = 100;
			try { sessionStorage.setItem('ms-pre-seen', '1'); } catch (e) {}
			pre.setAttribute('aria-busy', 'false');
			pre.classList.add('is-done');
			root.classList.add('ms-loaded');
			setTimeout(() => {
				pre.remove();
				root.classList.remove('is-loading');
			}, reduceMotion ? 260 : 720);
		};
		const onLoad = () => {
			loaded = true;
			const wait = Math.max(0, MIN - (performance.now() - start));
			setTimeout(finish, reduceMotion ? 0 : wait);
		};
		if (document.readyState === 'complete') onLoad();
		else window.addEventListener('load', onLoad, { once: true });
		setTimeout(finish, MAX);
	})();
})();
