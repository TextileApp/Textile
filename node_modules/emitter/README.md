## emitter ![NPM version](https://img.shields.io/npm/v/emitter.svg?style=flat)

Faster events controller for class and object

### Installation
```bash
$ npm install emitter
```

### Example
```js
import { EventEmitter, Promise } from 'emitter'

// Extend a object
let obj = { /* ... */ }
EventEmitter.extend(obj)

// Create a new emitter
let emitter = new EventEmitter()

// Define a class extend from Promise or EventEmitter
class Machine extends Promise {
  // ...
}
```

### API

- emitter.Promise()
- emitter.EventEmitter()

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

---
![docor]()
built upon love by [docor](git+https://github.com/turingou/docor.git) v0.3.0
