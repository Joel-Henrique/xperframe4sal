import { Router } from "express"
import { SaveEvent } from "../use-cases/save-event.js"
import { FirebaseEvent } from "../gateways/FirebaseEvent.js"

const eventRouter = Router()

eventRouter.post("/", async (request, response) => {

    const uid = request.body.event.user_id
    const taskId = request.body.event.detail.taskId
    const event = request.body.event
    const saveEventUseCase = new SaveEvent(new FirebaseEvent())
    let result = await saveEventUseCase.execute(uid, taskId, event)
    response.json(result)
    
})

export { eventRouter }