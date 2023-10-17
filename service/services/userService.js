const axios = require("../index");



const course_list =async (payload) => {
    return await axios.get(`/api/courses/index`).then((res) => {
        return [null, res.data]
    }).catch((error) => {
        return [error, null]
    })
}

const library_list =async (payload) => {
    return await axios.get(`/api/libraries`, {payload:payload}).then((res) => {
        return [null, res.data]
    }).catch((error) => {
        return [error, null]
    })
}









module.exports =  { course_list, library_list}