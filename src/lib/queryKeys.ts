export const queryKeys = {
  cart: {
    all: ['cart'] as const,
    checkout: ['cart', 'checkout'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  authors: {
    popular: ['authors', 'popular'] as const,
  },
  books: {
    all: ['books'] as const,
    home: ['books', 'home'] as const,
    search: (query: string) => ['books', 'search', query] as const,
    detail: (bookId: number | null) => ['books', 'detail', bookId] as const,
    author: (authorId: number) => ['books', 'author', authorId] as const,
    category: (categoryId: number, minRating?: number) =>
      ['books', 'category', categoryId, minRating] as const,
    related: (categoryId: number) => ['books', 'related', categoryId] as const,
  },
  loans: {
    all: ['loans'] as const,
    my: (status: string, query: string) =>
      ['loans', 'my', status, query] as const,
  },
  reviews: {
    my: ['reviews', 'my'] as const,
    book: (bookId: number | null) => ['reviews', bookId] as const,
  },
  me: {
    all: ['me'] as const,
  },
  admin: {
    users: (query: string, page: number) =>
      ['admin', 'users', query, page] as const,
    books: {
      all: ['admin', 'books'] as const,
      list: (status: string, query: string, page: number) =>
        ['admin', 'books', status, query, page] as const,
    },
    loans: {
      all: ['admin', 'loans'] as const,
      list: (status: string, query: string, page: number) =>
        ['admin', 'loans', status, query, page] as const,
    },
  },
};
