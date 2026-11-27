/* Miraculous documentation: theme switch, mobile menu, active link while scrolling, copy buttons. No libraries. */
(function () {
	'use strict';
	var root = document.documentElement;
	var $ = function (s, c) { return (c || document).querySelector(s); };
	var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

	/* Theme: follows the system, the button lets the visitor override it (remembered in this browser). */
	try {
		var saved = localStorage.getItem('ms-doc-theme');
		if (saved) root.setAttribute('data-theme', saved);
	} catch (e) { /* storage blocked: ignore */ }
	var themeBtn = $('#themeBtn');
	if (themeBtn) {
		themeBtn.addEventListener('click', function () {
			var dark = root.getAttribute('data-theme') === 'dark' ||
				(!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
			var next = dark ? 'light' : 'dark';
			root.setAttribute('data-theme', next);
			try { localStorage.setItem('ms-doc-theme', next); } catch (e) { /* ignore */ }
		});
	}

	/* Mobile menu */
	var menuBtn = $('#menuBtn');
	if (menuBtn) {
		menuBtn.addEventListener('click', function () {
			var open = document.body.classList.toggle('nav-open');
			menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
		$$('.sidebar a').forEach(function (a) {
			a.addEventListener('click', function () { document.body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); });
		});
	}

	/* Active link in the side menu */
	var links = $$('.sidebar a[href^="#"]');
	var map = {};
	links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting && map[en.target.id]) {
					links.forEach(function (l) { l.classList.remove('active'); });
					map[en.target.id].classList.add('active');
				}
			});
		}, { rootMargin: '-15% 0px -75% 0px' });
		Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
	}

	/* Copy buttons on code blocks */
	$$('pre').forEach(function (pre) {
		var b = document.createElement('button');
		b.type = 'button'; b.className = 'copy-btn'; b.textContent = 'Copy';
		b.addEventListener('click', function () {
			var text = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
			var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1400); };
			if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done, done); } else { done(); }
		});
		pre.appendChild(b);
	});
})();
