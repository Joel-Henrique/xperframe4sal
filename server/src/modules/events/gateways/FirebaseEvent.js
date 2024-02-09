import { ref, push, set } from "firebase/database"
import { db } from "../../../shared/repositories/database/FirebaseRealtimeDatabase.js"

class FirebaseEvent{

    async saveEvent(uid, taskId, event){

        const taskRef = ref(db, `users/${uid}/${taskId}/events/`)
        const pushableRef = push(taskRef)
        await set(pushableRef, event)

        return true
        
    }

}

export { FirebaseEvent }