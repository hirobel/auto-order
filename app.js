const puppeteer = require("puppeteer");
const KEYWORD = process.argv[2];
const AMAZON_URL = "https://www.amazon.co.jp/";

const main = async () => {
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    // puppeteerでconsole.logを利用するため
    // See: https://qiita.com/nobu17/items/5d073b7ec2df950e64f5
    page.on('console', msg => {
        for (let i = 0; i < msg._args.length; ++i)
        console.log(`${i}: ${msg._args[i]}`);
    });
    
    const url = await fetch(page);
    await purchase(page, url);
};

const fetch = async (page) => {
    // 事前処理
    // ----------------------------------

    // Amazonのサイトを開く
    await page.goto(AMAZON_URL);

    // 検索
    // ----------------------------------
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.type('input[name="field-keywords"]', KEYWORD),
        await page.evaluate(({ }) => {
            document.querySelector("#nav-search-bar-form").submit();
        }, {})
    ]);

    // 検索条件指定
    // ----------------------------------
    // 検索条件指定 > 値段設定
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.evaluate(({ }) => {
            let e = document.querySelector('#priceRefinements > ul');
            let f = e.querySelector('li[aria-label="0-500円"]');
            let aPriceOption = f.querySelector('span > a');
            aPriceOption.click();
        }, {})
    ]);

    // 検索条件指定 > 到着日
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        page.click("li[aria-label=明日までにお届け] > span > a")
    ]);

    // 検索結果取得
    // ----------------------------------
    let url = await page.evaluate(({ }) => {
        let resultList = document.querySelector('.s-main-slot.s-result-list');
        let list = Array.from(resultList.children);
        let items = []
        for ( const elm of list){
            // [note] href属性を持たない要素があるため場合分け
            if ( elm.querySelector('a').href ) items.push( elm.querySelector('a').href );
        }
        return items[Math.floor(Math.random() * items.length)];
    }, {});

    return url;
};

const purchase = async ( page, url ) => {
    // 事前処理
    // ----------------------------------

    // ログイン情報を取得
    const loginId = process.env.AMAZON_ID;
    const loginPassword = process.env.AMAZON_PASSWORD;

    // Amazonのサイトを開く
    await page.goto(AMAZON_URL);

    // ログインページへ移動
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.evaluate(() => {
            document.querySelector(".nav-action-button").click();
        })
    ]);

    // ログイン
    // ----------------------------------

    // ID入力
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.type('input[name="email"]', loginId),
        await page.evaluate(({ }) => {
            document.querySelector("form").submit();
        }, {})
    ]);

    // パスワード入力
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.type('input[name="password"]', loginPassword),
        await page.evaluate(({ }) => {
            document.querySelector("form").submit();
        }, {})
    ]);

    // 商品ページへ移動
    // ----------------------------------
    console.log(`[Info] url${url}`);
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.goto(url)
    ]);

    // 購入直前まで
    // ----------------------------------
    
    // 今すぐ購入
    // await page.waitFor(3000);
    // await page.evaluate(() => {
    //     document.querySelector("#buy-now-button").click(); [NOTE] 動作しません
    // });

    // カートに追加
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.evaluate(({ }) => {
            document.querySelector('#add-to-cart-button').click();
        }, {})
    ]);

    // 続行
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'load'}),
        await page.evaluate(({ }) => {
            document.querySelector('#hlb-ptc-btn-native').click();
        }, {})
    ]);

    // 注文を確定する 
    // await page.waitFor(5000);
    // await page.evaluate(({ }) => {
    //     document.querySelector('#spc-form').submit(); [NOTE] 動作しません
    // }, {});    
};

main();
