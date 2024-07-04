import {Router} from 'express'
import { addEnquiry, deleteEnquiry, getEnquiry, getSingleEnquiry } from '../controller/enquiryController.js'


const enquiryRouter=Router()

enquiryRouter.post("/",addEnquiry)
enquiryRouter.get("/",getEnquiry)
enquiryRouter.get("/single/:id",getSingleEnquiry)
enquiryRouter.delete("/:id",deleteEnquiry)



export default enquiryRouter