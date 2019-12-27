$(document).ready(function(){

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const redirect_uri = "https://backupbinder.netlify.com/upload.html" // replace with your redirect_uri;
    const client_secret = "vVkHKV4hswLANEHqI-CYCzX3"; // replace with your client secret
    const scope = "https://www.googleapis.com/auth/drive.file";
    var access_token= "";
    var client_id = "146136756337-jt4b3n285gl57vthk47jtdq18nlib6rh.apps.googleusercontent.com"; // replace it with your client id
    

    $.ajax({
        type: "POST",
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {code:code
            ,redirect_uri:redirect_uri,
            client_secret:client_secret,
        client_id:client_id,
        scope:scope,
        grant_type:"authorization_code"},
        dataType: "json",
        success: function(resultData) {
           
            
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           window.history.pushState({}, document.title, "/GitLoginApp/" + "upload.html");
           
           
           
           
        }
  });

    function stripQueryStringAndHashFromPath(url) {
        return url.split("?")[0].split("#")[0];
    }   

    function uploadFile(file) {
//        var that = this;
        var formData = new FormData();
        var metadata = {
            "name": file.name, // Filename at Google Drive
            "mimeType": file.type, // mimeType at Google Drive
        };
    
        // add assoc key values, this will be posts values
        formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        formData.append("file", file);
    
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
            success: function (data) {
                console.log("Succsesful file upload")
                console.log(data);
            },
            error: function (error) {
                console.log("LLLLLLLL")
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };
    
    function createFolder(folderName) {
        var formData = new FormData();
        var metadata = {
            "name": folderName, // Filename at Google Drive
            "mimeType": "application/vnd.google-apps.folder", // mimeType at Google Drive
        };
    
        // add assoc key values, this will be posts values
        formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/upload/drive/v3/files",
            success: function (data) {
                console.log("Succsesful folder creation")
                console.log(data);
            },
            error: function (error) {
                console.log("LLLLLLLL")
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    }
    
    function getFolderID(folderName) {
    
        $.ajax({
            type: "GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/drive/v3/files",
            q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            success: function (data) {
                console.log("Succsesful folder info retreival")
                console.log(data);
                for (i = 0; i < data.files.length; i++) {
                  if (data.files[i].name == folderName) {
                      console.log("Folder id of ", folderName, " found: ", data.files[i].id)
                      return data.files[i].id;
                  }
                }
                
                
            },
            error: function (error) {
                console.log("LLLLLLLL")
                console.log(error);
            },
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    }

    $("#upload").on("click", function (e) {
        var file = $("#files")[0].files[0];
        uploadFile(file);
        createFolder("bada bop boom pow");
        getFolderID("bada bop boom pow")
    });



    
});
