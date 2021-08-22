# auto-order

## 事前準備

```
$ npm install
$ export AMAZON_ID=<AmazonのログインID>
$ export AMAZON_PASSWORD=<Amazonのログインパスワード>
```

## 使い方

```
$ node app.js [キーワード]
```

e.g.) 
```
$ node app.js '缶詰 つまみ'
```

## 注意

時間を置いて実行するようにしてください。
短時間に連続で実行すると、ログイン時にcaptchaが入るようになったりするためです。おそらくbotと判定されているのだと思います。
また、それゆえに本リポジトリのコードが期待通りしない状況になります。
