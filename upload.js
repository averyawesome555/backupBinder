$(document).ready(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const redirect_uri = "https://backupbinder.netlify.com/upload.html" // replace with your redirect_uri;
    const client_secret = "vVkHKV4hswLANEHqI-CYCzX3"; // replace with your client secret
    const scope = "https://www.googleapis.com/auth/drive.file";
    var access_token= "";
    const client_id = "146136756337-jt4b3n285gl57vthk47jtdq18nlib6rh.apps.googleusercontent.com"; // replace it with your client id
    $("#binderContent").hide();


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
           listAll2();
        }
  });
  // hey guys, this is austin

    $("#uploadFile").on("click", function (e) {
//        var file = $("#files")[0].files[0];
        var folder = window.prompt("To which class would you like add this? Enter that class' name below, or enter \"Misc\" to add this to the \"Miscellaneous\" folder: ");
        if (folder == "Misc") { folder = "Miscellaneous";}
        for (i = 0; i < $("#files")[0].files.length; i++) {
            uploadFile($("#files")[0].files[i], folder);
        }
    });

    $("#createFolder").on("click", function (e) {
        var newFolderName = window.prompt("Enter the name of the new class you want to add:");
        createFolder(newFolderName);
    });

    $("#downloadFile").on("click", function (e) {
        var fileName = window.prompt("Enter the name of the file you want to download:");
        getFilesFromFolder("1t-G1jFzof31on-OGuPX0PhN4_rUIPKpm");
    });



    // maybe comment out?
    function stripQueryStringAndHashFromPath(url) {
        return url.split("?")[0].split("#")[0];
    }

    function uploadFile(file, folder) {
    getItemID(folder).then(function(result) {
          var formData = new FormData();
          var metadata = {
              "name": file.name,
              "mimeType": file.type,
              "parents": [result],
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
                  console.log("Succsesful file upload");
                  console.log(data);
              },
              error: function (error) {
                  console.log("Error in uploadFile");
                  console.log(error);
              },
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              timeout: 60000
          }); // end of AJAX call
      }) // end of .then
      .catch(function() {

      }); // end of .catch
    }

    function createFolder(folderName) {
        getItemID("Backup Binder").then(function(result) {
          var formData = new FormData();
          var metadata = {
                "name": folderName,
                "mimeType": "application/vnd.google-apps.folder",
                "parents": [result],
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
                    console.log("Error in createFolder method");
                    console.log(error);
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            });
          }) // end of .then
          .catch(function(error) {
            console.log(error);
        });
    }

    function createMasterFolder() {
        var formData = new FormData();
        var metadata = {
            "name": "Backup Binder",
            "mimeType": "application/vnd.google-apps.folder",
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
                console.log("Succsesful master folder creation");
                console.log(data);
                createFolder("Miscellaneous"); // creates misc folder for work that belongs to no class in particular; e.g. feild trip form
            },
            error: function (error) {
                console.log("Error in createMasterFolder method");
                console.log(error);
            },
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    }

    function getItemID(folderName) {
        return new Promise(function(resolve, reject) {
            $.ajax({
            type: "GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                },
                url: "https://www.googleapis.com/drive/v3/files",
                success: function (data) {
                    console.log(data);
                    for (i = 0; i < data.files.length; i++) {
                      if (data.files[i].name == folderName) {
                        console.log("Folder ID of " + folderName + ": " + data.files[i].id);
                        resolve(data.files[i].id);
                      } // end of if
                    } // end of for-loop
                },
                error: function (error) {
                    console.log("Folder " + folderName + " not found!");
                    console.log(error);
                    reject(error);
                },
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            }); // end of AJAX call
        }); // end of promise
    }

    // plan for Ryan's method"
    // 1. Create dictoriuionary <class name, jsonContent>
    // 2. Get children IDs for all class folders
    // 3. list all files in class fodlers and add to dictionary - https://stackoverflow.com/questions/24720075/how-to-get-list-of-files-by-folder-on-google-drive-api
    // 4. QED

    function listAll() {
      return new Promise(function(resolve, reject) {
        var all = {}; // creates dictionary <class name, jsonContent>
        getFilesFromFolder("Backup Binder").then(function(classes) {
          for (i = 0; i < classes[1].files.length; i++) {
            getFilesFromFolder(classes[1].files[i].name).then(function(classwork) {
              all[classwork[0]] = classwork[1];
              console.log(classwork[0] + " in getFilesFromFolder thenable: " + all[classwork[0]]);
            }).catch(function(error) {console.log(error)});
          } // end of for-loop
          console.log("All: " + all);
          resolve(all);
        }).catch(function(error) {console.log(error)});
      }); // end of promise
    }

    function listAll2() {
      return new Promise(function(resolve, reject) {
        getFilesFromFolder("Backup Binder").then(function(classes) {
          for (i = 0; i < classes[1].files.length; i++) {
            getFilesFromFolder(classes[1].files[i].name).then(function(classwork) {
              var classID = classwork[0];
              var classContent = classwork[1].files;
              var classwork2 = [classID, classContent];
              if ($("#binderContent").text() == "") { // if binderContent is empty
                var arr = [classwork2];
                $("#binderContent").text(arr);
              }
              else { // if it's not empty
                var binderContentArr = $.parseJSON($("#binderContent").text());
                binderContentArr.push(classwork2);
                $("#binderContent").text(binderContentArr);
              }
            }).catch(function(error) {console.log(error)});
          } // end of for-loop
          console.log($("#binderContent").text());
          resolve($.parseJSON($("#binderContent").text()));
        }).catch(function(error) {console.log(error)});
      }); // end of promise
    }



    function getFilesFromFolder(folderName) {
      return new Promise(function(resolve, reject) {
        getItemID(folderName).then(function(folderID) {
          $.ajax({
          type: "GET",
          beforeSend: function(request) {
              request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));

            }, // explanation of partial responses: https://developers.google.com/drive/api/v3/performance#partial-response
              url: "https://www.googleapis.com/drive/v3/files?q='"+ folderID + "'+in+parents",
              success: function (data) {
                console.log("Data from getFilesFromFolder():")
                console.log(data);
                var arr = [folderID, data];
                resolve(arr);

              },
              error: function (error) {
                  console.log("Error in method getFileInfo():");
                  console.log(error);
                  reject(error);
              },
              cache: false,
              contentType: false,
              processData: false,
              timeout: 60000
          });
        }); // end of then
      }); // end of promise
    }

    function isFirstTimeLogin() {
        $.ajax({
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));

            },
            url: "https://www.googleapis.com/drive/v3/files",
            success: function (data) {
                console.log(data);
                for (i = 0; i < data.files.length; i++) {
                  if (data.files[i].name == "Backup Binder") {
                      console.log("NOT first time login");
                      return;
                  }
                }
                console.log("first time login");
                createMasterFolder();
               // createFolder("Other"); // this is the folder for stuff that belongs to no class in particular e.g. field trip form
            },
            error: function (error) {
                console.log("Error in method isfirstTimeLogin");
                console.log(error);
            },
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    }

});
