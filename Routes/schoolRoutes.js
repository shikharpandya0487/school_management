const express=require('express')
const { addSchoolController, listAllSchools, updateSchoolInfo, deleteSchoolInfo } = require('../Controllers/school_management_controller')
const router=express.Router()


router.post('/addSchool',addSchoolController)
router.get('/listAllSchools',listAllSchools)
router.put('/updateSchoolInfo/:id',updateSchoolInfo)
router.delete('/deleteSchoolId/:id',deleteSchoolInfo)


module.exports=router