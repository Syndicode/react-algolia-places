# @syndicode/react-algolia-places

![img](syndicode-react-team-150.png)

Modern ReactJS component that provides functionality of [Algolia Places](https://community.algolia.com/places/).

This component is different from other available in npm because it doesn't use Algolia's ["places.js"](https://github.com/algolia/places) package but rather use ["algoliasearch"](https://github.com/algolia/algoliasearch-client-javascript) core package allowing you to use its power with your component's UI.

## Installation

NOTE: "react" and "algoliasearch" aren't bundled within this package, so you have to install them separately.

```bash
yarn add react algoliasearch
yarn add @syndicode/react-algolia-places
```

## Usage

```jsx
<AlgoliaPlaces
  defaultValue={defaultValue}
  apiKey={process.env.REACT_APP_ALGOLIA_PLACES_API_KEY}
  appId={process.env.REACT_APP_ALGOLIA_PLACES_APP_ID}
  onSelect={objectID => {
    console.log(objectID);
  }}
  searchParams={searchParams}
>
  {({ clear, error, loading, options, getInputProps, getOptionProps }) => (
    <>
      <input {...getInputProps()} />
      <ul>
        {options &&
          options.map(option => {
            // NOTE: you have to pass the option down to the getOptionProps() method
            return <li {...getOptionProps(option)} key={option.objectID}>{option.city}</li>;
          })}
      </ul>
    </>
  )}
</AlgoliaPlaces>
```

### Component's props

```
apiKey: String
appId: String # Your algolia's app apiKey and appId
defaultValue: String # Pass down objectID to prefetch result and fill in the input
onSelect(objectID: String, option: Option): String #
searchParams: searchParams
render | children - render prop
formatInputValue(hit: Hit): String - redefine default transformer for the inputs value on option select
hitTransformer(hit: Hit): Option - redefine default transformer for formatted option
```

### Render props parameters

```
clear() - change selected value to `null`, reset all search results
error: Object -
getInputProps() - method that creates props object to pass onto input element
getOptionProps(option: Option) - method that creates props object to pass onto option component
loading: Boolean - whether search request is in progress
options: [Option] - list of formatted algolia places search results
```

### Types

```graphql
type Option {
  administrative: String
  city: String
  country: String
  county: String
  formatted: String # City, Country, Administrative, County
  objectID: String # id of the selected object
}
```

See algolia docs for more info

- search params options - https://community.algolia.com/places/api-clients.html#search-parameters
- hit's shape - https://community.algolia.com/places/api-clients.html#json-answer
