/*--------------------- Copyright (c) 2026 -----------------------
[Master Javascript]
Project: Miraculous - Online Music Store Html Template
Version: 4.0.0 (Aurora Editorial)
Author: Kamleshyadav
Assigned to: Theme Forest
Main JS: sidebar, top nav, search, hero carousel, reveal,
         audio player, queue
-------------------------------------------------------------------*/
(function () {
	'use strict';

	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* Playlist ------------------------------------------------------
	   Index = the data-play value used in the markup.
	   Replace src with your own audio files. */
	const TRACKS = [
		{ title: 'Walking Promises', artist: 'Ava Cornish', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-01.mp3' },
		{ title: 'Until I Met You', artist: 'Brian Hill', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-02.mp3' },
		{ title: 'Gimme Some Courage', artist: 'Ava Cornish', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-03.mp3' },
		{ title: 'Dark Alley Acoustic', artist: 'Anna Ellison', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-04.mp3' },
		{ title: 'Echoes of You', artist: 'David Parker', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-05.mp3' },
		{ title: 'Heart Broken', artist: 'Anna Ellison', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-01.mp3' },
		{ title: 'Cloud Nine', artist: 'Brian Hill', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-02.mp3' },
		{ title: 'Golden Hour', artist: 'David Parker', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-03.mp3' },
		{ title: 'Paper Hearts', artist: 'Claire Hudson', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-04.mp3' },
		{ title: 'Slow Mornings', artist: 'Kevin Buckland', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-05.mp3' },
		{ title: 'Velvet Sky', artist: 'Mia Glover', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-01.mp3' },
		{ title: 'Quiet Rivers', artist: 'Kevin Buckland', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-02.mp3' },
		{ title: 'The Heartbeat Steps', artist: 'Ava Cornish', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-03.mp3' },
		{ title: 'One More Stranger', artist: 'Ava Cornish', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-04.mp3' },
		{ title: 'Endless Things', artist: 'Ava Cornish', cover: 'https://dummyimage.com/600x600', time: '00:10', src: 'assets/audio/song-05.mp3' }
	];

	/* Toast --------------------------------------------------------*/
	let toastTimer;
	const toast = (msg) => {
		const el = $('#msToast');
		if (!el) return;
		el.textContent = msg;
		el.classList.add('is-visible');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
	};

	/* Sidebar (tablet / mobile drawer) ------------------------------*/
	const toggleSidebar = (open) => {
		document.body.classList.toggle('sidebar-open', open);
		$('#msBackdrop')?.classList.toggle('is-visible', open);
	};
	$('#msMenuToggle')?.addEventListener('click', () => toggleSidebar(true));
	$('#msBackdrop')?.addEventListener('click', () => toggleSidebar(false));

	/* Top nav: sliding coral indicator ------------------------------*/
	const topnav = $('.ms-topnav');
	const ink = $('.ms-topnav-ink');
	const moveInk = (link) => {
		if (!ink || !link) return;
		ink.style.width = `${link.offsetWidth}px`;
		ink.style.transform = `translateX(${link.offsetLeft}px)`;
	};
	if (topnav) {
		const activeLink = () => $('a.active', topnav);
		$$('a', topnav).forEach((a) => a.addEventListener('mouseenter', () => moveInk(a)));
		topnav.addEventListener('mouseleave', () => moveInk(activeLink()));
		window.addEventListener('resize', () => moveInk(activeLink()));
		document.fonts?.ready.then(() => moveInk(activeLink()));
		moveInk(activeLink());
	}

	/* Search: icon expands into a field; Ctrl/Cmd + K focuses it ---*/
	const searchForm = $('#msSearchForm');
	const searchInput = $('#msSearch');
	const openSearch = () => { searchForm.classList.add('is-open'); searchInput.focus(); };
	const closeSearch = () => { if (!searchInput.value) searchForm.classList.remove('is-open'); };
	$('#msSearchToggle')?.addEventListener('click', () => {
		searchForm.classList.contains('is-open') && searchInput.value ? searchForm.requestSubmit() : openSearch();
	});
	searchInput?.addEventListener('blur', () => setTimeout(closeSearch, 150));
	// Enter opens the results page with the typed words
	searchForm?.addEventListener('submit', (e) => {
		e.preventDefault();
		const q = searchInput.value.trim();
		if (q) location.href = `search.html?q=${encodeURIComponent(q)}`;
	});
	document.addEventListener('keydown', (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
		if (e.key === 'Escape') {
			if (searchInput === document.activeElement) { searchInput.value = ''; searchInput.blur(); }
			toggleSidebar(false);
		}
	});

	/* Hero carousel ------------------------------------------------*/
	const hero = $('#msHero');
	if (hero) {
		const slides = $$('.ms-hero-slide', hero);
		const dots = $$('.ms-hero-dots button', hero);
		let current = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
		let timer;

		const go = (i) => {
			current = (i + slides.length) % slides.length;
			slides.forEach((s, n) => {
				s.classList.toggle('is-active', n === current);
				s.setAttribute('aria-hidden', n === current ? 'false' : 'true');
			});
			dots.forEach((d, n) => {
				d.classList.toggle('is-active', n === current);
				d.setAttribute('aria-selected', n === current ? 'true' : 'false');
			});
		};
		// hero slides change every 7s (paused for reduced-motion users)
		const HERO_AUTOPLAY = true;
		const start = () => { if (HERO_AUTOPLAY && !reduceMotion) { clearInterval(timer); timer = setInterval(() => go(current + 1), 7000); } };
		const stop = () => clearInterval(timer);

		dots.forEach((d, n) => d.addEventListener('click', () => { go(n); start(); }));
		$$('[data-hero-dir]', hero).forEach((b) => b.addEventListener('click', () => { go(current + +b.dataset.heroDir); start(); }));
		hero.addEventListener('mouseenter', stop);
		hero.addEventListener('mouseleave', start);
		hero.addEventListener('focusin', stop);

		// swipe on touch screens
		let x0 = null;
		hero.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
		hero.addEventListener('touchend', (e) => {
			if (x0 === null) return;
			const dx = e.changedTouches[0].clientX - x0;
			if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); start(); }
			x0 = null;
		});

		$('[data-hero-play]', hero)?.addEventListener('click', () => {
			const index = +slides[current].dataset.track;
			index === state.index && audio.src ? toggle() : load(index);
		});

		go(current);
		start();
	}

	/* Hero waveform: coral bars fading to white, tallest in the middle */
	const heroWave = $('#msHeroWave');
	if (heroWave) {
		const n = 34;
		heroWave.innerHTML = Array.from({ length: n }, (_, i) => {
			const t = i / (n - 1);
			const h = 18 + 82 * Math.pow(Math.sin(Math.PI * t), 1.4) * (0.55 + 0.45 * Math.abs(Math.sin((i + 1) * 2.3)));
			// coral at the edges, white through the middle
			const w = Math.pow(Math.sin(Math.PI * t), 2);
			const c = [253, 55, 75].map((v) => Math.round(v + (255 - v) * w * 0.8)).join(',');
			return `<span style="--h:${h.toFixed(0)};--i:${i};--c:rgb(${c})"></span>`;
		}).join('');
	}

	/* Scroll reveal ------------------------------------------------*/
	if ('IntersectionObserver' in window && !reduceMotion) {
		const io = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
		$$('.ms-reveal').forEach((el) => io.observe(el));
	} else {
		$$('.ms-reveal').forEach((el) => el.classList.add('is-visible'));
	}

	/* Like + cart buttons ------------------------------------------*/
	document.addEventListener('click', (e) => {
		const like = e.target.closest('[data-like]');
		if (like) {
			e.stopPropagation();
			const active = like.classList.toggle('is-active');
			$('i', like).className = active ? 'ri-heart-3-fill' : 'ri-heart-3-line';
			if (like.closest('.ms-hero-actions')) toast(active ? 'Added to your library' : 'Removed from your library');
			return;
		}
		const cart = e.target.closest('[data-cart]');
		if (cart) {
			const added = cart.classList.toggle('is-added');
			$('i', cart).className = added ? 'ri-check-line' : 'ri-shopping-cart-2-line';
			const inCart = $$('[data-cart].is-added').length;
			toast(added ? `Added to cart · ${inCart} item${inCart === 1 ? '' : 's'}` : 'Removed from cart');
		}
	}, true);

	/* Audio player -------------------------------------------------*/
	const audio = new Audio();
	audio.preload = 'none';
	const state = { index: 1, shuffle: false, repeat: false };
	let resumeAt = 0; // seconds to jump to when a saved track starts again

	const fmt = (s) => {
		if (!isFinite(s)) return '00:00';
		const m = Math.floor(s / 60);
		return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
	};

	const player = $('#msPlayer');
	const seeks = $$('[data-seek]');

	// waveform bars next to the time
	const wave = $('#msWave');
	if (wave) {
		wave.innerHTML = Array.from({ length: 12 }, (_, i) => {
			const h = 35 + 65 * Math.abs(Math.sin((i + 1) * 1.7));
			return `<span style="--h:${h.toFixed(0)};--i:${i}"></span>`;
		}).join('');
	}

	// right panel waveform: bars light up as the song plays
	const npWave = $('#msNpWave');
	if (npWave) {
		npWave.innerHTML = Array.from({ length: 44 }, (_, i) => {
			const h = 22 + 78 * Math.sin(Math.PI * i / 43) * (0.55 + 0.45 * Math.abs(Math.sin(i * 2.3)));
			return `<span style="--h:${h.toFixed(0)};--i:${i}"></span>`;
		}).join('');
	}
	const npBars = npWave ? $$('span', npWave) : [];

	// bottom bar track drawn as a waveform (light player): bars light up as the song plays;
	// one bar every ~5px, so a wide bar on big screens stays dense (rebuilt on resize)
	const seekBars = [];
	let lastPct = 0;
	const buildSeekBars = () => {
		seekBars.length = 0;
		$$('[data-seek-bars]').forEach((box) => {
			const n = Math.max(24, Math.floor(box.clientWidth / 5));
			box.innerHTML = Array.from({ length: n }, (_, i) => {
				const h = 24 + 76 * Math.abs(Math.sin((i + 1) * 0.9) * Math.cos(i * 0.37));
				return `<span style="--h:${h.toFixed(0)};--i:${i}"></span>`;
			}).join('');
			seekBars.push(...$$('span', box));
		});
		seekBars.forEach((bar, i) => bar.classList.toggle('is-on', i / seekBars.length < lastPct));
	};
	buildSeekBars();
	let seekResize;
	window.addEventListener('resize', () => { clearTimeout(seekResize); seekResize = setTimeout(buildSeekBars, 150); });
	const npPanel = $('.ms-np');

	// fill every element matching sel (pages without the right panel just skip it)
	const setAll = (sel, prop, value) => $$(sel).forEach((el) => (el[prop] = value));

	function renderTrack(animate) {
		const t = TRACKS[state.index];
		setAll('#msPlayerCover, #msNpCover, #msPillCover, #msSheetCover', 'src', t.cover);
		setAll('#msPlayerTitle, #msNpTitle, #msPillTitle, #msSheetTitle', 'textContent', t.title);
		setAll('#msPlayerArtist, #msNpArtist, #msPillArtist, #msSheetArtist', 'textContent', t.artist);
		setAll('#msNpDuration, [data-time-total]', 'textContent', audio.src && isFinite(audio.duration) ? fmt(audio.duration) : t.time);
		if (animate) {
			[player, npPanel, $('#msPill')].forEach((el) => {
				if (!el) return;
				el.classList.remove('is-changing');
				void el.offsetWidth; // restart the animation
				el.classList.add('is-changing');
			});
		}
		$$('[data-card]').forEach((c) => c.classList.toggle('is-playing', +c.dataset.card === state.index && !audio.paused));
		$$('.ms-chart .ms-track').forEach((r) => r.classList.toggle('is-playing', +r.dataset.play === state.index && !audio.paused));
		renderQueue();
	}

	function load(index, autoplay = true) {
		if (index !== state.index) resumeAt = 0;
		state.index = (index + TRACKS.length) % TRACKS.length;
		audio.src = TRACKS[state.index].src;
		renderTrack(true);
		if (autoplay) audio.play().catch(() => toast('Audio could not be loaded'));
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
		renderTrack(false);
	}

	const setProgress = (pct) => {
		$$('[data-seek-fill]').forEach((f) => (f.style.width = `${pct * 100}%`));
		seeks.forEach((s) => s.setAttribute('aria-valuenow', Math.round(pct * 100)));
		npBars.forEach((b, i) => b.classList.toggle('is-on', i / npBars.length < pct));
		lastPct = pct;
		seekBars.forEach((b, i) => b.classList.toggle('is-on', i / seekBars.length < pct));
		$('#msPill')?.style.setProperty('--p', (pct * 100).toFixed(1)); // progress ring of the mini player
	};

	audio.addEventListener('play', syncPlayState);
	audio.addEventListener('pause', syncPlayState);
	audio.addEventListener('timeupdate', () => {
		$$('[data-time-current]').forEach((el) => (el.textContent = fmt(audio.currentTime)));
		setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
	});
	audio.addEventListener('loadedmetadata', () => {
		setAll('#msNpDuration, [data-time-total]', 'textContent', fmt(audio.duration));
		if (resumeAt) { audio.currentTime = Math.min(resumeAt, audio.duration - 1); resumeAt = 0; }
	});
	audio.addEventListener('ended', () => (state.repeat ? (audio.currentTime = 0, audio.play()) : next()));

	const seekTo = (pct) => { if (audio.duration) audio.currentTime = Math.min(Math.max(pct, 0), 1) * audio.duration; };
	seeks.forEach((seek) => {
		seek.addEventListener('click', (e) => {
			const rect = seek.getBoundingClientRect();
			seekTo((e.clientX - rect.left) / rect.width);
		});
		seek.addEventListener('keydown', (e) => {
			if (!audio.duration) return;
			if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
			if (e.key === 'ArrowLeft') audio.currentTime = Math.max(audio.currentTime - 5, 0);
		});
	});

	// Transport buttons
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
		if (!el || e.target.closest('[data-no-play]')) return;
		e.preventDefault();
		const index = +el.dataset.play;
		index === state.index && audio.src ? toggle() : load(index);
	});

	// Hide / show the bottom bar (remembered across pages). While it is hidden a mini
	// player (#msPill) keeps playback in reach; [data-player-show] brings the bar back.
	const root = document.documentElement;
	const playerToggle = $('#msPlayerToggle');
	const syncPlayerToggle = () => {
		const hidden = root.classList.contains('player-hidden');
		if (!playerToggle) return;
		playerToggle.setAttribute('aria-label', hidden ? 'Show player' : 'Hide player');
		playerToggle.setAttribute('aria-expanded', hidden ? 'false' : 'true');
	};
	const setPlayerHidden = (hidden) => {
		root.classList.toggle('player-hidden', hidden);
		try { localStorage.setItem('ms-player-hidden', hidden ? '1' : '0'); } catch (e) {}
		syncPlayerToggle();
	};
	if (playerToggle) {
		syncPlayerToggle();
		playerToggle.addEventListener('click', () => {
			setPlayerHidden(!root.classList.contains('player-hidden'));
			if (root.classList.contains('player-hidden')) $('#msPill .ms-pill-open')?.focus();
		});
	}
	$$('[data-player-show]').forEach((b) => b.addEventListener('click', () => {
		setPlayerHidden(false);
		playerToggle?.focus();
	}));
	// "on-play" start: the bar waits off screen and slides up on the first play
	audio.addEventListener('play', () => {
		root.classList.remove('player-dormant');
		player?.classList.remove('is-ready');
	});

	// Phones/tablets: tapping the song in the bar opens a full-screen player
	const sheet = $('#msSheet');
	if (sheet) {
		const smallScreen = window.matchMedia('(max-width: 991.98px)');
		let opener = null;
		const openSheet = () => {
			opener = document.activeElement;
			root.classList.add('sheet-open');
			sheet.setAttribute('aria-hidden', 'false');
			$('[data-sheet-close]', sheet)?.focus();
		};
		const closeSheet = () => {
			root.classList.remove('sheet-open');
			sheet.setAttribute('aria-hidden', 'true');
			opener?.focus?.();
		};
		const song = $('.ms-player-song', player);
		// on small screens the song acts as a button that opens the sheet
		const syncSongButton = () => {
			if (!song) return;
			if (smallScreen.matches) { song.setAttribute('role', 'button'); song.setAttribute('tabindex', '0'); song.setAttribute('aria-label', 'Open player'); }
			else { song.removeAttribute('role'); song.removeAttribute('tabindex'); song.removeAttribute('aria-label'); }
		};
		syncSongButton();
		song?.addEventListener('click', () => { if (smallScreen.matches) openSheet(); });
		song?.addEventListener('keydown', (e) => { if (smallScreen.matches && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openSheet(); } });
		$$('[data-sheet-close]', sheet).forEach((b) => b.addEventListener('click', closeSheet));
		document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('sheet-open')) closeSheet(); });
		smallScreen.addEventListener('change', (e) => { syncSongButton(); if (!e.matches && root.classList.contains('sheet-open')) closeSheet(); });
	}

	// Volume (bottom bar + right panel stay in sync)
	const volumes = $$('[data-volume]');
	let volumeNow = 62;
	let lastVolume = 62;
	const setVolume = (v) => {
		volumeNow = +v;
		audio.volume = v / 100;
		volumes.forEach((r) => {
			r.value = v;
			r.style.setProperty('--val', `${v}%`);
		});
		$$('[data-mute] i').forEach((i) => (i.className = v == 0 ? 'ri-volume-mute-line' : v < 50 ? 'ri-volume-down-line' : 'ri-volume-up-line'));
	};
	volumes.forEach((r) => r.addEventListener('input', () => setVolume(r.value)));
	$$('[data-mute]').forEach((b) => b.addEventListener('click', () => {
		if (volumeNow > 0) { lastVolume = volumeNow; setVolume(0); } else { setVolume(lastVolume); }
	}));
	setVolume(volumeNow);

	// Queue: offcanvas list + compact list in the right panel
	function renderQueue() {
		const eq = '<div class="ms-eq"><span></span><span></span><span></span><span></span></div>';
		const list = $('#msQueueList');
		if (list) {
			list.innerHTML = TRACKS.map((t, i) => `
				<div class="ms-track${i === state.index ? ' is-playing' : ''}" data-play="${i}">
					<div class="ms-track-cover"><img src="${t.cover}" alt="${t.title} cover"><i class="ri-play-fill"></i></div>
					<div class="ms-track-info"><h4>${t.title}</h4><p>${t.artist}</p></div>
					${i === state.index && !audio.paused ? eq : ''}
				</div>`).join('');
		}
		const side = $('#msSideQueue');
		if (side) {
			side.innerHTML = TRACKS.map((t, i) => `
				<div class="ms-qrow${i === state.index ? ' is-playing' : ''}" data-play="${i}">
					<div class="ms-track-cover"><img src="${t.cover}" alt="${t.title} cover"><i class="ri-play-fill"></i></div>
					<h4>${t.title}</h4>
					${i === state.index && !audio.paused ? eq : `<span>${t.time}</span>`}
				</div>`).join('');
		}
	}
	$$('[data-queue-count]').forEach((el) => (el.textContent = TRACKS.length));

	/* Keep the song going between pages ---------------------------
	   Each page is a new document, so the current track and position
	   are saved and shown again on the next page; play resumes there. */
	const SAVE_KEY = 'ms-player';
	const save = () => {
		try {
			localStorage.setItem(SAVE_KEY, JSON.stringify({
				index: state.index,
				time: audio.src ? audio.currentTime : resumeAt,
				duration: audio.duration || 0
			}));
		} catch (e) {}
	};
	let lastSave = 0;
	audio.addEventListener('timeupdate', () => { if (Date.now() - lastSave > 1000) { lastSave = Date.now(); save(); } });
	audio.addEventListener('pause', save);
	window.addEventListener('pagehide', save);

	let saved = null;
	try { saved = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) {}
	if (saved && TRACKS[saved.index]) {
		state.index = saved.index;
		resumeAt = saved.time || 0;
		setAll('[data-time-current]', 'textContent', fmt(resumeAt));
		setProgress(saved.duration ? resumeAt / saved.duration : 0);
	} else if (document.documentElement.dataset.playerStart) {
		// first visit: the bar waits at 00:00 and the play button gently pulses
		setProgress(0);
		setAll('[data-time-current]', 'textContent', fmt(0));
		player?.classList.add('is-ready');
	} else {
		// nothing has played yet: the bar waits at 00:00
		setProgress(0);
		setAll('[data-time-current]', 'textContent', fmt(0));
	}
	renderTrack(false);

	/* Small page interactions --------------------------------------*/
	document.addEventListener('click', (e) => {
		const follow = e.target.closest('[data-follow]');
		if (follow) {
			const on = follow.classList.toggle('is-active');
			const icon = $('i', follow);
			follow.lastChild.textContent = on ? ' Following' : ' Follow';
			if (!icon) follow.textContent = on ? 'Following' : 'Follow';
			else {
				// data-follow-icons="on off" swaps in custom icons
				const [iconOn, iconOff] = (follow.dataset.followIcons || 'ri-user-follow-line ri-user-add-line').split(' ');
				icon.className = on ? iconOn : iconOff;
			}
			return;
		}
		const react = e.target.closest('[data-react]');
		if (react) {
			const on = react.classList.toggle('is-active');
			$('i', react).className = on ? 'ri-heart-3-fill' : 'ri-heart-3-line';
			return;
		}
		const add = e.target.closest('[data-add-song]');
		if (add) {
			const on = add.classList.toggle('is-active');
			add.innerHTML = on ? '<i class="ri-check-line"></i> Added' : '<i class="ri-add-line"></i> Add';
			return;
		}
		const dl = e.target.closest('[data-download]');
		if (dl) {
			e.stopPropagation();
			dl.classList.add('is-done');
			$('i', dl).className = 'ri-checkbox-circle-fill';
			toast('Saved for offline listening');
			return;
		}
		const tab = e.target.closest('[data-tabs] button');
		if (tab) {
			$$('button', tab.parentElement).forEach((b) => b.classList.toggle('is-active', b === tab));
			return;
		}
		const msg = e.target.closest('[data-toast]');
		if (msg) toast(msg.dataset.toast);
		if (e.target.closest('[data-clear-history]')) toast('Listening history cleared');
	}, true);

	// upload areas: show the chosen file name, highlight on drag
	$$('[data-dropzone]').forEach((zone) => {
		const input = $('input[type="file"]', zone);
		const title = $('h4', zone);
		const show = (file) => { if (file && title) title.textContent = file.name; };
		input?.addEventListener('change', () => show(input.files[0]));
		['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('is-over'); }));
		['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, () => zone.classList.remove('is-over')));
		zone.addEventListener('drop', (e) => { e.preventDefault(); show(e.dataTransfer.files[0]); });
	});

	/* Filter chips, sort menu and "load more" (listing pages) -------
	   Chips: [data-filter="pop"] inside [data-filter-group="id"];
	   items in #id carry data-genre / data-year / data-plays / data-title. */
	$$('[data-filter-group]').forEach((group) => {
		const grid = document.getElementById(group.dataset.filterGroup);
		if (!grid) return;
		const items = $$(':scope > *', grid);
		let filter = 'all';
		let showAll = false;
		let query = '';
		const more = $(`[data-load-more="${grid.id}"]`);
		const empty = $(`[data-empty="${grid.id}"]`);
		const apply = () => {
			let shown = 0;
			items.forEach((el) => {
				const match = (filter === 'all' || (el.dataset.genre || '').split(' ').includes(filter))
					&& (!query || (el.dataset.title || el.textContent).toLowerCase().includes(query));
				const visible = match && (showAll || filter !== 'all' || shown < +(grid.dataset.limit || 1e9));
				if (match) shown++;
				el.hidden = !visible;
			});
			if (more) more.hidden = showAll || filter !== 'all' || items.length <= +(grid.dataset.limit || 1e9);
			if (empty) empty.hidden = shown > 0;
		};
		$$('[data-filter]', group).forEach((chip) => chip.addEventListener('click', () => {
			$$('[data-filter]', group).forEach((c) => c.classList.toggle('is-active', c === chip));
			filter = chip.dataset.filter;
			// a dropdown shows the picked option; other chips reset it
			$$('[data-filter-label]', group).forEach((l) => (l.textContent = chip.closest('.dropdown') ? chip.textContent : l.dataset.filterLabel));
			apply();
		}));
		$(`[data-search="${grid.id}"]`)?.addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); apply(); });
		$$(`[data-view="${grid.id}"] [data-view-mode]`).forEach((b) => b.addEventListener('click', () => {
			$$(`[data-view="${grid.id}"] [data-view-mode]`).forEach((o) => o.classList.toggle('is-active', o === b));
			grid.classList.toggle('is-list', b.dataset.viewMode === 'list');
		}));
		// a link elsewhere on the page can pick a chip, e.g. the hero "Following" button
		$$('[data-filter-jump]').forEach((a) => a.addEventListener('click', () => $(`[data-filter="${a.dataset.filterJump}"]`, group)?.click()));
		more?.addEventListener('click', () => { showAll = true; apply(); });
		$$(`[data-sort="${grid.id}"] [data-sort-by]`).forEach((opt) => opt.addEventListener('click', (e) => {
			e.preventDefault();
			const by = opt.dataset.sortBy;
			const key = (el) => (by === 'title' ? el.dataset.title : -(+el.dataset[by] || 0));
			items.sort((a, b) => (key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0)).forEach((el) => grid.appendChild(el));
			const label = $(`[data-sort="${grid.id}"] [data-sort-label]`);
			if (label) label.textContent = opt.textContent;
			$$(`[data-sort="${grid.id}"] [data-sort-by]`).forEach((o) => o.classList.toggle('active', o === opt));
			apply();
		}));
		apply();
	});

	/* Card carousel: [data-carousel] with a scrolling track, arrows and dots */
	$$('[data-carousel]').forEach((car) => {
		const track = $('.ms-carousel-track', car);
		const dotsBox = $('.ms-carousel-dots', car);
		const pages = () => Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
		const page = () => Math.round(track.scrollLeft / track.clientWidth);
		const goTo = (n) => track.scrollTo({ left: n * track.clientWidth });
		if (dotsBox) {
			dotsBox.innerHTML = Array.from({ length: pages() }, (_, n) => `<button aria-label="Page ${n + 1}"></button>`).join('');
			$$('button', dotsBox).forEach((d, n) => d.addEventListener('click', () => goTo(n)));
		}
		const update = () => {
			const p = page();
			$$('button', dotsBox || car).forEach((d, n) => dotsBox && d.classList.toggle('is-active', n === p));
			const prev = $('[data-carousel-dir="-1"]', car);
			const next = $('[data-carousel-dir="1"]', car);
			if (prev) prev.disabled = track.scrollLeft <= 2;
			if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
		};
		$$('[data-carousel-dir]', car).forEach((b) => b.addEventListener('click', () => goTo(page() + +b.dataset.carouselDir)));
		track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
		update();
	});

	/* Search results page -------------------------------------------
	   Shows ?q= in the heading; chips and the Content Type checkboxes
	   pick which result sections ([data-result]) are shown. */
	const srInput = $('[data-search-input]');
	if (srInput) {
		const q = new URLSearchParams(location.search).get('q');
		if (q) {
			srInput.value = q;
			setAll('[data-search-query]', 'textContent', q);
			document.title = `${q} - Search - Miraculous`;
		}
		$('[data-search-clear]')?.addEventListener('click', () => { srInput.value = ''; srInput.focus(); });

		const sections = $$('[data-result]');
		const chips = $$('[data-search-type]');
		const checks = $$('[data-search-check]');
		const empty = $('[data-sr-empty]');
		let picked = new Set(['all']);
		const show = () => {
			const all = picked.has('all');
			sections.forEach((s) => (s.hidden = !all && !s.dataset.result.split(' ').some((k) => picked.has(k))));
			chips.forEach((c) => c.classList.toggle('is-active', picked.size === 1 && picked.has(c.dataset.searchType)));
			checks.forEach((c) => (c.checked = picked.has(c.dataset.searchCheck)));
			if (empty) empty.hidden = sections.some((s) => !s.hidden);
		};
		chips.forEach((c) => c.addEventListener('click', () => { picked = new Set([c.dataset.searchType]); show(); }));
		checks.forEach((c) => c.addEventListener('change', () => {
			const k = c.dataset.searchCheck;
			if (k === 'all') picked = new Set(['all']);
			else {
				picked.delete('all');
				c.checked ? picked.add(k) : picked.delete(k);
				if (!picked.size) picked.add('all');
			}
			show();
		}));
		show();
	}

	/* Store: product type tabs (top row + side tiles) filter every
	   [data-store-item]; a section with nothing left is hidden. */
	const storeTabs = $$('[data-store-tab]');
	if (storeTabs.length) {
		const storeEmpty = $('[data-store-empty]');
		storeTabs.forEach((tab) => tab.addEventListener('click', () => {
			const kind = tab.dataset.storeTab;
			storeTabs.forEach((t) => t.classList.toggle('is-active', t.dataset.storeTab === kind && (kind !== 'all' || t.classList.contains('ms-store-tab'))));
			$$('[data-store-item]').forEach((item) => (item.hidden = kind !== 'all' && !item.dataset.storeItem.split(' ').includes(kind)));
			$$('.ms-store-sec, .ms-store-promos').forEach((sec) => (sec.hidden = !$$('[data-store-item]', sec).some((i) => !i.hidden)));
			if (storeEmpty) storeEmpty.hidden = $$('[data-store-item]').some((i) => !i.hidden);
			if (tab.closest('.ms-rightbar')) $('.ms-store-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}));
	}

	/* Song tables (Liked Songs, History, Downloads): view chips,
	   search, date range, remove / clear with undo, sort by date and
	   pagination. Options on [data-liked]: data-per, data-noun,
	   data-now (YYYY-MM-DD), data-undo-text, data-clear-text. */
	const liked = $('[data-liked]');
	if (liked) {
		const body = $('.ms-lk-body', liked);
		const rows = $$('.ms-lk-row', liked);
		const pagesBox = $('[data-lk-pages]', liked);
		const info = $('[data-lk-info]', liked);
		const empty = $('[data-lk-empty]', liked);
		const undoBar = $('[data-lk-undo]');
		const PER = +(liked.dataset.per || 12);
		const noun = liked.dataset.noun || 'songs';
		let order = rows.slice();
		let page = 0;
		let query = '';
		let minDate = '';
		let newest = true;
		let lastRemoved = [];
		let undoTimer;
		const showUndo = (text) => {
			$('span', undoBar).textContent = text;
			undoBar.hidden = false;
			clearTimeout(undoTimer);
			undoTimer = setTimeout(() => (undoBar.hidden = true), 5000);
		};

		const render = () => {
			const list = order.filter((r) => !r.dataset.removed && (!query || r.dataset.title.includes(query)) && (!minDate || r.dataset.date >= minDate));
			const pages = Math.max(1, Math.ceil(list.length / PER));
			page = Math.min(page, pages - 1);
			rows.forEach((r) => (r.hidden = true));
			list.forEach((r, i) => {
				body.appendChild(r);
				$('.ms-lk-num', r).textContent = i + 1;
				r.hidden = i < page * PER || i >= (page + 1) * PER;
			});
			if (empty) empty.hidden = list.length > 0;
			const from = list.length ? page * PER + 1 : 0;
			info.textContent = `Showing ${from}–${Math.min((page + 1) * PER, list.length)} of ${list.length} ${noun}`;
			pagesBox.innerHTML = `<button data-page="prev" aria-label="Previous page"${page === 0 ? ' disabled' : ''}><i class="ri-arrow-left-s-line"></i></button>`
				+ Array.from({ length: pages }, (_, i) => `<button data-page="${i}"${i === page ? ' class="is-active" aria-current="page"' : ''}>${i + 1}</button>`).join('')
				+ `<button data-page="next" aria-label="Next page"${page >= pages - 1 ? ' disabled' : ''}><i class="ri-arrow-right-s-line"></i></button>`;
		};
		pagesBox.addEventListener('click', (e) => {
			const b = e.target.closest('[data-page]');
			if (!b || b.disabled) return;
			page = b.dataset.page === 'prev' ? page - 1 : b.dataset.page === 'next' ? page + 1 : +b.dataset.page;
			render();
			liked.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
		$('[data-lk-search]')?.addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); page = 0; render(); });
		$('[data-lk-sort]', liked)?.addEventListener('click', () => {
			newest = !newest;
			order.sort((a, b) => (newest ? b.dataset.date.localeCompare(a.dataset.date) : a.dataset.date.localeCompare(b.dataset.date)));
			$('[data-lk-sort-icon]', liked).className = newest ? 'ri-arrow-down-line' : 'ri-arrow-up-line';
			page = 0;
			render();
		});
		liked.addEventListener('click', (e) => {
			const heart = e.target.closest('[data-unlike]');
			if (!heart) return;
			e.stopPropagation();
			const row = heart.closest('.ms-lk-row');
			row.dataset.removed = '1';
			lastRemoved = [row];
			render();
			showUndo(liked.dataset.undoText || 'Removed from Liked Songs');
		});
		$$('[data-lk-clear]').forEach((btn) => btn.addEventListener('click', () => {
			lastRemoved = rows.filter((r) => !r.dataset.removed);
			lastRemoved.forEach((r) => (r.dataset.removed = '1'));
			render();
			showUndo(liked.dataset.clearText || 'List cleared');
		}));
		$('button', undoBar)?.addEventListener('click', () => {
			lastRemoved.forEach((r) => delete r.dataset.removed);
			lastRemoved = [];
			undoBar.hidden = true;
			render();
		});
		// date range menu (e.g. Last 7 / 30 days), counted back from data-now
		$$('[data-lk-range]').forEach((opt) => opt.addEventListener('click', () => {
			const days = +opt.dataset.lkRange;
			if (days) {
				const d = new Date(`${liked.dataset.now}T12:00:00`);
				d.setDate(d.getDate() - days + 1);
				minDate = d.toISOString().slice(0, 10);
			} else minDate = '';
			setAll('[data-lk-range-label]', 'textContent', opt.textContent);
			$$('[data-lk-range]').forEach((o) => o.classList.toggle('active', o === opt));
			page = 0;
			render();
		}));
		$('[data-lk-range].active')?.click();
		// chips switch between the songs table and the albums / artists / genres views
		$$('[data-lk-view]').forEach((chip) => chip.addEventListener('click', () => {
			$$('[data-lk-view]').forEach((c) => c.classList.toggle('is-active', c === chip));
			const view = chip.dataset.lkView === 'all' ? 'songs' : chip.dataset.lkView;
			$$('[data-lk-pane]', liked).forEach((p) => (p.hidden = p.dataset.lkPane !== view));
		}));
		render();
	}

	/* Listening activity card: tabs swap the bar heights and the stats
	   (data-bars = 7 comma-separated values 0-100, data-stats = a|b|c). */
	$$('[data-activity]').forEach((card) => {
		const bars = $$('.ms-act-day', card);
		const stats = $$('[data-act-stat]', card);
		const tabs = $$('[data-act-tab]', card);
		const apply = (tab) => {
			tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
			tab.dataset.bars.split(',').forEach((v, i) => bars[i]?.style.setProperty('--v', v));
			tab.dataset.stats.split('|').forEach((v, i) => { if (stats[i]) stats[i].textContent = v; });
		};
		tabs.forEach((t) => t.addEventListener('click', () => apply(t)));
		apply(tabs.find((t) => t.classList.contains('is-active')) || tabs[0]);
	});
	// settings switches confirm the change
	// a link outside the settings nav can open one of its tabs, e.g. "Manage Plan"
	$$('[data-tab-jump]').forEach((a) => a.addEventListener('click', (e) => {
		const btn = $(`[data-bs-target="${a.dataset.tabJump}"]`);
		if (!btn) return;
		e.preventDefault();
		btn.click();
		btn.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
	}));
	$$('[data-switch-toast]').forEach((input) => input.addEventListener('change', () => toast(`${input.dataset.switchToast} ${input.checked ? 'on' : 'off'}`)));

	/* Create playlist form ------------------------------------------
	   Character counters, cover preview, mood chips, picking songs
	   (with a running count), song search and a friendly submit. */
	const cpForm = $('[data-create-playlist]');
	if (cpForm) {
		$$('[data-count]', cpForm).forEach((field) => {
			const out = document.getElementById(field.dataset.count);
			const update = () => { if (out) out.textContent = field.value.length; };
			field.addEventListener('input', update);
			update();
		});
		const coverInput = $('[data-cover-input]', cpForm);
		coverInput?.addEventListener('change', () => {
			const file = coverInput.files[0];
			if (file) $('[data-cover-preview]', cpForm).src = URL.createObjectURL(file);
		});
		$$('[data-chip-toggle]', cpForm).forEach((chip) => chip.addEventListener('click', () => chip.classList.toggle('is-active')));

		const countOut = $('[data-pick-count]');
		const picks = $$('[data-pick]', cpForm);
		picks.forEach((btn) => btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const on = btn.classList.toggle('is-active');
			$('i', btn).className = on ? 'ri-check-line' : 'ri-add-line';
			if (countOut) countOut.textContent = picks.filter((b) => b.classList.contains('is-active')).length;
		}));
		const pickSearch = $('[data-pick-search]', cpForm);
		const pickEmpty = $('[data-pick-empty]', cpForm);
		pickSearch?.addEventListener('input', () => {
			const q = pickSearch.value.trim().toLowerCase();
			let shown = 0;
			$$('.ms-pick-row', cpForm).forEach((row) => {
				row.hidden = q && !row.dataset.title.toLowerCase().includes(q);
				if (!row.hidden) shown++;
			});
			if (pickEmpty) pickEmpty.hidden = shown > 0;
		});
		cpForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = $('[data-cp-name]', cpForm);
			if (!name.value.trim()) { toast('Please give your playlist a name'); name.focus(); return; }
			const n = picks.filter((b) => b.classList.contains('is-active')).length;
			toast(`Playlist “${name.value.trim()}” created with ${n} song${n === 1 ? '' : 's'}`);
		});
	}

	/* Blog article: comment likes, reply, post comment, newsletter, contents highlight */
	document.addEventListener('click', (e) => {
		const like = e.target.closest('[data-like-count]');
		if (like) {
			const on = like.classList.toggle('is-active');
			const n = $('span', like);
			$('i', like).className = on ? 'ri-heart-3-fill' : 'ri-heart-3-line';
			n.textContent = String(Number(n.textContent) + (on ? 1 : -1));
			return;
		}
		const reply = e.target.closest('[data-reply]');
		if (reply) {
			const box = $('[data-comment-form] textarea');
			if (!box) return;
			box.value = `@${reply.dataset.reply} `;
			box.closest('form').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
			box.focus({ preventScroll: true });
		}
	});

	const commentForm = $('[data-comment-form]');
	if (commentForm) {
		const list = $('[data-comment-list]');
		const count = $$('[data-comment-count]');
		const msg = $('[data-comment-msg]', commentForm);
		const say = (text, ok) => { msg.textContent = text; msg.className = `ms-bs-form-msg ${ok ? 'is-ok' : 'is-error'}`; };
		const esc = (v) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
		commentForm.addEventListener('input', (e) => e.target.closest('.ms-bs-input')?.classList.remove('is-error'));
		commentForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const f = commentForm.elements;
			const bad = (el, text) => { el.closest('.ms-bs-input').classList.add('is-error'); el.focus(); say(text, false); };
			if (!f.name.value.trim()) return bad(f.name, 'Please enter your name.');
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) return bad(f.email, 'Please enter a valid email.');
			if (f.comment.value.trim().length < 3) return bad(f.comment, 'Please write a comment.');
			const li = document.createElement('li');
			li.className = 'ms-bs-comment is-new';
			li.innerHTML = `<img src="${avatarSrc()}" data-avatar="1" alt="Your profile photo" width="40" height="40"><div><h4>${esc(f.name.value.trim())} <small>Just now</small></h4><p>${esc(f.comment.value.trim())}</p><button type="button" data-reply="${esc(f.name.value.trim())}">Reply</button></div><button type="button" class="ms-bs-clike" data-like-count aria-label="Like comment"><i class="ri-heart-3-line"></i><span>0</span></button>`;
			list.append(li);
			count.forEach((c) => (c.textContent = String(list.children.length)));
			f.comment.value = '';
			say('Thanks! Your comment is posted.', true);
			toast('Comment posted');
		});
	}

	const news = $('[data-newsletter]');
	if (news) {
		news.addEventListener('submit', (e) => {
			e.preventDefault();
			const email = news.elements.email;
			const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
			news.classList.toggle('is-error', !ok);
			if (!ok) { email.focus(); toast('Please enter a valid email address'); return; }
			email.value = '';
			toast('You are subscribed. Welcome aboard!');
		});
	}

	const toc = $('[data-toc]');
	if (toc && 'IntersectionObserver' in window) {
		const links = $$('a', toc);
		const heads = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
		const mark = (id) => links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
		const spy = new IntersectionObserver((entries) => {
			entries.forEach((en) => { if (en.isIntersecting) mark(en.target.id); });
		}, { rootMargin: '-15% 0px -70% 0px' });
		heads.forEach((h) => spy.observe(h));
		toc.addEventListener('click', (e) => { const a = e.target.closest('a'); if (a) mark(a.getAttribute('href').slice(1)); });
	}
	/* Profile photo (demo) ------------------------------------------
	   Change Photo: pick an image, it shows everywhere the avatar is used and is
	   remembered in this browser only (localStorage). Remove goes back to the default. */
	const AVATAR_KEY = 'ms-avatar';
	const AVATAR_DEFAULT = 'https://dummyimage.com/300x300';
	function avatarSrc() {
		try { return localStorage.getItem(AVATAR_KEY) || AVATAR_DEFAULT; } catch (e) { return AVATAR_DEFAULT; }
	}
	function applyAvatar(src = avatarSrc()) {
		$$('img[data-avatar]').forEach((img) => { img.dataset.avatar = '1'; img.src = src; });
	}
	applyAvatar();
	if ($('[data-avatar-change]')) {
		const picker = document.createElement('input');
		picker.type = 'file';
		picker.accept = 'image/*';
		picker.hidden = true;
		document.body.append(picker);
		// centre-crop to a 300px square so the saved photo stays small
		const squareAvatar = (file) => new Promise((resolve, reject) => {
			const url = URL.createObjectURL(file);
			const img = new Image();
			img.onload = () => {
				const side = Math.min(img.width, img.height);
				const canvas = document.createElement('canvas');
				canvas.width = canvas.height = 300;
				canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 300, 300);
				URL.revokeObjectURL(url);
				resolve(canvas.toDataURL('image/jpeg', 0.85));
			};
			img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('unreadable')); };
			img.src = url;
		});
		picker.addEventListener('change', () => {
			const file = picker.files[0];
			picker.value = '';
			if (!file) return;
			if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) { toast('Please choose an image under 8 MB'); return; }
			squareAvatar(file).then((data) => {
				let saved = true;
				try { localStorage.setItem(AVATAR_KEY, data); } catch (e) { saved = false; }
				applyAvatar(data);
				toast(saved ? 'Profile photo updated' : 'Photo shown for this visit only');
			}).catch(() => toast('That image could not be read'));
		});
		document.addEventListener('click', (e) => {
			if (e.target.closest('[data-avatar-change]')) picker.click();
			if (e.target.closest('[data-avatar-remove]')) {
				try { localStorage.removeItem(AVATAR_KEY); } catch (err) {}
				applyAvatar(AVATAR_DEFAULT);
				toast('Profile photo removed');
			}
		});
		document.addEventListener('keydown', (e) => {
			const el = e.target.closest?.('[data-avatar-change][role="button"]');
			if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); picker.click(); }
		});
	}
})();

/* Click effect (opt-in per page): sound-wave rings + a floating note where you click.
   Switch it on with <html data-click-fx> (empty areas only, buttons/links/fields stay calm)
   or <html data-click-fx="all"> (every click). Skipped for reduced-motion. Styles: .ms-cur-* in style.css */
(function () {
	'use strict';
	const root = document.documentElement;
	if (!root.hasAttribute('data-click-fx')) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	const everything = root.dataset.clickFx === 'all';
	const SKIP = 'input, textarea, select, label, [contenteditable]';
	const CONTROLS = 'a, button, [role="button"], [data-play], [data-card], .ms-player, .dropdown-menu, .offcanvas, .modal, .ms-sheet';
	let flip = false;
	let lastType = 'mouse';
	const burst = (e) => {
		const t = e.target;
		if (!(t instanceof Element) || t.closest(SKIP) || (!everything && t.closest(CONTROLS))) return;
		const x = e.clientX + 'px', y = e.clientY + 'px';
		const wave = document.createElement('span');
		wave.className = 'ms-cur-wave';
		wave.style.left = x; wave.style.top = y;
		const note = document.createElement('img');
		flip = !flip;
		note.src = 'assets/images/category/note-' + (flip ? 'single' : 'double') + '.svg';
		note.alt = '';
		note.className = 'ms-cur-note';
		note.style.left = x; note.style.top = y;
		note.style.setProperty('--dx', (Math.random() * 40 - 20).toFixed(0) + 'px');
		note.style.setProperty('--r', (Math.random() * 50 - 25).toFixed(0) + 'deg');
		document.body.append(wave, note);
		wave.addEventListener('animationend', () => wave.remove());
		note.addEventListener('animationend', () => note.remove());
	};
	/* mouse / pen: on press. touch: only on a real tap (a click), so starting a scroll with a finger does not fire it */
	document.addEventListener('pointerdown', (e) => {
		lastType = e.pointerType || 'mouse';
		if (lastType !== 'touch' && e.button === 0) burst(e);
	});
	document.addEventListener('click', (e) => { if (lastType === 'touch') burst(e); });
})();
