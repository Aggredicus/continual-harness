export function calculateEthicsScore(state) {
  const ethics = state.players.commons.ethics;
  return Math.round((ethics.earthCare + ethics.peopleCare + ethics.fairShare) / 3);
}

export function calculateCommonsScore(state) {
  const ethicsScore = calculateEthicsScore(state);
  return Math.round(
    state.global.watershedResilience * 1.5 +
    ethicsScore * 2 +
    state.players.commons.resources.trust * 3 +
    state.players.commons.resources.food -
    state.global.climatePressure
  );
}

export function calculateMegaCorpScore(state) {
  const mega = state.players.megaCorp;
  return Math.round(
    mega.profit * 1.4 +
    mega.corporateControl * 1.8 +
    (mega.resources.influence ?? 0) * 2
  );
}

export function summarizeScores(state) {
  return {
    commonsScore: calculateCommonsScore(state),
    megaCorpScore: calculateMegaCorpScore(state),
    ethicsScore: calculateEthicsScore(state),
    watershedResilience: state.global.watershedResilience,
    climatePressure: state.global.climatePressure
  };
}
