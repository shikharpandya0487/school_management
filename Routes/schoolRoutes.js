const express=require('express')
const { addSchoolController, listAllSchools } = require('../Controllers/school_management_controller')
const router=express.Router()


router.post('/addSchool',addSchoolController)
router.get('/listAllSchools',listAllSchools)



module.exports=router