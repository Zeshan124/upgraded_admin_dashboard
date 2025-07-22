import { Select, Spin } from "antd";
import { useState } from "react";
import { SapItemLookup } from "~/api/OMSService";


export default function SearchItemCode({ onSelect }) {
    const [data, setData] = useState([]);
    const [value, setValue] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchText) => {
        if (!searchText) {
            setData([]);
            return;
        }

        setLoading(true);

        try {
            const results = await SapItemLookup(searchText);
            console.log(results, 'results')
            setData(results.map((item) => ({ value: item.ItemCode, label: item.ItemName })));
        } catch (error) {
            console.error("Search failed:", error);
        }

        setLoading(false);
    };

    const handleChange = (selectedValue) => {
        setValue(selectedValue);
        if (onSelect) onSelect(selectedValue);
    };
    return (

        <Select
            showSearch
            value={value}
            placeholder="Search Code..."
            className="custom-search-item"
            style={{ width: '100%', height: '50px' }}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={loading ? <Spin size="small" /> : "No items found"}
            options={data}
        />

    )
}