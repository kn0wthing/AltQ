import assert from 'assert';
import * as mruUtils from './mruUtils';

describe('Tab registry', function () {
  it('pushes tabs correctly', function () {
    const tabActivations = [
      {
        id: 1,
        title: '1 tab',
        url: '1 tab url',
        favIconUrl: '1 tab favicon',
      }, {
        id: 2,
        title: '2 tab',
        url: '2 tab url',
        favIconUrl: '2 tab favicon',
      }, {
        id: 3,
        title: '3 tab',
        url: '3 tab url',
        favIconUrl: '3 tab favicon',
      }, {
        id: 4,
        title: '4 tab',
        url: '4 tab url',
        favIconUrl: '4 tab favicon',
      }, {
        id: 2,
        title: '2 tab',
        url: '2 tab url',
        favIconUrl: '2 tab favicon',
      }, {
        id: 3,
        title: '3 tab',
        url: '3 tab url',
        favIconUrl: '3 tab favicon',
      },
    ];

    const resultRegistry = [
      {
        id: 3,
        title: '3 tab',
        url: '3 tab url',
        favIconUrl: '3 tab favicon',
      }, {
        id: 2,
        title: '2 tab',
        url: '2 tab url',
        favIconUrl: '2 tab favicon',
      },
      {
        id: 4,
        title: '4 tab',
        url: '4 tab url',
        favIconUrl: '4 tab favicon',
      },
      {
        id: 1,
        title: '1 tab',
        url: '1 tab url',
        favIconUrl: '1 tab favicon',
      },
    ];

    tabActivations.forEach(activeTab => mruUtils.push(activeTab));
    assert.deepStrictEqual(mruUtils.getTabs(), resultRegistry);
  });

  it('removes tabs correctly', function () {
    const tabActivations = [
      {
        id: 3,
        title: '3 tab',
        url: '3 tab url',
        favIconUrl: '3 tab favicon',
      }, {
        id: 2,
        title: '2 tab',
        url: '2 tab url',
        favIconUrl: '2 tab favicon',
      },
      {
        id: 4,
        title: '4 tab',
        url: '4 tab url',
        favIconUrl: '4 tab favicon',
      },
      {
        id: 1,
        title: '1 tab',
        url: '1 tab url',
        favIconUrl: '1 tab favicon',
      },
    ];
    const resultRegistry = [
      {
        id: 7,
        title: '7 tab',
        url: '7 tab url',
        favIconUrl: '7 tab favicon',
      },
      {
        id: 2,
        title: '2 tab',
        url: '2 tab url',
        favIconUrl: '2 tab favicon',
      },
      {
        id: 1,
        title: '1 tab',
        url: '1 tab url',
        favIconUrl: '1 tab favicon',
      },
    ];
    mruUtils.init(tabActivations);
    mruUtils.remove(4);
    mruUtils.remove(3);
    mruUtils.push({
      id: 7,
      title: '7 tab',
      url: '7 tab url',
      favIconUrl: '7 tab favicon',
    });
    assert.deepStrictEqual(mruUtils.getTabs(), resultRegistry);
  });

  it('updates tab with new info', function () {
    const tabActivations = [
      {
        id: 3,
        title: '3 tab',
        url: '3 tab url',
        favIconUrl: '3 tab favicon',
      }, {
        id: 2,
        title: '2 tab',
        url: '2 tab url',
        favIconUrl: '2 tab favicon',
      },
      {
        id: 4,
        title: '4 tab',
        url: '4 tab url',
        favIconUrl: '4 tab favicon',
      },
      {
        id: 1,
        title: '1 tab',
        url: '1 tab url',
        favIconUrl: '1 tab favicon',
      },
    ];
    const resultRegistry = [
      {
        id: 3,
        title: '3 tab',
        url: '3 tab url',
        favIconUrl: '3 tab favicon',
      }, {
        id: 2,
        title: '2 tab updated',
        url: '2 tab url updated',
        favIconUrl: '2 tab favicon updated',
      },
      {
        id: 4,
        title: '4 tab',
        url: '4 tab url',
        favIconUrl: '4 tab favicon',
      },
      {
        id: 1,
        title: '1 tab',
        url: '1 tab url',
        favIconUrl: '1 tab favicon',
      },
    ];
    mruUtils.init(tabActivations);
    mruUtils.update({
      id: 2,
      title: '2 tab updated',
      url: '2 tab url updated',
      favIconUrl: '2 tab favicon updated',
    });
    assert.deepStrictEqual(mruUtils.getTabs(), resultRegistry);
  });
});
