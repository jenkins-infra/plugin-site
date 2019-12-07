/* eslint-env jest */

const axios = require('axios');
const fs = require('fs');

const gatsbyNode = require('./gatsby-node.js');

describe('main', function () {
  beforeEach(() => {
    this.activityReturn = {
      start: jest.fn(),
      end: jest.fn()
    };
    this.sourceNodeOptions = {
      reporter: {
        activityTimer: jest.fn().mockReturnValue(this.activityReturn),
        panic: jest.fn()
      },
      actions: {
        createNode: jest.fn()
      }
    };
  });
  it('valid test', async () => {
    // axios.get = jest.fn().mockReturnValue(
    //  Promise.resolve({
    //    status: 200,
    //    data: content
    //  })
    // );

    const ret = await gatsbyNode.sourceNodes(this.sourceNodeOptions, {
    });
    expect(this.sourceNodeOptions.reporter.panic.mock.calls).toEqual([]);
    expect(this.sourceNodeOptions.actions.createNode.mock.calls[0]).toEqual([
      {
        book: {
          authors: [
            {
              average_rating: '3.93',
              id: '4764',
              imageUrl:
                'https://images.gr-assets.com/authors/1264613853p5/4764.jpg',
              link: 'https://www.goodreads.com/author/show/4764.Philip_K_Dick',
              name: 'Philip K. Dick',
              ratings_count: '847302',
              smallImageUrl:
                'https://images.gr-assets.com/authors/1264613853p2/4764.jpg',
              text_reviews_count: '43138'
            }
          ],
          bookID: '7082',
          description:
            'It was January 2021, and Rick Deckard had a license to kill.<br />Somewhere among the hordes of humans out there, lurked several rogue androids. Deckard\'s assignment--find them and then..."retire" them. Trouble was, the androids all looked exactly like humans, and they didn\'t want to be found!',
          imageUrl: 'https://images.gr-assets.com/books/1519481930m/7082.jpg',
          isbn: '0345404475',
          isbn13: '9780345404473',
          largeImageUrl: '',
          link:
            'https://www.goodreads.com/book/show/7082.Do_Androids_Dream_of_Electric_Sheep_',
          smallImageUrl:
            'https://images.gr-assets.com/books/1519481930s/7082.jpg',
          textReviewsCount: '7303',
          title: 'Do Androids Dream of Electric Sheep?',
          titleWithoutSeries: 'Do Androids Dream of Electric Sheep?',
          uri: 'kca://book/amzn1.gr.book.v1.E-BSx4-7_dQupxRqJI5kMg'
        },
        children: [],
        id: '226999906',
        internal: {
          contentDigest: '23712eabb6275a9a06db64b131572eaa',
          type: 'GoodreadsBook'
        },
        parent: null,
        review: {
          dateAdded: '2011-10-24T17:42:54.000Z',
          dateUpdated: '2011-10-24T17:45:54.000Z',
          rating: 4,
          readAt: '2011-10-24T07:00:00.000Z',
          reviewID: '226999906',
          spoilerFlag: 'false',
          spoilersState: 'none',
          startedAt: '2011-10-20T07:00:00.000Z',
          votes: 0
        },
        shelfNames: ['read', 'dont-own']
      }
    ]);
    expect(true).toBeTruthy();
  });
});
