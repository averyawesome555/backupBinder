



$(document).ready(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const redirect_uri = "https://backupbinder.netlify.com/reminders.html" // replace with your redirect_uri;
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
           listAll();
        }
  });
  // hey guys, this is austin

    $("#uploadFile").on("click", function (e) {
		$("#files").click();
		$("#uploadModal").modal();
//        var file = $("#files")[0].files[0];
        // var folder = window.prompt("To which class would you like add this? Enter that class' name below, or enter \"Misc\" to add this to the \"Miscellaneous\" folder: ");
        // if (folder == "Misc") { folder = "Miscellaneous";}
        // for (i = 0; i < $("#files")[0].files.length; i++) {
        //     uploadFile($("#files")[0].files[i], folder);
        // }
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
    }

    function getFileInfoByID(fileID) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          type: "GET",
          beforeSend: function(request) {
              request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));

              },
              url: "https://www.googleapis.com/drive/v3/files/"+ fileID + "?fields=*",
              success: function (data) {
                  console.log(data);
                  resolve(data)
              },
              error: function (error) {
                  console.log("Error in method getFileInfobyID");
                  reject(error);
              },
              cache: false,
              contentType: false,
              processData: false,
              timeout: 60000
        });
      }); // end of promise
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

    function getItemNameByID(itemID) {
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
                      if (data.files[i].id == itemID) {
                        resolve(data.files[i].name);
                      } // end of if
                    } // end of for-loop
                },
                error: function (error) {
                    //console.log("Folder " + folderName + " not found!");
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

		$("body").on('DOMSubtreeModified', "#binderContent", function() {
		   	getItemNameByID(key).then(function(itemName) {
						
				var result = JSON.parse( $("#binderContent").text() );

				for(var key in result) {
					result[key][0] = itemName
				}

				console.log("RESULT: ", result)

				$("#binderContent").text(JSON.stringify(result))

			} );

				
		
	});

    // plan for Ryan's method"
    // 1. Create dictoriuionary <class name, jsonContent>
    // 2. Get children IDs for all class folders
    // 3. list all files in class fodlers and add to dictionary - https://stackoverflow.com/questions/24720075/how-to-get-list-of-files-by-folder-on-google-drive-api
    // 4. QED

    function listAll() {
      getFilesFromFolder("Backup Binder").then(function(classes) {
        for (i = 0; i < classes[1].files.length; i++) {
          getFilesFromFolder(classes[1].files[i].name).then(function(classwork) {
            var classID = classwork[0];
            var classContent = classwork[1].files;
            if ($("#binderContent").text() == "") { // if binderContent is empty
              var dict = {};
              dict[classID] = classContent;
              $("#binderContent").text(JSON.stringify(dict));
            }
            else { // if it's not empty
              var binderContentDict = $.parseJSON($("#binderContent").text());
              binderContentDict[classID] = classContent;
              $("#binderContent").text(JSON.stringify(binderContentDict));
            }
          }).catch(function(error) {console.log(error)});
        }
		
	   }).then(function(oofo) {
		//    var result = $.parseJSON($("#binderContent").text());
		//    console.log("RESULT ", result)
		// 		for (var key in result) {

		// 		console.log('key', key)

		// 		$("key").innerHTML = key;

		// 			getItemNameByID(key).then(function(className) {

					

		// 				var result2 = $.parseJSON($("#binderContent").text());
		// 				var keyName = $("key").innerHTML;

		// 				result2[className + "(" + keyName + ")"] = result2[keyName];

		// 				delete result2[keyName];

		// 				$("#binderContent").text(JSON.stringify(result2))

		// 			})
		// 		}
		// 	console.log("Result from listAll2: " + result.toString());
		})
        
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
                //console.log("Data from getFilesFromFolder():")
                //console.log(data);
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

	listAll()

});
