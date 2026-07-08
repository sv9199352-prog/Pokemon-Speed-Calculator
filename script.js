const slots = ["a", "b"];

function byId(id) {
  return document.getElementById(id);
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (Number.isNaN(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function stageMultiplier(stage) {
  const value = Number(stage);
  if (value >= 0) return (2 + value) / 2;
  return 2 / (2 - value);
}

function calculateRawSpeed({ base, iv, ev, level, nature }) {
  const basePart = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);
  return Math.floor((basePart + 5) * nature);
}

function calculateFinalSpeed(slot, level) {
  const base = clampNumber(byId(`base-${slot}`).value, 1, 255);
  const iv = clampNumber(byId(`iv-${slot}`).value, 0, 31);
  const ev = clampNumber(byId(`ev-${slot}`).value, 0, 252);
  const nature = clampNumber(byId(`nature-${slot}`).value, 0.9, 1.1);
  const stage = clampNumber(byId(`stage-${slot}`).value, -6, 6);
  const multiplier = Number(byId(`multiplier-${slot}`).value);
  const raw = calculateRawSpeed({ base, iv, ev, level, nature });
  const final = Math.floor(raw * stageMultiplier(stage) * multiplier);

  byId(`ev-value-${slot}`).textContent = ev;
  byId(`final-${slot}`).textContent = final;

  return {
    name: byId(`name-${slot}`).value.trim() || (slot === "a" ? "我方宝可梦" : "对方宝可梦"),
    raw,
    final,
  };
}

function renderResult() {
  const level = clampNumber(byId("level").value, 1, 100);
  byId("level").value = level;

  const a = calculateFinalSpeed("a", level);
  const b = calculateFinalSpeed("b", level);
  const diff = Math.abs(a.final - b.final);

  if (a.final > b.final) {
    byId("winner").textContent = `${a.name} 先出手`;
    byId("details").textContent = `最终速度 ${a.final}，比 ${b.name} 快 ${diff} 点。基础面板速度：${a.name} ${a.raw} / ${b.name} ${b.raw}。`;
  } else if (b.final > a.final) {
    byId("winner").textContent = `${b.name} 先出手`;
    byId("details").textContent = `最终速度 ${b.final}，比 ${a.name} 快 ${diff} 点。基础面板速度：${a.name} ${a.raw} / ${b.name} ${b.raw}。`;
  } else {
    byId("winner").textContent = "同速，需要拼速度判定";
    byId("details").textContent = `双方最终速度都是 ${a.final}。基础面板速度：${a.name} ${a.raw} / ${b.name} ${b.raw}。`;
  }
}

document.querySelectorAll("input, select").forEach((control) => {
  control.addEventListener("input", renderResult);
  control.addEventListener("change", renderResult);
});
renderResult();
