const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');
const qrloop = require('./qr/qrloop');
const sendSignUpVerification = require('./email/signup');
const jwtwrapper = require('./jwtwrapper');

const {
  formatErrors,
  validate
} = require('./utils');


// Query Resolvers
function findUser(root, params) {
  let {token} = params.viewer;

  return jwtwrapper(token, (decoded) => {
    let {email} = decoded;

    return db.collection("users").doc(email).get()
      .then((doc) => {
        if(!doc.exists) {
          return {
            status_code: 420,
            user: null,
            errors: "user does not exist"
          };
        }
        else {
          // console.log(doc.data());
          return doc.data();
        }})
      .then((dat)=>{
        return {
          status_code: 200,
          user: dat,
          errors: null
        };
    });
  });
}

function getUserFeed(root, params) {
  let {token} = params.viewer;

  return jwtwrapper(token, (decoded) => {
    let Query = db.collection('fests').where('isActive', '==', true);
    let docList = [];

    return Query.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('no events');
          return {
            status_code: 420,
            errors: 'No events currently.',
            feed: null
          };
        }
        else {
          snapshot.forEach(doc => {
            let modifiedDoc = doc.data();
            modifiedDoc.ID = doc.id;
            docList.push(modifiedDoc);
          });

          return {
            status_code: 200,
            errors: null,
            feed: docList
          };
        }
      }).catch(err => {
        return {
          status_code: 400,
          errors: err.message,
          feed: null
        };
      });
  });
};

// Mutation Resolvers
function createUser(root, params) {
  if(!validate(params.input.email)) {
    return {
      status_code: 420,
      errors: "Invalid Email"
    };
  }

// TODO make async - optional
  params.input.password = bcrypt.hashSync(params.input.password, 10);

  let users = db.collection('users').doc(params.input.email);
  let userData = JSON.parse(JSON.stringify(params.input));
  userData.isVerified = false;
  userData.auth_level = 1;

  return users.create(userData)
    .then(() => {
      let token = jwt.sign({email: userData.email}, 'emailSecret');

      sendSignUpVerification(userData, token);
      return {
        status_code: 200,
        errors: null
      };
    })
    .catch((err) => {
      if(err.code === 6){
        return {
          status_code: 420,
          errors: 'User already exists'
        }
      }
      return {
        status_code: 400,
        errors: formatErrors(err)
      };
    });
}

function authenticate(root, params) {
  let {password, email} = params;

  return db.collection("users").doc(email).get()
    .then((doc)=>{
      if(!doc.exists) {
        return {
          status_code: 420,
          errors: "Invalid Email",
          user: null,
          token: null,
          auth_level: -1
        };
      }
      else {
        let dat = doc.data();
        if(!dat.isVerified){
          return{
            status_code: 420,
            errors: "Email not verified",
            user: null,
            token: null,
            auth_level: -1
          };
        }

        return bcrypt.compare(password, dat.password)
          .then((res) => {
            if (res) {
              return {
              status_code: 200,
              errors: null,
              user: dat,
              token: jwt.sign({email: email}, 'secret'),
              auth_level: dat.auth_level
              };
            }
            else {
              return {
                status_code: 420,
                errors: "Invalid Password.",
                user: dat,
                token: null,
                auth_level: -1
              };
            }
          })
          .then(dat => {
            console.log(dat);
            return dat;
          })
          .catch(err => {
            return {
              status_code: 400,
              errors: err.message,
              user: null,
              token: null,
              auth_level: -1
            };
          });
      }
    })
    .catch((err)=>{
      console.log(err);
    });
}

function createFest(root, params) {
  let {token} = params.viewer;

  return jwtwrapper(token, (decoded) => {
    let festData = JSON.parse(JSON.stringify(params.festInput));
    let query = db.collection('fests').doc();

    return query.create(festData)
      .then(()=>{
        let doc = festData;
        doc.ID = query.id;
        return{
          status_code: 200,
          errors: null,
          fest: doc
        };
      }).catch((err)=>{
        console.log("LOG THIS CREATEFEST" + err);
        let message = formatErrors(err);
        return {
          status_code: 420,
          errors: message,
          fest: null
        };
      });
  });
};

const toggleFest = (root, params) => {
  let {token} = params.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if(err){
      let message = formatErrors(err);
      return{
        status_code: 420,
        errors: message
      };
    }

    let query = db.collection('fests').doc(params.ID);
    return query.get()
      .then((doc)=>{
        if(!doc.exists){
          return{
            status_code: 420,
            errors: "Invalid ID."
          };
        }

        let docZ = doc.data();
        return query.update({isActive: !docZ.isActive})
          .then(()=>{
            return {
              status_code: 200,
              errors: null
            };
          }).catch(err => {
            console.log(err);
            console.log(err.code);
            return{
              status_code: 400,
              errors: err.message
            };
        });
      }).catch(err => {
        return{
          status_code: 400,
          errors: err.message
        };
    });
  });
};

const enableQr = (root, params) => {
  let {token} = params.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      let message = formatErrors(err);
      return {
        status_code: 420,
        errors: message
      };
    }
    qrloop(params.ID, params.timelimit, 5);
    return {
      status_code: 200,
      errors: 'qrcode generation initiated'
    };
  });
};

const verify = (root, params)=>{
  let {token} = params.viewer;
  return jwt.verify(token, 'emailSecret', (err, decoded) => {
    if (err) {
      let message = formatErrors(err);
      return {
        status_code: 420,
        errors: message
      };
    }
    return db.collection('users').doc(decoded.email)
      .update({isVerified: true})
      .then(()=>{
        return {
          status_code: 200,
          errors: null
        };
      }).catch(err => {
      console.log(err);
      console.log(err.code);
      return{
        status_code: 400,
        errors: err.message
      };
    });
  });
};

// function updateAttendance(userDoc, festId, verificationCode) {
function updateAttendance(root, params) {
  // let userDoc = db.collection('users').doc(params.user_email);
  let festDoc = db.collection('fests').doc(params.festID);
  // let verificationCode = params.code;
  let {token} = params.viewer;
  return jwt.verify(token, 'secret', (err, decoded) => {
    if(err){
      let message = formatErrors(err);
      return{
        status_code: 420,
        errors: message
      };
    }
    return festDoc.get()
      .then((doc)=>{
        if(!doc.exists){
          return {
            status_code: 200,
            errors: null
          };
        }

        let record = {
          email: decoded.email,
          timestamp: Math.floor(new Date() / 1000)  // UNIX epoch
          };
        console.log(record);
        let dat = doc.data();
        console.log(dat.QRval);
        if(dat.QRval === params.code){
          let records = dat.attendance;
            records.push(record);
            return festDoc.set({attendance: records}, {merge: true})
              .then(() => {
                return {
                  status_code: 200,
                  errors: null
                };
              }).catch(err => {
                return {
                  status_code: 400,
                  errors: err.message
                };
              });
        }
        else {
          return {
            status_code: 420,
            errors: 'Invalid Verification Code'
          };
        }
      }).catch(err => {
        return {
          status_code: 400,
          errors: err.message
        };
      });
  // return Promise.all([userDoc.get(), festDoc.get()])
  //   .then(vals => {
  //     let userData = vals[0];
  //     let festData = vals[1];
  //
  //     if (!userData.exists) {
  //       return {
  //         flag: false,
  //         errors: "user not found"
  //       }
  //     }
  //     else if (!festData.exists) {
  //       return {
  //         flag: false,
  //         errors: "fest not found"
  //       }
  //     }
  //
  //     // verify with qr value in the DB
  //     if (verificationCode === festData.data().QRval) {
  //       // TODO update attendance better to the list
  //       let record = {
  //         email: params.user_email,
  //         timestamp: Math.floor(new Date() / 1000)  // UNIX epoch
  //       };
  //       let records = festData.data().attendance;
  //       records.push(record);
  //
  //       festDoc.set(
  //         {attendance: records},
  //         {merge: true}
  //       );
  //     }
  //     else {
  //       return {
  //         flag: false,
  //         errors: 'invalid verification code'
  //       }
  //     }
  //
  //     return {
  //       flag: true,
  //       errors: 'attendance updated'
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //
  //     return {
  //       flag: false,
  //       errors: err
  //     }
  //   });
    });
}

const removeFest = (root, params) => {
  let {token} = params.viewer;

  return jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      let message = formatErrors(err);
      return {
        status_code: 420,
        errors: message
      };
    }

    let query = db.collection('fests').doc(params.festID);
    return query.delete()
      .then(()=>{
        console.log("Fest successfully deleted!");
        return{
          status_code: 200,
          errors: null
        }
    }).catch((err) => {
      let message = formatErrors(err);
      return {
        status_code: 400,
        errors: message
      }
    })
  });
};
module.exports = {
  findUser: findUser,
  getFeed: getUserFeed,
  createUser: createUser,
  authenticate: authenticate,
  createFest: createFest,
  toggleFest: toggleFest,
  enableQr: enableQr,
  updateAttendance: updateAttendance,
  verify: verify,
  removeFest: removeFest
};
