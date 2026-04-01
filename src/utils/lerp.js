export const lerp = (a, b, t) => a + (b - a) * t;

export const inverseLerp = (a, b, v) => (v - a) / (b - a);

export const interpolateWaypoints = (waypoints, progress) => {
  let i = 0;
  // Find the segment including the current progress
  while (i < waypoints.length - 1 && waypoints[i + 1][0] < progress) {
    i++;
  }

  const [p0, ...v0] = waypoints[i];
  const nextWaypoint = waypoints[i + 1] || waypoints[i];
  const [p1, ...v1] = nextWaypoint;

  // Handle progress outside or at the bounds
  if (p1 === p0) return v0;
  
  const t = Math.max(0, Math.min(1, inverseLerp(p0, p1, progress)));
  
  return v0.map((val, idx) => lerp(val, v1[idx], t));
};
