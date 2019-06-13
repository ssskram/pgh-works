// provided an array of points and a list of assets,
// returns assets within bounds

import inside from "point-in-polygon";

export default function assetsInPolygon(points, assets) {
  let shape = [] as any;
  let componentAssets = [] as any;
  points.forEach(function(point) {
    const shapeArray = [point.lat, point.lng];
    shape.push(shapeArray);
  });
  assets.forEach(function(asset) {
    if (asset.shape) {
      asset.shape.points.forEach(function(point) {
        const ins = inside([point.lat, point.lng], shape);
        if (ins == true && !componentAssets.includes(asset)) {
          componentAssets.push(asset);
        }
      });
    }
  });
  return componentAssets;
}
