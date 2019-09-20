
import { set, uploadsearch } from 'visearch-javascript-sdk';
import * as rp from 'request-promise';

set('app_key', '890640f4b381cbcb3b5cafb0b179c097');

/* Test for individual image with Visense API. */
// router.get('/image-search', function(req, response, next) {
// //   visearch.uploadsearch({
// //     im_url: "https://cdn-images.article.com/products/SKU2128/2890x1500/image46788.jpg?fit=max&w=2600&q=60&fm=webp",
// //   }, function(res) {
// //       /* Collect related SKUs from Visenze API call. */
// //       let SKUs = extractSKUs(res.result);
// //
// //       /* Get product information from ElastiGraph. */
// //       getElastiInformation(SKUs)
// //           .then(function (parsedBody){
// //             response.send(extractProductData(parsedBody));
// //           });
// //
// //   }, function(err){
// //       response.send("GET error")
// //   });
// // });

function extractSKUs(list) {
  let SKUs = [];
  list.forEach(function(item){
    SKUs.push(item.im_name);
  });
  return SKUs;
}

function getElastiInformation(SKUs) {
  let skuList = "";

  SKUs.forEach(function(sku){
    skuList += "\""+ sku + "\",";
  });

  const elastigraph_query = {
    query: "{  products(skus: [" + skuList + "], store: GB) { sku name price { current } details images { listingImage } } }"
  };

  let options = {
    method: "POST",
    uri: "https://es-elastigraph.made.com/graphql",
    body: elastigraph_query,
    json: true
  };

  return rp(options);
}

function extractProductData(productData) {
  let matches = [];
  const cloudinaryURL = "https://res-5.cloudinary.com/made-com/image/upload/a_auto,b_transparent,c_pad,d_made.svg,dpr_1.0,f_auto,h_550,q_auto:best,w_1050/v4/";
  productData.data.products.forEach(function(product){
    matches.push({
      SKU: product.sku,
      description: product.name,
      image_url: cloudinaryURL + product.images.listingImage,
      price: product.price.current / 100,
      style: product.details.style,
      type: product.details.productType.value
    });
  });
  return {
    matches: matches
  };
}

function extractHotspots(data) {
  let hotspots = [];
  for (let item of data.product_types) {
    const centreX = ((item.box[2] - item.box[0]) / 2) + item.box[0];
    const centreY = ((item.box[3] - item.box[1]) / 2) + item.box[1];
    hotspots.push({
      'coords': [centreX, centreY],
      'type': item.type,
      'score': item.score,
    });
  }
  return hotspots;
}

function searchImage(image) {
  return new Promise(function(resolve, reject) {
    uploadsearch({
      image: image,
    }, function(res) {
      let SKUs = extractSKUs(res.result);
      const hotspots = extractHotspots(res);
      getElastiInformation(SKUs)
        .then(function (parsedBody){
          return extractProductData(parsedBody);
        })
        .then(data => {
          data['hotspots'] = hotspots;
          resolve(data);
        });
    }, function(err){
      reject(err);
    });
  });
}

export default searchImage;