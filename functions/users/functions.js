const admin = require('firebase-admin');
const _ = require('lodash');
const { RESPONSE_MESSAGES } = require('./response-messages.js');

exports.createUser = async (req) => {
    let {email, password, displayName, phoneNumber, emailVerified, disabled} = req.body;

    if(_.isEmpty(email) || _.isEmpty(password))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.ERROREMAILORPASS
        }

    //Create user
    try{
        await admin.auth().createUser({email, password, displayName, phoneNumber, emailVerified, disabled});
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.CREATED
        }

    }catch(e){
        return {
            success: false,
            message: e.message
        }

    }
};

exports.getAllUsers = async (limit, pageToken) => {
    const users = [];
    try{
        const listUsers = await admin.auth().listUsers(limit, pageToken);
        listUsers.users.forEach(el => {
            users.push(el);
        });
            if(listUsers.pageToken)
                return {
                    success: true,
                    result: users,
                    nextPage: listUsers.pageToken
                }

            return {
                success: true,
                result: users
            }
    }catch(e){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.USERS_LIST
        }
    }
};

exports.deleteUser = async (id) => {
    try{
        await admin.auth().deleteUser(id);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.DELETED
        }
    }catch(e){
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_DELETE
        }
    }
};

exports.updateUser = async (req) => {
    const { id } = req.params;
    const { email, password, displayName, disabled } = req.body;
    
    if(_.isEmpty(email))
        return {
            success: false,
            message: RESPONSE_MESSAGES.REJECT.NOT_EMAIL
        };

    const userData = {
        displayName,
        email,
        disabled
    };

    const newUserData = !_.isEmpty(password) ? Object.assign({}, userData, { password }) : userData;

    try{
        await admin.auth().updateUser(id, newUserData);
        return {
            success: true,
            message: RESPONSE_MESSAGES.SUCCESS.UPDATED
        }
    }catch(e){
        return {
            success: false,
            message: e.message
        }
    }
};