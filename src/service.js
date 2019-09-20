
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
  let tags = [];
  productData.data.products.forEach(function(product){
    tags.push({name: product.details.productType.value, score: 0})  ;
    tags = addArrayElements(tags, product.details.colour);
    tags = addArrayElements(tags, product.details.style);
    tags = addArrayElements(tags, product.details.room);
    tags = addArrayElements(tags, product.details.mainMaterials);
  });
  return [...new Set(tags)];
}

function addArrayElements(tags, array) {
  array.forEach(function(element){
    tags.push({
      name: element,
      score: 0,
    });
  });
  return tags;
}

function extractHotspots(items) {
  let hotspots = [];
  for (let item of items) {
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
    discoversearch({
      image: image,
    }, function(res) {
      let SKUs = extractSKUs(res.objects);
      getElastiInformation(SKUs)
        .then(function (parsedBody){
          const data = {
            matches: extractProductData(parsedBody),
            tags: extractTags(parsedBody),
            hotspots: extractHotspots(res.objects)
          };
          resolve(data);
        });
    }, function(err){
      reject(err);
    });
  });
}

export default searchImage;
