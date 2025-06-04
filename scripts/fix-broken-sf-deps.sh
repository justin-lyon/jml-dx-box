fixbrokensfdeps(){
  rm -rf node_modules 2>/dev/null
  rm -f package-lock.json 2>/dev/null

  npm install -D \
    eslint@^9.0.0 \
    @lwc/eslint-plugin-lwc@^3.0.0 \
    @salesforce/eslint-config-lwc@^4.0.0 \
    @salesforce/eslint-plugin-lightning@^2.0.0 \
    eslint-plugin-jest@^28.11.1 \
    @salesforce/eslint-plugin-aura@^3.0.0


  curl -sSL \
    "https://gist.githubusercontent.com/surajp/17f8a581a90f1c238ec9a92bf771f52c/raw/8e48d98cf7419c005746c1754aac0187959d5012/eslint-config.js" \
    -o eslint.config.js
}
