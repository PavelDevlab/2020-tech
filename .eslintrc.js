module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
//     "airbnb",
    "eslint:recommended",
    "prettier"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "plugins": [
    "jsx-a11y",
    "react",
    "prettier",
    "@typescript-eslint"
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    // "import/no-extraneous-dependencies": ["error", {
    //   "devDependencies": [
    //     "./internals/**",
    //   ],
    // }],
    // "import/no-dynamic-require": 0,
    // "import/no-webpack-loader-syntax": 0,
    // "jsx-a11y/media-has-caption": 0,
    // "no-loop-func": 0,
    // "no-bitwise": 0,
    // "react/forbid-prop-types": 0,
    // // "react/jsx-filename-extension": 0,
    // "no-script-url": 0,
    // "class-methods-use-this": 0,
    // "import/prefer-default-export": 0,
    // "react/sort-prop-types": "error",
    // "react/jsx-sort-props": "error",
    // "react/jsx-sort-default-props": "error",
    "linebreak-style": "off"
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "./internals/webpack/client/webpack.prod.babel.js"
      }
    },
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      "flowVersion": "0.53" // Flow version
    },
    "propWrapperFunctions": [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn"t set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      {"property": "freeze", "object": "Object"},
      {"property": "myFavoriteWrapper"}
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {"name": "Link", "linkAttribute": "to"}
    ]
  }
};
