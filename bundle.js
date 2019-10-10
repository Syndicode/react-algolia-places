'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var algoliasearch = _interopDefault(require('algoliasearch'));

const getLocalizedString = value => {
  const string = value ? value.default : null;
  if (Array.isArray(string)) {
    return string[0];
  }

  return string;
};

const getAdministrativeName = ({ administrative }) =>
  administrative && administrative[0];
const getCityName = ({ locale_names }) => getLocalizedString(locale_names);
const getCountryName = ({ country }) => getLocalizedString(country);
const getCountyName = ({ county }) => getLocalizedString(county);

const formatResult = (city, country, administrative, county) =>
  [city, country, administrative, county].filter(str => !!str).join(", ");

const formatInputValue = (city, country) =>
  [city, country].filter(Boolean).join(", ");

const transformHit = hit => {
  const { objectID } = hit;
  const administrative = getAdministrativeName(hit);
  const city = getCityName(hit);
  const country = getCountryName(hit);
  const county = getCountyName(hit);
  const formatted = formatResult(city, country, administrative, county);

  return {
    administrative,
    city,
    country,
    county,
    formatted,
    objectID,
  };
};

const noop = () => {};

const AlgoliaPlaces = ({
  apiKey,
  appId,
  children,
  defaultValue,
  formatInputValue: formatInputValue$1 = formatInputValue,
  hitTransformer = transformHit,
  onSelect = noop,
  render,
  searchConfig,
}) => {
  // Setup algoliasearch placesClient client
  const placesClient = react.useMemo(() => algoliasearch.initPlaces(appId, apiKey), [
    appId,
    apiKey,
  ]);
  const searchPlace = query => placesClient.search(query, searchConfig);

  // Setup hooks
  const [error, setError] = react.useState(null);
  const [inputValue, setInputValue] = react.useState("");
  const [loading, setLoading] = react.useState(false);
  const [options, setOptions] = react.useState(null);
  react.useEffect(() => {
    const getPlaceObject = objectID =>
      placesClient.getObject(objectID, searchConfig);

    const getPlaceById = async defaultValue => {
      setLoading(true);
      getPlaceObject(defaultValue)
        .then(result => {
          setLoading(false);
          const { city, country } = hitTransformer(result);
          setInputValue(formatInputValue$1(city, country));
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
    formatInputValue$1,
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
          setInputValue(formatInputValue$1(city, country));
          onSelect(objectID, option);
        },
      };
    },
  });
};

module.exports = AlgoliaPlaces;
