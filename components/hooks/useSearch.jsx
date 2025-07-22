import { useState, useEffect } from "react";
import { searchUser } from "~/api/userService";
import useDebounce from '~/components/hooks/useDebounce'
const useSearch = (searchAPI, token="") => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchedData, setSearchedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedSearchKeyword = useDebounce(searchKeyword, 500); // 500ms delayx
    const debouncedSelectedCategory = useDebounce(selectedCategory, 500); // Adjust delay as needed

    useEffect(() => {
        if (debouncedSearchKeyword.trim() !== "" || debouncedSelectedCategory !== '') {
            search();
        } else {
            setSearchedData([]);
            setIsLoading(false);
        }
    }, [debouncedSearchKeyword, debouncedSelectedCategory]); // Depend on the debounced values

    const search = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await searchAPI(debouncedSearchKeyword, debouncedSelectedCategory);
            setSearchedData(response.data);
        } catch (error) {
            setError(error);
        }
        setIsLoading(false);
    };

    // useEffect(() => {
    //     console.log(selectedCategory, searchKeyword )
    //     if (searchKeyword.trim() !== "" || selectedCategory !=='') {
    //         console.log('search()', searchKeyword, selectedCategory )
    //         search();
    //     } else {
    //         console.log(selectedCategory)
    //         setSearchedData([]);
    //     }
    // }, [searchKeyword, selectedCategory]); //

    // const search = async () => {
    //     console.log('search')
    //     setIsLoading(true);
    //     setError(null);
    //     try {
            
    //         const response = await searchAPI(searchKeyword, selectedCategory);
    //         setSearchedData(response.data);
    //     } catch (error) {
    //         setError(error);
    //     }
    //     setIsLoading(false);
    // };

    const handleSearch = (keywordValue, category) => {
        if (keywordValue !==''){
            setSearchKeyword(keywordValue);
        }
        if (category !== '') {
            setSelectedCategory(category);
        }
        
    };
    const handleCategoryChange = (slug) => {
        setSelectedCategory(slug);
    };

    return {
        searchKeyword,
        setSearchKeyword,
        handleCategoryChange,
        selectedCategory,
        searchedData,
        isLoading,
        error,
        handleSearch,
    };
};

export default useSearch;
