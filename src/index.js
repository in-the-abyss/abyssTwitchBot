const { alertChannel } = require('./bot.js')
const logger = require('./logger')
const redis = require('redis')
const fetch = require('node-fetch')

require('dotenv').config()

const PORT=process.env.PORT || 80;
const REDIS_ENDPOINT=process.env.REDIS_ENDPOINT || 'redis';
const REDIS_PORT=process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD=process.env.REDIS_PASSWORD || "";
const channel = process.env.CHANNEL || "messages";

let subscriber;

const requestOptions = {
    method: 'get',
    headers: {"User-Agent":"PostmanRuntime/7.26.10"}
};

//create redis instance
try {
    subscriber = redis.createClient({
        host: REDIS_ENDPOINT,
        port: REDIS_PORT,
        password: REDIS_PASSWORD
    })
    console.log(REDIS_ENDPOINT)
} catch (err) {
    logger.error({
        message: "Redis connection failed!"
    });
    process.exit(1);
}

getProduct = async (sku) => {
    return await fetch(`https://www.bestbuy.ca/api/v2/json/product/${sku}?currentRegion=ON&include=all&lang=en-CA`, requestOptions)
        .then(response => {
            return response.json()
        })
        .catch(error => {
            logger.error({
                message: error
            });
            return null
        });
}

subscriber.on("ready", () => {
    console.log("redis has connected")
})

//subscriber recieves a message
subscriber.on("message", async (incomingChannel,message) => {
    if (incomingChannel === channel) {
        try {
            let parsedMessage = JSON.parse(message).message

            product = await getProduct(parsedMessage.sku)
            if (product && product.availability && product.availability.isAvailableOnline) {
                alertChannel(channel, `${product.name} is now available! URL: ${product.productUrl} Quantity: ${product.availability.onlineAvailabilityCount}`)
            }
        } catch (e) {
            logger.error({
                message: e
            })
        }    
    }
})


subscriber.on("error", function(error) {
    logger.error({
        message: error
    })
    process.exit(1);
});




subscriber.subscribe(channel);