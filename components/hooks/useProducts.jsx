import useSWR from 'swr';
import { fetchAllProducts } from '~/api/productService';

function useProducts(initialProduct=[]) {
    const { data: productData, error: errorProduct, isLoading: isLoadingProduct, mutate: mutateProduct } = useSWR('/all-products',
        fetchAllProducts, {
        initialData: initialProduct,
    });

    return {
        productData,
        errorProduct,
        isLoadingProduct,
        mutateProduct,
    };
}

export default useProducts;
