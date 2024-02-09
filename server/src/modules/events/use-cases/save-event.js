class SaveEvent {

    constructor(firebaseEventGateway){
        this.firebaseEventGateway = firebaseEventGateway
    }

    async execute(uid, taskId, event){
        return this.firebaseEventGateway.saveEvent(uid, taskId, event)
    }

}

export { SaveEvent }