const port=process.env.PORT || 10000;
const server = require("http").Server();

var io =require("socket.io")(server);

var allqs={};

io.on("connection", function(socket){
 
    socket.on("joinedRoom", function(data){
        console.log("joining room", data);
        
        socket.join(data);
        socket.myRoom = data;
        
        if(!allqs[data]){
            allqs[data] = {
                qobj:{}
            };
        }
    });
    
    socket.on("qSubmit", function(data){
        allqs[socket.myRoom].qobj = data;
        socket.to(socket.myRoom).emit("newQ", data);
        console.log(data);
    });
    
    socket.on("answer", function(data){
        console.log(data);
        console.log(allqs[socket.myRoom].qobj.A);
        var msg="WRONG!";
       if(data == allqs[socket.myRoom].qobj.A){
           msg="WINNER!";
       } 
        socket.emit("result", msg);
    });
    
    socket.on("disconnect", function(){
        
    
    })
});

server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    console.log("Port Running");
})