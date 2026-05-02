"""
Module 4 — Anime Search & Detail
Streamlit test UI

Run from backend/:
    streamlit run tests/test_anime_search.py
"""

import asyncio
import os
import sys

import streamlit as st

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from app.services.anilist.encyclopedia_client import (  # noqa: E402
    get_anime_detail_page,
    search_anime,
)


@st.cache_data(show_spinner=False, ttl=300)
def _search(query: str):
    return asyncio.run(search_anime(query, limit=8))


@st.cache_data(show_spinner=False, ttl=600)
def _detail(mal_id: int):
    return asyncio.run(get_anime_detail_page(mal_id))

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Animetrix — Anime Search",
    page_icon="🔍",
    layout="wide",
)

st.title("🔍 Anime Search & Encyclopedia")
st.caption("Search any anime and explore its full details — powered by MyAnimeList (Jikan)")

# ── Search bar ────────────────────────────────────────────────────────────────
sc1, sc2 = st.columns([6, 1])
with sc1:
    query = st.text_input("Search anime", placeholder="e.g. Attack on Titan, Naruto, Steins Gate...")
with sc2:
    search_clicked = st.button("🔍 Search", use_container_width=True)

if "selected_id" not in st.session_state:
    st.session_state.selected_id = None
if "selected_title" not in st.session_state:
    st.session_state.selected_title = None
if "suggestions" not in st.session_state:
    st.session_state.suggestions = []

# ── Search ────────────────────────────────────────────────────────────────────
if search_clicked and query and len(query) >= 2:
    st.session_state.selected_id = None
    st.session_state.selected_title = None
    with st.spinner("Searching..."):
        st.session_state.suggestions = _search(query)

# ── Suggestions grid ──────────────────────────────────────────────────────────
if st.session_state.suggestions and st.session_state.selected_id is None:
    suggestions = st.session_state.suggestions
    if not suggestions:
        st.info("No results found. Try a different title.")
    else:
        st.markdown("**Select an anime:**")
        cols = st.columns(4)
        for i, s in enumerate(suggestions):
            with cols[i % 4]:
                if s.get("image"):
                    st.image(s["image"], width=120)
                title_display = s.get("title_english") or s.get("title")
                ep_info = f" · {s['episodes']} eps" if s.get("episodes") else ""
                yr_info = f" · {s['year']}" if s.get("year") else ""
                score_info = f" · ⭐ {s['score']}" if s.get("score") else ""
                st.caption(f"{title_display}{ep_info}{yr_info}{score_info}")
                if st.button("View Details", key=f"sel_{s['mal_id']}"):
                    st.session_state.selected_id = s["mal_id"]
                    st.session_state.selected_title = title_display
                    st.session_state.suggestions = []
                    st.rerun()

# ── Back button ───────────────────────────────────────────────────────────────
if st.session_state.selected_id:
    if st.button("← Back to search"):
        st.session_state.selected_id = None
        st.session_state.selected_title = None
        st.rerun()

# ── Detail page ───────────────────────────────────────────────────────────────
if st.session_state.selected_id:
    with st.spinner(f"Loading details for **{st.session_state.selected_title}**..."):
        try:
            page = _detail(st.session_state.selected_id)
        except Exception as exc:
            st.error(f"Error loading details: {exc}")
            st.stop()

    if not page:
        st.error("Could not load anime details. Please try again.")
        st.stop()

    anime = page["anime"]
    characters = page["characters"]
    recommendations = page["recommendations"]
    staff = page["staff"]

    # ── Hero ──────────────────────────────────────────────────────────────────
    st.divider()
    hero_img, hero_info = st.columns([2, 5])

    with hero_img:
        if anime.get("image"):
            st.image(anime["image"], width=220)

    with hero_info:
        title = anime.get("title_english") or anime.get("title")
        st.markdown(f"# {title}")
        if anime.get("title_japanese"):
            st.caption(anime["title_japanese"])

        # Meta row
        meta_parts = []
        if anime.get("type"):        meta_parts.append(f"📺 {anime['type']}")
        if anime.get("episodes"):    meta_parts.append(f"{anime['episodes']} eps")
        if anime.get("year"):        meta_parts.append(f"📅 {anime['year']}")
        if anime.get("season"):      meta_parts.append(anime["season"].title())
        if anime.get("status"):      meta_parts.append(anime["status"])
        if anime.get("duration"):    meta_parts.append(anime["duration"])
        if meta_parts:
            st.markdown("  ·  ".join(meta_parts))

        if anime.get("studios"):
            st.markdown(f"🎬 **Studio:** {', '.join(anime['studios'])}")
        if anime.get("rating"):
            st.markdown(f"🔞 **Rating:** {anime['rating']}")

        # Stats
        st.markdown("---")
        s1, s2, s3, s4, s5 = st.columns(5)
        s1.metric("⭐ MAL Score", anime.get("score") or "—")
        s2.metric("🏆 Rank", f"#{anime['rank']}" if anime.get("rank") else "—")
        s3.metric("📈 Popularity", f"#{anime['popularity']}" if anime.get("popularity") else "—")
        s4.metric("👥 Members", f"{anime['members']:,}" if anime.get("members") else "—")
        s5.metric("❤️ Favorites", f"{anime['favorites']:,}" if anime.get("favorites") else "—")

    # ── Genres & Themes ───────────────────────────────────────────────────────
    all_tags = anime.get("genres", []) + anime.get("themes", []) + anime.get("demographics", [])
    if all_tags:
        st.markdown(" ".join(f"`{t}`" for t in all_tags))

    # ── Synopsis ──────────────────────────────────────────────────────────────
    if anime.get("synopsis"):
        st.divider()
        st.subheader("📖 Synopsis")
        st.write(anime["synopsis"])

    # ── Characters ────────────────────────────────────────────────────────────
    if characters:
        st.divider()
        st.subheader("👥 Characters")
        char_cols = st.columns(len(characters))
        for i, char in enumerate(characters):
            with char_cols[i]:
                if char.get("image"):
                    st.image(char["image"], width=90)
                st.caption(f"**{char['name']}**")
                role_color = "🔴" if char.get("role") == "Main" else "🔵"
                st.caption(f"{role_color} {char.get('role', '')}")

    # ── Staff ─────────────────────────────────────────────────────────────────
    if staff:
        st.divider()
        st.subheader("🎥 Key Staff")
        staff_cols = st.columns(min(len(staff), 5))
        for i, member in enumerate(staff):
            with staff_cols[i % 5]:
                if member.get("image"):
                    st.image(member["image"], width=80)
                st.caption(f"**{member['name']}**")
                st.caption(", ".join(member.get("positions", [])))

    # ── Recommendations ───────────────────────────────────────────────────────
    if recommendations:
        st.divider()
        st.subheader("💡 You Might Also Like")
        rec_cols = st.columns(len(recommendations))
        for i, rec in enumerate(recommendations):
            with rec_cols[i]:
                if rec.get("image"):
                    st.image(rec["image"], width=100)
                st.caption(f"**{rec['title']}**")
                st.caption(f"👍 {rec.get('votes', 0)} votes")
                if st.button("View", key=f"rec_{rec['mal_id']}_{i}"):
                    st.session_state.selected_id = rec["mal_id"]
                    st.session_state.selected_title = rec["title"]
                    st.rerun()

    # ── Background ────────────────────────────────────────────────────────────
    if anime.get("background"):
        with st.expander("📚 Background / Production Notes"):
            st.write(anime["background"])
