module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
  ],
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 14,
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'plugins': ['import'],
  'rules': {
    // CommonJS形式での記述を禁止(module.exports,require)
    'import/no-commonjs': 'error',
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    // consoleは使用可能
    'no-console': 'off',
    // 使用していない変数宣言は行わない
    'no-unused-vars': 'warn',
    // ネストの中での関数と変数の宣言は許可
    'no-inner-declarations': 'off',
    // インデント設定
    'indent': [
      'warn',
      2, // 半角スペース2文字
      {
        // switch-case にインデントを入れる
        'SwitchCase': 1,
        // .property はインデント無し
        'MemberExpression': 0,
        // 三項演算子は保留(ずれてもよい)
        'ignoredNodes': ['ConditionalExpression'],
      }
    ],
    // 演算子の前後にスペースを入れる
    'space-infix-ops': 'warn',
    // if や for の {} は必須
    'curly': 'warn',
    // if や for の後ろにスペースを入れる
    'keyword-spacing': 'warn',
    // if や for の {} を1行で書くときは内側にスペースを入れる
    'block-spacing': 'warn',
    // ブロックの前にスペースを入れる
    'space-before-blocks': 'warn',
    // 関数宣言の () の前にスペースを入れる
    'space-before-function-paren': 'warn',
    // 関数実行の () の前にはスペースを入れない
    'no-spaced-func': 'warn',
    // オブジェクトの {} の内側にスペースを入れる
    'object-curly-spacing': ['warn', 'always'],
    // オブジェクトの : の前後のスペースを指定
    'key-spacing': [
      'warn',
      { 'beforeColon': false, 'afterColon': true, 'mode': 'minimum' }
    ],
    // コンマの前はスペースなし、コンマの後ろにはスペースを入れる
    'comma-spacing': ['warn', { 'before': false, 'after': true }],
    // コメントの'//'と文字の間にスペースを入れる。ただし、'*'は例外とする。
    'spaced-comment': ['warn', 'always', { 'exceptions': ['*'] }],
    // 行末のスペースは無し
    'no-trailing-spaces': 'warn',
    // linuxのvi (テキストエディタ) で編集すると、ファイル末尾に改行が付与される。
    // 環境への依存性を下げるために、常に付与しておく。
    'eol-last': 'warn',
    // 三項演算子の入れ子は不可
    'no-nested-ternary': 'warn',
    // アロー関数の引数の括弧は必要
    'arrow-parens': 'warn',
    // アロー関数の矢印の前後にスペースを入れる
    'arrow-spacing': 'warn',
    // アロー関数でもreturnの省略は禁止
    'arrow-body-style': ['error', 'always'],
    // varは使わない
    'no-var': 'error',
    // .は同じ行で記載する
    'dot-location': ['warn', 'property'],
    // 厳密等価演算子(===)のみ許可し、等価演算子(==)は許可しない
    'eqeqeq': 'error',
    // if-elseやtry-catch文の改行を必須とする
    'brace-style': ['warn', 'stroustrup', { 'allowSingleLine': true }],
  },
  'overrides': [
    // cjsファイルのみCommonJS形式を許可する
    {
      'files': ['**/*.cjs'],
      'rules': {
        'import/no-commonjs': 'off',
      }
    },
    // vueファイル用設定
    {
      'files': ['**/*.vue'],
      'env': {
        'vue/setup-compiler-macros': true
      },
      'extends': [
        'plugin:vue/vue3-recommended',
      ],
      // 'rules': {
      //   // 中身のないタグの閉じ方
      //   'vue/html-self-closing': ['warn', {
      //     'html': {
      //       // 普通のHTMLにあるタグは、通常通りにする
      //       'void': 'never',
      //       'normal': 'never',
      //       // Vueコンポーネントは、末尾に'/'を入れる
      //       'component': 'always'
      //     },
      //   }],
      //   // 属性 (idなど) が付いたタグの改行は強制しない
      //   'vue/singleline-html-element-content-newline': 'off',
      //   // コンポーネントをタグとして使うときはパスカルケース (公式の推奨)
      //   // https://ja.vuejs.org/guide/essentials/component-basics.html#using-a-component
      //   'vue/component-name-in-template-casing': 'warn',
      //   // コンポーネントのpropsやv-on(@)はキャメルケースにする。
      //   // (vueとjavascriptで書き方を揃えて、検索できるようにしたい。)
      //   'vue/attribute-hyphenation': ['warn', 'never'],
      //   'vue/v-on-event-hyphenation': ['warn', 'never'],
      // }
    },
    // jestのテストファイル用設定
    {
      'files': ['*.test.js'],
      'plugins': ['jest'],
      'extends': [
        'plugin:jest/recommended',
        'plugin:jest/style'
      ],
    }
  ],
};
