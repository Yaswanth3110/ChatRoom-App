const express = require("express")
const app = express()
const http = require("http")
const server = http.Server(app)
const socketIo = require("socket.io")
const io = socketIo(server)
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")
app.enable("trust proxy");
 //import {newChat, getAllMessages, getAllUsers} from "./apis/chatApi"
const {newChat , getAllMessages, getAllUsers} = require("./apis/chatApi")

app.use(express.static("public"))
// CORS
app.use(
  cors({
    allowedHeaders: ["X-Requested-With", "Content-Type"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

const port = process.env.PORT || 8080
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "views")
app.set("view engine", "ejs")
app.use(cookieParser());

server.listen(port, ()=>{
	console.log("app is listening on port 8080")
})


io.on("connection", (socket)=>{
    console.log("connected")
    socket.on("getAllMessages", (roomid)=>{
       getAllMessages(roomid, (result)=>{
          if(result.status === "success"){
            socket.emit("allMessages", {message:result.message})
          }
       })
    })
  
    socket.on("sendMessage", (data , callBack)=>{
          let instant = new newChat(data);
          instant.appendData((result)=>{
            callBack(result);
            if(result.status === "success"){
                socket.broadcast.to(data.roomid).emit("receiveMessage", data);
            }
          })
    })

    socket.on("joinRoom", (roomid)=>{
        socket.join(roomid);
    })

    socket.on("loadUsers", (roomid, callBack)=>{
        getAllUsers(roomid,(result)=>{
            if(result.status === "success"){
              callBack(result.message)
            }
        })
    })
    socket.on("typing", (data)=>{
        socket.broadcast.to(data.roomid).emit("someOneTyping", {username: data.username})
    })
})




app.get("/", (req,resp)=>{
  resp.render("chat")
})
app.post("/join", (req,resp)=>{
  console.log(req.body)
  resp.send("Hi mowa")
})






