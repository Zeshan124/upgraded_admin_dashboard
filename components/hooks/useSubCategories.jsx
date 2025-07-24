import useSWR from 'swr';
import { fetchAllSubCategories } from '~/services/subCategoryService';


function useSubCategories(initialSubcategory = []) {
    const { data: subCategoryData, error: subCategoryError, isLoading: subCategoryLoading, mutate } = useSWR(
        '/subcategories/get',
        fetchAllSubCategories,
        {
            initialData: initialSubcategory,
            revalidateOnFocus: false,
        }
    );

    return {
        subCategoryData,
        subCategoryError,
        subCategoryLoading,
        mutate
    };
}

export default useSubCategories;
