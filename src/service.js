
import { set, discoversearch } from 'visearch-javascript-sdk';
import * as rp from 'request-promise';

set('app_key', '890640f4b381cbcb3b5cafb0b179c097');

function extractSKUs(list) {
  let SKUs = [];
  list.forEach(function(match){
    match.result.forEach(function(item){
      SKUs.push(item.im_name);
    });
  });
  return [...new Set(SKUs)];
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
  return matches;
}

function extractTags(productData) {
  return "";
}

function searchImage(image) {
  return new Promise(function(resolve, reject) {
    discoversearch({
      image: image,
    }, function(res) {
      let SKUs = extractSKUs(res.objects);
      getElastiInformation(SKUs)
        .then(function (parsedBody){
          let matches = extractProductData(parsedBody);
          let tags = extractTags(parsedBody);
          let data = {
            matches: matches,
            tags: tags,
          };
          resolve(data);
        });
    }, function(err){
      reject(err);
    });
  });
}

export default searchImage;
