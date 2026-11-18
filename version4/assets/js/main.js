/*------------------------------------------------------------------
Template Name: Miraculous - Online Music Store Html Template
Version: 4.0.0
Main JS: loader, sidebar, sliders, waveforms, audio player, queue
-------------------------------------------------------------------*/
(function () {
	'use strict';

	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

	/* Playlist ------------------------------------------------------
	   Replace src with your own audio files. */
	const TRACKS = [
		{ title: 'Until I Met You', artist: 'Ava Cornish', cover: 'assets/images/album/01.jpg', src: 'https://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3' },
		{ title: 'Dark Alley Acoustic', artist: 'Ava Cornish', cover: 'assets/images/album/02.jpg', src: 'https://www.jplayer.org/audio/mp3/TSP-05-Your_face.mp3' },
		{ title: 'Gimme Some Courage', artist: 'Ava Cornish', cover: 'assets/images/album/03.jpg', src: 'https://www.jplayer.org/audio/mp3/TSP-07-Cybersonnet.mp3' },
		{ title: 'Walking Promises', artist: 'Ava Cornish', cover: 'assets/images/album/04.jpg', src: 'https://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3' },
		{ title: 'Desired Games', artist: 'Ava Cornish', cover: 'assets/images/album/05.jpg', src: 'https://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3' },
		{ title: 'Endless Things', artist: 'Ava Cornish', cover: 'assets/images/album/06.jpg', src: 'https://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3' },
		{ title: 'Cloud Nine', artist: 'Brian Hill', cover: 'assets/images/album/07.jpg', src: 'https://www.jplayer.org/audio/mp3/Miaow-04-Lismore.mp3' },
		{ title: 'One More Stranger', artist: 'Claire Hudson', cover: 'assets/images/album/08.jpg', src: 'https://www.jplayer.org/audio/mp3/Miaow-05-The-separation.mp3' }
	];

	/* Loader -------------------------------------------------------*/
	let introPlayed = false;
	const hideLoader = () => {
		$('#msLoader')?.classList.add('is-hidden');
		if (!introPlayed) { introPlayed = true; playIntro(); }
	};
	window.addEventListener('load', hideLoader);
	setTimeout(hideLoader, 2500); // never block the page on slow CDNs/images

	/* Sidebar (mobile) ---------------------------------------------*/
	const toggleSidebar = (open) => {
		document.body.classList.toggle('sidebar-open', open);
		$('#msBackdrop')?.classList.toggle('is-visible', open);
	};
	$('#msMenuToggle')?.addEventListener('click', () => toggleSidebar(true));
	$('#msBackdrop')?.addEventListener('click', () => toggleSidebar(false));

	/* Search shortcut: Ctrl/Cmd + K ---------------------------------*/
	document.addEventListener('keydown', (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			$('#msSearch')?.focus();
		}
	});

	/* Waveforms ----------------------------------------------------
	   data-shape: "hero" rises toward the controls, "seek" is a centred
	   swell, "mini" is a small card visualiser. */
	const PALETTES = {
		hero: [[84, 98, 255], [170, 70, 245], [255, 140, 230]],
		seek: [[255, 79, 168], [139, 53, 245], [61, 140, 255]],
		mini: [[255, 79, 216], [200, 120, 255], [22, 217, 245]]
	};
	const mix = (stops, t) => {
		const seg = t < 0.5 ? 0 : 1, k = (t - seg * 0.5) * 2;
		return 'rgb(' + stops[seg].map((c, j) => Math.round(c + (stops[seg + 1][j] - c) * k)).join(',') + ')';
	};
	const SHAPES = {
		hero: (t, r) => 0.1 + 0.9 * Math.exp(-Math.pow(t - 0.8, 2) / 0.02) * (0.3 + 0.7 * r),
		seek: (t) => 0.1 + 0.9 * Math.pow(Math.sin(Math.PI * t), 2) * (0.45 + 0.55 * Math.abs(Math.sin(t * 37) * 0.7 + Math.sin(t * 11) * 0.3)),
		mini: (t) => 0.25 + 0.75 * Math.pow(Math.sin(Math.PI * t), 1.2) * Math.abs(Math.sin(t * 29))
	};
	$$('[data-wave]').forEach((wave) => {
		const count = parseInt(wave.dataset.wave, 10) || 40;
		const shape = SHAPES[wave.dataset.shape] ? wave.dataset.shape : 'seek';
		let html = '';
		for (let i = 0; i < count; i++) {
			const t = i / (count - 1);
			const r = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1; // stable pseudo-random spike
			const h = Math.max(8, SHAPES[shape](t, r) * 100);
			html += `<span style="--h:${h.toFixed(1)};--i:${i};--c:${mix(PALETTES[shape], t)}"></span>`;
		}
		wave.innerHTML = html;
	});

	/* Sliders ------------------------------------------------------*/
	$$('.ms-swiper').forEach((el) => {
		const perView = parseInt(el.dataset.perView, 10) || 5;
		const wrap = el.closest('.ms-slider-wrap');
		new Swiper(el, {
			slidesPerView: 2.2,
			spaceBetween: 16,
			grabCursor: true,
			navigation: { prevEl: $('.prev', wrap), nextEl: $('.next', wrap) },
			breakpoints: {
				576: { slidesPerView: Math.min(3, perView) },
				992: { slidesPerView: Math.min(4, perView), spaceBetween: 24 },
				1400: { slidesPerView: perView, spaceBetween: 24 }
			}
		});
	});

	/* Motion animations ----------------------------------------------
	   Driven by Motion (motion.dev) when it is loaded and the visitor
	   allows animation; otherwise the CSS scroll reveal below is used. */
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let playIntro = () => {};

	if (window.Motion && !reduceMotion) {
		const { animate, inView, stagger, scroll } = window.Motion;
		const ease = [0.22, 0.61, 0.36, 1];
		const spring = { type: 'spring', stiffness: 380, damping: 24 };
		const hide = (els, from) => els.length && animate(els, { opacity: 0, ...from }, { duration: 0 });
		document.documentElement.classList.add('has-motion');

		// Intro: everything starts hidden behind the loader, then plays in sequence
		const heroText = $$('.ms-hero-content > *');
		const heroControls = $$('.ms-hero-controls > *');
		const sideItems = $$('.ms-sidebar-panel .ms-logo, .ms-sidebar .ms-nav li, .ms-nav-title, .ms-premium-wrap');
		hide(heroText, { y: 34 });
		hide(heroControls, { y: 20 });
		hide(sideItems, { x: -24 });
		hide($$('.ms-topbar, .ms-hero-media'), {});
		if ($('#msPlayer')) animate('#msPlayer', { y: '100%' }, { duration: 0 });

		playIntro = () => {
			animate('.ms-hero-media', { opacity: [0, 1], scale: [1.08, 1] }, { duration: 1.4, ease });
			animate('.ms-topbar', { opacity: [0, 1], y: [-16, 0] }, { duration: 0.6, ease });
			animate(heroText, { opacity: [0, 1], y: [34, 0] }, { duration: 0.8, delay: stagger(0.12, { startDelay: 0.15 }), ease });
			animate(heroControls, { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: stagger(0.06, { startDelay: 0.55, from: 'center' }), ease });
			animate(sideItems, { opacity: [0, 1], x: [-24, 0] }, { duration: 0.5, delay: stagger(0.04, { startDelay: 0.1 }), ease });
			animate('#msPlayer', { y: ['100%', '0%'] }, { ...spring, delay: 0.8 });
			// start watching sections only now, so the first ones animate in view rather than behind the loader
			setTimeout(() => sections.forEach(({ section, items }) => inView(section, () => {
				animate(items, { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, delay: stagger(0.05), ease });
			}, { amount: 0.15 })), 450);
		};

		// Sections: header, then their cards one by one as they scroll into view
		const sections = $$('.ms-reveal').map((section) => {
			section.classList.remove('ms-reveal');
			const items = $$('.ms-sec-head, .swiper-slide, .row > .col, .ms-track, .ms-promo', section);
			hide(items, { y: 28 });
			return { section, items };
		});

		// Hero image drifts slower than the page (parallax)
		const hero = $('.ms-hero');
		if (hero) scroll(animate('.ms-hero-media img', { y: [0, 90] }, { ease: 'linear' }), { target: hero, offset: ['start start', 'end start'] });

		// Spring hover lift on cards
		$$('.ms-card, .ms-mood, .ms-artist, .ms-radio').forEach((el) => {
			el.addEventListener('pointerenter', () => animate(el, { y: -6 }, spring));
			el.addEventListener('pointerleave', () => animate(el, { y: 0 }, spring));
		});

		// Spring hover + press on buttons
		$$('.ms-btn, .ms-icon-btn, .ms-play-ring, .ms-ctrl').forEach((el) => {
			el.addEventListener('pointerenter', () => animate(el, { scale: 1.06 }, spring));
			el.addEventListener('pointerleave', () => animate(el, { scale: 1 }, spring));
			el.addEventListener('pointerdown', () => animate(el, { scale: 0.92 }, spring));
			el.addEventListener('pointerup', () => animate(el, { scale: 1.06 }, spring));
		});
	} else {
		/* Scroll reveal (CSS fallback) ---------------------------------*/
		const io = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12 });
		$$('.ms-reveal').forEach((el) => io.observe(el));
	}

	/* Like buttons -------------------------------------------------*/
	document.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-like]');
		if (!btn) return;
		const icon = $('i', btn);
		const active = btn.classList.toggle('is-active');
		icon.className = active ? 'ri-heart-3-fill' : 'ri-heart-3-line';
	});

	/* Audio player -------------------------------------------------*/
	const audio = new Audio();
	audio.preload = 'none';
	const state = { index: 3, shuffle: false, repeat: false };

	const fmt = (s) => {
		if (!isFinite(s)) return '00:00';
		const m = Math.floor(s / 60);
		return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
	};

	const seek = $('#msSeek');
	const seekBars = seek ? $$('span', seek) : [];

	function renderTrack() {
		const t = TRACKS[state.index];
		$('#msPlayerCover').src = t.cover;
		$('#msPlayerTitle').textContent = t.title;
		$('#msPlayerArtist').textContent = t.artist;
		$$('[data-card]').forEach((c) => c.classList.toggle('is-playing', +c.dataset.card === state.index && !audio.paused));
		renderQueue();
	}

	function load(index, autoplay = true) {
		state.index = (index + TRACKS.length) % TRACKS.length;
		audio.src = TRACKS[state.index].src;
		renderTrack();
		if (autoplay) audio.play().catch(() => {});
	}

	function toggle() {
		if (!audio.src) return load(state.index);
		audio.paused ? audio.play().catch(() => {}) : audio.pause();
	}

	function next() {
		if (state.shuffle) {
			let n;
			do { n = Math.floor(Math.random() * TRACKS.length); } while (n === state.index && TRACKS.length > 1);
			return load(n);
		}
		load(state.index + 1);
	}

	function syncPlayState() {
		const playing = !audio.paused;
		document.body.classList.toggle('is-playing', playing);
		$$('[data-action="toggle"]').forEach((b) => {
			$('i', b).className = playing ? 'ri-pause-fill' : 'ri-play-fill';
			b.setAttribute('aria-label', playing ? 'Pause' : 'Play');
		});
		$$('[data-play] > i.ri-play-fill, [data-play] > i.ri-pause-fill').forEach((i) => {
			const own = +i.parentElement.dataset.play === state.index && playing;
			i.className = own ? 'ri-pause-fill' : 'ri-play-fill';
		});
		renderTrack();
	}

	audio.addEventListener('play', syncPlayState);
	audio.addEventListener('pause', syncPlayState);
	audio.addEventListener('loadedmetadata', () => { $('#msDuration').textContent = fmt(audio.duration); });
	audio.addEventListener('timeupdate', () => {
		$('#msCurrent').textContent = fmt(audio.currentTime);
		const pct = audio.duration ? audio.currentTime / audio.duration : 0;
		const upto = Math.round(pct * seekBars.length);
		seekBars.forEach((bar, i) => bar.classList.toggle('is-past', i < upto));
		seek?.setAttribute('aria-valuenow', Math.round(pct * 100));
	});
	audio.addEventListener('ended', () => (state.repeat ? (audio.currentTime = 0, audio.play()) : next()));

	seek?.addEventListener('click', (e) => {
		if (!audio.duration) return;
		const rect = seek.getBoundingClientRect();
		audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
	});

	// Transport buttons (hero + player share the same actions)
	document.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-action]');
		if (!btn) return;
		const action = btn.dataset.action;
		if (action === 'toggle') toggle();
		if (action === 'next') next();
		if (action === 'prev') audio.currentTime > 3 ? (audio.currentTime = 0) : load(state.index - 1);
		if (action === 'shuffle' || action === 'repeat') {
			state[action] = !state[action];
			$$(`[data-action="${action}"]`).forEach((b) => b.classList.toggle('is-active', state[action]));
		}
	});

	// Any element with data-play="index" plays that track
	document.addEventListener('click', (e) => {
		const el = e.target.closest('[data-play]');
		if (!el) return;
		const index = +el.dataset.play;
		index === state.index && audio.src ? toggle() : load(index);
	});

	// Volume
	const volume = $('#msVolume');
	const setVolume = (v) => {
		audio.volume = v / 100;
		volume.value = v;
		volume.style.setProperty('--val', `${v}%`);
		$('#msMute i').className = v == 0 ? 'ri-volume-mute-line' : v < 50 ? 'ri-volume-down-line' : 'ri-volume-up-line';
	};
	let lastVolume = 60;
	volume?.addEventListener('input', () => setVolume(volume.value));
	$('#msMute')?.addEventListener('click', () => {
		if (+volume.value > 0) { lastVolume = volume.value; setVolume(0); } else { setVolume(lastVolume); }
	});
	if (volume) setVolume(volume.value);

	// Queue
	function renderQueue() {
		const list = $('#msQueueList');
		if (!list) return;
		list.innerHTML = TRACKS.map((t, i) => `
			<div class="ms-track${i === state.index ? ' is-playing' : ''}" data-play="${i}">
				<div class="ms-track-cover"><img src="${t.cover}" alt=""><i class="ri-play-fill"></i></div>
				<div class="ms-track-info"><h4>${t.title}</h4><p>${t.artist}</p></div>
				${i === state.index && !audio.paused ? '<div class="ms-eq"><span></span><span></span><span></span><span></span></div>' : ''}
			</div>`).join('');
	}

	// Demo state: show the bar partly played until the first real playback
	seekBars.forEach((bar, i) => bar.classList.toggle('is-past', i < seekBars.length * 0.52));
	renderTrack();
})();
