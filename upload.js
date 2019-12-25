$(document).ready(function(){

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirect_uri = "https://backupbinder.netlify.com/upload.html" // replace with your redirect_uri;
    const client_secret = "vVkHKV4hswLANEHqI-CYCzX3"; // replace with your client secret
    const scope = "https://www.googleapis.com/auth/drive.file";
    var access_token= "";
    var client_id = "146136756337-jt4b3n285gl57vthk47jtdq18nlib6rh.apps.googleusercontent.com"; // replace it with your client id
    

    $.ajax({
        type: 'POST',
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

    function uploadFile(File file) {
//        var that = this;
        var formData = new FormData();
        var metadata = {
            'name': file.getName(), // Filename at Google Drive
            'mimeType': file.getType(), // mimeType at Google Drive
        };
    
        // add assoc key values, this will be posts values
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append("file", file);
    
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
            success: function (data) {
                console.log("Succsesful upload?")
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
    
//    Upload.prototype.progressHandling = function (event) {
//        var percent = 0;
//        var position = event.loaded || event.position;
//        var total = event.total;
//        var progress_bar_id = "#progress-wrp";
//        if (event.lengthComputable) {
//            percent = Math.ceil(position / total * 100);
//        }
//        // update progressbars classes so it fits your code
//        $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
//        $(progress_bar_id + " .status").text(percent + "%");
//    };

    $("#upload").on("click", function (e) {
        var file = $("#files")[0].files[0];
        uploadFile(file);
    });



    
});
