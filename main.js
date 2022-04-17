const express = require('express');
const axios = require('axios');
const stellar = require('stellar-sdk');
const base64 = require('js-base64');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

process.env.SECRET || (console.error("Missing Secret key in dotenv!") && process.kill(process.pid, 'SIGTERM'));

var app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:id', async (req, res) => {
    try{
        let resp = await axios.get(`https://stellarhotpotato.tk/generate_xdr?source=GDCZ4WDQKII2ZNEPJHXB3YJ2FAHOKFMDD3XQVBLJJH4EQ6RVXAAEKAIQ&destination=${req.params['id']}`);
        let xdr = resp.data["xdr"];
        tx = stellar.TransactionBuilder.fromXDR(xdr, stellar.Networks.PUBLIC);
        tx.sign(stellar.Keypair.fromSecret(process.env.SECRET));

        xdr = tx.toXDR();
        bxdr = base64.encode(xdr);


        
        res.json({"url": `http://stellarhotpotato.tk/complete-pass?xdr=${bxdr}`});
        

    }catch(e) {
        res.statusCode = 500;
        if(e.response){
            res.json(e.response.data);
        } else {
            console.error(e);
            res.json({"err":"Unknown error"});
        }
    }
});


app.listen(3000);

process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated')
    })
  })
