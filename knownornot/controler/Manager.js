var {Server} = require("socket.io");
/**
*   The manager class willmanage the reception of all incomin socket request from clients
*   and redirect it to the apropriate class to make API request and send response to the client.
*/
class Manager{
    io;

    constructor(serveur) {
        // initialise the socket io clas of the server
        this.io = new Server(serveur);

        // this section is used to interact whith any client, one by one
        this.io.on("connection", (socket) => {
            console.info(`Client connected [id=${socket.id}]`);
            console.log(this.io.sockets.server.engine.clientsCount);
            
            //to add a response to a resquest
            //socket.on("",) => {}
            socket.on("newUser", userinfo => {
                console.info(userinfo);
            });

            socket.on("userCon", userinfo => {
                console.info(userinfo);
            });

            socket.on("CheckUserUuid", UserUuid => {
                console.info(UserUuid);
            })
            
            socket.on("UserDel", userinfo => {
            })

            socket.on("UserUpdate", userinfo => {
            })
        })
    }

    /**
     * The method used to get the instance of the manager, 
     * or create it if it dosen't exist.
     */
    static getInstance(serveur) {
        if (!this.instance) {
          this.instance = new Manager(serveur);
        }
        return this.instance;
    }
}


module.exports = Manager;