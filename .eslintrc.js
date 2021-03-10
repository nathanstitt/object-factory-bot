module.exports = {
    "env": {
        "browser": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": 12,
        "sourceType": "module",
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "settings": {
    },
    "rules": {
        '@typescript-eslint/ban-types': 0,
        'import/prefer-default-export': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-unused-vars': ["error", { "ignoreRestSiblings": true }],
        'no-unused-vars': ["error", { "ignoreRestSiblings": true }],
    },
}
