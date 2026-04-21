"""
Streamlit test app for Module 2 — Image → Character Detection.

Run from the backend/ folder:
    streamlit run tests/test_character_detection.py
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

import streamlit as st

from app.services.character_detection.pipeline import detect_character

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Chibi — Character Detection",
    page_icon="🎌",
    layout="wide",
)

st.title("🎌 Chibi — Anime Character Detection")
st.caption("Module 2 · Upload an anime image and Gemini Vision will identify the character")

st.divider()

# ── Upload ────────────────────────────────────────────────────────────────────
uploaded_file = st.file_uploader(
    "Upload an anime character image",
    type=["jpg", "jpeg", "png", "webp"],
    help="Works best with clear character art, screenshots, or fan art.",
)

if uploaded_file:
    col_img, col_results = st.columns([1, 2])

    with col_img:
        st.image(uploaded_file, caption="Uploaded Image", use_container_width=True)

    with col_results:
        if st.button("🔍 Detect Character", type="primary", use_container_width=True):
            image_bytes = uploaded_file.read()

            with st.spinner("Analyzing image with Gemini Vision..."):
                try:
                    result = asyncio.run(detect_character(image_bytes))
                except Exception as exc:
                    st.error(f"Detection failed: {exc}")
                    st.stop()

            gemini = result

            confidence = gemini.get("confidence", "low")
            confidence_color = {"high": "🟢", "medium": "🟡", "low": "🔴"}.get(confidence, "⚪")
            character_name = gemini.get("character_name", "Unknown")
            anime_title = gemini.get("anime_title", "Unknown")
            visual_traits = gemini.get("visual_traits", [])
            notes = gemini.get("notes", "")

            # ── Header ────────────────────────────────────────────────────────
            st.subheader("🤖 Character Analysis")
            st.markdown(f"## {character_name}")
            st.markdown(f"📺 **Anime / Manga:** {anime_title}")
            st.markdown(f"**Confidence:** {confidence_color} {confidence.capitalize()}")

            st.divider()

            # ── Visual Traits ─────────────────────────────────────────────────
            if visual_traits:
                st.markdown("### 👁️ Visual Traits")
                cols = st.columns(2)
                for i, trait in enumerate(visual_traits):
                    cols[i % 2].markdown(f"- {trait}")

            st.divider()

            # ── Description & Fun Fact ────────────────────────────────────────
            if notes:
                st.markdown("### 📖 Description")
                st.markdown(notes)

                sentences = [s.strip() for s in notes.replace("\u2019", "'").split(".") if s.strip()]
                if sentences:
                    st.divider()
                    st.markdown("### ⚡ Fun Fact")
                    st.info(f'"{sentences[0]}."')
