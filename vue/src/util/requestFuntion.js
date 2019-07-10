

const getApi = (url)=>{
    let urlList = [
        '/FileDownload/down1',
        '/FileUploadController/upload',
    ];
    let api = null;
    if(urlList.includes(url)){
        api = process.env.BASE_BY_API
    }else{
        api =  process.env.BASE_API
    }
    return api;
}

const getToken = function () {
    return  localStorage.getItem('token');
}

export {
    getApi,
    getToken,
}

