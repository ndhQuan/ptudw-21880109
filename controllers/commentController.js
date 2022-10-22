let controller = {};
const { query } = require('express');
let models = require('../models');
let Comment = models.Comment;
const { Op } = require('sequelize');

controller.add = (comment) =>{
    return new Promise((resolve, reject) => {
        Comment
            .create(comment)
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

module.exports = controller;