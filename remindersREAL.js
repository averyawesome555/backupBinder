function INIT() {

	Vue.filter('icon', function(fileType) {
		s = "fa-"

		switch(fileType) {
			case "img":
				return s + "image"
		}
	})

	Vue.filter('src', function(val) {
		return "src(" + val + ")"
	})

	binder = new Vue({
		el: "#accordionExample",
		data: {
			contents: [
				{
					name: "India Homework 1886",
					fileType: "img",
					lastAccessed: "6 days ago"
				},
				{
					name: "Industrial Revolution Write Up",
					fileType: "img",
					lastAccessed: "2 days ago"
				},
				{
					name: "Industrial Revo. Handout",
					fileType: "img",
					lastAccessed: "seconds ago"
				}
			]
		},
		computed: {
			folders: function() {

				var p = $.parseJSON( $("#binderContent").text() )

				console.log($("#binderContent").text())
				console.log(p);

				result = []

				for (var key in p) {
					if (p.hasOwnProperty(key)) {
						result.push({
							name: p[key][0],
							id: key,
							contents: []
						})
					}
				}
				return result;
			}
		}
	})

	Vue.filter("modalTarget", function(value) {
		if (!this.modalActive) {
			this.modalActive = !this.modalActive;
			return "#searchModal"
		}
	})

	var search = new Vue({
		el: "#searchModal",
		data: {
			searchTerm: "",
			results: [],
			modalActive: false,
		}
	})


	upload = new Vue({
		el: "#uploadModal",
		data: {
			location: "",
			currentFile: "",
		},
		computed: {
			folders: function() {
				return binder.folders;
			}
		},
		methods: {
			previewFile: function() {
				var preview = document.querySelector('#img');
				var file    = $('#files')[0].files[0];
				var reader  = new FileReader();

				reader.onloadend = function () {
					preview.src = reader.result
				}

				if (file) {
					reader.readAsDataURL(file);
				} else {
					preview.src = "";
				}
			},
			src: function(src) {
				return 'src("' + src + '")'
			},
			upload: function() {
				$('#files').click()
			},
			clear: function() {
				$("#img")[0].src = ""
			},
			uploadFileV: function() {


				var file = $('#files')[0].files[0];
				var folder = this.lcoation;

				var reader  = new FileReader();

				reader.onloadend = function () {
					console.log(reader.result)
					uploadFileFunction(reader.result, folder);
				}

				if (file) {
					reader.readAsDataURL(file);
				}

			}
		}
	})

	folderModal = new Vue({
		el: "#folderModal",
		data: {
			folderName: "Name"
		},
		computed: {
			existingFolders: function() {
				res = []

				x = binder.folders;

				for(i in x) {
					if(x.hasOwnProperty(i)) {
						res.push(x[i].name)
					}
				}

				return res;
			}
		},
		methods: {
			makeFolder: function() {
				createFolder(this.folderName)
				this.folderName = "Name"
			}
		}
	})

}

window.setTimeout(INIT, 5000)