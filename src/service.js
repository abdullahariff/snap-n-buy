
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
  productData.data.products.forEach(function(product){
    matches.push({
      SKU: product.sku,
      description: product.name,
      image_url: product.images.listingImage,
      price: product.price.current,
      style: product.details.style,
      type: product.details.productType.value
    });
  });
  return {
    matches: matches
  };
}

function searchImage(image) {
  return new Promise(function(resolve, reject) {
    uploadsearch({
        im_url: "https://cdn-images.article.com/products/SKU2128/2890x1500/image46788.jpg?fit=max&w=2600&q=60&fm=webp",
        // fl: ["im_url","price"]
    }, function(res) {
      let SKUs = extractSKUs(res.result);
      getElastiInformation(SKUs)
        .then(function (parsedBody){
          const data = extractProductData(parsedBody);
          resolve(data);
        });
    }, function(err){
      reject(err);
    });
  });
}

export default searchImage;