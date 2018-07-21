/*
  generate a redirect URL for each source in campaign
 */
const uuid = require('uuid/v4');
const querystring = require('querystring');


function generateRedirects(festID, campaignName, targetURL, sources) {
  let campaignId = uuid();
  let redirectURL = 'redirect.dscvit.com/campaign?';

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
    campaign[campaignId][source] = url;
  }

  return [campaignId, campaign];
}
