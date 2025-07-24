import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";

import ContainerDefault from "~/components/layouts/ContainerDefault";
import Pagination from "~/components/elements/basic/Pagination";
import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import TableAreaItems from "~/components/shared/tables/TableAreaItems";
import FormCreateAreaCity from "~/components/shared/forms/FormCreateAreaCity";

import { toTitleCase } from "~/util";
import { fetchCities } from "~/services/cityService";

import axiosInstance from "~/services/axiosInstance";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";

const { Option } = Select;

const CityAreaPage = ({ cities: initialCities }) => {
  const {
    data: cities,
    error: cityDataError,
    isLoading: isLoadingCityData,
    mutate,
  } = useSWR("/cities/get", fetchCities, { initialData: initialCities });
  const [selectedCity, setSelectedCity] = useState(
    initialCities[0]?.cityID || null
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const handleCityChange = (value) => {
    setSelectedCity(value);
  };

  if (cityDataError) return <div>Error Fetching Data</div>;
  if (isLoadingCityData || !cities) return <LoadingSpinner />;
  return (
    <ContainerDefault>
      <HeaderDashboard
        title="City/Area"
        description="QistBazaar Area Listing"
      />
      <ErrorBoundary>
        <section className="ps-dashboard ps-items-listing">
          <div className="ps-section__left">
            <div className="ps-section__header">
              <div className="pl-2">
                <FormSearchSimple />
              </div>
              <div className="pb-3 pl-2" style={{ maxWidth: "365px" }}>
                <Select
                  placeholder="Select City"
                  className="ps-ant-dropdown"
                  listItemHeight={20}
                  onChange={handleCityChange}
                  value={selectedCity}
                >
                  {cities?.map((item) => (
                    <Option key={item.cityID} value={item.cityID}>
                      {toTitleCase(item.cityName)}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="ps-section__content">
              <TableAreaItems cityData={cities} selectedCity={selectedCity} />
              {/* <div className="ps-section__footer">
                <p>Show 5 in 30 items.</p>
                <Pagination />
              </div> */}
            </div>
          </div>
          <div className="ps-section__right">
            <FormCreateAreaCity cityData={cities} mutate={mutate} />
          </div>
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};

export async function getStaticProps() {
  try {
    const citiesData = await fetchCities();
    return {
      props: {
        cities: citiesData,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        cities: [],
      },
    };
  }
}

export default connect((state) => state.app)(CityAreaPage);
