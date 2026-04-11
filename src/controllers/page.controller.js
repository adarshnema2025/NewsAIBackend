const pageService=require("../services/page.service");

exports.createPage=async(req,res)=>{
    const page=await pageService.createPage(req.body,req.user.id);
    return res.json(page);
}

//GET archives
exports.getPage=async(req,res)=>{
    const pages=await pageService.getPage(req.user.id);
    return res.json(pages);
}