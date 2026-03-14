import { analyzeReviews } from "../scoring/masterScorer.js";

const testProduct = {
  rating:4.8,
  totalReviews:40,
  distribution:{5:80,4:10,3:5,2:3,1:2},
  reviews:["great product","bad battery","could improve"]
};

console.log(analyzeReviews(testProduct));