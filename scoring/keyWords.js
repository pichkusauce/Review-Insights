export function extractKeywords(reviews) {

  const words = {};

  reviews.forEach(text => {

    text.toLowerCase().split(/\W+/).forEach(w => {

      if (w.length < 4) return;

      words[w] = (words[w] || 0) + 1;

    });

  });

  return Object.entries(words)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,6)
    .map(w=>w[0]);

}