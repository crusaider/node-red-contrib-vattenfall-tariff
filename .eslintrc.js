module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  plugins: ["jest"],
  extends: ["standard", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.spec.js"],
      env: {
        jest: true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "error",
  },
};
