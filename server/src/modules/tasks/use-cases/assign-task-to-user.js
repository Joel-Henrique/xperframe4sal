class AssignTaskToUser {

    constructor(firebaseTaskGateway){
        this.firebaseTaskGateway = firebaseTaskGateway
    }

    async execute(taskId, uid){
        return this.firebaseTaskGateway.assignTaskToUser(taskId, uid)
    }
}

export { AssignTaskToUser }