const port=process.env.PORT || 10000;
const server = require("http").Server();

var io =require("socket.io")(server);

//var allUsers = [];

var allusers1=[];
var allusers2=[];

var allusers={};

io.on("connection", function(socket){
    console.log("connet");
//    allUsers.push(socket.id);
//    console.log(allUsers);
    
//    socket.emit("yourid", socket.id);
//    
//    io.emit("userJoined", allUsers);
    
    socket.on("joinRoom", function(data){
        console.log(data);
        socket.join(data);
        
        socket.myRoom = data;
        socket.emit("yourid", socket.id);
        
        if(!allusers[data]){
            allusers[data]=[];
        }
        
        allusers[data].push(socket.id);
        io.to(data).emit("userJoined", allusers[data]);
        
//        if(data == "room1"){
//            allusers1.push(socket.id);
//             io.to(data).emit("userJoined", allusers1);
//            console.log(allusers1);
//        }else if(data == "room2"){
//            allusers2.push(socket.id);
//            io.to(data).emit("userJoined", allusers2);
//            // to(data) tells which room it is. goes to the space first
//        }
    })
    
    socket.on("mymove", function(data){
        socket.to(this.myRoom).emit("newmove", data)
    })
    
    socket.on("disconnect", function(){
        
        var index = allusers[this.myRoom].indexOf(socket.id);
        allusers[this.myRoom].splice(index, 1);
        io.to(this.myRoom).emit("userJoined", allusers[this.myRoom]);
        
//      var index = allUsers.indexOf(socket.id);
//        allUsers.splice(index, 1);
//        io.emit("userJoined", allUsers);
    })
});


server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    console.log("Port Running");
})