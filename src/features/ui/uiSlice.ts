import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  searchQuery: string;
  selectedCategory: string;
  isSearchOpen: boolean;
}

const initialState: UiState = {
  searchQuery: '',
  selectedCategory: '',
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    openSearch(state) {
      state.isSearchOpen = true;
    },
    closeSearch(state) {
      state.isSearchOpen = false;
      state.searchQuery = '';
    },
  },
});

export const { setSearchQuery, setSelectedCategory, openSearch, closeSearch } = uiSlice.actions;
export default uiSlice.reducer;
