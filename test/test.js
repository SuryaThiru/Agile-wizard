const expect = require('chai').expect;
const {generateRedirects} = require('../graphql/utils');

describe('redirect url generator', () => {
  it('generate all urls and campaign ID', () => {
    let src = ['whatsapp', 'fb', 'linkedin'];
    let out = generateRedirects('233', 'testing', 'register.target.com/url', src);
    let cid = out[0];
    let data = out[1];

    expect(cid).to.be.a('string');
    expect(cid).to.have.lengthOf(36);
    expect(data[cid]).to.have.property('name');

    for (let i = 0; i < src.length; i++)
      expect(data[cid]).to.have.property(src[i]);

    for (let i = 0; i < src.length; i++)
      expect(data[cid][src[i]]).to.be.a('string');
  });
});
