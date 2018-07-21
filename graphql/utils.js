const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const querystring = require('querystring');
const firebaseWebAPI = require('../config/lazarus-web-api');
const rp = require('request-promise');


async function generateRedirects(festID, campaignName, targetURL, sources,
                                 metaTitle=null, metaDesc=null, metaImageUrl=null) {
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
    url = await getFirebaseDynamicLink(url, metaTitle, metaDesc, metaImageUrl);
    campaign[campaignId][source] = url;
  }

  return [campaignId, campaign];
}

function getFirebaseDynamicLink(url, metaTitle=null, metaDesc=null,
                                metaImageUrl=null) {
  // set default values
  metaImageUrl = metaImageUrl || 'https://pbs.twimg.com/profile_images/' +
    '978523451886469120/u4iGgAm8_400x400.jpg';
  metaDesc = metaDesc || 'DSC VIT Vellore is a non-profit ' +
    'student developer group to develop, learn and share';
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
    });
  // .catch(err => {
  //   return err;
  // });
}

function formatCampaign(campaign, cid) {
  // convert from db schema to graphql schema
  let name = campaign[cid].name;
  delete campaign[cid].name;

  return {
    ID: cid,
    name: name,
    sourceURLs: JSON.stringify(campaign[cid])
  };
}

const formatErrors = (e) => {
  console.log(e.code);
  if(e.name === 'JsonWebTokenError' || e.name === 'SyntaxError'){
    return "Token is Invalid";
  }
  else if(e.code === 6){
    return "User Already exists";
  }
  return e.message;
};

const validate =  (email)=>{
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
};


module.exports = {
  formatErrors: formatErrors,
  validate: validate,
  generateRedirects: generateRedirects,
  formatCampaign: formatCampaign
};
