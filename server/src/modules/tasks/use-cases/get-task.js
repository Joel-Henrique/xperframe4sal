class GetTask {

    constructor(configurationFileGateway){
        this.configurationFileGateway = configurationFileGateway
    }

    async execute(taskId){
        return this.configurationFileGateway.getTask(taskId)
    }
}

export { GetTask }