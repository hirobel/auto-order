# auto-order

## 概要
明日のビールのつまみを楽しく選ぶためにつくったスクリプト
自分のAmazonアカウント上のカートに、ランダムで商品を追加します。

自分のローカル環境でpuppeteerを動作させ、予め設定したおいたアカウントでAmazonにアクセスし、商品を自動チョイスしてカートに入れてくれます。
その上で、注文の直前まで進んでくれます。

あえて明日届くという待つ楽しみと、何をチョイスされるか分からないプチサプライズを楽しみましょう。

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
また、それゆえに本リポジトリのコードが期待通りしない状況になります!
