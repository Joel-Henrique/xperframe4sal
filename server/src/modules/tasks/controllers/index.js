import { Router } from "express"
import { GetTasks } from "../use-cases/get-tasks.js"
import { GetTask } from "../use-cases/get-task.js"
import { ConfigurationFile } from "../../../shared/repositories/config/ConfigurationFile.js"
import { FirebaseTask } from "../gateways/FirebaseTask.js"
import { TaskAlreadyAssignedToUser } from "../use-cases/task-already-assigned-to-user.js"
import { AssignTaskToUser } from "../use-cases/assign-task-to-user.js"

const tasksRouter = Router()
const configurationFileGateway = new ConfigurationFile()
const firebaseTaskGateway = new FirebaseTask()

tasksRouter.get("/", async (request, response) => {

    const getTasksUseCase = new GetTasks(configurationFileGateway)
    const result = await getTasksUseCase.execute()
    response.json(result)

})

tasksRouter.get("/:taskId", async (request, response) => {

    const {taskId} = request.params
    const getTaskUseCase = new GetTask(configurationFileGateway)
    const result = await getTaskUseCase.execute(taskId)
    response.json(result)

})

tasksRouter.get("/:taskId/assigned", async (request, response) => {

    const {taskId} = request.params
    const {uid} = request.query
    const taskAlreadyAssignedToUserUseCase = new TaskAlreadyAssignedToUser(firebaseTaskGateway)
    const result = {already_assigned: await taskAlreadyAssignedToUserUseCase.execute(taskId, uid)}
    response.json(result)

})

tasksRouter.post("/:taskId/assign", async (request, response) => {

    const {taskId} = request.params
    const {uid} = request.body
    const assignTaskToUserUseCase = new AssignTaskToUser(firebaseTaskGateway)
    const result = await assignTaskToUserUseCase.execute(taskId, uid)
    response.json(result)

})

export { tasksRouter }