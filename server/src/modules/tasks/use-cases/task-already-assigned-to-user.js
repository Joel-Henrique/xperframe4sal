class TaskAlreadyAssignedToUser {

    constructor(firebaseTaskGateway){
        this.firebaseTaskGateway = firebaseTaskGateway
    }

    async execute(taskId, uid){
        return this.firebaseTaskGateway.taskAlreadyAssignedToUser(taskId, uid)
    }
}

export { TaskAlreadyAssignedToUser }