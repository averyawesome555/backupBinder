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

    var Upload = function (file) {
        this.file = file;
    };
    
    Upload.prototype.getType = function() {
        localStorage.setItem("type",this.file.type);
        return this.file.type;
    };
    Upload.prototype.getSize = function() {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    Upload.prototype.getName = function() {
        return this.file.name;
    };
    Upload.prototype.doUpload = function () {
        var metadata = {
            'name': this.getName(), // Filename at Google Drive
            'mimeType': this.getType(), // mimeType at Google Drive
            'parents': ['### folder ID ###'], // Folder ID at Google Drive
        };

        var accessToken = localStorage.getItem("accessToken"); // Here gapi is used for retrieving the access token.
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
            body: form,
        }).then((res) => {
            return res.json();
        }).then(function(val) {
            console.log(val);
        });
    };
    
    Upload.prototype.progressHandling = function (event) {
        var percent = 0;
        var position = event.loaded || event.position;
        var total = event.total;
        var progress_bar_id = "#progress-wrp";
        if (event.lengthComputable) {
            percent = Math.ceil(position / total * 100);
        }
        // update progressbars classes so it fits your code
        $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
        $(progress_bar_id + " .status").text(percent + "%");
    };

    $("#upload").on("click", function (e) {
        var fileContent64 = getBase64($("#files")[0].files[0]);
        var file2 = new Blob([fileContent64], {type: 'image/jpeg'});
        var upload = new Upload(file);
    
        // maby check size or type here with upload.getSize() and upload.getType()
    
        // execute upload
        upload.doUpload();
    });



    
});

function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     console.log("Image to base64: ", reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
}
