// provided a list of street segments, this returns the center most segment
// which will be provided as center point for map rendering

export default function findMiddleSegment(segments) {
  const middle = Math.floor(segments.length / 2);
  const middleSegment = segments[middle];
  return middleSegment;
}
