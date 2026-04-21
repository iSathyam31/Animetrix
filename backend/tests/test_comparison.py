"""
Module 3 — Anime Comparison Engine
Streamlit test UI

Run from backend/:
    streamlit run tests/test_comparison.py
"""

import asyncio
import os
import sys

import streamlit as st

# ── path setup so imports resolve from backend/ ──────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from app.agents.comparison.runner import compare  # noqa: E402

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Animetrix — Comparison Engine",
    page_icon="⚔️",
    layout="wide",
)

st.title("⚔️ Anime Comparison Engine")
st.caption("Head-to-head analysis powered by MyAnimeList (Jikan) data + Azure OpenAI")

# ── Inputs ────────────────────────────────────────────────────────────────────
col1, col2 = st.columns(2)

with col1:
    subject_a = st.text_input("First Anime", placeholder="e.g. Attack on Titan")
with col2:
    subject_b = st.text_input("Second Anime", placeholder="e.g. Demon Slayer")

run = st.button("⚔️ Compare", use_container_width=True, type="primary")

# ── Run comparison ────────────────────────────────────────────────────────────
if run:
    if not subject_a.strip() or not subject_b.strip():
        st.warning("Please enter both subjects before comparing.")
        st.stop()

    with st.spinner(f"Fetching MAL data and analysing **{subject_a}** vs **{subject_b}**..."):
        try:
            result = asyncio.run(compare(subject_a.strip(), subject_b.strip()))
        except Exception as exc:
            st.error(f"Error: {exc}")
            st.stop()

    # Check for error response from agent
    if "error" in result:
        st.error(result["error"])
        st.stop()

    # ── Header ────────────────────────────────────────────────────────────────
    st.divider()
    h1, vs_col, h2 = st.columns([5, 1, 5])

    meta_a = result.get("meta_a", {})
    meta_b = result.get("meta_b", {})

    def _render_anime_card(title, meta, img_key, score_key, scores):
        if result.get(img_key):
            st.image(result[img_key], width=160)
        st.markdown(f"## {title}")
        # Episode count + year
        eps = meta.get("episodes")
        yr = meta.get("year")
        info_parts = []
        if eps:
            info_parts.append(f"📺 {eps} eps")
        if yr:
            info_parts.append(f"📅 {yr}")
        if info_parts:
            st.caption(" · ".join(info_parts))
        # MAL score
        if scores:
            st.metric("MAL Score", scores.get(score_key, "—"))
        # Genre chips
        genres = meta.get("genres", [])
        if genres:
            st.markdown(" ".join(f"`{g}`" for g in genres))

    with h1:
        _render_anime_card(
            result.get("subject_a", subject_a), meta_a, "image_a", "subject_a",
            result.get("mal_scores")
        )
    with vs_col:
        st.markdown("<h2 style='text-align:center;color:gray;'>VS</h2>", unsafe_allow_html=True)
    with h2:
        _render_anime_card(
            result.get("subject_b", subject_b), meta_b, "image_b", "subject_b",
            result.get("mal_scores")
        )

    st.divider()

    # ── Dimension scores ──────────────────────────────────────────────────────
    st.subheader("📊 Dimension Breakdown")
    dimensions: dict = result.get("dimensions", {})

    for dim_key, dim_data in dimensions.items():
        label = dim_key.replace("_", " ").title()
        score_a = dim_data.get("score_a", 0)
        score_b = dim_data.get("score_b", 0)
        winner = dim_data.get("winner", "Tie")
        reason = dim_data.get("reason", "")

        with st.expander(f"**{label}** — Winner: 🏆 {winner}", expanded=True):
            c1, c2 = st.columns(2)
            with c1:
                st.markdown(f"**{result.get('subject_a', subject_a)}**")
                st.progress(score_a / 10.0, text=f"{score_a:.1f} / 10")
            with c2:
                st.markdown(f"**{result.get('subject_b', subject_b)}**")
                st.progress(score_b / 10.0, text=f"{score_b:.1f} / 10")
            st.caption(reason)

    st.divider()

    # ── Overall winner ────────────────────────────────────────────────────────
    overall = result.get("overall_winner", "Tie")
    st.markdown(f"### 🏆 Overall Winner: **{overall}**")
    st.info(result.get("verdict", ""))

    # ── Best for ──────────────────────────────────────────────────────────────
    st.subheader("🎯 Best For")
    best = result.get("best_for", {})
    bf1, bf2 = st.columns(2)
    with bf1:
        st.markdown(f"**{result.get('subject_a', subject_a)}**")
        st.write(best.get("subject_a", "—"))
    with bf2:
        st.markdown(f"**{result.get('subject_b', subject_b)}**")
        st.write(best.get("subject_b", "—"))

    # ── Raw JSON expander ─────────────────────────────────────────────────────
    with st.expander("🔍 Raw JSON response"):
        st.json(result)
