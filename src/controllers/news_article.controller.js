const newsarchiveService=require("../services/archive.service");

exports.createNewsArchive=async(req,res)=>{
    const archiveNews=await newsarchiveService.createNewsArchive(req.body,req.user.id);
    return res.json(archiveNews);
}

//GET archives
exports.getNewsArchive=async(req,res)=>{
    const archivesNews=await newsarchiveService.getNewsArchive(req.user.id);
    return res.json(archivesNews);
}