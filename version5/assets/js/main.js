/*------------------------------------------------------------------
Template Name: Miraculous - Online Music Store Html Template
Version: 5.0.0 (Aurora Editorial)
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
		{ title: 'Walking Promises', artist: 'Ava Cornish', cover: 'assets/images/trending/01.jpg', time: '04:16', src: 'https://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3' },
		{ title: 'Until I Met You', artist: 'Brian Hill', cover: 'assets/images/trending/02.jpg', time: '03:58', src: 'https://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3' },
		{ title: 'Gimme Some Courage', artist: 'Ava Cornish', cover: 'assets/images/trending/03.jpg', time: '04:21', src: 'https://www.jplayer.org/audio/mp3/TSP-07-Cybersonnet.mp3' },
		{ title: 'Dark Alley Acoustic', artist: 'Kevin Buckland', cover: 'assets/images/trending/04.jpg', time: '03:47', src: 'https://www.jplayer.org/audio/mp3/TSP-05-Your_face.mp3' },
		{ title: 'Echoes of You', artist: 'Claire Hudson', cover: 'assets/images/hero/album-echoes.jpg', time: '04:28', src: 'https://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3' },
		{ title: 'Heart Broken', artist: 'Kevin Buckland', cover: 'assets/images/release/01.jpg', time: '03:36', src: 'https://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3' },
		{ title: 'Cloud Nine', artist: 'Brian Hill', cover: 'assets/images/release/02.jpg', time: '04:05', src: 'https://www.jplayer.org/audio/mp3/Miaow-04-Lismore.mp3' },
		{ title: 'Golden Hour', artist: 'Claire Hudson', cover: 'assets/images/release/03.jpg', time: '04:16', src: 'https://www.jplayer.org/audio/mp3/Miaow-05-The-separation.mp3' },
		{ title: 'Paper Hearts', artist: 'David Parker', cover: 'assets/images/release/04.jpg', time: '03:52', src: 'https://www.jplayer.org/audio/mp3/Miaow-06-Beside-me.mp3' },
		{ title: 'Slow Mornings', artist: 'Anna Ellison', cover: 'assets/images/release/05.jpg', time: '04:10', src: 'https://www.jplayer.org/audio/mp3/Miaow-07-Bubble.mp3' },
		{ title: 'Velvet Sky', artist: 'Max Glover', cover: 'assets/images/release/06.jpg', time: '03:44', src: 'https://www.jplayer.org/audio/mp3/Miaow-08-Stirring-of-a-fool.mp3' },
		{ title: 'Quiet Rivers', artist: 'Anna Ellison', cover: 'assets/images/store/01.jpg', time: '04:02', src: 'https://www.jplayer.org/audio/mp3/Miaow-09-Partir.mp3' },
		{ title: 'The Heartbeat Steps', artist: 'Ava Cornish', cover: 'assets/images/recommend/03.jpg', time: '03:49', src: 'https://www.jplayer.org/audio/mp3/Miaow-10-Thin-ice.mp3' },
		{ title: 'One More Stranger', artist: 'Ava Cornish', cover: 'assets/images/trending/04.jpg', time: '04:12', src: 'https://www.jplayer.org/audio/mp3/TSP-02-Pin.mp3' },
		{ title: 'Endless Things', artist: 'Ava Cornish', cover: 'assets/images/release/06.jpg', time: '03:57', src: 'https://www.jplayer.org/audio/mp3/TSP-03-Daydream.mp3' }
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
		// TEMP: autoplay off while testing — set HERO_AUTOPLAY = true to turn it back on
		const HERO_AUTOPLAY = false;
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
			toast(added ? 'Added to cart' : 'Removed from cart');
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
	const npPanel = $('.ms-np');

	// fill every element matching sel (pages without the right panel just skip it)
	const setAll = (sel, prop, value) => $$(sel).forEach((el) => (el[prop] = value));

	function renderTrack(animate) {
		const t = TRACKS[state.index];
		setAll('#msPlayerCover, #msNpCover', 'src', t.cover);
		setAll('#msPlayerTitle, #msNpTitle', 'textContent', t.title);
		setAll('#msPlayerArtist, #msNpArtist', 'textContent', t.artist);
		setAll('#msNpDuration', 'textContent', audio.src && isFinite(audio.duration) ? fmt(audio.duration) : t.time);
		if (animate) {
			[player, npPanel].forEach((el) => {
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
	};

	audio.addEventListener('play', syncPlayState);
	audio.addEventListener('pause', syncPlayState);
	audio.addEventListener('timeupdate', () => {
		$$('[data-time-current]').forEach((el) => (el.textContent = fmt(audio.currentTime)));
		setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
	});
	audio.addEventListener('loadedmetadata', () => {
		setAll('#msNpDuration', 'textContent', fmt(audio.duration));
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

	// Hide / show the bottom bar (remembered across pages)
	const playerToggle = $('#msPlayerToggle');
	const syncPlayerToggle = () => {
		const hidden = document.documentElement.classList.contains('player-hidden');
		playerToggle.setAttribute('aria-label', hidden ? 'Show player' : 'Hide player');
		playerToggle.setAttribute('aria-expanded', hidden ? 'false' : 'true');
	};
	if (playerToggle) {
		syncPlayerToggle();
		playerToggle.addEventListener('click', () => {
			const hidden = document.documentElement.classList.toggle('player-hidden');
			try { localStorage.setItem('ms-player-hidden', hidden ? '1' : '0'); } catch (e) {}
			syncPlayerToggle();
		});
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
					<div class="ms-track-cover"><img src="${t.cover}" alt=""><i class="ri-play-fill"></i></div>
					<div class="ms-track-info"><h4>${t.title}</h4><p>${t.artist}</p></div>
					${i === state.index && !audio.paused ? eq : ''}
				</div>`).join('');
		}
		const side = $('#msSideQueue');
		if (side) {
			side.innerHTML = TRACKS.map((t, i) => `
				<div class="ms-qrow${i === state.index ? ' is-playing' : ''}" data-play="${i}">
					<div class="ms-track-cover"><img src="${t.cover}" alt=""><i class="ri-play-fill"></i></div>
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
	} else {
		// demo state: show the bar partly played until the first real playback
		setProgress(0.7);
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
})();
