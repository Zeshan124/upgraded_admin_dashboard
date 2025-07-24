import React, { useState } from 'react';
import useSWR from 'swr';
import { addArea, fetchAllAreas } from '~/services/areaService';
import { addCity } from '~/services/cityService';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import { toTitleCase } from '~/util';

const FormCreateAreaCity = ({ cityData, mutate }) => {
    const { mutate: mutateArea } = useSWR('/areas/get', fetchAllAreas);
    const { showSuccess, showError, contextHolder } = useMessageHandler();

    const [formData, setFormData] = useState({
        name: '',
        city: '',
    });

    const formOnChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const resetFormDataHandler = () => {
        setFormData({
            name: '',
            city: '',
        });
    };

    const submitFormHandler = async (event) => {
        event.preventDefault();
        const { name, city } = formData;

        if (!name.trim()) {
            showError('Please provide a valid name.');
            return;
        }

        try {
            let response;
            if (city) {
                response = await addArea({ areaName: name, cityID: city, createdBy: 11 });
                await mutateArea();
            } else {
                response = await addCity(name);
                await mutate();
            }

            if (response && response.status === 200) {
                showSuccess(response.data.message || 'Successfully Inserted');
            }
            showError(response.data.message || 'Error Inserting Data');
        } catch (error) {

            showError('Error Inserting Data');
            console.error('Error adding area/city:', error);
        }
    };

    return (
        <ErrorBoundary>
            {contextHolder}
            <form onSubmit={submitFormHandler} className="ps-form ps-form--new" action="index.html" method="get">
                <div className="ps-form__content">
                    <div className="form-group">
                        <label>Name<sup>*</sup></label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Area/City name"
                            name="name"
                            onChange={formOnChangeHandler}
                            value={formData.name}
                        />
                    </div>
                    <div className="form-group form-group--select">
                        <label>City</label>
                        <div className="form-group__content">
                            <select
                                className="ps-select"
                                title="Select City"
                                onChange={formOnChangeHandler}
                                name="city"
                                value={formData.city}
                            >
                                <option value="">Select City</option>
                                {cityData && cityData?.map((item) => (
                                    <option value={item.cityID} key={item.cityID}>
                                        {toTitleCase(item.cityName)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="ps-form__bottom">
                    <button className="ps-btn ps-btn--gray" onClick={resetFormDataHandler}>
                        Reset
                    </button>
                    <button className="ps-btn ps-btn--submit success" type="submit">
                        Add new
                    </button>
                </div>
            </form>
        </ErrorBoundary>
    );
};

export default FormCreateAreaCity;
