$(document).ready(function(){

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const redirect_uri = "https://backupbinder.netlify.com/upload.html" // replace with your redirect_uri;
    const client_secret = "vVkHKV4hswLANEHqI-CYCzX3"; // replace with your client secret
    const scope = "https://www.googleapis.com/auth/drive.file";
    var access_token= "";
    const client_id = "146136756337-jt4b3n285gl57vthk47jtdq18nlib6rh.apps.googleusercontent.com"; // replace it with your client id
    

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
           
           console.log("Result Data: ", resultData);
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           //window.history.pushState({}, document.title, "/GitLoginApp/" + "upload.html");
           
           isFirstTimeLogin();
        }
  });
    
    $("#uploadFile").on("click", function (e) {
//        var file = $("#files")[0].files[0];
        var folder = window.prompt("To which class would you like add this? Enter that class' name below, or enter nothing to add this to the \"Other\" folder: ");
        for (i = 0; i < $("#files")[0].files.length; i++) {
            uploadFile($("#files")[0].files[i], folder);
        }
    });
        
    $("#createFolder").on("click", function (e) {
        var newFolderName = window.prompt("Enter the name of the new class you want to add:");
        createFolder(newFolderName);
    });

                          
                          
                          
    function stripQueryStringAndHashFromPath(url) {
        return url.split("?")[0].split("#")[0];
    }   

    function uploadFile(file, folder) {
        var formData = new FormData();
        var metadata;
        if (folder == "") {
            metadata = {
            "name": file.name, 
            "mimeType": file.type, 
            "parents": [getFolderID("Other")],
            };
        }
        else {
            metadata = {
            "name": file.name, 
            "mimeType": file.type, 
            "parents": [getFolderID(folder)],
            };
        }
        
    
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
        var metadata;
        if (folderName == "Backup Binder") { // if first time login, adds Backup Binder folder to root of Drive
            metadata = {
            "name": folderName, 
            "mimeType": "application/vnd.google-apps.folder",
            };
        }
        else { // adds class folder into Backup Binder folder
            metadata = {
            "name": folderName,
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [getFolderID("Backup Binder")],
            };
        }
    
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
                // Only implement the JSON file solution if the getFolderID method is too uneliable
//                if (folderName == "Backup Binder") {
//                    // add entry {username, getFolderID("Backup Binder")} to masterFoldersIndex.json
//                }
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
            q: "mimeType = 'application/vnd.google-apps.folder'",
            success: function (data) {
                console.log("Succsesful folder ID retreival")
                console.log(data);
                for (i = 0; i < data.files.length; i++) {
                  if (data.files[i].name == folderName) {
                      console.log("Folder id of ", folderName, " found: ", data.files[i].id)
                      return data.files[i].id;
                  }
                }
                // the next 3 lines trigger if the user tries to upload a file to a nonexisttent folder.
                console.log("Folder " + folderName + " does not exist. Creating it now...");
                createFolder(folderName);
                return getFolderID(folderName);
                
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
    
    function isFirstTimeLogin() {
        $.ajax({
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/drive/v3/files",
            q: "mimeType = 'application/vnd.google-apps.folder'",
            success: function (data) {
                console.log(data);
                for (i = 0; i < data.files.length; i++) {
                  if (data.files[i].name == "Backup Binder") {
                      console.log("NOT first time login")
                  }
                }
                console.log("first time login");
                createFolder("Backup Binder");
                createFolder("Other"); // this is the folder for stuff that belongs to no class in particular e.g. field trip form
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
    
    function getFileInfoByID(id) {
           $.ajax({
            type: "GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/drive/v3/files/" + id,
            success: function (data) {
                console.log("Succsesful file/folder info retreival")
                console.log(data);
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

        
});
