const express=require('express')
const router=express.Router()

const Course=require('../models/Courses')

/* Ajouter une nouvelle course */
router.post("/",(req,res)=>{
    const { metres, duree, date, idRunner } = req.query
    const newCourse=new Course({
        metres, duree, date, idRunner
    })
    newCourse.save()
        .then(courses=>res.send(courses))
        .catch(err=>console.log(err))
})

/* Afficher toutes les courses */
router.get("/",(req,res)=>{
    Course.find()
        .then(courses=>res.send(courses))
        .catch(err=>console.log(err))
})

/* Afficher les cours d'un utilisateurs */
router.get("/:_id",(req,res)=>{
    const {_id}=req.params
    Course.findOne({_id})
      .then(courses=>res.send(courses))
      .catch(err=>console.log(err))
})


router.get("/user/:idUser", (req, res) => {
    const { idUser } = req.params
    Course.find({ idRunner: idUser })
        .then(courses => res.send(courses))
        .catch(err => res.send(err))
})


router.put("/:_id",(req,res)=>{
    const {_id}=req.params
    const modifyCourse=req.body 
    Course.findOneAndUpdate({_id},{$set: modifyCourse}) 
        .then(courses=>res.send("course Updated"))
        .catch(err=>console.log(err))
})

router.delete("/:_id",(req,res)=>{
    const {_id}=req.params
    Course.findOneAndDelete({_id:_id})
        .then(courses=>res.send("success"))
        .catch(err=>console.log(err))
})


module.exports=router
