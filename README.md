# Agile-wizard
The backend system for projectX powered by graphql

route: https://project-lazarus.herokuapp.com/

## API usage

For Every Query/Mutation that requires viewer:{token: <token>} remove viewer and set a bearer jwt token in the header.
Do not set bearer token in the query/Mutation that do not require viewer.

#### verify

*(special case requires token to be given in body)*
*(different secret)*
```
mutation ver{
  verify(viewer:{token: <token>}){
    status_code
    errors
  }
}
```

#### get user feed i.e. fests/events that are active
```
query feed{
  getFeed(viewer:{token: <token>}){
    status_code
    errors
    feed{
      ID
      name
      venue
      tags
      description
      speakers
      contact
      link
      isActive
      fromDate
      toDate
    }
  }
}
```

#### Create a fest
```
mutation festcreate{
  createFest(viewer:{token: <token>}, festInput:{name: <string> ,venue: <string>,tags: <list of string>,description: <string>,speakers: <list of strings>,contact: <list of string>,link: <list of string>,isActive: <bool>,fromDate: <ISO date string>,toDate: <ISO date string>}){
    status_code
    errors
    fest{
      ID
      speakers
      RSVP
      speakers
      tags
      contact
      isActive
    }
  }
}
```

#### Edit a fest
```
mutation festedit{
  editFest(viewer:{token: <token>}, ID:<string festID>, festInput:{name: <string> ,venue: <string>,tags: <list of string>,description: <string>,speakers: <list of strings>,contact: <list of string>,link: <list of string>,isActive: <bool>,fromDate: <ISO date string>,toDate: <ISO date string>}){
    status_code
    errors
    fest{
      ID
      speakers
      RSVP
      speakers
      tags
      contact
      isActive
    }
  }
}
```

#### Remove a fest / future: Restricted by authorization level
```
mutation removeFest{
  removeFest(festID: <string>,viewer:{token: <token>}) {
    status_code
    errors
  }
}
```

#### Change or toggle event to active or not
```
mutation toggle{
  toggleFest(viewer:{token: <token>}, ID: <string festID>){
    status_code
    errors
  }
}
```

#### Post a blog
```
mutation addBlog {
    addBlog(blogPost: {title: <string>, description: <string>, tags: <string?>, author: <string>, link: <string> }) {
        status_code
        errors
        blog {
            ID
            title
            date
            description
            tags
            author
            link
        }
    }
}
```

#### Edit a blog
```
mutation editBlog {
    editBlog(ID: <string>, blogPost: {title: <string?>, description: <string?>, tags: <string?>, author: <string?>, link: <string?> }) {
        status_code
        errors
    }
}
```

#### Get all blogs
```
query blogs {
    getBlogs(count: <int>) {
        errors,
        status_code,
        blogs {
            ID
            title
            date
            description
            tags
            author
            link
        }
    }
}
```

#### Signup
```
mutation first {
  createUser(input: {fname: <string>, lname: <string>, reg: <string>, email: <string>, phone: <string>, password: <string>, google: <bool>, gender: <string>}){
    status_code
    errors
  }
}
```

#### Edit user profile
```
mutation edit {
  editUser(input: {email: <string>, fname: <string?>, lname: <string?>, reg: <string?>, phone: <string?>, password: <string?>, google: <bool?>, gender: <string?>}){
    status_code
    errors
  }
}
```

#### Login universal for all
```
mutation auth{
  authenticate(email: <string>, password: <string>){
    status_code
    errors
    auth_level
    user{
      fname
      lname
      reg
      email
      gender
      google
    }
  }
}
```

#### Find user details / future: restricted by authorization level
```
query finduser {
  findUser(viewer: {token: <token>}) {
    status_code
    errors
    user{
      fname
      lname
      email
    }
  }
}
```

#### Enable the qr generator 
```$xslt
mutation enableQR {
  enableQr(festID: <string>, viewer:{token: <token>}) {
    status_code
    errors
  }
}
```

#### Disable the qr generator 
```$xslt
mutation disableQR {
  disableQr(festID: <string>, viewer:{token: <token>}) {
    status_code
    errors
  }
}
```

#### Update user attendance 
```$xslt
mutation attendance {
  updateAttendance(festID: <string>, code: <string>) {
    status_code
    errors
  }
}
```

#### Update add RSVP 
```$xslt
mutation addRSVP {
  addRSVP(festID: <string>, viewer:{token: <token>}) {
    status_code
    errors
  }
}
```

#### Add a feedback
 ```$xslt
 mutation addfeedback {
   addFeedback(festID: <string>, feedback: <string>) {
     status_code
     errors
   }
 }
 ```

### Contributing
* don't push to master directly
* use jshint to check linting issues (use the .jshrc provided in the repo) or run `npm run lint`


__*Note*__: If you are just gonna run the server, we recommend building the docker image and save yourself from the pain of handling
dependencies
