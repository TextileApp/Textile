const url = require('url');
const request = require('request-promise');
const NodeCache = require('node-cache');
// use non node promise lib so it'll work in browser.
const Promise = require('bluebird');

const DEFAULT_CACHE_OPTIONS = {
  stdTTL: (60 * 60 * 12), // 12 hours
};

class ShopStyle {

  /**
   * Class for accessing the ShopStyle API
   * @param {string} pid API key
   * @param {string} [locale] set the locale for the api.
   * @param {Object} [node-cache] configuration options.
   *   Defaults to 12 hour ttl.
   * @param {string} [version] the version of the api to use.
   *   Defaults to version 2.
   *
   * @see {@link https://www.shopstylecollective.com/api/overview|API Overview}
   *    to obtain an API key and for further information on use.
   * @see {@link https://github.com/mpneuried/nodecache#options|node-cache options}
   *    for cache options
   * @see {@link https://github.com/PopSugar/shopstyle-sdk-nodejs|shopstyle-sdk}
   *    for list of supported locales
   */
  constructor(pid, locale = 'US', cacheOptions = DEFAULT_CACHE_OPTIONS, version = 2) {
    this.pid = pid;
    this.version = version;
    this.locale = locale;

    // Turn off caching by passing in false for cacheOptions
    if (cacheOptions) {
      this.cache = new NodeCache(cacheOptions);
    } else {
      this.cache = false;
    }

    switch (this.locale) {
      case 'UK':
        this.host = 'api.shopstyle.co.uk';
        break;
      case 'DE':
        this.host = 'api.shopstyle.de';
        break;
      case 'FR':
        this.host = 'api.shopstyle.fr';
        break;
      case 'JP':
        this.host = 'api.shopstyle.co.jp';
        break;
      case 'AU':
        this.host = 'api.shopstyle.com.au';
        break;
      case 'CA':
        this.host = 'api.shopstyle.ca';
        break;
      case 'US':
      default:
        this.host = 'api.shopstyle.com';
    }
  }

  brands(options = {}) {
    return this.call('brands', options);
  }

  categories(options = {}) {
    return this.call('categories', options);
  }

  colors(options = {}) {
    return this.call('colors', options);
  }

  product(id) {
    return this.call(`products/${id}`);
  }

  products(options = {}) {
    return this.call('products', options);
  }

  productsHistogram(options = {}) {
    return this.call('products/histogram', options);
  }

  retailers() {
    return this.call('retailers');
  }

  lists(options = {}) {
    return this.call('lists', options);
  }

  callUri(path, options) {
    const query = Object.assign({ pid: this.pid }, options);
    const urlObj = {
      protocol: 'http',
      hostname: this.host,
      pathname: `api/v${this.version}/${path}`,
      query,
    };

    return url.format(urlObj);
  }

  call(path, options = {}) {
    const uri = this.callUri(path, options);

    if (this.cache) {
      return new Promise((resolve, reject) => {
        let value;
        value = this.cache.get(uri);
        if (!value) {
          return request(uri).then((result) => {
            value = JSON.parse(result);
            const cacheResult = this.cache.set(uri, value);
            if (!cacheResult) {
              return reject('failed to cache result');
            }

            return resolve(value);
          }, e => reject(e));
        }

        return resolve(value);
      });
    }

    // pull this out into a function
    return request(uri).then(result => JSON.parse(result));
  }
}

module.exports = ShopStyle;
