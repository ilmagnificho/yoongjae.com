/**
 * Backgrounds - CSS gradient-based pixel backgrounds per scene
 * Will be replaced with Canvas pixel art in Stage 3B
 */
const Backgrounds = (() => {
  const SCENES = {
    campus: {
      gradient: 'linear-gradient(180deg, #1a3a2a 0%, #2a5a3a 30%, #3a7a4a 60%, #4a6a3a 80%, #2a3a2a 100%)',
      elements: '🏛️ 🌳 📚',
      label: 'Columbus University',
    },
    sf_office: {
      gradient: 'linear-gradient(180deg, #1a1a3e 0%, #2a2a4e 40%, #1a1a2e 70%, #0a0a1e 100%)',
      elements: '💻 🖥️ 📌',
      label: 'SoMa Office - Bluffely HQ',
    },
    sf_cafe: {
      gradient: 'linear-gradient(180deg, #2a1a0a 0%, #3a2a1a 30%, #4a3a2a 60%, #2a2a1a 100%)',
      elements: '☕ 💻 🪟',
      label: 'SF Cafe',
    },
    conference: {
      gradient: 'linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 30%, #2a1a5e 50%, #0a0a1e 100%)',
      elements: '🎤 📺 👥',
      label: 'TechBuzz Disrupt',
    },
    ny_office: {
      gradient: 'linear-gradient(180deg, #0a0a1e 0%, #1a1a2e 30%, #0a1a3e 60%, #0a0a0f 100%)',
      elements: '🌃 🏙️ 🪟',
      label: 'New York Office',
    },
    a2z_office: {
      gradient: 'linear-gradient(180deg, #1a1a2e 0%, #2a2a3e 30%, #1a2a4e 60%, #0a1a2e 100%)',
      elements: '📊 📋 🖊️',
      label: 'a2z Capital',
    },
    twitter_feed: {
      gradient: 'linear-gradient(180deg, #0a0a1e 0%, #1a1a2e 40%, #0a1a3e 100%)',
      elements: '📱 💬 🔥',
      label: 'X Timeline',
    },
    boardroom: {
      gradient: 'linear-gradient(180deg, #1a0a0a 0%, #2a1a1a 30%, #1a1a2e 60%, #0a0a1e 100%)',
      elements: '🪑 📽️ 📊',
      label: 'Investment Committee',
    },
    dashboard: {
      gradient: 'linear-gradient(180deg, #0a0a1e 0%, #1a0a2e 40%, #0a1a1e 100%)',
      elements: '📈 📉 🖥️',
      label: 'Portfolio Dashboard',
    },
    gp_room: {
      gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 30%, #1a1a1a 60%, #0a0a0a 100%)',
      elements: '📚 🪑 💡',
      label: 'GP Office',
    },
  };

  function getScene(key) {
    return SCENES[key] || SCENES.sf_office;
  }

  function renderBackground(containerEl, sceneKey) {
    const scene = getScene(sceneKey);
    containerEl.style.background = scene.gradient;
    containerEl.setAttribute('data-scene-label', scene.label);
    containerEl.setAttribute('data-scene-elements', scene.elements);
  }

  return { getScene, renderBackground };
})();
