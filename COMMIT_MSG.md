feat(malla): snapshot real + piezas referenciadas/snapshot interactivas; fix merges/aspecto/gaps; toolbar (congelar/duplicar/eliminar) y DnD con snap

### Resumen
Migrated ESLint configuration to place JSX flags under parserOptions, removing the unsupported languageOptions.ecmaFeatures entry

Added explicit .ts extensions for internal imports so Node’s test runner can resolve modules like block-clone and block-active

Consolidated curriculum type declarations and added an optional origin reference for snapshots, eliminating duplicate interfaces

Dropped an obsolete eslint-disable directive from the expression evaluator to keep lint output clean
