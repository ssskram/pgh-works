import io from 'socket.io-client'
let socket = io('https://restless.azurewebsites.us/pghWorks/activity')

export function subscribeToActivity (cb) {
    socket.on('data', function (data) {
        cb(null, data)
    })
    socket.emit('subscribe')
}

export function broadcastActivity () {
    socket.emit('update')
}
