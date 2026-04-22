const GRADIENTS = [
  "linear-gradient(in oklab 145deg, oklab(88% 0.022 0.075) 0%, oklab(84% 0.030 0.090) 55%, oklab(93% 0.012 0.044) 100%)",
  "linear-gradient(in oklab 145deg, oklab(88% 0.060 0.018) 0%, oklab(84% 0.075 0.022) 55%, oklab(93% 0.034 0.010) 100%)",
  "linear-gradient(in oklab 145deg, oklab(88% 0.065 -0.015) 0%, oklab(84% 0.080 -0.018) 55%, oklab(93% 0.036 -0.008) 100%)",
  "linear-gradient(in oklab 145deg, oklab(89% 0.042 0.058) 0%, oklab(85% 0.052 0.072) 55%, oklab(93% 0.022 0.034) 100%)",
  "linear-gradient(in oklab 145deg, oklab(89% -0.044 0.022) 0%, oklab(85% -0.055 0.027) 55%, oklab(93% -0.026 0.013) 100%)",
  "linear-gradient(in oklab 145deg, oklab(88% 0.032 -0.062) 0%, oklab(84% 0.040 -0.078) 55%, oklab(93% 0.018 -0.038) 100%)",
  "linear-gradient(in oklab 145deg, oklab(89% -0.009 -0.055) 0%, oklab(85% -0.012 -0.068) 55%, oklab(93% -0.005 -0.033) 100%)",
  "linear-gradient(in oklab 145deg, oklab(89% -0.042 -0.018) 0%, oklab(85% -0.052 -0.023) 55%, oklab(93% -0.024 -0.010) 100%)",
  "linear-gradient(in oklab 145deg, oklab(88% 0.048 -0.008) 0%, oklab(84% 0.060 -0.010) 55%, oklab(93% 0.026 -0.005) 100%)",
  "linear-gradient(in oklab 145deg, oklab(87% 0.035 0.095) 0%, oklab(83% 0.045 0.115) 55%, oklab(92% 0.018 0.055) 100%)",
] as const;

/** djb2 hash → consistent gradient per category label. */
export function getCategoryGradient(category: string): string {
  let h = 5381;
  for (let i = 0; i < category.length; i++) {
    h = ((h << 5) + h) ^ category.charCodeAt(i);
  }
  return GRADIENTS[Math.abs(h) % GRADIENTS.length]!;
}
