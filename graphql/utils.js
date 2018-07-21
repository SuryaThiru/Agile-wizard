const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const querystring = require('querystring');

function generateRedirects(festID, campaignName, targetURL, sources) {
  /*
  generate a redirect URL for each source in campaign
  params:
  festID, campaignName, targetURL (string)
  sources (array of strings)
 */
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


const test = (stuff)=>{
  return {
    flag: true,
    errors: null,
    token: jwt.sign({email: stuff.email}, process.env.jwt_secret)
  };
};

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
  test: test,
  formatErrors: formatErrors,
  validate: validate,
  generateRedirects: generateRedirects
};
