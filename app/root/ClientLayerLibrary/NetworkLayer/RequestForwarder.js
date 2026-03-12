const { io } = require('socket.io-client')
const appSpecificErrors = require('../../IndependentCommonUtils/appSpecificErrors')
const { RequestSerializer } = require('./RequestSerializer')
const { ActionAntiAction } = require('./ActionAntiAction')
const {Event} = require('../../IndependentCommonUtils/CommonUtils')
let sock = null
let logger = null
const subscriptionBook = new Map()
let disconnectionHandler = null
let requestSerializer = null
let actionAntiAction = null
class RequestSerializers{
    constructor(){
        this.serializers = new Map()
    }

    requestToSend(key, sock, event, ack, ...data){
    let serializer = this.serializers.get(key)
        if(undefined === serializer) {
            serializer = new RequestSerializer()
            this.serializers.set(key, serializer)
        }
        serializer.requestToSend(sock, event, ack, ...data)
    }
}

function subscribe(symbol, exchange, type, callback){
    const key = JSON.stringify([symbol, exchange, type])

    let matter = subscriptionBook.get(key)
    if (undefined === matter) {
        const updateEvt = new Event()
        matter =
        {
            updator :  (update) => {
                            if (!updateEvt.empty()) {
                                updateEvt.raise(update)
                            }
                        },
            evt :       updateEvt
        }

        subscriptionBook.set(key, matter)
        actionAntiAction.antiAct(key, ()=>{
            requestSerializer.requestToSend(key, sock, 'subscribe', (result)=>{
                if(result.success) {            
                    logger.warn(`subscriptionSuccess for: ${key}`)
                } else {
                    logger.warn(`subscriptionFailure for: ${key}, reason: ${result.reason}`)
                }
            }, symbol, exchange, type)
        })
    }
    
    matter.evt.registerCallback(callback)
}

function unsubscribe(symbol, exchange, type, callback){
    const key = JSON.stringify([symbol, exchange, type])
    let matter = subscriptionBook.get(key)
    if (undefined === matter) {
        throw new Error(`Spurious unsubscription for key: ${key}`)
    }

    matter.evt.unregisterCallback(callback)
    if (matter.evt.empty()) {
        subscriptionBook.delete(key)
        actionAntiAction.act(key, 10000, ()=>{
            requestSerializer.requestToSend(key,
                                            sock,
                                            'unsubscribe',
                                            (result)=>{
                                                if(result.success) {
                                                    logger.warn(`unsubscriptionSuccess for: ${key}`)
                                                }else {
                                                    logger.warn(`unsubscriptionFailure for: ${key}, reason: ${result.reason}`)
                                                }
                                            },
                                            symbol,
                                            exchange,
                                            type)
        })
    }
}

function forward(intent){
    const action = intent.action
    if(0 === action.localeCompare("subscribe")){
        forwardSubscription(intent)
    }
    else if(0 === action.localeCompare("unsubscribe")){
        forwardUnsubscription(intent)
    }else if(0 === action.localeCompare("disconnect")){
        sock.disconnect()
    }
}

function forwardSubscription(subscription){
    subscribe(subscription.symbol,
              subscription.exchange,
              subscription.type,
              subscription.callback)
}

function forwardUnsubscription(subscription){
    unsubscribe(subscription.symbol,
                subscription.exchange,
                subscription.type,
                subscription.callback)
}

function disconnect(){
}

function connect(serverAddress, libLogger){//Server address <ip>:<port>
    actionAntiAction = new ActionAntiAction(libLogger) 
    logger = libLogger
    requestSerializer = new RequestSerializers()
    logger.debug(`Connecting to the server ${JSON.stringify(serverAddress)}`)
    sock = io(serverAddress.url,
              {
                path: serverAddress.path,
                // path: '/long_polling',
                // transportOptions: {
                //     websocket: {
                //       path: "/ws/"
                //     }
                // },                
                transports: ['websocket'],
                //secure: window.location.protocol === 'https:',
                //rejectUnauthorized: false, // This is often necessary for self-signed certificates
                reconnection: false,
                // transportOptions: {
                //     polling: {
                //         extraHeaders: {
                //             'x_Backend_Port': '65'  // Set the desired backend port
                //         }
                //     }
                // },
                // extraHeaders: {
                //     "x_Backend_Port": "65"
                //   }
                //secure: true
              }
            )

    sock.on('connect', ()=>{
        logger.debug(`Connected by id: ${sock.id}, syncing subscriptions`)
        subscriptionBook.forEach((evt, key)=>{
            const [symbol, exchange, type]  = JSON.parse(key)
            requestSerializer.requestToSend(key, sock, 'subscribe', (result)=>{
                if(result.success) {
                    logger.warn(`subscriptionSuccess for: ${key}`)
                } else {
                    logger.warn(`subscriptionFailure for: ${key}, reason: ${result.reason}`)
                }
            }, symbol, exchange, type)
        })
    })

    sock.on('disconnect', (reason)=>{
        libLogger.error(`disconnect, description: ${JSON.stringify(reason)}`)
        setTimeout(()=>disconnectionHandler(reason), 0);
    })

    sock.on("depth", (depth)=>{
        const depthJSon = JSON.parse(depth)
        const key = JSON.stringify([depthJSon.symbol, depthJSon.exchange, "depth"])
        const matter = subscriptionBook.get(key);
        if (undefined !== matter) {
            matter.updator(depthJSon)
        }
    })

    sock.on("trade", (trade)=>{
        const tradeJSon = JSON.parse(trade)
        const key = JSON.stringify([tradeJSon.symbol, tradeJSon.exchange, "trade"])
        const matter = subscriptionBook.get(key);
        if (undefined !== matter) {
            matter.updator(tradeJSon)
        }
    })

    sock.on("connect_error", (reason) => {
        libLogger.error(`connect_error, description: ${JSON.stringify(reason)}`)
        setTimeout(()=>disconnectionHandler(reason), 0);
    });
}

function setDisconnectionHandler(callback){
    disconnectionHandler = callback
}

module.exports.connect = connect
module.exports.forward = forward
module.exports.disconnect = disconnect
module.exports.setDisconnectionHandler = setDisconnectionHandler
