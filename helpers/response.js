
const responseError = ({error,message})=>{
    return {
        error,
        message
        
    }
}

const responseSuccess = ({error,message,data})=>{
    return {
        error,
        message,
        data
    }
}


module.exports = {
    responseError,
    responseSuccess
}