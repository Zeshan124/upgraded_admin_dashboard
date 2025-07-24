import useSWR from 'swr';
import { fetchProductCategories } from '~/services/categoryService';


function useCategoryandSub(initialCategory = []) {

    const { data: CategorySubcategory, error: categoryError, isLoading: categoryLoading, mutate } = useSWR(
        '/products-categories',
        fetchProductCategories,
        {
            initialData: initialCategory,
        }
    );

    return {
        CategorySubcategory,
        categoryError,
        categoryLoading,
        mutate,
    };
}

export default useCategoryandSub;
