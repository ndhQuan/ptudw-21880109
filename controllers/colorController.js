let controller = {};
let models = require('../models');
let Color = models.Color;
const { Op } = require('sequelize');

controller.getAll = (query) =>{
    let options = {
        attributes: ['id','name','imagepath','code'],
        include: [{ 
                model: models.ProductColor,
                include: [{
                    model: models.Product,
                    attributes: ['id'],
                    where: {
                        price: {
                            [Op.gte]: query.min,
                            [Op.lte]: query.max,
                        }
                    } 
                }]
            }
        ],
    }
    if(query.category > 0){
        options.include[0].include[0].where.categoryId = query.category;
    }
    if(query.brand > 0){
        options.include[0].include[0].where.brandId = query.brand;
    }
    return new Promise((resolve, reject) =>{
        Color
        .findAll(options)
        .then(data=>{
            resolve(data);
        })
        .catch((error)=>{
            reject(new Error(error));
        })
    })
}

module.exports = controller;