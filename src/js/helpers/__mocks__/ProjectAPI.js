export const mockGetCategoriesDir = jest.fn();
export const mockIsCategoryLoaded = jest.fn();
export const mockSetCategoryLoaded = jest.fn();
export const mockImportCategoryGroupData = jest.fn();
export const mockGetBookId = jest.fn();
export const mockGetSelectedCategories = jest.fn();
export const mockSetSelectedCategories = jest.fn();
export const mockSetCategoryGroupIds = jest.fn();
export const mockResetCategoryGroupIds = jest.fn();
export const mockHasNewGroupsData = jest.fn();
export const mockResetLoadedCategories = jest.fn();
export const mockRemoveStaleCategoriesFromCurrent = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    setCategoryGroupIds: mockSetCategoryGroupIds,
    getCategoriesDir: mockGetCategoriesDir,
    isCategoryLoaded: mockIsCategoryLoaded,
    setCategoryLoaded: mockSetCategoryLoaded,
    importCategoryGroupData: mockImportCategoryGroupData,
    getBookId: mockGetBookId,
    getSelectedCategories: mockGetSelectedCategories,
    setSelectedCategories: mockSetSelectedCategories,
    resetCategoryGroupIds: mockResetCategoryGroupIds,
    hasNewGroupsData: mockHasNewGroupsData,
    resetLoadedCategories: mockResetLoadedCategories,
    removeStaleCategoriesFromCurrent: mockRemoveStaleCategoriesFromCurrent
  };
});

export default mock;
