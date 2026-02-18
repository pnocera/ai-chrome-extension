(() => {
  'use strict';

  const STORAGE_KEY = 'aistudio_export_config';
  const DEFAULT_CONFIG = {
    EXTRACTION_MODE: 'xhr',
    INCLUDE_USER: true,
    INCLUDE_MODEL: true,
    INCLUDE_THINKING: true,
    COLLAPSIBLE_THINKING: true,
    HINT_DISMISSED: false
  };

  const pageType = document.querySelector('.panel')?.dataset.page || 'popup';
  const statusEl = document.getElementById('status');

  const refs = {
    includeUser: document.getElementById('include-user'),
    includeModel: document.getElementById('include-model'),
    includeThinking: document.getElementById('include-thinking'),
    collapsibleThinking: document.getElementById('collapsible-thinking'),
    modeXhr: document.getElementById('mode-xhr'),
    modeDom: document.getElementById('mode-dom'),
    openOptions: document.getElementById('open-options')
  };

  function normalizeConfig(config) {
    const normalized = { ...DEFAULT_CONFIG, ...(config || {}) };
    normalized.EXTRACTION_MODE = normalized.EXTRACTION_MODE === 'dom' ? 'dom' : 'xhr';
    if (!normalized.INCLUDE_MODEL) normalized.INCLUDE_THINKING = false;
    if (!normalized.INCLUDE_THINKING) normalized.COLLAPSIBLE_THINKING = false;
    return normalized;
  }

  function readFromUI() {
    return normalizeConfig({
      INCLUDE_USER: refs.includeUser.checked,
      INCLUDE_MODEL: refs.includeModel.checked,
      INCLUDE_THINKING: refs.includeThinking.checked,
      COLLAPSIBLE_THINKING: refs.collapsibleThinking.checked,
      EXTRACTION_MODE: refs.modeDom.checked ? 'dom' : 'xhr'
    });
  }

  function applyToUI(config) {
    refs.includeUser.checked = config.INCLUDE_USER;
    refs.includeModel.checked = config.INCLUDE_MODEL;
    refs.includeThinking.checked = config.INCLUDE_THINKING;
    refs.collapsibleThinking.checked = config.COLLAPSIBLE_THINKING;
    refs.modeXhr.checked = config.EXTRACTION_MODE === 'xhr';
    refs.modeDom.checked = config.EXTRACTION_MODE === 'dom';

    refs.includeThinking.disabled = !config.INCLUDE_MODEL;
    refs.collapsibleThinking.disabled = !config.INCLUDE_THINKING;
  }

  let saveTimer = null;
  async function saveConfig(config) {
    await chrome.storage.local.set({ [STORAGE_KEY]: normalizeConfig(config) });
    if (statusEl) {
      statusEl.textContent = 'Saved';
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => { statusEl.textContent = ''; }, 900);
    }
  }

  async function loadConfig() {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return normalizeConfig(stored?.[STORAGE_KEY]);
  }

  async function handleUIChange() {
    const config = readFromUI();
    applyToUI(config);
    await saveConfig(config);
  }

  async function init() {
    const config = await loadConfig();
    applyToUI(config);

    refs.includeUser.addEventListener('change', handleUIChange);
    refs.includeModel.addEventListener('change', handleUIChange);
    refs.includeThinking.addEventListener('change', handleUIChange);
    refs.collapsibleThinking.addEventListener('change', handleUIChange);
    refs.modeXhr.addEventListener('change', handleUIChange);
    refs.modeDom.addEventListener('change', handleUIChange);

    if (pageType === 'popup') {
      refs.openOptions.addEventListener('click', () => chrome.runtime.openOptionsPage());
    }

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local' || !changes[STORAGE_KEY]) return;
      applyToUI(normalizeConfig(changes[STORAGE_KEY].newValue));
    });
  }

  init().catch((error) => {
    if (statusEl) statusEl.textContent = 'Error';
    console.error('Failed to initialize UI:', error);
  });
})();