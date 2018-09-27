# Iocfy
A simple IoC module for node.js.

## Usage

```
npm install iocfy
```

For example, the project structure:

```
|--service/
   |--user.js
|--model/
   |--user.js
|index.js
```

First step. Add the beans

```
model/user.js

class UserModel {
  findOne() {
    return {
      name: 'hello world',
      age: 21,
    };
  }
}

----------------------
service/user.js

class UserService {
  find() {
    this.userModel.findOne();
  }
}
```

And add a config for Iocfy.

```
application.json

{
  "beans": {
    "userModel": {
      "class": "model/user"
    },
    "userService": {
      "class": "service/user"
    }
  }
}
```

Finally, using the Iocfy to manage the beans.

```
index.js

const Iocfy = require('iocfy');
const config = require('application.json');
Iocfy.load(config);

const UserService = Iocfy.getBean('userService');
console.log(UserService.find());    // { name: 'hello world', age: 21 }
```
