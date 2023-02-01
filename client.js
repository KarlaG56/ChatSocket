const { Socket } = require('net');
var name= 'Anonimo';

const readline =require("readline").createInterface({
    input: process.stdin,
    output:process.stdout
})

const options = {
    port: 4561,
    host: '127.0.0.1'
}

const client = new Socket();
client.setEncoding('utf-8');
client.connect(options);

function main(){
    client.on('connect', ()=>{
        console.log('Conexion satisfactoria!')
    })
    client.on ('data', (data)=>{
        if(data.toString().substring(0, 25)=="Nombre guardado con exito" && name=="Anonimo"){
            name=data.substring(26);
        }
        console.log("" + data + "")
        if(data == 'Adios'){
            client.end();
            process.exit();
        }
    })
    
    client.on('error', (err)=>{
        console.log(err.message)
    })

    readline.on("line", (line)=>{
        if(line == '0'){
            console.log("No")
        }else{
            if(line.substring(0,4)== 'name'){
                client.write(line);
            } else if (line.substring(0,4) == 'quit'){
                client.write(line + ' ' + name)
            } else {
                client.write(name + ': ' + line)
            }
        }
    })
}

main();
