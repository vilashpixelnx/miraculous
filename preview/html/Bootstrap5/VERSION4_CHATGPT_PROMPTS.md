# Miraculous v4 — ChatGPT Design Prompt Pack

## Project ki samajh (summary)

**Miraculous – Online Music Store HTML Template** (ThemeForest). Spotify + Apple Music + Bandcamp-style music streaming & music store website.

| Version | Look | Layout | Pages |
|---|---|---|---|
| v1 | Dark navy `#1b2039` + cyan `#3bc8e7` | 80px icon sidebar, sliders, footer | 22 |
| v2 | Light white + coral `#ff4865` | Same as v1, light theme | 22 |
| v3 | Deep navy `rgb(12,27,44)` + magenta, compact | 225px text sidebar ("Browse Music / Your Music"), "Hello, David" header, list-heavy, no footer | 11 (+ new `music.html`) |

Common elements across all versions: left sidebar nav, top header with search ("Search Music Here..") + language selector + login/register popups, sticky bottom audio player (jPlayer) with queue panel ("clear / save playlist"), loader, Poppins font, Bootstrap 3 + jQuery + Swiper.

**v4 ka goal:** v1/v2/v3 se bilkul alag, 2026 premium identity — sirf recolor nahi.

---

## STEP 1 — Master prompt (sabse pehle, ek baar)

> v1, v2, v3 ke 2–3 screenshots attach karke ye paste karo.

```
Act as a world-class product designer (Awwwards / Apple Design Award level) specializing in premium music & media products in 2026.

CONTEXT
"Miraculous" is an HTML template sold on ThemeForest: a music streaming + online music store website (stream, buy, download, upload music, live radio, playlists, blog). Attached are screenshots of Version 1 (dark navy + cyan), Version 2 (light + coral) and Version 3 (deep navy + magenta, compact sidebar). I need VERSION 4: a completely new, premium, trend-setting design that must look clearly different from all three, so buyers see it as a new product. Keep the same features and content, reinvent everything visual.

STEP 1 — Before designing any page, propose 3 distinct creative directions. For each give: concept name, one-line mood, color palette (hex), font pairing, signature visual element, and why it sells on ThemeForest in 2026. Example directions to consider (do not just copy): "Aurora Glass" (dark, mesh gradients, frosted glass), "Editorial Vinyl" (big serif typography, warm off-black, magazine layouts), "Neon Bento" (bento grids, electric accent, playful 3D). Wait for me to pick one.

STEP 2 — After I choose, create the full V4 DESIGN SYSTEM:
- Color tokens: background, 3 surface levels, border, primary, secondary, accent gradient, text primary/secondary/muted, success/warning/error — dark mode AND light mode
- Typography: display + body font (Google Fonts or free variable fonts), full type scale (Display, H1–H6, body, caption) with sizes/weights/line-heights
- Spacing (8px grid), radius scale, shadow/elevation scale, blur levels, gradients
- Grid: 1440px desktop, 1024 tablet, 390 mobile
- Components: buttons (primary/secondary/ghost/icon/play), inputs, search, select, toggles, tabs, chips/tags, badges (NEW, LIVE, HOT, PREMIUM), track row, album card, artist card (circular), playlist card, genre tile, radio station card, blog card, pricing card, modal, toast, dropdown, pagination, skeleton loader, empty state
- Iconography style (e.g. Phosphor / Lucide, 1.5px stroke)
- Motion rules: hover, page transition, now-playing equalizer animation

GLOBAL LAYOUT (used on every page)
- Navigation: replace old heavy sidebar with a modern collapsible sidebar or floating icon rail. Groups: "Discover" (Home, Albums, Artists, Genres, Top Tracks, Radio, Free Music, Featured Playlists) and "Your Library" (Favourites, History, Downloads, Purchased, Playlists, Upload). Create Playlist button at bottom.
- Top bar: big search with Ctrl+K command palette, language selector, notifications, upgrade-to-premium CTA, user avatar menu ("Hello, David").
- Player: floating glass pill player at bottom — cover, title/artist, like, prev/play/next, shuffle/repeat, seek bar with waveform, time, volume, queue, lyrics, full-screen button. Expands into full-screen "Now Playing" with dynamic color background from album art, synced lyrics and queue.
- Mobile: bottom tab bar (Home, Search, Library, Profile) + mini player above it.

QUALITY RULES
- Premium ThemeForest-ready: pixel-perfect alignment, consistent spacing, realistic content (real-looking album art, artist photos, track names, durations, prices), no lorem ipsum in headings
- WCAG AA contrast, clear hover/active/focus states
- Every page must reuse the same design system — consistency is the top priority
- Output each page as a high-fidelity desktop UI mockup (1440px wide, full page), then the mobile version when I ask

Start with STEP 1 now.
```

---

## STEP 2 — Har page ka prompt (ek-ek karke bhejo)

> Har prompt ke start me ye line lagao:
> **"Using exactly the same V4 design system, sidebar, top bar and player as the Home page, design the ___ page (1440px desktop, full page, high fidelity):"**

### 1. Home (`index.html`)
```
Sections in order:
1. Immersive hero: featured album "Record Breaking Albums!" — huge album art, animated gradient glow, artist name, Play Now + Add to Library buttons, small carousel dots for 3 hero slides
2. "Recently Played" — horizontal scroll row of album cards with hover play button
3. "Weekly Top 15" — numbered chart list (01–15) in 3 columns: cover, title, artist, duration, more menu; top 3 highlighted
4. "New Releases" — wide card slider with release date and NEW badge
5. "Featured Artists" — circular artist avatars with follower count + follow button
6. "Featured Albums" — bento grid (1 large + 4 small)
7. "Top Genres" — colorful genre tiles (Romantic, Dance, Workout, Classical, Hip-Hop, Pop) with tilted cover art
8. "Live Radio" — station cards with LIVE pulse badge and listener count
9. "This Month's" trending row
10. Premium CTA banner + "Download Our App" (App Store / Google Play, phone mockup)
11. Footer: logo, about, newsletter subscribe, contact info, social links, quick links, copyright
```

### 2. Albums (`album.html`)
```
Page header "Albums" with filter chips (All, Trending, New, Top Rated, by Genre, by Year) and sort dropdown + grid/list toggle.
Sections: "Trending Albums" slider, "Newly Released Albums" grid, "Top 15 Albums" ranked list, "Albums By Artists" grouped rows, "Recommended Albums", "Live Radio" strip at bottom. Pagination / load more.
```

### 3. Album Single (`album_single.html`)
```
Album "Dream Your Moments" by Frank Adler.
- Hero: large cover with color-extracted gradient background, ALBUM label, title, artist avatar + name, year, 12 songs, total duration, price.
- Action bar: big Play, Shuffle, Like, Download, Buy Album ($), Share, more.
- Tracklist table: #, title + featured artists, plays, duration, like, download, buy-track price, more. Currently playing row shows animated equalizer.
- Album credits/description, release info.
- "More from Frank Adler", "Newly Released Albums" rows.
- "Leave A Comment" section: comment list with avatars + form (name, email, comment).
```

### 4. Artists (`artist.html`)
```
Header "Artists" with alphabet filter A–Z and genre chips.
Sections: "Top Artists" spotlight (one huge featured artist + ranking), "Trending Artists" circular avatars grid, "Recommended Artists", "Live Radio" strip. Each artist card: photo, name, monthly listeners, follow button, verified badge.
```

### 5. Artist Single (`artist_single.html`)
```
Artist "Ava Cornish".
- Full-bleed cinematic banner photo with gradient fade, verified badge, name in huge display type, monthly listeners, Play / Follow / Share buttons.
- Tabs: Overview, Songs, Albums, About, Events.
- "Popular" top 10 tracks list with plays and durations.
- Discography row (albums, singles, EPs).
- About card with bio, stats (followers, monthly listeners, world rank), social links, photo gallery.
- "Similar Artists" row, "Live Radio" strip.
```

### 6. Genres (`genres.html`)
```
Header "Browse Genres" with search inside genres.
Big bento grid of "Top Genres" tiles, each with unique gradient, genre name, song count, tilted album art, hover zoom. Include: Romantic, Dance Beats, Workout, Pop, Hip-Hop, Rock, Classical, EDM, Indie, Jazz, Lo-fi, Devotional. "Live Radio" strip below.
```

### 7. Genre Single (`genres_single.html`)
```
Genre "Romantics".
Hero banner with genre gradient, title, description, followers, Play All.
Sub-category rows: "Love At First Sight", "Pure Love", "Romantics" — each a playlist/album card slider. Then "Top Tracks in Romantic" list and "Live Radio" strip.
```

### 8. Stations / Live Radio (`stations.html`)
```
Header "Live Radio" with "Total Channel: 12".
- Featured live station hero with big LIVE badge, animated waveform, listeners count, Tune In button.
- "Discover radio stations by genre": Today's Hit, Pop / Hits, Rock, Classical Music, Dance / Electronic, Comedy Club.
- "Filter radio by location": map-style or chips for California, Colorado, Indiana, North Carolina, Oregon, South Dakota.
- Station cards grid: logo, name, frequency, genre, now playing, listeners.
```

### 9. Top Tracks / Charts (`top_track.html`)
```
Header "Charts".
- "Weekly Top 15" premium chart: rank, rank change arrow (up/down/new), cover, title, artist, album, plays, duration.
- "Trending Tracks" card slider.
- "Top Tracks Of All Time" list with big rank numbers.
- Chart filter: Global / India / Weekly / Monthly. "Live Radio" strip.
```

### 10. Free Music (`free_music.html`)
```
Header "Free Music" with FREE badges.
Sections: "Download Latest" (track cards with download count + download icon), "Download Trending Tracks" list, "Download Albums" grid, "Live Radio" strip. Promo banner: "Go Premium for unlimited high-quality downloads".
```

### 11. Featured Playlists (`feature_playlist.html`)
```
Header "Featured Playlists" with mood chips (Chill, Focus, Party, Workout, Sleep, Romance, Travel).
Masonry/bento playlist cards: collage cover, playlist name, curator, song count, total duration, followers, play on hover. Editorial "Playlist of the Week" hero on top.
```

### 12. Add / Your Playlists (`add_playlist.html`)
```
"Your Playlists" page.
- "Create New Playlist" large dashed card.
- User playlist grid cards with edit/delete/share menus.
- Show "Create Playlist" modal: cover upload, name, description, public/private toggle, Create button.
```

### 13. Favourites (`favourite.html`)
```
"Your Favourites" — heart gradient hero with total liked songs, Play All / Shuffle.
Tabs: Songs, Albums, Artists, Playlists.
Track table with like/unlike, download, more. "Recently Played" row below.
```

### 14. History (`history.html`)
```
"Listening History" — timeline grouped by Today, Yesterday, This Week.
Rows: cover, title, artist, time played, duration, play again. Side card: listening stats (minutes this week, top genre, top artist, small bar chart).
History playlists: Top Trendings, Dance Beats, Heart Broken, International Hits, New Romantic Charts, Workout Time. "Clear History" button.
```

### 15. Downloads (`download.html`)
```
"Downloads" — storage usage bar, quality selector (128/320 kbps/Lossless), Download All.
"Free Downloads" track list with status (downloaded / downloading progress / queued). "Recently Played" row.
```

### 16. Purchased (`purchase.html`)
```
"Purchased Tracks" — order summary cards (total spent, tracks owned, albums owned).
Table: cover, title, artist, purchase date, price, invoice download, Download Now. "Recently Played" row.
Also design a Checkout modal/page: cart items, coupon code, payment methods (card, PayPal, UPI, Apple Pay), order total, Pay Now.
```

### 17. Upload (`upload.html`)
```
"Upload & Share Your Music With The World".
- Big drag-and-drop upload zone with waveform illustration and upload progress state.
- "Track Information" form: Track Name*, Artist's Name*, Select Album, Genre, Select Privacy (Public/Private/Unlisted), cover art upload, lyrics, tags, release date, price (free/paid).
- Upload / Cancel buttons. Side panel: upload guidelines + live preview card of the track.
```

### 18. Profile (`profile.html`)
```
User "Bella Scott".
Profile header: cover banner, avatar with edit, name, PREMIUM badge, followers/following/playlists counts.
"Edit Profile" form: Your Name*, Your Email*, Your Password*, Confirm Password*, bio, country, avatar upload, Save button.
Below: public playlists, top artists this month.
```

### 19. Manage Account (`manage_acc.html`)
```
Settings layout with left tabs: Account Overview, Subscription, Payment Methods, Notifications, Privacy, Devices, Language.
"Account Overview" card (username, email, DOB, country, current plan).
"Subscription Plans": 3 pricing cards — Basic, Standard (most popular, highlighted), Professional — monthly/yearly toggle, features with check icons, CTA buttons.
```

### 20. Blog (`blog.html`)
```
Editorial magazine-style blog. Featured post hero (large image, category tag, title, author, read time).
Grid of blog cards: image, category, title, excerpt, author avatar, date. Category chips, pagination, newsletter box.
```

### 21. Blog Single (`blog_single.html`)
```
Article "Dream Your Moments" by Krystal C. Rahn.
Wide hero image, title, author, date, read time, share bar. Readable 720px article column with pull quotes, embedded track player card, image gallery.
Sidebar: Search, Categories, Feature Posts, tags.
Comments section + comment form (Your Name, Your Email, Your Comments).
```

### 22. Song / Music Single (`music.html` – v3 wala page)
```
Single track page "David Parker Songs (05 Songs)".
Large cover with vinyl record peeking out and spinning on play, title, artists, Play / Like / Download / Add to Playlist.
Synced lyrics panel, song credits, "You may also like" track list.
```

### 23. Popups & States
```
Design these as separate frames:
1. Login modal (email, password, Keep me signed in, Google/Apple/Facebook login, Register link)
2. Register / Sign Up modal (name, email, password, confirm password)
3. Language selection popup (grid of languages with checkboxes: English, Hindi, Punjabi, Tamil, Telugu, Bengali, Marathi, Spanish, etc.)
4. Queue drawer (current song, up next list, clear, save playlist) + "Are you sure you want to clear your queue?" confirm dialog
5. Full-screen Now Playing view with synced lyrics
6. Command palette search (Ctrl+K) with recent searches and results grouped by Songs/Artists/Albums
7. Page loader (branded animation), 404 page, empty states (no favourites, no downloads)
```

### 24. Mobile versions
```
Now create mobile (390px) versions of: Home, Album Single, Artist Single, Now Playing, Library (Favourites), Search. Use bottom tab bar + mini player.
```

---

## Tips — consistency ke liye

1. **Ek chat me hi saare pages banao** — naya chat khologe to style badal jayega.
2. Design system milne ke baad usko copy karke save kar lo. Agar ChatGPT style bhatakne lage, to design system dobara paste karke bolo: *"Strictly follow this design system."*
3. Pehle Home approve karo, phir baaki pages. Har baar likho: *"Same sidebar, top bar and player as Home."*
4. Image ki jagah code chahiye to bolo: *"Now convert this page into responsive HTML + Tailwind CSS (or Bootstrap 5), using the design system as CSS variables."*
5. ThemeForest ke liye: dark + light dono mode ke screenshots banwao — buyers ko 2 skins pasand aate hain.
