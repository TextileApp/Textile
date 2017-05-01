const ShopStyle = require('../');

describe('Shopstyle', () => {
  it('should build a callUri', () => {
    const us = new ShopStyle('test');
    let url = us.callUri('brands');
    expect(url).toBe('http://api.shopstyle.com/api/v2/brands?pid=test');

    const uk = new ShopStyle('test', 'UK');
    url = uk.callUri('brands');
    expect(url).toBe('http://api.shopstyle.co.uk/api/v2/brands?pid=test');

    const de = new ShopStyle('test', 'DE');
    url = de.callUri('brands');
    expect(url).toBe('http://api.shopstyle.de/api/v2/brands?pid=test');

    const fr = new ShopStyle('test', 'FR');
    url = fr.callUri('brands');
    expect(url).toBe('http://api.shopstyle.fr/api/v2/brands?pid=test');

    const jp = new ShopStyle('test', 'JP');
    url = jp.callUri('brands');
    expect(url).toBe('http://api.shopstyle.co.jp/api/v2/brands?pid=test');

    const au = new ShopStyle('test', 'AU');
    url = au.callUri('brands');
    expect(url).toBe('http://api.shopstyle.com.au/api/v2/brands?pid=test');

    const ca = new ShopStyle('test', 'CA');
    url = ca.callUri('brands');
    expect(url).toBe('http://api.shopstyle.ca/api/v2/brands?pid=test');
  });

  it('should get brands', (done) => {
    const ss = new ShopStyle('test');
    ss.brands({ limit: 10 }).then((response) => {
      expect(response.metadata.limit).toBe(10);
      done();
    }, e => done.fail(e));
  });

  it('should get categories', (done) => {
    const ss = new ShopStyle('test');
    ss.categories({ cat: 'womens-clothes', depth: 1 }).then((response) => {
      expect(response.metadata.root.id).toBe('womens-clothes');
      expect(response.metadata.maxDepth).toBe(3);
      done();
    });
  });

  it('should get colors', (done) => {
    const ss = new ShopStyle('test');
    ss.colors().then((response) => {
      expect(response.colors.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should get a product', (done) => {
    const ss = new ShopStyle('test');
    ss.product(359131344).then((response) => {
      expect(response.id).toBe(359131344);
      done();
    });
  });

  it('should get a retailer histogram of products', (done) => {
    const ss = new ShopStyle('test');
    const options = { filters: 'Retailer', fts: 'red dress' };
    ss.productsHistogram(options).then((response) => {
      expect(response.metadata.total).toBeGreaterThan(0);
      done();
    });
  });

  it('should search for products', (done) => {
    const ss = new ShopStyle('test');
    const options = {
      fts: 'red dress',
      offset: 0,
      limit: 10,
      fl: ['b171', 'b28080', 'c7', 'd0', 'p31:40', 's85', 's87', 's89', 't0'],
      sort: 'PriceLoHi',
    };
    ss.products(options).then((response) => {
      expect(response.metadata.filters.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return retailers', (done) => {
    const ss = new ShopStyle('test');
    ss.retailers().then((response) => {
      expect(response.retailers.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return lists', (done) => {
    const ss = new ShopStyle('test');
    const options = {
      userId: 'fred',
    };
    ss.lists(options).then((response) => {
      expect(response.lists.length).toBeGreaterThan(0);
      done();
    });
  });

  it('works without cache', (done) => {
    const ss = new ShopStyle('test', 'US', false);
    const options = {
      userId: 'fred',
    };
    ss.lists(options).then((response) => {
      expect(response.lists.length).toBeGreaterThan(0);
      done();
    });
  });

  it('rejects a bad request', (done) => {
    const bad = new ShopStyle('YOUR_API_KEY');
    bad.brands().then(
      () => done.fail('should have rejected'),
      () => done()
    );
  });

  // no 'spec', but shows in coverage if the
  // cache code path is called -- this test
  // caught a bug!  Go code coverage!
  it('uses the cache', (done) => {
    const ss = new ShopStyle('test');
    ss.brands()
      .then(() => ss.brands().then(() => done()),
      e => done.fail(e));
  });
});

