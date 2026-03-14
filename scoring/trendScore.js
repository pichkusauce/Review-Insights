export function trendScore(product){

  const dist = product.distribution;

  if(!dist) return 0;

  let score = 0;

  if(dist[5] > 70) score += 20;
  if(dist[1] > 20) score += 10;

  return score;

}