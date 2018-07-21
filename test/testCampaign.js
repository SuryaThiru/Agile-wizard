/*
  generate a redirect URL for each source in campaign
 */
const uuid = require('uuid/v4');
const querystring = require('querystring');
const firebaseWebAPI = require('../config/lazarus-web-api');
const rp = require('request-promise');


async function generateRedirects(festID, campaignName, targetURL, sources) {
  let campaignId = uuid();
  let redirectURL = 'http://redirect.dscvit.com/campaign?';

  let campaign = {};
  campaign[campaignId] = {
    name: campaignName
  };

  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];

    let params = {  // params in each redirect url
      fest: festID,
      next: targetURL,
      cid: campaignId,
      source: source
    };

    let url = redirectURL + querystring.stringify(params);
    url = await getFirebaseDynamicLink(url);
    campaign[campaignId][source] = url;
  }

  return [campaignId, campaign];
}

function getFirebaseDynamicLink(url, metaTitle=null, metaDesc=null, metaImageUrl=null) {
  metaImageUrl = metaImageUrl || 'https://pbs.twimg.com/profile_images/' +
    '978523451886469120/u4iGgAm8_400x400.jpg';
  metaDesc = metaDesc || 'DSC VIT Vellore is a non-profit student developer group' +
    ' to develop, learn and share';
  metaTitle = metaTitle || 'Developer Student Community VIT';

  const firebaseDynamicLinkDomain = 'dscvit.page.link';
  let apiHost = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks';
  const apiKey = { key: firebaseWebAPI.api_key };

  apiHost += '?' + querystring.stringify(apiKey);   // add query params

  let requestBody = {
    'dynamicLinkInfo': {
      'dynamicLinkDomain': firebaseDynamicLinkDomain,
      'link': url,
      'socialMetaTagInfo': {
        'socialTitle': metaTitle,
        'socialDescription': metaDesc,
        'socialImageLink': metaImageUrl
      }
    }
  };

  let options = {
    method: 'POST',
    uri: apiHost,
    headers: {
      "Content-Type": "application/json"
    },
    json: true,
    body: requestBody
  };

  return rp(options)
    .then(body => {
      return body.shortLink;
    })
    // .catch(err => {
    //   return err;
    // });
}