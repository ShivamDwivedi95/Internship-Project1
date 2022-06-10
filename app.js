const convert = document.getElementById("convert");
var tempFileName = "";

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

function convertFile() {
    let url = document.getElementById('url').value;
    let file = document.getElementById('myfile');
    if(url.length) {
        if(isValidURL(url)) {
            let fetchURL = "https://cts.ofoct.com/upload_from_url.php?input_format=WAV,20MP3,20OGG,AAC,WMA&url="+url;
            fetch(fetchURL, {
                method: 'GET'
            }).then(response => {
                return response.text();
            }).then(data => {
                tempFileName = data.split("|")[2];
                convertUtil(tempFileName);
            })
        } else
            alert("URL is not valid");
    } else if(file.value.length) {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "*/*");
        myHeaders.append("Accept-Language", "en-CA,en-US;q=0.9,en;q=0.8");
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("Origin", "https://www.ofoct.com");
        myHeaders.append("Referer", "https://www.ofoct.com/");
        myHeaders.append("Sec-Fetch-Dest", "empty");
        myHeaders.append("Sec-Fetch-Mode", "cors");
        myHeaders.append("Sec-Fetch-Site", "same-site");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33");
        myHeaders.append("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Microsoft Edge\";v=\"102\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
        
        var formdata = new FormData();
        formdata.append("myfile", file.files[0], "[PROXY]");
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
        };
        
        fetch("https://cts.ofoct.com/upload.php", requestOptions)
          .then(response => {
            return response.text();
          })
          .then(data => {
            console.log(data);
            let tempFileName = data;
            tempFileName = tempFileName.slice(2,-2);
            console.log(tempFileName);
            convertUtilFromUpload(tempFileName);
          })
          .catch(error => console.log('error', error));
        
    } else
        alert("Please upload file or provide a link! ");
    
    
}

function convertUtil(tempFileName){
    let convertURL = "https://cts.ofoct.com/convert-file_v2.php?cid=audio2midi&output=MID&row=file1&sourcename=furelisemp3&&rowid=file1&tmpfpath="+tempFileName;
    fetch(convertURL, {method: 'GET'})
    .then(response => {
        return response.text();
    }).then(data => {
        let path = data.split("|")[2];
        let downloadURL = "https://cts.ofoct.com/get-file.php?type=get&downloadsavename=test.mid&genfpath="+path;
        downloadFile(downloadURL,tempFileName)
    })
}


function convertUtilFromUpload(tempFileName){
    console.log(tempFileName)
    let convertURL = "https://cts.ofoct.com/convert-file_v2.php?cid=audio2midi&output=MID&tmpfpath="+ tempFileName +"&row=file1&sourcename=furelisemp3&&rowid=file1";
    console.log(convertURL);
    fetch(convertURL, {method: 'GET'})
    .then(response => {
        return response.text();
    }).then(data => {
        console.log(data);
        let path = data.split("|")[2];
        console.log(path)
        let downloadURL = "https://cts.ofoct.com/get-file.php?type=get&downloadsavename=test.mid&genfpath="+path;
        downloadFile_Upload(downloadURL,tempFileName)
        
    })
}

function downloadFile(downloadURL,tempFileName) {
    fetch(downloadURL, {method: 'GET'})
        .then(response => {
            return response.blob();
        }).then(convertedFile => {
            saveAs(convertedFile,tempFileName+".mid");

        })
}

function downloadFile_Upload(downloadURL,tempFileName) {
    fetch(downloadURL, {method: 'GET'})
        .then(response => {
            return response.blob();
        }).then(convertedFile => {
            saveAs(convertedFile,tempFileName+"mid");
        })
}

