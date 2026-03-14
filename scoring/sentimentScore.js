export function sentimentScore(reviews) {

  const positiveWords = [
    "good","great","excellent","best","love","amazing","perfect","nice",
    "worth","fantastic","awesome","smooth","fast","reliable","happy",
    "satisfied","super","recommend","liked","comfortable"
  ];

  const negativeWords = [
    "bad","worst","poor","hate","problem","slow","disappointed","waste",
    "terrible","awful","defective","broken","cheap","damage","issue",
    "useless","refund","return","heating","lag"
  ];

  const complaintWords = [
    "battery","camera","quality","size","weight","sound","display",
    "performance","charging","durability"
  ];

  const suggestionWords = [
    "improve","better","could","should","expect","wish"
  ];

  let score = 0;
  let complaints = [];
  let suggestions = [];

  reviews.forEach(text => {

    const lower = text.toLowerCase();

    positiveWords.forEach(w => {
      if (lower.includes(w)) score += 1;
    });

    negativeWords.forEach(w => {
      if (lower.includes(w)) score -= 1;
    });

    complaintWords.forEach(w => {
      if (lower.includes(w)) complaints.push(w);
    });

    suggestionWords.forEach(w => {
      if (lower.includes(w)) suggestions.push(w);
    });

  });

  return {
    sentimentScore: score,
    complaints: [...new Set(complaints)],
    suggestions: [...new Set(suggestions)]
  };

}