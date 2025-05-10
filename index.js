import express from 'express'
import path from 'path'
import axios from 'axios';
import * as cheerio from 'cheerio';




const app = express();
const port = 5000;


app.use(express.static(path.join(path.resolve(),'./public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

let url;
let data_array=[];
let title_array=[];
let price_array=[];
let rating_array=[];
let image_array=[];
let stocks_array=[];
let stocks = 0;

 data_array=["B0DTK9DZB4","B0CHVXMW2J","B0D76YBGP6","B0DP2JPZKL","B07XCM6T4N",
             "B0DH3J6LB9","B09LCJ87VC","B0D63CNLJ9","B0DZNP6L5B","B0CZ7JN6PR",
             "B0DTK9DZB4","B0BQN3NW8C","B0D4TGZG1H","B084TNMLTB","B0DG2ZND2L",
             "B0C2S39V9Y","B09SB5V3LY","B0CQ8JVK2D","B0D7Q327L8","B0CWP9N3JD",
             "B0BBV83YF9", "B0CGCZJ75B",
             "B0CXXHFFM7","B07575FPC3","B07B4KQRZG","B0BN1V3MYY","B0D6YZWTNF",
             "B0757631XR","B06XH9QPX2","B00QPS8BAW","B00MGCCZSU","B06WGM2HK2",
             "B0CLTZH4F1","B07D3CXH7H","B01GJIGZIM","B07JHP3CY3","B07R5SJBZ2",


 ];

for(let i=0;i<data_array.length;i++){


url='https://www.amazon.in/dp/'+data_array[i];
axios.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
})
.then(response => {
  const $ = cheerio.load(response.data);

   const title = $('#productTitle').text().trim();
   const price = $('#corePrice_feature_div span.a-offscreen').first().text().trim();
   const image = $('#landingImage').attr('src') || $('#imgTagWrapperId img').attr('src');
     const availabilityText = $('#availability').text().trim();

  if (availabilityText.toLowerCase().includes("in stock")) {
    stocks++;
  }

   const totalRatings = $('#acrCustomerReviewText').text().trim();
   $('#histogramTable tr').each((index, element) => {
    const star = $(element).find('.a-text-left a').text().trim();
    const count = $(element).find('.a-text-right').text().trim();
    if (star && count) {
      ratingBreakdown[star] = count;
    }
  });

  title_array[i]=title;
  price_array[i]=price;
  rating_array[i]=totalRatings;
  image_array[i]=image;
  stocks_array[i]=stocks;

  // console.log(`Price: ${price}`);
  // console.log(`Overall Rating: ${overallRating}`);
  // console.log(`Total Ratings: ${totalRatings}`);
  // console.log('Rating Breakdown:');
  // console.log(ratingBreakdown);
})
.catch(error => {
  console.error('Error fetching the page:', error);
});

}



app.get('/', (req, res) => {
  res.render('index.ejs',{title_array,price_array,rating_array,image_array,data_array,stocks_array});
});

app.get('/products',(req,res)=>{
res.render('product.ejs',{title_array,price_array,rating_array,image_array,data_array,stocks_array});
});
 
app.get('/grocery',(req,res)=>{
res.render('grocery.ejs',{title_array,price_array,rating_array,image_array,data_array,stocks_array});
});

app.get('/developers',(req,res)=>{
res.render('developers.ejs')
});



app.listen(port, () => {
  console.log(`server is running at ${port}`)
})