class ApiResponse{
    constructor(statusCode,data,message = "Success"){
        this.statusCode=statusCode,
        this.data=data,
        this.message=message,
        this.success=statusCode<400
    }
}
export {ApiResponse};

// class className{
//     constructor(a,b,c){
//        this.a=a,
//        this.b=b,
//        this.c=c
//     }
// }
// export {className}