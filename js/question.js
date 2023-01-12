window.onload = () => {
    const submit = document.getElementById('submit');
    const black_cover = document.getElementById('modal-overlay');
    const message = document.getElementById('modal-content');
    const error_alert = document.getElementById('alert');
    const text_crypto = document.getElementById('modal-content-text-crypto');
    const text = document.getElementById('modal-content-text');
    const password = document.getElementById('password');

    submit.addEventListener('click', () => {
        try{
            const base = crypto(text_crypto.textContent, password.value);
            if(base!=""){
                text.innerText = base;
                black_cover.style.display = 'block';
                message.style.display = 'block';
                error_alert.style.display = 'none';
                AutoLink();
            }else{
                error_alert.style.display = 'block';
            }
        } catch(error) {
            error_alert.style.display = 'block';
        }
    });
    black_cover.addEventListener('click', () => {
        black_cover.style.display = 'none';
        message.style.display = 'none';
        text.innerText = "";
    });
}

function crypto(angou,password) {
    // あからじめ仕込んでおいた暗号化データのカンマ","を使って文字列をそれぞれに分割
    var array_rawData = angou.split(',');;

    var salt = CryptoJS.enc.Hex.parse(array_rawData[0]);  // パスワードSalt
    var iv = CryptoJS.enc.Hex.parse(array_rawData[1]);    // 初期化ベクトル（IV）
    var encrypted_data = CryptoJS.enc.Base64.parse(array_rawData[2]); //暗号化データ本体

    //パスワード（鍵空間の定義）
    var secret_passphrase = CryptoJS.enc.Utf8.parse(password);
    var key128Bits500Iterations =
        CryptoJS.PBKDF2(secret_passphrase, salt, {keySize: 128 / 8, iterations: 500 });

    //復号オプション（暗号化と同様）
    var options = {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7};

    //復号
    var decrypted = CryptoJS.AES.decrypt({"ciphertext":encrypted_data}, key128Bits500Iterations, options);
    // 文字コードをUTF-8にする
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function AutoLink() {
    var str = document.getElementById('modal-content-text').textContent;
    var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g; // ']))/;正規表現（/〜/）を解釈してくれないエディタ等で自動整形を崩さないため。
    var regexp_makeLink = function(all, url, h, href) {
    return '<a href="h' + href + '" target="_blank">' + url + '</a>';
    }
    var textWithLink = str.replace(regexp_url, regexp_makeLink);
    document.getElementById('modal-content-text').innerHTML = textWithLink
}
