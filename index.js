import { useEffect, useState, useMemo } from "react";
import algoliasearch from "algoliasearch";

import {
  transformHit,
  formatInputValue as defaultFormatInputValue,
} from "./utils";

const noop = () => {};

const AlgoliaPlaces = ({
  apiKey,
  appId,
  children,
  defaultValue,
  formatInputValue = defaultFormatInputValue,
  hitTransformer = transformHit,
  onSelect = noop,
  render,
  searchConfig,
}) => {
  // Setup algoliasearch placesClient client
  const placesClient = useMemo(() => algoliasearch.initPlaces(appId, apiKey), [
    appId,
    apiKey,
  ]);
  const searchPlace = query => placesClient.search(query, searchConfig);

  // Setup hooks
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  useEffect(() => {
    const getPlaceObject = objectID =>
      placesClient.getObject(objectID, searchConfig);

    const getPlaceById = async defaultValue => {
      setLoading(true);
      getPlaceObject(defaultValue)
        .then(result => {
          setLoading(false);
          const { city, country } = hitTransformer(result);
          setInputValue(formatInputValue(city, country));
        })
        .catch(error => {
          setLoading(false);
          setError(error);
        });
    };

    if (defaultValue) {
      getPlaceById(defaultValue);
    }
  }, [
    defaultValue,
    formatInputValue,
    hitTransformer,
    placesClient,
    searchConfig,
  ]);

  const clear = () => {
    onSelect(null);
    setInputValue("");
    setOptions(null);
  };

  return (render || children)({
    clear,
    error,
    loading,
    options,
    getInputProps() {
      return {
        value: inputValue,
        onChange(e) {
          const query = e.target.value;
          setInputValue(query);
          if (query && query.length > 1) {
            setLoading(true);

            searchPlace(query)
              .then(results => {
                setLoading(false);
                const optionsList = results.hits.map(hitTransformer);
                setOptions(optionsList);
              })
              .catch(error => {
                setLoading(false);
                setError(error);
              });
          }
        },
      };
    },
    getOptionProps(option) {
      const { city, country, objectID } = option;

      return {
        title: option.formatted,
        disabled: loading,
        onClick() {
          setOptions(null);
          setInputValue(formatInputValue(city, country));
          onSelect(objectID, option);
        },
      };
    },
  });
};

export default AlgoliaPlaces;
