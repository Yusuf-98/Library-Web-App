// ===== Pagination =====

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ===== Book =====

export interface BookAuthor {
  id: number;
  name: string;
  bio?: string | null;
}

export interface BookCategory {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number | null;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  authorId: number;
  categoryId: number;
  author: BookAuthor;
  category: BookCategory;
}

export interface PaginatedBooks {
  books: Book[];
  pagination: Pagination;
}

export interface AuthorBooksResponse extends PaginatedBooks {
  author: BookAuthor;
  bookCount: number;
}

// ===== Category =====

export interface Category {
  id: number;
  name: string;
}

// ===== Author =====

export interface Author {
  id: number;
  name: string;
  bio?: string | null;
  bookCount: number;
  accumulatedScore?: number;
}

// ===== Cart =====

export interface CartItem {
  id: number;
  bookId: number;
  addedAt: string;
  book: Book;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  itemCount: number;
}

export interface CheckoutUser {
  name: string;
  email: string;
  nomorHandphone: string;
}

export interface CheckoutResponse {
  user: CheckoutUser;
  items: CartItem[];
  itemCount: number;
}

export interface FromCartLoan {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  returnByMessage: string;
}

export interface FromCartFailure {
  cartItemId: number;
  bookId: number;
  reason: string;
}

export interface FromCartResponse {
  loans: FromCartLoan[];
  failed: FromCartFailure[];
  removedFromCart: number;
  message: string;
}

// ===== Loan =====

export type LoanStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE' | string;

export interface Loan {
  id: number;
  status: LoanStatus;
  displayStatus: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays: number;
  book: Book;
}

export interface AdminLoan extends Loan {
  borrower: { id: number; name: string; email: string; phone: string | null };
}

// ===== Review =====

export interface Review {
  id: number;
  bookId: number;
  userId: number;
  star: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string };
}

export interface MyReview {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  book: Book;
}

export interface CreatedReview {
  id: number;
  bookId: number;
  userId: number;
  star: number;
  comment: string | null;
  createdAt: string;
}

// ===== User =====

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  role: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  profilePhoto: string | null;
  createdAt: string;
}

export interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

export interface MyProfileResponse {
  profile: UserProfile;
  loanStats: LoanStats;
  reviewsCount: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}
