const STOPWORDS = new Set([
  "this","that","with","have","from","they","them","were","been",
  "very","really","just","also","when","than","then","there",
  "good","great","nice","like","love","okay","much","more"
]);

export function extractKeywords(reviews, limit = 10) {

  const wordFreq = {};
  const phraseFreq = {};

  reviews.forEach(text => {

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOPWORDS.has(w));


    words.forEach(w => {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    });

 
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i+1]}`;
      phraseFreq[phrase] = (phraseFreq[phrase] || 0) + 1;
    }

  });

  const combined = [
    ...Object.entries(wordFreq),
    ...Object.entries(phraseFreq)
  ];

  return combined
    .sort((a,b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}
