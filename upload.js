$(document).ready(function(){
    

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirect_uri = "backupbinder.netlify.com/upload.html" // replace with your redirect_uri;
    const client_secret = "IfbKmGBAXregYvn-GZD8PKX_"; // replace with your client secret
    const scope = "https://www.googleapis.com/auth/drive";
    var access_token= "";
    var client_id = "774704742314-dr9ck0r56h63ums0urlmfutqel0d0aar.apps.googleusercontent.com"// replace it with your client id;
    

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


    $("#upload").on("click", function (e) {
        //var file = $("#files")[0].files[0];


        var fileContent = 'sample text'; // As a sample, upload a text file.
        var file = new Blob([fileContent], {type: 'text/plain'});
        var metadata = {
            'name': 'sampleName', // Filename at Google Drive
            'mimeType': 'text/plain', // mimeType at Google Drive
            'parents': ['### folder ID ###'], // Folder ID at Google Drive
        };

        var accessToken = localStorage.getItem("accessToken"); // Here gapi is used for retrieving the access token.
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', file);

        var xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';
        xhr.onload = () => {
            console.log(xhr.response.id); // Retrieve uploaded file ID.
        };
        xhr.send(form);

    });



    
});
