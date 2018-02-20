const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const db = require('./db');
const qrloop = require('./qr/qrloop');


const {
  formatErrors,
  constructMessage,
  validate
} = require('./utils');


sgMail.setApiKey(process.env['sendgrid']);


// Query Resolvers
const findUser = (root, something)=>{
  let {token} = something.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if(err) {
      let message = formatErrors(err);
        return {
          flag: false,
          user: null,
          errors: message
        }
    }

    let {email} = decoded;
    return db.collection("users").doc(email).get()
      .then((doc) => {
        if(!doc.exists) {
          return{
            flag: false,
            user: null,
            errors: "user does not exist"
          }
        }
        else{
          console.log(doc.data());
          return doc.data();
        }
    }).then((dat)=>{
      return {
        flag: true,
        user: dat,
        errors: null
      }
    });
  });
};

const getUserFeed = (_, params) =>{
  let {token} = params.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if(err) {
      let message = formatErrors(err);
      return {
        flag: false,
        user: null,
        errors: message
      }
    }

    let Query = db.collection('fests').where('isActive', '==', true);
    let docList = [];
    return Query.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('empty');
          return {
            flag: false,
            errors: 'No events currently.',
            feed: null
          }
        }
        else {
          snapshot.forEach(doc => {
            let modifiedDoc = doc.data();
            modifiedDoc.ID = doc.id;
            docList.push(modifiedDoc);
          });
          return {
            flag: true,
            errors: null,
            feed: docList
          }
        }
      }).catch(err => {
        return {
          flag: false,
          errors: err.message,
          feed: null
        }
      })
  })
};


// Mutation Resolvers
const createUser = (root, params) => {
    if(!validate(params.input.email)){
        return {
            flag: false,
            errors: "Invalid Email"
        }
    }
    params.input.password = bcrypt.hashSync(params.input.password, 10);
    let users = db.collection('users').doc(params.input.email);
    let userData = JSON.parse(JSON.stringify(params.input));
    userData.isVerified = false;
    return users.create(userData)
        .then(() => {
            // return test(params.input)
            let token = jwt.sign({email: userData.email}, 'emailSecret');
            userData.link = "http://localhost:3000/?a="+token;
            let construct = constructMessage(userData.email, userData);
            sgMail.send(construct)
                .then(() => {
                    console.log('mail sent!');
                })
                .catch(err => {
                    return{
                        flag: false,
                        errors: err.message
                    }
                });
            return {
                flag: true,
                errors: null
            };
        })
        .catch((err) => {
            return {
                flag: false,
                errors: formatErrors(err)
            }
        });
};

const authenticate = (root, params) => {
  let {password, email} = params;
    return db.collection("users").doc(email).get()
      .then((doc)=>{
        if(!doc.exists) {
          return {
            flag: true,
            errors: "Invalid Username",
            user: null,
            token: null
          }
        }
        else {
          let dat = doc.data();
          if(!dat.isVerified){
            return{
              flag: false,
              errors: "Email Not Verified",
              user: null,
              token: null
            }
          }
          return bcrypt.compare(password, dat.password)
            .then((res) => {
              if (res) {
                return {
                flag: true,
                errors: null,
                user: dat,
                token: jwt.sign({email: email}, 'secret')
                }
              }
              else {
                return {
                  flag: false,
                  errors: "Invalid Password.",
                  user: dat,
                  token: null
                }
              }
            })
            .then(dat => {
              console.log(dat);
              return dat;
            })
            .catch(err => {
              return {
                flag: false,
                errors: err.message,
                user: null,
                token: null
              }
            });
        }
      })
      .catch((err)=>{
        console.log(err);
      });
};

const createFest = (root, params) => {
  let {token} = params.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      let message = formatErrors(err);
      return {
        flag: false,
        errors: message,
        fest: null
      }
    }
    let festData = JSON.parse(JSON.stringify(params.festInput));
    let query = db.collection('fests').doc();
    return query.create(festData)
      .then(()=>{
        let doc = festData;
        doc.ID = query.id;
        return{
          flag: true,
          errors: null,
          fest: doc
        }
      }).catch((err)=>{
        console.log("LOG THIS CREATEFEST" + err);
        let message = formatErrors(err);
        return{
          flag: false,
          errors: message,
          fest: null
        }
      })
  })
};

const toggleFest = (root, params) => {
  let {token} = params.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if(err){
      console.log(err);
      return{
        flag: false,
        errors: "Invalid token"
      }
    }
    let query = db.collection('fests').doc(params.ID);
    return query.get()
      .then((doc)=>{
        if(!doc.exists){
          return{
            flag: false,
            errors: "Invalid ID."
          }
        }

        let docZ = doc.data();
        return query.update({isActive: !docZ.isActive})
          .then(()=>{
            return {
              flag: true,
              errors: null
            }
          }).catch(err => {
            console.log(err);
            console.log(err.code);
            return{
              flag: false,
              errors: err.message
            }
        })
      }).catch(err => {
        return{
          flag: false,
          errors: err.message
        }
    })
  })
};

const enableQr = (root, params) => {
  // params.timelimit
  // params.ID
  let {token} = params.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      console.log(err);
      return {
        flag: false,
        errors: "Invalid token"
      }
    }
    // return type { flag: <bool>, errors: null or appropriate message }
    // let query = db.collection('fests').doc(params.ID);
    // //loop update
    // return query.update({QRCODE: "place qr code here"})
    //   .then(() => {
    //     return {
    //       flag: true,
    //       status: 'qrcode generation initiated'
    //     }
    //   }).catch(err => {
    //     return {
    //       flag: false,
    //       errors: err.message
    //     }
    // })
    qrloop(params.ID, params.timelimit, 5);
    return {
      flag: false,
      status: 'qrcode generation initiated'
    }
  })
};

const verify = (root, params)=>{
  let {token} = params.viewer;
  return jwt.verify(token, 'emailSecret', (err, decoded) => {
    if (err) {
      console.log(err);
      return {
        flag: false,
        errors: "Invalid token"
      }
    }
    return db.collection('users').doc(decoded.email)
      .update({isVerified: true})
      .then(()=>{
        return {
          flag: true,
          errors: null
        }
      }).catch(err => {
      console.log(err);
      console.log(err.code);
      return{
        flag: false,
        errors: err.message
      }
    })
  })
};



module.exports = {
  findUser: findUser,
  getFeed: getUserFeed,
  createUser: createUser,
  authenticate: authenticate,
  createFest: createFest,
  toggleFest: toggleFest,
  enableQr: enableQr,
  verify: verify
};