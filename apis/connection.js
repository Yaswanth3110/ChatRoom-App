const connection = require("./connection.js")

function  getAllMessages(roomid,resolve){
        let query = `select * from chat where roomid = "${roomid}";`
        connection.query(query, (err,result)=>{
            if(err) resolve({status:"error", message:"mysql error occured"})
            else{
                resolve({status:"success", message:result})
            }
        })
}
function getAllUsers(roomid, resolve){
        let query  = `select distinct username from chat where roomid = "${roomid}"`
        connection.query(query, (err,result)=>{
            if(err) resolve({status:"error", message:"Mysql error occured"})
            else{
                resolve({status:"success", message:result})
            }
        })
}
class newChat {
    constructor(data){
        this.username = data.username 
        this.roomid = data.roomid
        this.message = data.message
        this.time = data.time
    }
    appendData(resolve){
            let query =`insert into chat(username, message, roomid, time) values("${this.username}", "${this.message}", "${this.roomid}","${this.time}");`
            connection.query(query , (err,result)=>{
                if(err) resolve({status:"error"})
                else{
                    resolve({status:"success"})
                }
            })
    }
    

}

module.exports = {newChat, getAllMessages, getAllUsers}
