var WorkTime = require('../models/workTimeTableModel');
var userService = require('../services/user.service');
var timeTableService = require('../services/timeTable.service');
var mongodb = require('mongodb').MongoClient;


var workTimeTableController = function (nav) {

    var getYourTimeTable = function (req, res) {
        res.render('yourTimeTable',
            {
                title: 'Your Work Time Table',
                userName: req.user.username,
                nav: nav,
                message: ''
            });
    };

    var getTimeTableMenu = function (req, res) {
        userService.getUsers()
            .then(function (users) {
            res.render('timeTableMenu',
                {
                    title: 'Time Table Menu',
                    userName: req.user == undefined ? undefined : req.user.username,
                    nav: nav,
                    message: '',
                    users: users
                });
        });
    };
    
    var getTeammateTimeTable = function (req, res) {
        res.render('teammatesTimeTable',
            {
                title: `${req.body.teammateName}'s Work Time Table`,
                userName: req.user == undefined ? undefined : req.user.username,
                teammate: req.body.teammateName,
                nav: nav,
                message: ''
            });
    };

    var createTimeTable = function (req, res) {
        let item = req.body;
        item.user = req.user.username;
        let newWorkTimeItem = timeTableService.createTimeTable(item);
        newWorkTimeItem.save(function (err) {
            if(err) {
                var errMsg = `Sorry there were an error saving the stand-up hour time. + ${err}`;
                res.render('yourTimeTable',
                    {
                        title: 'Work Time Table',
                        userName: req.user.username,
                        nav: nav,
                        message: errMsg
                    });
            }
        });
    };

    var updateTimeTable = function (req, res) {
        WorkTime.findOneAndUpdate({id: req.body.id }, { start: req.body.workStart, end: req.body.workEnd },
            function (err, workTimeItem) {
                if(err) console.error(`Err: ${err}`);
                console.log(`Event ${req.body.title} updated successfully`);
            });
    };

    var deleteTimeTable = function (req, res) {
        console.log(`ID: ${req.body.id}`);
        WorkTime.findOneAndRemove({id: req.body.id }, function (err) {
            if(err) console.error(`Err: ${err}`);
            console.log(`Event delete successfully`);
        });
    };

    var getEvents = function(req, res) {
        var query = WorkTime.find();
        var startTime = req.query.start;
        var endTime = req.query.end;
        var memberName = req.query.username == undefined ? req.user.username : req.query.username;
        console.log(`User: ${memberName}`);
        query.find({$and: [{memberName: memberName ,start: {$gte: startTime}, end: {$lte: endTime}}]})
            .exec(function (err, workTimeItems) {
                if(err) {
                    console.error(`Error: ${err}`);
                }
                console.log(`Results: ${workTimeItems}`);
                res.send(workTimeItems);
            });
    };

    return {
        getYourTimeTable: getYourTimeTable,
        getTimeTableMenu: getTimeTableMenu,
        getTeammateTimeTable: getTeammateTimeTable,
        createTimeTable: createTimeTable,
        updateTimeTable: updateTimeTable,
        deleteTimeTable: deleteTimeTable,
        getEvents: getEvents
    };
};

module.exports = workTimeTableController;