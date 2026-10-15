/* ============ boot ============ */
(function boot() {
  renderSoundBtn();
  $('#hud-sound').addEventListener('click', () => SFX.toggle());
  $('#hud-home').addEventListener('click', () => { SFX.click(); go('home'); });
  window.addEventListener('hashchange', () => route());
  updateHUD();
  route();
})();
