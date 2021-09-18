// require all the packages needed
require('dotenv').config();
const formidable = require('formidable');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

// import the PaytmChecksum to autheticate the payment requests
const PaytmChecksum = require('./PaytmChecksum');

exports.payment = (req, res) => {
    const { 
        amount,
        email,
        mobileNo
    } = req.body;

    // prepare the request object
    let params = {};
    params['MID'] = process.env.PAYTM_MERCHANT_ID;
    params['WEBSITE'] = process.env.PAYTM_WEBSITE;
    params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID;
    params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE;
    params['ORDER_ID'] = uuidv4();
    params['CUST_ID'] = email;
    params['TXN_AMOUNT'] = amount.toString();
    params['EMAIL'] = email;
    params['MOBILE_NO'] = mobileNo.toString();
    params['CALLBACK_URL'] = 'http://localhost:5454/api/paymentCallback';

    // use PaytmChecksum to generate a signature
    let paytmChecksum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY)
    
    paytmChecksum.then(response => {
        let paytmCheckSumResp = {
            ...params,
            "CHECKSUMHASH": response
        };
        res.json(paytmCheckSumResp);
    }).catch(error => {
        res.status(500).json({
            message: "Error in Payment",
            error: error
        });
    });
}

exports.paymentCallback = (req, res) => {
    // it is called by paytm system, Paytm server will send the trsaction details
    // we need to read this transaction details

    const form = new formidable.IncomingForm();

    form.parse(req, (error, fields, file) => {
        // check if it is an error or not 
        if (error) {
            console.log(error);
            res.status(500).json({ error });
        }

        // verify the signature
        const checksumHash = fields.CHECKSUMHASH;

        const isVerified = PaytmChecksum.verifySignature(fields, process.env.PAYTM_MERCHANT_KEY, checksumHash);

        if (isVerified) {
            // response from the paytm server is valid
            // make an API call, get the transaction status from the paytm server
            let params = {};
            params["MID"] = fields.MID;
            params["ORDER_ID"] = fields.ORDERID;
            PaytmChecksum.generateSignature(
                params, 
                process.env.PAYTM_MERCHANT_KEY
            ).then(checksum => {
                params["CHECKSUMHASH"] = checksum;
                const data = JSON.stringify(params);

                const reqObject = {
                    hostname: 'securegw-stage.paytm.in',
                    port: '443',
                    path: '/order/status',
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length
                    },
                    data: data
                }
                let response = "";
                let request = https.request(reqObject, (responseFromPaytm) => {
                    responseFromPaytm.on('data', (chunk) => {
                        response += chunk;
                    });
                    responseFromPaytm.on('end', () => {
                        if (JSON.parse(response).STATUS === 'TXN_SUCCESS') {
                            // transaction is successfull, 
                            // Zomato BE will inform the Zomato FE
                            res.sendFile(__dirname, + '/success.html');
                        } else {
                            // transaction is Failure, 
                            // Zomato BE will inform the Zomato FE
                            res.sendFile(__dirname, + '/failure.html');
                        }
                    })
                });
                request.write(data);
                request.end();
            }).catch(error => {
                res.status(500).json({
                    message: "Error in Payment",
                    error: error
                });
            })

        } else {
            // response is not valid
            console.log("checksum mismatch");
            res.status(500).json({ error: "It's a hacker !" });
        }
    })
}