export function severityFromScore(score01) {
  // Hugging Face image-classification returns "confidence" not "severity".
  // We derive a severity estimate so the UI can show a complete report.
  const score = Math.max(0, Math.min(1, Number(score01) || 0));
  const sev = Math.round(10 + score * 80); // 10..90
  return Math.max(1, Math.min(99, sev));
}

export function levelFromSeverity(severityPct) {
  const s = Number(severityPct) || 0;
  if (s < 15) return 'mild';
  if (s < 30) return 'moderate';
  return 'severe';
}

export function yieldLossFromSeverity(severityPct) {
  const s = Math.max(0, Math.min(100, Number(severityPct) || 0));
  if (s < 15) return '5–12% expected yield loss';
  if (s < 30) return '12–25% expected yield loss';
  if (s < 50) return '25–40% expected yield loss';
  return '40–60% expected yield loss';
}

export function financialImpactFromSeverity(severityPct) {
  const s = Math.max(0, Math.min(100, Number(severityPct) || 0));
  // Rough range per acre; dynamic based on estimated severity.
  const min = Math.round(1500 + s * 120);
  const max = Math.round(min * 1.6);
  return `₹${min.toLocaleString('en-IN')}–₹${max.toLocaleString('en-IN')} / acre`;
}

function normalizeLabel(label) {
  if (!label) return 'Unknown';
  return String(label)
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function doHfRequest(url, token, imageBuffer) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      Accept: 'application/json',
    },
    body: imageBuffer,
  });

  const raw = await resp.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  return { resp, data };
}

export async function hfClassifyImage({ modelId, token, imageBuffer, retries = 2 }) {
  if (!modelId) throw new Error('HF_MODEL_ID is not configured');
  if (!token) throw new Error('HF_API_TOKEN is not configured');
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) throw new Error('Missing image buffer');

  const hfBase = (process.env.HF_INFERENCE_BASE || 'https://router.huggingface.co').replace(/\/$/, '');
  const safeModelPath = String(modelId)
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  const url = `${hfBase}/hf-inference/models/${safeModelPath}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const { resp, data } = await doHfRequest(url, token, imageBuffer);

    if (resp.ok) {
      // Typical response: [{ label: "...", score: 0.91 }, ...]
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        const top = data.reduce((best, cur) => ((cur?.score ?? 0) > (best?.score ?? 0) ? cur : best), data[0]);
        return {
          label: normalizeLabel(top?.label),
          score: Number(top?.score) || 0,
          raw: data,
        };
      }
      // Single object: { label: "...", score: 0.91 }
      if (data && typeof data === 'object' && (data.label != null || data.score != null)) {
        return {
          label: normalizeLabel(data.label),
          score: Number(data.score) || 0,
          raw: data,
        };
      }
      if (Array.isArray(data) && data.length === 0) {
        throw new Error('Model returned no predictions. Try a clearer crop image.');
      }
      throw new Error('Unexpected Hugging Face response format');
    }

    // 503 = model loading; retry after estimated_time
    if (resp.status === 503 && attempt < retries && data?.estimated_time) {
      const waitSec = Math.min(data.estimated_time || 20, 60);
      await new Promise((r) => setTimeout(r, waitSec * 1000));
      continue;
    }

    const msg =
      (data && typeof data === 'object' && (data.error || data.message)) ||
      (typeof data === 'string' ? data : null) ||
      `Hugging Face inference failed (${resp.status})`;
    const err = new Error(msg);
    err.status = resp.status;
    err.details = data;
    throw err;
  }
}

export function buildTreatmentsForDisease(diseaseName) {
  const n = (diseaseName || '').toLowerCase();

  if (n.includes('blight')) {
    return [
      { name: 'Mancozeb (protectant fungicide)', dose: '2–2.5 g/L water (spray)', urgency: 'High', recovery: 75 },
      { name: 'Remove infected leaves', dose: 'Field sanitation today', urgency: 'Medium', recovery: 55 },
      { name: 'Improve airflow', dose: 'Avoid overcrowding; prune if needed', urgency: 'Low', recovery: 45 },
    ];
  }

  if (n.includes('mildew')) {
    return [
      { name: 'Wettable sulfur', dose: '2 g/L water (spray)', urgency: 'High', recovery: 78 },
      { name: 'Neem oil (organic option)', dose: '3–5 ml/L water', urgency: 'Medium', recovery: 60 },
      { name: 'Avoid overhead irrigation', dose: 'Keep foliage dry', urgency: 'Low', recovery: 50 },
    ];
  }

  if (n.includes('rot') || n.includes('fusarium')) {
    return [
      { name: 'Trichoderma (bio-control)', dose: '5 g/L water or as label', urgency: 'High', recovery: 70 },
      { name: 'Improve drainage', dose: 'Avoid waterlogging', urgency: 'High', recovery: 65 },
      { name: 'Remove severely infected plants', dose: 'Rogueing + disposal', urgency: 'Medium', recovery: 55 },
    ];
  }

  return [
    { name: 'Scout and isolate infected area', dose: 'Inspect field blocks', urgency: 'High', recovery: 60 },
    { name: 'Follow local extension recommendation', dose: 'Use crop-specific guidance', urgency: 'Medium', recovery: 55 },
    { name: 'Maintain irrigation and nutrition balance', dose: 'Avoid stress; balanced inputs', urgency: 'Low', recovery: 45 },
  ];
}

