const names=[];
const DataBase=[];
const net = require('net');
const server = net.createServer()

server.on('connection', (socket)=>{
    if(!DataBase.includes(socket)){
        DataBase.push(socket);
    }

    socket.on('data',(data)=>{   
        console.log('/Mensaje recibido desde el cliente: ' + data)

        if(data.toString().substring(0,4)=="name"){
            var name = data.toString().substring(5);
            if(names.includes(name)){
                socket.write("Este nombre ya existe")
            } else {
                names.push(name)
                socket.write("Nombre guardado con exito "+name)
            }
        } else {
            if(data.toString().substring(0,4)=='quit'){
                for(let i=0; i<DataBase.length; i++){
                    if(DataBase[i]==socket){
                        DataBase.splice(i);
                    }
                }
                var name = data.toString().substring(5);
                for(let i=0; i<names.length; i++){
                    if(names[i]==name){
                        names.splice(i)
                        sendingMessages(name + ' a abandonado el chat', socket);
                        socket.write("Adios");
                    }
                }
            } else {
                sendingMessages(data, socket);
            }
        }
        //socket.write('Recibido')
    })
        socket.on('close', ()=>{
        console.log('Comunicacion finalizada')
    })
    socket.on('error', (err)=>{
        console.log(err.message)
    })
})

server.listen({host: '127.0.0.1', port:4561}, ()=> {
    console.log('Servidor esta escuchando en el puerto', server.address().port)
})

function sendingMessages(message, conexion){
    for(const socket of DataBase){
        if(socket != conexion){
            socket.write(message);
        }
    }
}