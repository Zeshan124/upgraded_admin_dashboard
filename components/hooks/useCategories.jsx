import useSWR from 'swr';
import { fetchAllCategories } from '~/services/categoryService';


function useCategories(initialCategory = []) {
    
    const { data: categoryData, error: categoryError, isLoading: categoryLoading, mutate } = useSWR(
        '/categories/get',
        fetchAllCategories,
        {
            initialData: initialCategory,
        }
    );

    return {
        categoryData,
        categoryError,
        categoryLoading,
        mutate,
    };
}

export default useCategories;
