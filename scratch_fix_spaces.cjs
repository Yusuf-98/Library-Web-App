const fs = require('fs');

const files = [
  'src/components/common/CardAuthor.tsx',
  'src/components/common/CardBook.tsx',
  'src/components/common/CardCategory.tsx',
  'src/components/common/CardMyReview.tsx',
  'src/components/common/GiveReviewModal.tsx',
  'src/components/common/ListCart.tsx',
  'src/components/common/Navbar.tsx',
  'src/components/common/SearchOverlay.tsx',
  'src/index.css',
  'src/pages/admin/AdminBookFormPage.tsx',
  'src/pages/admin/AdminBookListPage.tsx',
  'src/pages/admin/AdminBorrowedListPage.tsx',
  'src/pages/admin/AdminUserListPage.tsx',
  'src/pages/BookByAuthorPage.tsx',
  'src/pages/BookDetailPage.tsx',
  'src/pages/CartPage.tsx',
  'src/pages/CategoryPage.tsx',
  'src/pages/CheckoutPage.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/MyLoansPage.tsx',
  'src/pages/MyProfilePage.tsx',
  'src/pages/ReviewsPage.tsx',
  'src/pages/SuccessPage.tsx',
];

// Matches calc(<expr with spaces>) and replaces internal spaces with underscores
const calcRegex = /calc\(([^)]*)\)/g;

let totalReplacements = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let count = 0;
  const updated = content.replace(calcRegex, (match, inner) => {
    if (!inner.includes(' ')) return match;
    count++;
    return `calc(${inner.replace(/ /g, '_')})`;
  });
  if (count > 0) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`${file}: ${count} replacement(s)`);
    totalReplacements += count;
  } else {
    console.log(`${file}: 0 replacements`);
  }
}

console.log(`\nTotal: ${totalReplacements} calc() space fixes`);
