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

export const formatResult = (city, country, administrative, county) =>
  [city, country, administrative, county].filter(str => !!str).join(", ");

export const formatInputValue = (city, country) =>
  [city, country].filter(Boolean).join(", ");

export const transformHit = hit => {
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
