class GetTasks {

    constructor(configurationFileGateway){
        this.configurationFileGateway = configurationFileGateway
    }

    async execute(){
        return this.configurationFileGateway.getTasks()
    }
    
}

export { GetTasks }