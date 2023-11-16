const users = [];
const messages = [];

module.exports = (io) => {
    console.log("socket is on");
    // io.use((socket, next) => {
    //     // Use the cors middleware for Socket.IO
    //     cors()(socket.request, socket.request.res, next);
    //   });
    io.on('connection', (socket) => {
        console.log('Handshake done');

        // Handle joining a group
        socket.on('joinGroup', ({ email, group_id }) => {
            const user = { id: socket.id, email, group_id };
            users.push(user);
            socket.join(group_id);
            io.to(group_id).emit('userJoined', user);
            console.log(`User ${socket.id} joined group: ${group_id}`);

        });
        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected');
            const index = users.findIndex((user) => user.id === socket.id);
            if (index !== -1) {
                const disconnectedUser = users.splice(index, 1)[0];
                io.to(disconnectedUser.groupId).emit('userLeft', disconnectedUser);
            }
        });
    });
};
